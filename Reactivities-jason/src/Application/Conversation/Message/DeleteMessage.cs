using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Conversation.DTO;
using Reactivities_jason.Application.SignalR;
using Reactivities_jason.Domain.Entities;
using Serilog;

namespace Reactivities_jason.Application.Conversation.Message
{
    public record DeleteMessageCommand : IRequest<int>
    {
        public Guid MessageId { get; set; }
    }
    public class DeleteMessageHandler : IRequestHandler<DeleteMessageCommand, int>
    {
        private readonly ILogger _logger;
        private readonly IApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserAccessor _userAccessor;
        private readonly IMapper _mapper;
        private readonly IDistributedCache _cache;
        private readonly IHubContext<ConversationHub> _hubContext;
        public DeleteMessageHandler(IApplicationDbContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor, IHubContext<ConversationHub> hubContext, IMapper mapper, ILogger logger, IDistributedCache cache)
        {
            _logger = logger;
            _userAccessor = userAccessor;
            _userManager = userManager;
            _context = context;
            _hubContext = hubContext;
            _mapper = mapper;
            _cache = cache;
        }
        public async Task<int> Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
        {
            var message = await _context.Messages.Include(x => x.Sender).Include(x => x.Conversations).ThenInclude(x => x.ConversationsParticipants).ThenInclude(x => x.AppUser).FirstOrDefaultAsync(x => x.Id == request.MessageId);
            if (message == null)
            {
                _logger.Error($"No Message With Message ID Equal {request.MessageId}");
                return 0;
            }
            string keyCacheListMessage = $"List-Message-Conversation-{message.Conversations.Id}";
            string resultListMessageCache = await _cache.GetStringAsync(keyCacheListMessage);

            var currentUser = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
            var toUserId = message.Conversations.ConversationsParticipants.SingleOrDefault(x => x.AppUser.UserName != _userAccessor.GetUsername()).AppUser.Id;
            if (message.Sender.UserName != currentUser.UserName)
            {
                _logger.Error($"Cannot Delete Message Because Message With ID {request.MessageId} Does Not User ID {currentUser.Id}");
                return 0;
            }
            _context.Messages.Remove(message);
            var result = await _context.SaveChangesAsync(cancellationToken);
            List<MessageDTO> MessageDTOs;
            MessageDTO latestMessageDTO = null;
            var messageDto = _mapper.Map<MessageDTO>(message);
            if (!string.IsNullOrEmpty(resultListMessageCache))
            {
                MessageDTOs = JsonConvert.DeserializeObject<List<MessageDTO>>(resultListMessageCache);
                var removeMessage = MessageDTOs.Where(x => x.Id != messageDto.Id).ToList();
                string convertString = JsonConvert.SerializeObject(removeMessage);
                latestMessageDTO = removeMessage.Last();
                await _cache.SetStringAsync(keyCacheListMessage, convertString);
            }
            var ListMessageDeleteDTO = new ListMessageDeleteDTO
            {
                MessageDelete = messageDto,
                LatestMessage = latestMessageDTO,
            };
            await _hubContext.Clients.User(toUserId).SendAsync("DeleteMessage", ListMessageDeleteDTO);
            _logger.Information($"Successfully Delete Message With ID {request.MessageId}");
            return result;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Conversation.DTO;
using Reactivities_jason.Application.SignalR;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Conversation.Message
{
    public class ListMessageQuery : IRequest<ProfileDTO>
    {
        public string Username { get; set; }
    }

    public class ListMessageHandler : IRequestHandler<ListMessageQuery, ProfileDTO>
    {
        private readonly IHubContext<ConversationHub> _hubContext;
        private readonly IApplicationDbContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public ListMessageHandler(IApplicationDbContext context, IUserAccessor userAccessor, UserManager<AppUser> userManager, IMapper mapper, IHubContext<ConversationHub> hubContext)
        {
            _context = context;
            _userAccessor = userAccessor;
            _userManager = userManager;
            _mapper = mapper;
            _hubContext = hubContext;
        }
        public async Task<ProfileDTO> Handle(ListMessageQuery request, CancellationToken cancellationToken)
        {
            var toUser = await _userManager.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.UserName == request.Username);
            var currentUsername = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
            if (toUser is null)
            {
                return null;
            }
            var Conversations = await _context.Conversations.Include(x => x.Messages).Include(x => x.ConversationsParticipants).ThenInclude(x => x.AppUser).Where(x => x.ConversationsParticipants.Any(x => x.AppUser.UserName == currentUsername.UserName)).ToListAsync();
            var Conversation = Conversations.FirstOrDefault(x => x.ConversationsParticipants.Any(x => x.AppUser.UserName == toUser.UserName));
            var Messages = await _context.Messages.Where(x => x.Conversations == Conversation).Include(x => x.Files).OrderBy(x => x.CraetedAt).ToListAsync();
            foreach (var message in Messages)
            {
                if (message.Sender.UserName == toUser.UserName)
                {
                    if (!message.IsRead)
                    {
                        message.IsRead = true;
                    }
                }
            }
            var messageDTO = _mapper.Map<List<MessageDTO>>(Messages);
            var profileUser = new ProfileDTO
            {
                Id = toUser.Id,
                UserName = toUser.UserName,
                DisplayName = toUser.DisplayName,
                Messages = messageDTO,
                Image = toUser.Photos?.FirstOrDefault(x => x.isMain)?.fileBase64
            };
            var ConversationDTO = new ConversationsDTO
            {
                Username = toUser.UserName,
                FromUsername = currentUsername.UserName
            };
            await _context.SaveChangesAsync(cancellationToken);
            await _hubContext.Clients.User(toUser.Id).SendAsync("ReadMessage", ConversationDTO);
            return profileUser;
        }
    }
}

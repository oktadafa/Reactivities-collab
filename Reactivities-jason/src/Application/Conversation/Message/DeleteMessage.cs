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
    public record DeleteMessageCommand : IRequest<int>
    {
        public Guid MessageId { get; set; }
    }
    public class DeleteMessageHandler : IRequestHandler<DeleteMessageCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserAccessor _userAccessor;
        private readonly IMapper _mapper;

        private readonly IHubContext<ConversationHub> _hubContext;
        public DeleteMessageHandler(IApplicationDbContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor, IHubContext<ConversationHub> hubContext, IMapper mapper)
        {
            _userAccessor = userAccessor;
            _userManager = userManager;
            _context = context;
            _hubContext = hubContext;
            _mapper = mapper;
        }
        public async Task<int> Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
        {
            var message = await _context.Messages.Include(x => x.Sender).Include(x => x.Conversations).ThenInclude(x => x.ConversationsParticipants).ThenInclude(x => x.AppUser).FirstOrDefaultAsync(x => x.Id == request.MessageId);
            if (message == null)
            {
                return 0;
            }
            var currentUser = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
            var toUserId = message.Conversations.ConversationsParticipants.SingleOrDefault(x => x.AppUser.UserName != _userAccessor.GetUsername()).Id;
            if (message.Sender.UserName != currentUser.UserName)
            {
                return 0;
            }
            _context.Messages.Remove(message);
            var messageDto = _mapper.Map<MessageDTO>(message);
            var result = await _context.SaveChangesAsync(cancellationToken);
            await _hubContext.Clients.User(toUserId.ToString()).SendAsync("DeleteMessage", messageDto);
            return result;
        }
    }
}

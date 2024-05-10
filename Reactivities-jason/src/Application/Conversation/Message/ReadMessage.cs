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
    public record ReadMessageCommad : IRequest<int>
    {
        public MessageDTO Message  { get; set; }
    }

    public class ReadMessageHandler : IRequestHandler<ReadMessageCommad, int>
    {
        private readonly IApplicationDbContext _contex;
        private readonly IHubContext<ConversationHub> _context;
        private readonly IUserAccessor _userAccessor;
        public ReadMessageHandler(IApplicationDbContext context, IHubContext<ConversationHub> hubContext, IUserAccessor userAccessor)
        {
            _contex = context;
            _context = hubContext;
            _userAccessor = userAccessor;
        }
        public async Task<int> Handle(ReadMessageCommad request, CancellationToken cancellationToken)
        {
            var messages = await _contex.Messages.Include(x => x.Sender).Include(x =>x.Conversations).ThenInclude(x => x.ConversationsParticipants).ThenInclude(x => x.AppUser).FirstOrDefaultAsync(x => x.Id == request.Message.Id);
            messages.IsRead = true;
        var result =   await _contex.SaveChangesAsync(cancellationToken);
        var conversationDto = new ConversationsDTO{
            Username = messages.Conversations.ConversationsParticipants.FirstOrDefault(x => x.AppUser.UserName != messages.Sender.UserName).AppUser.UserName,
            FromUsername = messages.Sender.UserName,
            Message = messages.Body,
            IsRead = messages.IsRead,
            createdAt = messages.CraetedAt,
            DisplayName = messages.Sender.DisplayName
         };
      await  _context.Clients.User(messages.Sender.Id).SendAsync("ReadMessage", conversationDto);
        return  result;
        }
    }
}

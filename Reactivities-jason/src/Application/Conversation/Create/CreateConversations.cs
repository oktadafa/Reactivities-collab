using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Conversation.DTO;

namespace Reactivities_jason.Application.Conversation.Create
{
    public record CreateConversationsCommand : IRequest<int>
     {
        public DateTime createdAt { get; set; }
    }

    public class CreateConversationsHandler : IRequestHandler<CreateConversationsCommand, int>
    {
        private readonly IApplicationDbContext _context;
        public CreateConversationsHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public Task<int> Handle(CreateConversationsCommand request, CancellationToken cancellationToken)
        {
            var conversation = new Domain.Entities.Conversations {
                CreatedAt = request.createdAt
            };
            _context.Conversations.Add(conversation);
            return _context.SaveChangesAsync(cancellationToken);
        }
    }
}

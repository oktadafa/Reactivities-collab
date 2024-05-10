using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Security;
using Reactivities_jason.Application.Conversation.DTO;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Conversation.Get
{
    [Authorize]
    public record ListConversationQuery : IRequest<List<ConversationsDTO>>;

    public class ListConversationHandler : IRequestHandler<ListConversationQuery, List<ConversationsDTO>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public ListConversationHandler(IApplicationDbContext context, IUserAccessor userAccessor, UserManager<AppUser> userManager, IMapper mapper)
        {
            _context = context;
            _userAccessor = userAccessor;
            _userManager = userManager;
            _mapper = mapper;

        }
        public async Task<List<ConversationsDTO>> Handle(ListConversationQuery request, CancellationToken cancellationToken)
        {
            var currentUser = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
            var conversations = await _context.Conversations.Include(x => x.Messages).ThenInclude(x => x.Files).Include(x => x.ConversationsParticipants).ThenInclude(x => x.AppUser).Where(x => x.ConversationsParticipants.Any(x => x.AppUser.UserName == currentUser.UserName)).ProjectTo<ConversationsDTO>(_mapper.ConfigurationProvider, new { currentUsername = currentUser.UserName }).AsNoTracking().ToListAsync();
            return conversations;
        }
    }

}

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
    public class SendMessageCommand : IRequest<int>
    {
        public string Body { get; set; }
        public string Username { get; set; }
        public DateTime craetedAt { get; set; }
        public FileDTO File { get; set; }
    }

    public class SendMessageHandler : IRequestHandler<SendMessageCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly UserManager<AppUser> _userManager;

        private readonly IMapper _mapper;
        private readonly IHubContext<ConversationHub> _hubContext;
        public SendMessageHandler(IApplicationDbContext context, IMapper mapper, IUserAccessor userAccessor, UserManager<AppUser> userManager, IHubContext<ConversationHub> hubContext)
        {
            _userAccessor = userAccessor;
            _context = context;
            _userManager = userManager;
            _hubContext = hubContext;
            _mapper = mapper;
        }
        public async Task<int> Handle(SendMessageCommand request, CancellationToken cancellationToken)
        {
            var toUser = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == request.Username);
            var currentUser = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
            if (toUser is null || currentUser is null || request.Username == currentUser.UserName)
            {
                return 0;
            }
            var ListConversations = await _context.Conversations.Include(x => x.ConversationsParticipants).ThenInclude(x => x.AppUser).Include(x => x.Messages).ThenInclude(x => x.Files).Where(x => x.ConversationsParticipants.Any(x => x.AppUser.UserName == currentUser.UserName)).ToListAsync();
            var Conversations = ListConversations.SingleOrDefault(x => x.ConversationsParticipants.Any(x => x.AppUser.UserName == toUser.UserName));
            var data = new MessageDTO { };
            if (Conversations is null)
            {
                Conversations = new Conversations
                {
                    CreatedAt = DateTime.UtcNow,
                };
                var ConversationsParticipants = new List<ConversationsParticipants>() {
                   new ConversationsParticipants {
                    Conversations = Conversations,
                    AppUser = toUser
                   },
                   new ConversationsParticipants {
                    Conversations = Conversations,
                    AppUser = currentUser,
                   }
                };
                foreach (var participants in ConversationsParticipants)
                {
                    Conversations.ConversationsParticipants.Add(participants);
                }
                _context.Conversations.Add(Conversations);

                data.FromDisplayName = currentUser.UserName;
                data.Image = currentUser.Photos?.FirstOrDefault(x => x.isMain)?.fileBase64;
                var result = await _context.SaveChangesAsync(cancellationToken);
            }
            var file = new ConvesationFile { };
            if (request.File != null)
            {
                file.Name = request.File.Name;
                file.Size = request.File.Size;
                file.Base64 = request.File.Base64;
                file.ContentType = request.File.ContentType;
            }
            else
            {
                file = null;
            }
            var messages = new Messages
            {
                Conversations = Conversations,
                Sender = currentUser,
                Body = request.Body,
                CraetedAt = DateTime.UtcNow,
                Files = file
            };
            Conversations.Messages.Add(messages);
            var es = await _context.SaveChangesAsync(cancellationToken);
            data.Id = messages.Id;
            data.Body = request.Body;
            data.FromUsername = currentUser.UserName;
            data.createdAt = messages.CraetedAt;
            data.IsRead = false;
            data.File = _mapper.Map<FileDTO>(messages.Files);
            try
            {
                await _hubContext.Clients.User(toUser.Id).SendAsync("ReceiveMessage", data);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine("Error");
                Console.WriteLine(ex.Message);
            }
            return es;
        }
    }
}

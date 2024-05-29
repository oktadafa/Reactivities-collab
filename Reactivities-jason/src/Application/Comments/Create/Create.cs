using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Reactivities_jason.Application.Comments.Dto;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.SignalR;
using Reactivities_jason.Domain.Entities;
using Serilog;

namespace Reactivities_jason.Application.Comments.Create
{
    [Authorize]
    public record CreateCommand : IRequest<CommentDto>
    {
        public string Body { get; set; } = null;
        public string CommentImage { get; set; } = null;
        public Guid ActivityId { get; set; }
        public string ParentCommentId { get; set; }
    }

    public class CreateHandler : IRequestHandler<CreateCommand, CommentDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _user;
        private readonly UserManager<AppUser> _myUser;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly ILogger _logger;
        public CreateHandler(IApplicationDbContext context, ILogger logger, IMapper mapper, IUserAccessor user, UserManager<AppUser> userManager, IHubContext<ChatHub> hubContext)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
            _user = user;
            _myUser = userManager;
            _hubContext = hubContext;
        }
        public async Task<CommentDto> Handle(CreateCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var Activity = await _context.Activities.Include(x => x.Comments).FirstOrDefaultAsync(x => x.Id == request.ActivityId);
                if (Activity is null)
                {
                    _logger.Error($"No Activity With Activity Id Equal {request.ActivityId}");
                    return null;
                }

                var paretnComment = Activity.Comments.FirstOrDefault(x => x.Id.ToString() == request.ParentCommentId);
                var user = await _myUser.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());
                // var comment = new Comment{
                //     Activity = Activity,
                //     Author = user,
                //     CommentImage = request.CommentImage,
                //     Body = request.Body
                // };
                Comment comment;
                if (paretnComment != null)
                {
                    comment = new Comment
                    {
                        Activity = Activity,
                        Author = user,
                        CommentImage = request.CommentImage,
                        Body = request.Body,
                        CommentParent = paretnComment
                    };
                    paretnComment.ReplyComments.Add(comment);
                    _logger.Information($"User ID {user.Id} Reply Comment ID {paretnComment.Id}");

                }
                else
                {
                    comment = new Comment
                    {
                        Activity = Activity,
                        Author = user,
                        CommentImage = request.CommentImage,
                        Body = request.Body
                    };
                    Activity.Comments.Add(comment);
                    _logger.Information($"User ID ${user.Id} Send Comment To Activity ID {Activity.Id}");
                }
                await _context.SaveChangesAsync(cancellationToken);
                var commentDto = _mapper.Map<CommentDto>(comment);
                await _hubContext.Clients.Group(Activity.Id.ToString()).SendAsync("ReceiveComment", commentDto);
                _logger.Information($"User ID {user.Id} Succes Send Comment to Activity ID {Activity.Id}");
                return commentDto;
            }
            catch (System.Exception ex)
            {
                Console.Write(ex.Message);
                _logger.Error($"Error Send Comment : {ex.Message}");
                return null;
            }
        }
    }
}

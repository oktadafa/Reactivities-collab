using Microsoft.AspNetCore.Mvc;
using Reactivities_jason.Application.Comments.Create;
using Reactivities_jason.Application.Comments.Dto;
using Reactivities_jason.Application.Comments.List;
namespace Reactivities_jason.Web.Endpoints
{
    public class Chat : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this).MapPost(SendComment, "send")
            .MapGet(ListComment, "list/{activityId}");
        }

        public Task<CommentDto> SendComment(ISender sender, [FromBody] CreateCommand command)
        {
            return sender.Send(command );
        }

        public Task<List<CommentDto>> ListComment(ISender sender, Guid activityId)
        {
            return sender.Send( new ListQuery{ActivityId = activityId});
        }
    }
}

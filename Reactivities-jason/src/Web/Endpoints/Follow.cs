
using Microsoft.AspNetCore.Mvc;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Application.Follow.Command.Following;
using Reactivities_jason.Application.Follow.Queries.GetFollow;
namespace Reactivities_jason.Web.Endpoints
{
    public class Follow : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
            .RequireAuthorization()
            .MapPut(FollowToggle, "{username}")
            .MapGet(GetFollow, "{username}");
        }

        public async Task<Result> FollowToggle(ISender sender, string username )
        {
            var result = await sender.Send(new FollowToggleCommand{TargetUsername = username});
            return result;
        }

        public async Task<List<Application.Profiles.Profiles>> GetFollow(ISender sender, string username, [FromQuery]string predicate)
        {
            return await sender.Send(new ListFollowQuery{Username = username, Predicate = predicate});
        }
    }
}


using Microsoft.AspNetCore.Mvc;
using Reactivities_jason.Application.Activities.Queries.GetByUsername;
using Reactivities_jason.Application.Common.Models;
 using Reactivities_jason.Application.Profiles.Commands.UpdateProfiles;
using Reactivities_jason.Application.Profiles.Queries.Detail;

namespace Reactivities_jason.Web.Endpoints
{
    public class Profiles : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetProfiles, "{Username}")
            .MapGet(GetUserActivity, "{Username}/activities")
            .MapPut(UpdateProfile, "update");
        }

        public Task<Application.Profiles.Profiles> GetProfiles(ISender sender, string Username)
        {
            return  sender.Send(new DetailQuery(Username));
        }

        public Task<List<UserActivityDTO>> GetUserActivity(ISender sender, string username, [FromQuery] string predicate)
        {
            return sender.Send(new ListActivitiesQuery(username,predicate));
        }

        public async Task<Result> UpdateProfile(ISender sender, [FromBody] UpdateProfileDTO updateProfile)
        {
            return await sender.Send(new UpdateProfileCommand(updateProfile));
        }

    }
}

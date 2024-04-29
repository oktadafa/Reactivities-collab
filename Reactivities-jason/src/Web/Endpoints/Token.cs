
using Microsoft.AspNetCore.Mvc;
using Reactivities_jason.Application.AppToken;

namespace Reactivities_jason.Web.Endpoints
{
    public class Token : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this).MapPost(SetExpireToken, "/set");
        }

        public Task<string> SetExpireToken(ISender sender, [FromBody] AddTokenCommand command)
        {
            return sender.Send(command);
        }
    }
}

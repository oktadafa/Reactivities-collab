using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapCustomApi<AppUser>();
    }
}

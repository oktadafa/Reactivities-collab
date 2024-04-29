using Reactivities_jason.Domain.Entities;
using Reactivities_jason.Infrastructure.Identity;

namespace Reactivities_jason.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapIdentityApi<AppUser>();
    }

}

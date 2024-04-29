using Microsoft.AspNetCore.Mvc;
using Reactivities_jason.Application.Activities.Command.CreateActivity;
using Reactivities_jason.Application.Activities.Command.DeleteActivity;
using Reactivities_jason.Application.Activities.Command.Update;
using Reactivities_jason.Application.Activities.Queries;
using Reactivities_jason.Application.Activities.Queries.GetById;
using Reactivities_jason.Application.Common.Models;

namespace Reactivities_jason.Web.Endpoints
{
    public class Activity : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this).RequireAuthorization()
            .MapPost(CreateActivity, "tambah")
            .MapPut(UpdateActivity, "update/{id}")
            .MapDelete(DeleteActivity, "delete/{id}")
            .MapPut(Attend, "attendee");

            app.MapGroup(this).AllowAnonymous().MapGet(GetActivityList).MapGet(ActivityById, "get/{id}");

        }

        public Task<PaginatedList<ListActivityDTO>> GetActivityList(ISender sender, [AsParameters] ListQuery query)
        {
            return sender.Send(query);
        }
        public Task<Guid> CreateActivity(ISender sender, [FromBody] CreateActivityDTO activity)
        {
            return sender.Send(new CreateActivityCommand{ActivityDTO = activity});
        }

        public async Task<IResult> UpdateActivity(ISender sender, ListActivityDTO activityDTO, Guid id)
        {
            if (activityDTO.id != id)
            {
                return Results.BadRequest();
            }
          await sender.Send(new UpdateActivityCommand{ActivityDTO = activityDTO});
          return Results.NoContent();
        }

        public async Task<Result> DeleteActivity(ISender sender, Guid id)
        {
           var result = await sender.Send(new DeleteActivityCommand(id));
            return result;
        }

        public async Task<Result> Attend(UpdateAttendeeCommand command, ISender sender)
        {
           var result =await sender.Send(command);
           return result;            
        }

        public Task<ListActivityDTO> ActivityById ([AsParameters]ActivityByIdQuery query, ISender sender)
        {
            return  sender.Send(query);
        }
    }

}

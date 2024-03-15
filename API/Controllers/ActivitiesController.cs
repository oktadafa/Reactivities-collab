using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore; // Untuk DbContext dan ToListAsync()
// using Domain; // Pastikan ini sesuai dengan namespace definisi 'Activity'

using Application.Activities;
using Application.DTO;
using Microsoft.AspNetCore.Authorization;
using Application.Core; // Pastikan ini sesuai dengan namespace definisi 'DataContext'


namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet] //api/activities
        public async Task<IActionResult> GetActivities([FromQuery]ActivityParams paggingParams)
        {
            return handlePageResult(await Mediator.Send(new List.Query{Params = paggingParams}));
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id)
        {
            // return await _context.Activities.FindAsync(id);
            return handleResult(await Mediator.Send(new Details.Query { Id = id }));
        }
        [Authorize]
        [HttpPost("tambah")]
        public async Task<IActionResult> CreateActivity([FromBody]ActivityDTO activity)
        {
            await Mediator.Send(new Create.Command { activity = activity });
            return Ok();
        }

        [Authorize(Policy = "IsActivyHost")]
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> UpdateActivity(Guid id, [FromBody] ActivityDTO activity)
        {
            return handleResult(await Mediator.Send(new Edit.Command { activity = activity, id = id }));
        }

        [Authorize(Policy = "IsActivyHost")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return handleResult(await Mediator.Send(new Delete.Command { id = id }));
            
        }
        [Authorize]
        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            return handleResult(await Mediator.Send(new UpdateAttendance.Command{id = id}));
        }

        [AllowAnonymous]
        [HttpPost("{activityId}/attend/kick/{username}")]
        public async Task<IActionResult> KickUser(Guid activityId, string username)
        {
            return handleResult(await Mediator.Send(new KickUser.Command{Username = username, ActivityId= activityId}));
            // return NotFound("tidak ada");
        }
    }
}
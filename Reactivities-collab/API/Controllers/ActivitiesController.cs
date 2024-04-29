using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore; // Untuk DbContext dan ToListAsync()
// using Domain; // Pastikan ini sesuai dengan namespace definisi 'Activity'

using Application.Activities;
using Application.DTO;
using Microsoft.AspNetCore.Authorization;
// using Application.Comments; // Pastikan ini sesuai dengan namespace definisi 'DataContext'


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
        [Authorize(Policy = "IsEmailVerify")]
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

        [Authorize(Policy = "IsActivyHost")]
        [HttpPost("{id}/attend/kick/{username}")]
        public async Task<IActionResult> KickUser(Guid id, string username)
        {
            return handleResult(await Mediator.Send(new KickUser.Command{Username = username, ActivityId= id}));
            // return NotFound("tidak ada");
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPost("{id}/attend/add/{username}")]
        public async Task<IActionResult> AddUserAttendee(Guid id, string username)
        {
            return handleResult(await Mediator.Send(new AddAttende.Command{Username = username, ActivityId = id}));
        }

        // [AllowAnonymous]
        // [HttpPost("uploadPhoto")]
        // public async Task<IActionResult> uploadPhoto(CommentDto comment)
        // {
        //     return handleResult(await Mediator.Send(new UploadPhotoChat.Command{comment = comment}));
        // }       
    }
}
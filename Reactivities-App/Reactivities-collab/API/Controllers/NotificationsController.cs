using Application.Notification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult> GetNotification(){
            return handleResult(await Mediator.Send(new List.Query{}));
        }

        [AllowAnonymous]
        [HttpPut("update/{id}")]
        public async Task<ActionResult> UpdateNotification(int id)
        {
            return handleResult(await Mediator.Send(new Update.Command{NotificationId = id}));
        }
    }
}
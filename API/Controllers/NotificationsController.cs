using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Notification;
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
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Followers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {  
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow(string username)
        {
            return handleResult(await Mediator.Send(new FollowToggle.Command{TargetUsername = username}));
        }
        [AllowAnonymous]
        [HttpGet("{username}")]
        public async Task<IActionResult> GetFollowings(string username, string predicate)
        {
            return handleResult(await Mediator.Send(new List.Query{Username = username, Predicate = predicate}));
        }
    }
}
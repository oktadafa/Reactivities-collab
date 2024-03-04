using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : BaseApiController
    {
        private readonly UserManager<AppUser> _user;
        public ProfileController(UserManager<AppUser> user)
        {
            _user = user;
        }
        [Authorize]
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return handleResult(await Mediator.Send(new Details.Query{Username = username}));
        }

        [AllowAnonymous]
        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetActivitiesByUsername(string username, [FromQuery]string Predikat)
        {
            return handleResult(await Mediator.Send(new ListActivities.Query{Username = username, Predicate =Predikat}));
        }

        [Authorize]
        [HttpPut()]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto profile)
        {
               return handleResult(await Mediator.Send(new Edit.Command{Profile = profile}));   
        }
        
    }

}
using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccouncController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        public AccouncController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }
        
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Email == loginDTO.Email);
            if (user == null)
            {
                return NotFound("Username or Password Wrong");
            }

            var result = await _userManager.CheckPasswordAsync(user, loginDTO.Password);
            if (result)
            {
                return CreateObject(user);
            }
            return Unauthorized();
        }



        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register (RegisterDTO register)
        {

            if (await _userManager.Users.AnyAsync(x => x.Email == register.Email))
            {
                ModelState.AddModelError("email", "Email is already taken");
                return ValidationProblem();
            }
            
            if (await _userManager.Users.AnyAsync(x => x.UserName == register.Username))
            {
                ModelState.AddModelError("username", "Username is already taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = register.DisplayName,
                Email = register.Email,
                UserName = register.Username
            };

            var result = await _userManager.CreateAsync(user, register.Password);
            if (result.Succeeded)
            {
                return CreateObject(user);
            }
            return BadRequest(result.Errors);

        }
        private UserDTO CreateObject(AppUser user)
        {

            return new UserDTO
            {
                DisplayName = user.DisplayName,
                Image = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x=>x.Email == User.FindFirstValue(ClaimTypes.Email));
            return CreateObject(user);
        }
    }
}
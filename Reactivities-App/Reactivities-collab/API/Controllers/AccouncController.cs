
using System.Security.Claims;
using API.DTOs;
using API.Services;
using Application.Interface;
using Application.User;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    
    [Route("api/[controller]")]
    public class AccouncController : BaseApiController
    {
        private readonly IEmailService _email;
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        [Obsolete]
        private readonly Microsoft.AspNetCore.Hosting.IHostingEnvironment _hosting;

        private readonly IConfiguration _configuration;
        [Obsolete]
        public AccouncController(UserManager<AppUser> userManager, TokenService tokenService, IConfiguration configuration, Microsoft.AspNetCore.Hosting.IHostingEnvironment environment,IEmailService email)
        {
            _hosting = environment;
            _userManager = userManager;
            _tokenService = tokenService;
            _configuration = configuration;
            _email = email;
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
                UserName = register.Username,
                ExpireVerifyCode = DateTime.UtcNow.AddMinutes(5),
                VerifyCode = (int)Convert.ToInt64(GenerateVerificationCode())
            };

            var result = await _userManager.CreateAsync(user, register.Password);
            if (result.Succeeded)
            {
               await _email.SendVerficationEmail(user.Email, user.VerifyCode.ToString());
                return CreateObject(user);
            }
            return BadRequest(result.Errors);

        }

        [AllowAnonymous]
        [HttpPost("login/google")]
        public async Task<ActionResult<UserDTO>> LoginGoogle(RegisterGoogleDTO register)
        {
            var user = await _userManager.Users.SingleOrDefaultAsync(x => x.Email == register.Email);
            if (user != null)
            {
                return CreateObject(user);
            }

            var newUser = new AppUser
            {
                DisplayName = register.DisplayName,
                Email = register.Email,
                UserName = register.Username,
                };
            var result = await _userManager.CreateAsync(newUser);
            if (result.Succeeded)
            {       
                return CreateObject(newUser);
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
                Username = user.UserName,
                EmailVerify = user.EmailConfirmed,
                expireVerifyCode = user.ExpireVerifyCode,
                Email = user.Email
            };
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(x=>x.Email == User.FindFirstValue(ClaimTypes.Email));
            return CreateObject(user);
        }

        [Authorize]
        [HttpPost("email-verify")]      
        public async Task<IActionResult> SendEmail()
        {
            return handleResult(await Mediator.Send(new SendCodeVerify.Command{}));
        }

        [Authorize]
        [HttpPut("email-verify/")]
        public async Task<IActionResult> VerifyEmail(TokenDTO code)
        {
            return  handleResult(await Mediator.Send(new VerifyEmail.Command{code = code.verifyToken}));
        }

        
        private string GenerateVerificationCode()
        {
            const string chars = "0123456789";
            Random random = new Random();
            char[] code = new char[6];
            for (int i = 0; i < code.Length; i++)
            {
                code[i] = chars[random.Next(chars.Length)];
            }
            return new string(code);
        }
    }

}

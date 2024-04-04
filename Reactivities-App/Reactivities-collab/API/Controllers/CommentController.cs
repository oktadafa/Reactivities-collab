using Application.Comments;
using Application.Photos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentController : BaseApiController
    {
        [AllowAnonymous]
        [HttpPost("uploadPhoto")]
        public async Task<IActionResult> uploadPhoto(CommentDto comment)
        {
            return handleResult(await Mediator.Send(new UploadPhotoChat.Command { comment = comment }));
        }

    }
}
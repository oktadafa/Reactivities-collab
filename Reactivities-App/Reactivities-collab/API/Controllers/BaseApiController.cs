using API.Extensions;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        // Menggunakan properti read-only untuk memastikan hanya satu instance IMediator yang digunakan.
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult handleResult<T>(Result<T> result) 
        {
            if (result == null)
            {
                return NotFound();
            }
            if (result.IsSuccess && result.Value != null)
            {
                return Ok(result.Value);
            }
            if (result.IsSuccess && result.Value == null)
            {
                return NotFound();
            }
            return BadRequest();
        }

        protected ActionResult handlePageResult<T>(Result<PagedList<T>> result)
        {
            if (result == null)
            {
                return NotFound();
            }
            if (result.IsSuccess && result.Value != null)
            {
                Response.AddPaginationHeader(result.Value.CurrentPage, result.Value.PageSize, result.Value.TotalCount, result.Value.TotalPages);
                return Ok(result.Value);
            }
            if (result.IsSuccess && result.Value == null)
            {
                return NotFound();
            }
            return BadRequest();
        }
    }
}
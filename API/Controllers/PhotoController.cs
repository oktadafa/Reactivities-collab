using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotoController : BaseApiController
    {
        
        [HttpPost]
        public async Task<IActionResult> Add ([FromForm] Add.Command command)
        {
            return handleResult(await Mediator.Send(command));
        }

        [HttpDelete]

        public async Task<IActionResult> Delete(string id)
        {
            return handleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        [HttpPost("{id}/setMain")]

        public async Task<IActionResult> SetMain(string id)
        {
            return handleResult(await Mediator.Send(new SetMain.Command{Id = id}));
        }
    }
}
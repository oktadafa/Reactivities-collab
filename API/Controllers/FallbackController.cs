<<<<<<< HEAD
=======

>>>>>>> ec7d01b32bf3e9ed43fc1fc2a5f7f163780b7bdb
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
<<<<<<< HEAD
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), 
            "wwwroot", "index.html"), "text/HTML");
=======
    public class FallbackController  :Controller
    {
        public IActionResult index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
>>>>>>> ec7d01b32bf3e9ed43fc1fc2a5f7f163780b7bdb
        }
    }
}
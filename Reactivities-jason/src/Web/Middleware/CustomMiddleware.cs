using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Web.Middleware
{
    public class CustomMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CustomMiddleware> _logger;
        private readonly IHostEnvironment _host;
        public CustomMiddleware(RequestDelegate requestDelegate, ILogger<CustomMiddleware> logger1, IHostEnvironment hostEnvironment)
        {
            _next = requestDelegate;
            _logger = logger1;
            _host = hostEnvironment;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception)
            {
                _logger.LogError($"ERror {context.Response.StatusCode}");
                Console.WriteLine(context.Response.StatusCode);
            }
        }
    }
}

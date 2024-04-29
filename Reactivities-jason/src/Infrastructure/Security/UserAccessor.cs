
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Reactivities_jason.Application.Common.Interfaces;

namespace Reactivities_jason.Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {

        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public string GetUsername()
        {
            return _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.Name)!;
        }
    }
}

using Reactivities_jason.Application.Common.Models;

namespace Reactivities_jason.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string> GetUserNameAsync(string userId);

    Task<bool> IsInRoleAsync(string userId, string role);

    Task<bool> AuthorizeAsync(string userId, string policyName);

    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password, string emai, string displayName);

    Task<Result> DeleteUserAsync(string userId);
}

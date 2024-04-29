
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Reactivities_jason.Application.Common.Interfaces;

namespace Reactivities_jason.Infrastructure.Data.Configurations
{
    public class BearerToken : IConfigureOptions<BearerTokenOptions>
    {
        public void Configure(BearerTokenOptions options)
        {
            options.BearerTokenExpiration = TimeSpan.FromSeconds(5);
        }
    }
}

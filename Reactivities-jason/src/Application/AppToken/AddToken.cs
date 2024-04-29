using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.AppToken
{
    public record AddTokenCommand : IRequest<string>
    {
        public string Time { get; set; }
        public int Duration { get; set; }
    }

    public class AddTokenHandler : IRequestHandler<AddTokenCommand, string>
    {
        private readonly IApplicationDbContext _context;
        private readonly IHostApplicationLifetime _host;
        private readonly IMemoryCache _memoryCache;
        public AddTokenHandler(IApplicationDbContext context, IHostApplicationLifetime host, IMemoryCache memoryCache)
        {
            _context = context;
            _host = host;
            _memoryCache = memoryCache;
        }
        public async Task<string> Handle(AddTokenCommand request, CancellationToken cancellationToken)
        {
             var appToken = await _context.AppTokens.FirstOrDefaultAsync(x => x.nameSetting == "Expire Bearers");
            try
            {
                var Duration = request.Duration;
                switch (request.Time)
                {
                    case "days":
                        Duration = Duration * 24 * 60;
                        break;
                    case "hours":
                        Duration = Duration * 60;
                        break;
                    default:
                        break;
                }

                appToken.values = Duration.ToString();
                // _bearer.BearerTokenExpiration = TimeSpan.FromMinutes(Duration);
                _memoryCache.Set("expireToken", appToken.values);
                var status = await _context.SaveChangesAsync(cancellationToken);
                return status.ToString();
            }
            catch (System.Exception ex)
            {
                Console.WriteLine(ex.Message);
                return ex.Message;
            }

        }
    }
}

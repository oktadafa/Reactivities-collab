using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Domain.DTO;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Infrastructure.Security
{
    public class TokenConfiguration : ITokenConfiguration
    {
        private readonly IApplicationDbContext _context;
        public TokenConfiguration( IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TokenExpireDTO> GetExpireBearer()
        {
            var token = await _context.AppTokens.FirstOrDefaultAsync(x => x.nameSetting == "Expire Bearers");
                
            return new TokenExpireDTO
            {
                ExpireBearer = Convert.ToDouble(token.values)
            };

        }
    }
}


using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Domain.Constants;
using Reactivities_jason.Infrastructure.Data;
using Reactivities_jason.Infrastructure.Data.Interceptors;
using Reactivities_jason.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Reactivities_jason.Domain.Entities;
using Reactivities_jason.Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.BearerToken;
namespace Microsoft.Extensions.DependencyInjection;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        Guard.Against.Null(connectionString, message: "Connection string 'DefaultConnection' not found.");
        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("RedisConnection");
            options.InstanceName = "Reactivities";
        });
        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());

            options.UseNpgsql(connectionString);
        });
        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<ApplicationDbContextInitialiser>();

        services.AddAuthentication()
            .AddBearerToken(IdentityConstants.BearerScheme, async options =>
            {
                var token = services.BuildServiceProvider().GetService<ITokenConfiguration>();
                var result = await token.GetExpireBearer();
                options.BearerTokenExpiration = TimeSpan.FromDays(365);
                options.RefreshTokenExpiration = TimeSpan.FromMinutes(2);
                options.Events = new BearerTokenEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && ((path.StartsWithSegments("/chat"))) || ((path.StartsWithSegments("/conversation"))))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });


        services.AddCors(opt =>
        {
            opt.AddPolicy("Cookie", policy =>
            {
                policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:5173");
            });
        });
        services.AddAuthorizationBuilder();
        services
            .AddIdentityCore<AppUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddApiEndpoints();

        services.AddSingleton(TimeProvider.System);
        services.AddTransient<IIdentityService, IdentityService>();
        services.AddAuthorization(options =>
        {
            options.AddPolicy(Policies.CanPurge, policy => policy.RequireRole(Roles.Administrator));
            options.AddPolicy(Policies.IsHost, policy => { policy.Requirements.Add(new IHostRequirement()); });
        });
        services.AddTransient<IAuthorizationHandler, IHostRequirementHandler>();
        return services;
    }
}

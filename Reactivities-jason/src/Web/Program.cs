using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Infrastructure.Data;
using Reactivities_jason.Infrastructure.Security;
using Reactivities_jason.Application.SignalR;
using Serilog;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication;
using Reactivities_jason.Infrastructure.Data.Configurations;
using Microsoft.AspNetCore.Authentication.BearerToken;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddKeyVaultIfConfigured(builder.Configuration);

builder.Services.AddApplicationServices();
builder.Services.AddScoped<ITokenConfiguration, TokenConfiguration>();
// builder.Services.AddScoped<IConfigureOptions<AuthenticationBuilder>, BearerToken>();
// builder.Services.AddScoped<IConfigureOptions<BearerTokenOptions>,BearerToken>();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddWebServices();
builder.Services.AddSingleton<IUserAccessor, UserAccessor>();
var logger = new LoggerConfiguration().WriteTo.Console().WriteTo.File("log.txt", rollingInterval: RollingInterval.Day).CreateLogger();
builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    await app.InitialiseDatabaseAsync();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseHealthChecks("/health");
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.UseSwaggerUi(settings =>
{
    settings.Path = "/api";
    settings.DocumentPath = "/api/specification.json";
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();
app.UseCors("CorsPolicy");
app.UseCors("Cookie");
app.MapFallbackToFile("index.html");
app.UseExceptionHandler(options =>
{
    options.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "text/plain";

        await context.Response.WriteAsync("Internal Server ERror");
    });
});

app.Map("/", () => Results.Redirect("/api"));
app.MapHub<ChatHub>("/chat");
app.MapHub<ConversationHub>("/conversation");
app.MapEndpoints();

app.Run();

public partial class Program { }

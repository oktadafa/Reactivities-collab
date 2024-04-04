using API.Extensions;
using API.Middleware;
using API.Signal;
using API.SignalR;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdntityServices(builder.Configuration);
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMidleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();    
app.MapHub<ChatHub>("/chat");
<<<<<<< HEAD
app.MapFallbackToController("Index", "Fallback");

=======
app.MapHub<NotificationHub>("/notification");
app.MapFallbackToController("index", "Fallback");
>>>>>>> ec7d01b32bf3e9ed43fc1fc2a5f7f163780b7bdb
using var scope = app.Services.CreateScope();
var services  = scope.ServiceProvider;

try
{
    var context =  services.GetRequiredService<DataContext>();
    var dafa =  services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, dafa);
}
catch (System.Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
    throw;
}

app.Run();

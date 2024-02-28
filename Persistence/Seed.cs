using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
                if (!userManager.Users.Any())
                {
                var users = new List<AppUser>
                {
                    new AppUser{Email = "oktadafasampang@gmail.com", Bio = "okta daffa ramadani", DisplayName="dafa", UserName="dafasdfa"},
                    new AppUser{Email = "oktadafa@gmail.com", Bio = "okta daffa ramadani", DisplayName="okta",UserName="daffasdaa"},
                    new AppUser{Email = "rakai@gmail.com", Bio = "Rakai Wikrama Wardhana", DisplayName="rakai",UserName="rakai"},

                };

                foreach (var user in users)
                {
                  var result  =  await userManager.CreateAsync(user, "Ddasas33dasdadas");
                  Console.WriteLine(result);
                }
            }

                
            
            if (context.Activities.Any()) return;

            var activities = new List<Activity>
            {
                new Activity
                {
                    Title = "Past Activity 1",
                    Date = DateTime.Now.ToUniversalTime(),
                    Description = "Activity 2 months ago",
                    Category = "drinks",
                    City = "London",
                    Venue = "Pub",
                },
            };

            await context.Activities.AddRangeAsync(activities);
            await context.SaveChangesAsync();
        }
    }
}
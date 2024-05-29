using Microsoft.AspNetCore.Identity;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{

    // public string? DisplayName { get; set; }

    public string Bio { get; set; }

    public int VerifyCode { get; set; }

    public DateTime ExpireVerifyCode { get; set; }

    public ICollection<ActivityAttendee> ActivityAttendees { get; set; }


}

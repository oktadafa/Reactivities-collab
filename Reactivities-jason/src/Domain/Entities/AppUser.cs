using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Reactivities_jason.Domain.Entities
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }

        public string Bio { get; set; }

        public int VerifyCode { get; set; }

        public DateTime ExpireVerifyCode { get; set; }

        public ICollection<ConversationsParticipants> ConversationsParticipants { get; set; }

        public ICollection<ActivityAttendee> ActivityAttendees { get; set; }

        public ICollection<UserFollowing> Followings { get; set; }

        public ICollection<UserFollowing> Followers { get; set; }

        public ICollection<Messages> Messages { get; set; }

        public ICollection<Photo> Photos { get; set; }
    }
}

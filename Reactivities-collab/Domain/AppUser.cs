using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio {get;set;}
        public int VerifyCode { get; set; }
        public DateTime ExpireVerifyCode { get; set; }
        public ICollection<ActivityAttendee> Activities {get;set;}
        public ICollection<Photo> Photos { get; set; }
        public ICollection<UserFollowing> Followings { get; set; }
        public ICollection<UserFollowing> Followers { get; set; }
        public ICollection<Notifikasi> Notifications {get;set;}
        public ICollection<Notifikasi> historyNotif { get; set; }

    }
}
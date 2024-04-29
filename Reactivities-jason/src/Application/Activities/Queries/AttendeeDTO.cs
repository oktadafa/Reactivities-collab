
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Activities.Queries
{
    public class AttendeeDTO
    {
        public string Username { get; set; }
        
        public string DisplayName { get; set; }
        
        public string Bio { get; set; }

        public string Image { get; set; }     

        public bool Following { get; set; }
        
        public int FollowersCount{ get; set; }
        
        public int FollowingCount { get; set; }       
        
        private class Mapping : Profile
        {
            public Mapping()
            {
                string currentUsername = null;

                CreateMap<ActivityAttendee, AttendeeDTO>()
                .ForMember(x => x.DisplayName, o => o.MapFrom(a => a.AppUser.DisplayName))
                .ForMember(x => x.Username, o => o.MapFrom(a => a.AppUser.UserName))
                .ForMember(x => x.Bio, o => o.MapFrom(a => a.AppUser.Bio))
                .ForMember(x => x.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.isMain).fileBase64))
                .ForMember(x => x.Following, o => o.MapFrom(a => a.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)))
                .ForMember(x => x.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(x => x.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count));
            }
        }

    }
}

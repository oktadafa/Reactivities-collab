using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Profiles
{
    public class Profiles
    {
        public string Username { get; set; }

        public string DisplayName { get; set; }

        public string Bio { get; set; }

        public bool Following { get; set; }

        public int FollowersCount { get; set; }

        public int FollowingCount { get; set; }
        public string Image { get; set; }
        public ICollection<Domain.Entities.Photo> Photos {get;set;}
        private class Mapping : Profile
        {
            public Mapping()
            {
                string currentUsername = null;

                CreateMap<AppUser, Profiles>()
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)))
                .ForMember(d => d.Image, o => o.MapFrom(l => l.Photos.FirstOrDefault(x => x.isMain).fileBase64));
            }
        }
    }
}

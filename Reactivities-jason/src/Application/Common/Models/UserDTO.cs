using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Common.Models
{
    public class UserDTO
    {
        public Guid Id { get; set; }
        public string DisplayName { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string Image { get; set; }

        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<AppUser, UserDTO>().ForMember(x => x.UserName, o => o.MapFrom(p => p.UserName)).ForMember(x => x.DisplayName, o => o.MapFrom(p => p.DisplayName)).ForMember(x => x.Email, x => x.MapFrom(p => p.Email)).ForMember(x => x.Image, o => o.MapFrom(p => p.Photos.FirstOrDefault(y => y.isMain == true).fileBase64));
            }
        }

    }
}

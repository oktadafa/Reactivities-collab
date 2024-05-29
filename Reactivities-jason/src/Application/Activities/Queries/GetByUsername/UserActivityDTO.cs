using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Activities.Queries.GetByUsername
{
    public class UserActivityDTO
    {
        public Guid id { get; set; }

        public string Title { get; set; }

        public string Category { get; set; }

        public DateTime Date { get; set; }

        [JsonIgnore]
        public string HostUsername { get; set; }

        public string HostDisplayName { get; set; }



        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<ActivityAttendee, UserActivityDTO>()
                  .ForMember(x => x.id, o => o.MapFrom(x => x.Activity.Id))
            .ForMember(x => x.Title, o => o.MapFrom(x => x.Activity.Title))
            .ForMember(x => x.HostUsername, o => o.MapFrom(p => p.Activity.Attendees.FirstOrDefault(u => u.isHost).AppUser.UserName))
            .ForMember(o => o.Date, y => y.MapFrom(p => p.Activity.Date))
            .ForMember(t => t.Category, o => o.MapFrom(s => s.Activity.Category))
            .ForMember(x => x.HostDisplayName, o => o.MapFrom(s => s.Activity.Attendees.FirstOrDefault(x => x.isHost).AppUser.DisplayName));

            }
        }

    }
}

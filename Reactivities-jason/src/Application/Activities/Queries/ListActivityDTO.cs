using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Activities.Queries
{
    public class ListActivityDTO
    {
        public Guid id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Venue { get; set; }
        public string City { get; set; }
        public string HostUsername { get; set; }
        public bool isCanceled { get; set; }
        public bool isPrivate { get; set; } = false;
        public ICollection<AttendeeDTO> Attendees{get;set;}
        private class Mapping :Profile 
        {
            public Mapping()
            {
                CreateMap<Activity, ListActivityDTO>().ForMember(x => x.HostUsername, o => o.MapFrom(a => a.Attendees!.FirstOrDefault(x => x.isHost)!.AppUser!.Email));
            }
        }
    }
}

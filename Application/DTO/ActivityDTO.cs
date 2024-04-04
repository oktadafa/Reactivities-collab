using Application.Activities;

namespace Application.DTO
{
    public class ActivityDTO
    {
        public Guid id { get; set; }
        public string Title { get; set; }
        
        public DateTime Date { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string City { get; set; }

        public string Venue { get; set; }

        public string HostUsername { get; set; }
    public bool isCanceled { get; set; }

    public bool isPrivate {get;set;} = false;

    public ICollection<AttendeeDto> Attendees {get;set;}
     }
}
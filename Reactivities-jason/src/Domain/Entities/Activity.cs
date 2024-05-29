using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime;
using System.Threading.Tasks;

namespace Reactivities_jason.Domain.Entities
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Venue { get; set; }
        public string City { get; set; }
        public bool isCanceled { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<ActivityAttendee> Attendees { get; set; } = new List<ActivityAttendee>();
    }
}

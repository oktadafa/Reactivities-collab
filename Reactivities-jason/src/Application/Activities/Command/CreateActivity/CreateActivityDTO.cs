namespace Reactivities_jason.Application.Activities.Command.CreateActivity
{
    public class CreateActivityDTO
    {

        public Guid id { get; set; } = new Guid();
        
        public string Title { get; set; }

        public DateTime Date { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string Venue { get; set; }

        public string City { get; set; }
        
        

    }
}

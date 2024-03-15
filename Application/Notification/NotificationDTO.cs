namespace Application.Notification
{
    public class NotificationDTO
    {
        public int Id { get; set; }
        
        public string From { get; set; }

        public string Image { get; set; }

        public string Message { get; set; }
        
        public string To { get; set; }
        
        public DateTime Date { get; set; }
        
    }
}
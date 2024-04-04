namespace Application.Notification
{
    public class NotificationDTO
    {
        public int Id { get; set; }
        public string From { get; set; }
        public string userNameFrom { get; set; }
        public string? Image { get; set; }
        public string type {get;set;}
        public string Message { get; set; }
        public string ToId { get; set; }
        public DateTime Date { get; set; }

        public bool isRead { get; set; }
    }
}
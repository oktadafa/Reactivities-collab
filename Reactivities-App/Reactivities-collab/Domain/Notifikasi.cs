
namespace Domain
{
    public class Notifikasi
    {
        public int Id { get; set; }
        public AppUser To { get; set; }
        public string Message { get; set; }
        public AppUser From { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        
        public bool isRead { get; set; }
    }
}
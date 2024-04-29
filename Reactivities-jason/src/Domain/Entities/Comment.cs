namespace Reactivities_jason.Domain.Entities
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Body { get; set; }
        public AppUser Author { get; set; }
        public Activity Activity { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Comment CommentParent {get;set;}  
        public ICollection<Comment> ReplyComments = new List<Comment>();
        public string CommentImage { get; set; }
    }
}

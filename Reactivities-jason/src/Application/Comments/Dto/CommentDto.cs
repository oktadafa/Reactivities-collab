using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Application.Comments.Dto
{
    public class CommentDto
    {
        public Guid id { get; set; }
        
        public string Body { get; set; }
        
        public string Username { get; set; }
        
        public string DisplayName { get; set; }
        
        public string Image { get; set; }
        
        public string CommentImage { get; set; }

        public DateTime CreatedAt { get; set; }
        
        public ICollection<CommentDto> ReplyComments { get; set; } = new List<CommentDto>();
        
        
        private class Mapping : Profile{
            public Mapping()
            {
                CreateMap<Domain.Entities.Comment, CommentDto>().ForMember(x => x.DisplayName, o => o.MapFrom(p => p.Author.DisplayName))
                .ForMember(x => x.Username, o =>  o.MapFrom( p=> p.Author.UserName))
                .ForMember(x => x.Image, o => o.MapFrom(p => p.Author.Photos.FirstOrDefault(x => x.isMain).fileBase64));
            }
        }
        
        
    }
}

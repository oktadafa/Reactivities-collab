using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Application.Conversation.DTO
{
    public class MessageDTO
    {
        public Guid Id { get; set; }
        public string Image { get; set; }
        public string FromDisplayName { get; set; }
        public string Body { get; set; }
        public string FromUsername { get; set; }
        public bool IsRead { get; set; }
        public DateTime createdAt { get; set; }

        public FileDTO File { get; set; }

        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<Domain.Entities.Messages, MessageDTO>().ForMember(x => x.FromUsername, o => o.MapFrom(x => x.Sender.UserName)).ForMember(x => x.createdAt, o => o.MapFrom(p => p.CraetedAt))
                .ForMember(x => x.File, o => o.MapFrom(x => x.Files));
            }
        }
    }
}

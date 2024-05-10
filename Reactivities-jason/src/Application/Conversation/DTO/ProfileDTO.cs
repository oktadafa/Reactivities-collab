using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Application.Conversation.DTO
{
    public class ProfileDTO
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string UserName { get; set; }
        public string Image { get; set; }
        public ICollection<MessageDTO> Messages { get; set; } = new List<MessageDTO>();
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Domain.Entities
{
    public class Messages
    {
        public Guid Id { get; set; }
        public Guid ConversationsId { get; set; }
        public string SenderId { get; set; }
        public Conversations Conversations { get; set; }
        public AppUser Sender { get; set; }
        public string Body { get; set; }
        public bool IsRead { get; set; } = false;
        public ConvesationFile Files { get; set; }
        public DateTime CraetedAt { get; set; }
    }
}

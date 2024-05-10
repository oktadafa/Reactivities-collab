using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Domain.Entities
{
    public class ConversationsParticipants
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public Guid ConversationId { get; set; }
        public AppUser AppUser { get; set; }
        public Conversations Conversations { get; set; }
    }
}

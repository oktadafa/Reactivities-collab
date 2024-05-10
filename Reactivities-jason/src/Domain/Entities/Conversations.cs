using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Domain.Entities
{
    public class Conversations
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<ConversationsParticipants> ConversationsParticipants { get; set;} = new List<ConversationsParticipants>();
        public ICollection<Messages> Messages { get; set; } = new List<Messages>();
    }
}

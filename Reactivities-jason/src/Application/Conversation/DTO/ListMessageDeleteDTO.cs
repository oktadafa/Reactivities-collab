using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Application.Conversation.DTO
{
    public class ListMessageDeleteDTO
    {
        public MessageDTO MessageDelete { get; set; }
        public MessageDTO LatestMessage { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Domain.Entities
{
    public class ConvesationFile
    {
        public Guid Id { get; set; }
        public Guid MessageId {get;set;}
        public Messages Messages{get; set;}
        public string Name { get; set; }
        public string ContentType { get; set; }
        public string Base64 { get; set; }
        public int Size { get; set; }
    }
}

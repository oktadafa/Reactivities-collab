using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Domain.Entities
{
    public class Photo
    {
        public Guid id { get; set; }
        
        public string FileName { get; set; }
        
        public string fileBase64 { get; set; }

        public bool isMain { get; set; }
        
    }
}

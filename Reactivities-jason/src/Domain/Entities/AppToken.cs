using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Reactivities_jason.Domain.Entities
{
    public class AppToken
    {
        public Guid id { get; set; }
        public string nameSetting { get; set; }
        public string values { get; set; }
    }

}

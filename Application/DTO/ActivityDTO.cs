using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using Microsoft.AspNetCore.Mvc.ActionConstraints;

namespace Application.DTO
{
    public class ActivityDTO
    {
        public string Title { get; set; }
        
        public DateTime Date { get; set; }

        public string Description { get; set; }

        public string Category { get; set; }

        public string City { get; set; }

        public string Venue { get; set; }

        public string HostUsername { get; set; }  
        public ICollection<Profile> Profiles {get;set;}
     }
}
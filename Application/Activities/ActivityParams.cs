using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;

namespace Application.Activities
{
    public class ActivityParams : PaggingParams
    {
        public bool isGoing { get; set; }

        public bool isHost { get; set; }

        public DateTime startDate { get; set; } = DateTime.UtcNow;

        public string Predicate {get;set;} = "future";

        public string Username { get; set; }
    }
}
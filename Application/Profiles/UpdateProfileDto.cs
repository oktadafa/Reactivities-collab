using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class UpdateProfileDto
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
    }
}
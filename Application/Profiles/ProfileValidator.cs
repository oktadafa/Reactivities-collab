using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interface;
using Domain;
using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace Application.Profiles
{
    public class ProfileValidator : AbstractValidator<UpdateProfileDto>
    {
        public ProfileValidator()
        {

            RuleFor(x => x.DisplayName).NotEmpty();
        }
    }
}
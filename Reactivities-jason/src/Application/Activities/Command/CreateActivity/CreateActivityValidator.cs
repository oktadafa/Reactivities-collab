using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Application.Activities.Command.CreateActivity
{
    public class CreateActivityValidator : AbstractValidator<CreateActivityCommand>
    {
        public CreateActivityValidator()
        {
            RuleFor(x => x.ActivityDTO.Title).NotEmpty().WithMessage("Title Can Not Empty");
            RuleFor(x => x.ActivityDTO.Description).NotEmpty().WithMessage("Description Can not Empty");
            RuleFor(x => x.ActivityDTO.Category).NotEmpty().WithMessage("Category Can Not Empty");
            RuleFor(x => x.ActivityDTO.Venue).NotEmpty().WithMessage("Venue Can Not Empty");
            RuleFor(x => x.ActivityDTO.Date).NotEmpty().WithMessage("Date Can Not Empty");
        }
    }
}

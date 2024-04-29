namespace Reactivities_jason.Application.Activities.Command.Update
{
    public class UpdateActivityValidator : AbstractValidator<UpdateActivityCommand>
    {
        public UpdateActivityValidator()
        {
            RuleFor(x => x.ActivityDTO.Title).NotEmpty().WithMessage("Title Can Not Empty");
            RuleFor(x => x.ActivityDTO.Description).NotEmpty().WithMessage("Description Not Empty");
            RuleFor(x => x.ActivityDTO.Category).NotEmpty().WithMessage("Category Not Empty");
            RuleFor(x => x.ActivityDTO.Date).NotEmpty().WithMessage("Date Not Empty");
            RuleFor(x => x.ActivityDTO.Venue).NotEmpty().WithMessage("Venue Can Not Empty");
        }
    }
}

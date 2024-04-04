using FluentValidation;

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
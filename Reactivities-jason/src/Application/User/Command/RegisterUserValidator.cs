namespace Reactivities_jason.Application.User.Command
{
    public class RegisterUserValidator : AbstractValidator<RegisterUserCommand>
     {
        public RegisterUserValidator()
        {
            RuleFor(x => x.Email).EmailAddress().WithMessage("This is must email");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email Not Empty");
            RuleFor(x => x.Username).NotEmpty().WithMessage("Username Not Empty");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Password Not Empty");
            RuleFor(x => x.Password).MinimumLength(8).WithMessage("Password Must Lengt Minimum 8");
            RuleFor(x => x.Password).Matches("[A-Za-z0-9]*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]+[A-Za-z0-9]*")
                .WithMessage("Password must contain at least one symbol.");
            RuleFor(x => x.Password).Matches("[A-Za-z0-9]*[0-9]+[A-Za-z0-9]*")
                .WithMessage("Password must contain at least one number.");

        }
    }
}

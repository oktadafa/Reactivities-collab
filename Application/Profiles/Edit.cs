
using Application.Core;
using Application.Interface;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public UpdateProfileDto Profile { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Profile).SetValidator(new ProfileValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _user;

            private readonly UserManager<AppUser> userManager;

            private readonly IMapper _mapper;
            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _context = context;
                _user = userAccessor;
                _mapper = mapper;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());
                user.DisplayName = request.Profile.DisplayName;
                user.Bio = request.Profile.Bio ?? "";
               var result = await  _context.SaveChangesAsync() > 0;
               if (result)
               {
                    return Result<Unit>.Success(Unit.Value);
               }
               return Result<Unit>.Failure("error");
            }
        }




    }
}
using Application.Core;
using Application.DTO;
using Application.Interface;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public ActivityDTO activity {get; set;}
        }

        public class CommandValidator : AbstractValidator<Command> 
        {
            public CommandValidator()
            {
                RuleFor(x => x.activity).SetValidator(new ActivityValidator());
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _imapper;

            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _imapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                    var activity = _imapper.Map<Activity>(request.activity);
                    var attende = new ActivityAttendee{
                        AppUser = user,
                        Activity = activity,
                        isHost = true
                    };

                    activity.Attendees.Add(attende);
                    
                    _context.Activities.Add(activity);
                    await _context.SaveChangesAsync();
                     return Result<Unit>.Success(Unit.Value);
                }
                catch (Exception error)
                {
                    return Result<Unit>.Failure(Convert.ToString(error));
                }
                
            }
        }
    }
}

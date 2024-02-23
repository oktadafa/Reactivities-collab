using Application.Core;
using Application.DTO;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
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
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _imapper = mapper;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = _imapper.Map<Activity>(request.activity); 
                _context.Activities.Add(activity);
               var result =  await _context.SaveChangesAsync() > 0;
               if(!result) return Result<Unit>.Failure("failed to create activity");
               return  Result<Unit>.Success(Unit.Value);
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Application.Core;
using Application.Interface;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public string Body{get;set;}
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }
            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);
                if(activity is null) return null;
                var user =  await _context.Users.Include(p=> p.Photos).SingleOrDefaultAsync(x =>x.UserName == _userAccessor.GetUsername());
 
                var coment  = new Comment {
                    Activity = activity,
                    Author = user,
                    Body = request.Body                    
                };
                activity.Comments.Add(coment);

                var success = await _context.SaveChangesAsync() > 0;
                if(success) return Result<CommentDto>.Success(_mapper.Map<CommentDto>(coment));

                return Result<CommentDto>.Failure("failed to add comment");
            }
        }
    }
}

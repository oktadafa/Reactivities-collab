using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int CommentId {get;set;}

            public Guid ActivityId {get;set;}

        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var comment = await _context.Comments.SingleOrDefaultAsync(x => x.Id == request.CommentId);
                if (comment is null)
                {
                    return null;
                }

                 _context.Comments.Remove(comment);
                 var result = await _context.SaveChangesAsync() > 0;
                 return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Gagal Menghapus Pesan");
            }
        }
    }
}
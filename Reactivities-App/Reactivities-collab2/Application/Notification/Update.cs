using Application.Core;
using MediatR;
using Persistence;

namespace Application.Notification
{
    public class Update
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int NotificationId;
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
                var notification = _context.Notifications.SingleOrDefault(x => x.Id == request.NotificationId);
                if (notification is null)
                {
                    return null;
                }
                notification.isRead = true;
                var result = await _context.SaveChangesAsync() > 0;
                return  result? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Gagal");
            }
        }
    }
}
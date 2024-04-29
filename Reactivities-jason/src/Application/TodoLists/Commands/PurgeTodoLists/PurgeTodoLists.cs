// using Reactivities_jason.Application.Common.Interfaces;
// using Reactivities_jason.Application.Common.Security;
// using Reactivities_jason.Domain.Constants;

// namespace Reactivities_jason.Application.TodoLists.Commands.PurgeTodoLists;

// [Authorize(Roles = Roles.Administrator)]
// [Authorize(Policy = Policies.CanPurge)]
// public record PurgeTodoListsCommand : IRequest;

// public class PurgeTodoListsCommandHandler : IRequestHandler<PurgeTodoListsCommand>
// {
//     private readonly IApplicationDbContext _context;

//     public PurgeTodoListsCommandHandler(IApplicationDbContext context)
//     {
//         _context = context;
//     }

//     public async Task Handle(PurgeTodoListsCommand request, CancellationToken cancellationToken)
//     {
//         _context.TodoLists.RemoveRange(_context.TodoLists);

//         await _context.SaveChangesAsync(cancellationToken);
//     }
// }

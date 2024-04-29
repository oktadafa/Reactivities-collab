// using Reactivities_jason.Application.Common.Interfaces;
// using Reactivities_jason.Domain.Events;

// namespace Reactivities_jason.Application.TodoItems.Commands.DeleteTodoItem;

// public record DeleteTodoItemCommand(int Id) : IRequest;

// public class DeleteTodoItemCommandHandler : IRequestHandler<DeleteTodoItemCommand>
// {
//     private readonly IApplicationDbContext _context;

//     public DeleteTodoItemCommandHandler(IApplicationDbContext context)
//     {
//         _context = context;
//     }

//     public async Task Handle(DeleteTodoItemCommand request, CancellationToken cancellationToken)
//     {
//         var entity = await _context.TodoItems
//             .FindAsync(new object[] { request.Id }, cancellationToken);

//         Guard.Against.NotFound(request.Id, entity);

//         _context.TodoItems.Remove(entity);

//         entity.AddDomainEvent(new TodoItemDeletedEvent(entity));

//         await _context.SaveChangesAsync(cancellationToken);
//     }

// }

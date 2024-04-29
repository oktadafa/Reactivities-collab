// using Reactivities_jason.Domain.Events;
// using Microsoft.Extensions.Logging;

// namespace Reactivities_jason.Application.TodoItems.EventHandlers;

// public class TodoItemCreatedEventHandler : INotificationHandler<TodoItemCreatedEvent>
// {
//     private readonly ILogger<TodoItemCreatedEventHandler> _logger;

//     public TodoItemCreatedEventHandler(ILogger<TodoItemCreatedEventHandler> logger)
//     {
//         _logger = logger;
//     }

//     public Task Handle(TodoItemCreatedEvent notification, CancellationToken cancellationToken)
//     {
//         _logger.LogInformation("Reactivities_jason Domain Event: {DomainEvent}", notification.GetType().Name);

//         return Task.CompletedTask;
//     }
// }

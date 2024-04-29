using MediatR;
using Microsoft.AspNetCore.SignalR;
using Reactivities_jason.Application.Comments.Create;
using Reactivities_jason.Application.Comments.List;

namespace Reactivities_jason.Application.SignalR
{
    public class ChatHub : Hub
    {
       private readonly IMediator _mediator;
    public ChatHub(IMediator mediator)
    {
      _mediator = mediator;
    }

    public async Task SendComment(CreateCommand command)
    {
        try
        {
            var comment = await _mediator.Send(command);
            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment);
        }
        catch (Exception error)
        {
            Console.WriteLine(error.Message);
        }
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var ActivityId = httpContext.Request.Query["activityId"];
        await Groups.AddToGroupAsync(Context.ConnectionId, ActivityId);
        var result = await _mediator.Send(new ListQuery{ActivityId = new Guid(ActivityId)});
        await Clients.Caller.SendAsync("LoadComments", result);
    }
    }
}

using Application.Interface;
using Application.Notification;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.Signal
{
    public class NotificationHub :Hub
    {
        private readonly IMediator _mediator;
        private readonly IUserAccessor _user;
        public NotificationHub(IMediator mediator, IUserAccessor user)
        {
            _mediator = mediator;
            _user = user;
        }

        public override async Task OnConnectedAsync()
        {
            var result = await _mediator.Send(new List.Query{});
            await Clients.Caller.SendAsync("LoadNotification", result.Value);
        }


        public async Task Send(Create.Command command)
        {
            var Notification = await _mediator.Send(command);
            await Clients.All.SendAsync("ReceiveNotif", Notification.Value);
        }
    }
}
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
            try
            {
                var Notification = await _mediator.Send(command);
                await Clients.Users(Notification.Value.ToId).SendAsync("ReceiveNotif", Notification.Value);
            }
            catch (System.Exception err)
            {
                Console.WriteLine(err);
                
            }
        }

        public async Task Delete(DeleteFollow.Command command)
        {
            var result = await _mediator.Send(command);
            await Clients.User(result.Value).SendAsync("DeleteFollow", command.From); 
        }
    }
}
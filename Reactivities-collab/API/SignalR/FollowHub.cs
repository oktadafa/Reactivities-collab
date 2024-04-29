using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Followers;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class FollowHub:Hub
    {
        private readonly IMediator _mediator;

        public FollowHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task SendFollow(FollowToggle.Command command)
        {
            
        }
    }
}
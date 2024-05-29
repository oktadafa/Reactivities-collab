using Microsoft.AspNetCore.SignalR;
using Reactivities_jason.Application.Conversation.DTO;
using Reactivities_jason.Application.Conversation.Get;
using Reactivities_jason.Application.Conversation.Message;

namespace Reactivities_jason.Application.SignalR
{
    public class ConversationHub : Hub
    {
        private readonly IMediator _mediator;

        public ConversationHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public override async Task OnConnectedAsync()
        {
            var result = await _mediator.Send(new ListConversationQuery { });
            await Clients.Caller.SendAsync("LoadConversation", result);
        }

        public async Task listMessages(ListMessageQuery query)
        {
            try
            {
                var result = await _mediator.Send(query);
                await Clients.Caller.SendAsync("ListMessage", result);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public async Task<int> ReadMessage(MessageDTO message)
        {
            Console.WriteLine(message);
            var result = await _mediator.Send(new ReadMessageCommad { Message = message });
            return result;
        }

    }
}

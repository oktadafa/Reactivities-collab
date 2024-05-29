using Microsoft.AspNetCore.Mvc;
using Reactivities_jason.Application.Conversation.Create;
using Reactivities_jason.Application.Conversation.DTO;
using Reactivities_jason.Application.Conversation.Get;
using Reactivities_jason.Application.Conversation.Message;
using Reactivities_jason.Application.Photo.Command.Delete;

namespace Reactivities_jason.Web.Endpoints
{
    public class Conversations : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetConversations, "")
            .MapGet(GetMessages, "messages/{Username}")
            .MapPost(CreateConversations, "create")
            .MapPost(SendMessage, "send/message/")
            .MapDelete(DeleteMessage, "message/{id}");
        }

        public Task<List<ConversationsDTO>> GetConversations(ISender sender)
        {
            return sender.Send(new ListConversationQuery { });
        }

        public Task<int> CreateConversations(ISender sender, [FromBody] CreateConversationsCommand command)
        {
            return sender.Send(command);
        }

        public async Task<int> SendMessage(ISender sender, [FromBody] SendMessageCommand command)
        {
            var result = await sender.Send(command);
            return result;
        }

        public async Task<ProfileDTO> GetMessages(ISender sender, string Username)
        {
            var result = await sender.Send(new ListMessageQuery { Username = Username });
            return result;
        }

        public async Task<int> DeleteMessage(ISender sender, Guid id)
        {
            var results = await sender.Send(new DeleteMessageCommand { MessageId = id });
            return results;
        }
    }
}

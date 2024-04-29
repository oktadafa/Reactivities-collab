using System.Net.Sockets;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Application.Photo.Command.Delete;
using Reactivities_jason.Application.Photo.Command.setMain;
using Reactivities_jason.Application.Photo.Command.UploadPhoto;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Web.Endpoints
{
    public class Photo : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
            .RequireAuthorization()
            .MapPost(UploadPhoto)
            .MapPut(SetMain, "{id}")
            .MapDelete(DeletePhoto, "{id}");
        }

        public Task<Domain.Entities.Photo> UploadPhoto(UploadPhotoCommand command, ISender sender)
        {
            return sender.Send(command);
        }

        public Task<Result> SetMain(Guid id,ISender sender)
        {
            return sender.Send(new SetMainCommand{id = id});
        }
        
        public Task<Result> DeletePhoto(Guid id, ISender sender)
        {
            return sender.Send(new DeletePhotoCommand{id = id});
        }
    }
}

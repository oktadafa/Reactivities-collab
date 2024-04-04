using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interface
{
    public interface IPhotoAcessor
    {
        Task<PhotoUploadResult> AddPhoto(IFormFile file);

        Task<string> deletePhoto (string PublicId);
        
    }
}
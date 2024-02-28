using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
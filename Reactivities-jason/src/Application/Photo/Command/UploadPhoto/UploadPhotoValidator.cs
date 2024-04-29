using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reactivities_jason.Application.Photo.Command.UploadPhoto
{
    public class UploadPhotoValidator : AbstractValidator<UploadPhotoCommand>
    {
        public UploadPhotoValidator()
        {
            RuleFor(x => x.fileBase64).Must(x => ToMb(x) < 3.0 ).WithMessage("File Size To Big");
            RuleFor(x => x.fileBase64).Must(x => checkEkstension(x)).WithMessage("File Extension Not Supported");
        }

        private double ToMb(string Base64)
        {
            int base64Index = Base64.IndexOf("base64,", StringComparison.Ordinal);

            string base64String = Base64.Substring(base64Index + 7); // 7 adalah panjang dari "base64,"

            // Konversi string Base64 ke array byte
            byte[] bytes = Convert.FromBase64String(base64String);

            // Hitung ukuran berkas dalam MB
            double fileSizeMB = (double)bytes.Length / (1024.0 * 1024.0);

            return fileSizeMB;
        }

        private bool checkEkstension(string Base64)
        {
            int indexSemiColon = Base64.IndexOf(";");
            string contentType = Base64.Substring(5, indexSemiColon - 5);
            var allowedExtension = new []{"image/png", "image/jpg", "image/jpeg"};
            return allowedExtension.Contains(contentType);
        }
    }
}

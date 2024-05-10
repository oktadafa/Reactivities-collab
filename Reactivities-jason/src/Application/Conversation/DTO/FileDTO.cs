using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Conversation.DTO
{
    public class FileDTO
    {
        public string Name { get; set; }
        public string Base64 { get; set; }
        public int Size { get; set; }
        public string ContentType { get; set; }
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<ConvesationFile, FileDTO>();
            }
        }
    }
}

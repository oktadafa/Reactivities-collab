using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Conversation.DTO
{
    public class ConversationsDTO
    {
        public string Username { get; set; }
        public DateTime createdAt { get; set; } = DateTime.UtcNow;
        public string DisplayName { get; set; }
        public string Message { get; set; }
        public string Image { get; set; }
        public string FromUsername { get; set; }
        public bool IsRead { get; set; }
        public string file { get; set; }
        public string fileType { get; set; }
        public int NoReadCount { get; set; }
        private class Mapping : Profile
        {
            public Mapping()
            {
                string currentUsername = null;
                CreateMap<Conversations, ConversationsDTO>().ForMember(x => x.Message, o => o.MapFrom(p => p.Messages.OrderByDescending(x => x.CraetedAt).First().Body))
                .ForMember(x => x.Username, o => o.MapFrom(p => p.ConversationsParticipants.FirstOrDefault(x => x.AppUser.UserName != currentUsername).AppUser.UserName))
                .ForMember(x => x.DisplayName, o => o.MapFrom(p => p.ConversationsParticipants.FirstOrDefault(x => x.AppUser.UserName != currentUsername).AppUser.DisplayName))
                .ForMember(x => x.Image, o => o.MapFrom(p => p.ConversationsParticipants.FirstOrDefault(x => x.AppUser.UserName != currentUsername).AppUser.Photos.FirstOrDefault(x => x.isMain).fileBase64))
                .ForMember(x => x.createdAt, o => o.MapFrom(p => p.Messages.OrderByDescending(x => x.CraetedAt).First().CraetedAt))
                .ForMember(x => x.FromUsername, o => o.MapFrom(p => p.Messages.OrderByDescending(x => x.CraetedAt).First().Sender.UserName))
                .ForMember(x => x.IsRead, o => o.MapFrom(x => x.Messages.OrderByDescending(x => x.CraetedAt).First().IsRead))
                .ForMember(x => x.NoReadCount, o => o.MapFrom(x => x.Messages.Where(x => x.Sender.UserName != currentUsername && !x.IsRead).ToList().Count))
                .ForMember(x => x.file, o => o.MapFrom(x => x.Messages.OrderByDescending(x => x.CraetedAt).First().Files.Name))
                .ForMember(x => x.fileType, o => o.MapFrom(x => x.Messages.OrderByDescending(x => x.CraetedAt).First().Files.ContentType));

            }
        }
    }
}

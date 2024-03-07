
using Application.Activities;
using Application.Comments;
using Application.DTO;
using Application.Profiles;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;
            CreateMap<Activity,Activity>();
            
            CreateMap<ActivityDTO, Activity>();
            
            CreateMap<Activity, ActivityDTO>()
            .ForMember(d => d.HostUsername, o=>o.MapFrom(s=> s.Attendees.FirstOrDefault(e=> e.isHost).AppUser.UserName));
            
            CreateMap<ActivityAttendee,AttendeeDto>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.Bio, o=> o.MapFrom(s=> s.AppUser.Bio))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url)).ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));
            
            CreateMap<Comment,CommentDto>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
            .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
            
            CreateMap<ActivityAttendee, UserActivityDto>()
            .ForMember(x => x.Id, o => o.MapFrom(x => x.Activity.Id))
            .ForMember(x => x.Title, o => o.MapFrom(x => x.Activity.Title))
            .ForMember(x => x.HostUsername, o => o.MapFrom(p => p.Activity.Attendees.FirstOrDefault(u => u.isHost).AppUser.UserName))
            .ForMember(o => o.Date,y => y.MapFrom(p => p.Activity.Date))
                .ForMember(d => d.isPrivate, o => o.MapFrom(s => s.Activity.isPrivate))
            .ForMember(t => t.Category, o => o.MapFrom(s => s.Activity.Category));

        }
    }
}
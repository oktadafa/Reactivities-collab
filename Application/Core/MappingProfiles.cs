
using Application.Activities;
using Application.DTO;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity,Activity>();
            CreateMap<ActivityDTO, Activity>();
            CreateMap<Activity, ActivityDTO>().ForMember(d => d.HostUsername, o=>o.MapFrom(s=> s.Attendees.FirstOrDefault(e=> e.isHost).AppUser.UserName));
            CreateMap<ActivityAttendee, Profiles.Profile>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.Bio, o=> o.MapFrom(s=> s.AppUser.Bio));
            CreateMap<AppUser, Profiles.Profile>().ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}
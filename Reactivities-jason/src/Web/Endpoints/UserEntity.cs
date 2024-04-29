using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Application.Common.Models;
using Reactivities_jason.Application.User.Command;
using Reactivities_jason.Application.User.Query;
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Web.Endpoints
{
    public class UserEntity : EndpointGroupBase
    {
        // private readonly UserManager<AppUser> _userManager;
        // private readonly IMapper _mapper;
        // private readonly IUser _user;
        // public UserEntity(IUser user, UserManager<AppUser> userManager, IMapper mapper)
        // {
        //     _userManager = userManager;
        //     _user = user;
        //     _mapper = mapper;
        // }
        public override void Map(WebApplication app)
        {
         app.MapGroup(this)
         .MapGet(GetUser, "")
         .MapPost(RegisterUser,"register");
        }

        public Task<UserDTO> GetUser(ISender sender)
        {
            return sender.Send(new GetUserQuery());
        }

        public Task<Result> RegisterUser(ISender sender, RegisterUserCommand command)
        {
            return sender.Send(command);
        }
    }
}

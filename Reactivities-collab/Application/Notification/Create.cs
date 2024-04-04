using System.Data;
using Application.Core;
using Application.Interface;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Notification
{
    public class Create
    {
        public class Command : IRequest<Result<NotificationDTO>>
        {
        
            public string Username { get; set; }
            
            public string Message { get; set; }
            
        }

        public class CommandValidator : AbstractValidator<NotificationDTO>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Message).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<NotificationDTO>>
        {
            private readonly DataContext _contex;
            private readonly IUserAccessor _user;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IUserAccessor user, IMapper mapper)
            {

                _contex = context;
                _user = user;
                _mapper = mapper;
            }
               public async Task<Result<NotificationDTO>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var to = await _contex.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                    var from = await _contex.Users.Include(p=> p.Photos).SingleOrDefaultAsync(x => x.UserName == _user.GetUsername());

                    var Notification = new Notifikasi
                    {
                        To = to,
                        Message = request.Message,
                        From = from,
                        isRead = false
                    };
                    var image = from.Photos.FirstOrDefault(x => x.IsMain)?.Url;

                        _contex.Notifications.Add(Notification);
                    
                    var result = await _contex.SaveChangesAsync() > 0;
                 
                    var NotificationDTO = new NotificationDTO
                    {
                        Id = Notification.Id,
                        ToId = Notification.To.Id,
                        Image = image,
                        userNameFrom = Notification.From.UserName,
                        Message = Notification.Message,
                        From = Notification.From.DisplayName,
                        Date = Notification.Date,
                        isRead = Notification.isRead
                    };

                    return result ? Result<NotificationDTO>.Success(NotificationDTO) : Result<NotificationDTO>.Failure("Gagal");
                }
                catch (Exception err)
                {
                    Console.WriteLine(err);
                    return Result<NotificationDTO>.Failure("gagal");
                }
            }
        }
    }
}
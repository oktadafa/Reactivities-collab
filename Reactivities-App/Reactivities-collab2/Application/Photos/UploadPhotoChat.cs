using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using Application.Core;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class UploadPhotoChat
    {
        public class Command : IRequest<Result<Unit>>
        {
            public CommentDto comment { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => convertBase64ToImage(x.comment.CommentImage)).Must(x=>x.Length < 4000000000).WithMessage("FIle Size To Very Big");
            }

            public byte[] convertBase64ToImage(string image)
            {
                byte[] decodeData = Convert.FromBase64String(image);
                return decodeData;
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var chat = await _context.Comments.SingleOrDefaultAsync(x => x.Id == request.comment.Id);
                if (chat is null)
                {
                    return null;
                }
                chat.CommentImage = request.comment.CommentImage;
                var result = await _context.SaveChangesAsync() > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Tidak Bisa Menambahkan Photo");
            }
        }
    }
}
using Reactivities_jason.Domain.Entities;

namespace Reactivities_jason.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    // DbSet<TodoList> TodoLists { get; }

    // DbSet<TodoItem> TodoItems { get; }
    DbSet<Activity> Activities { get; }
    DbSet<UserFollowing> UserFollowings { get; }
    DbSet<ActivityAttendee> ActivityAttendees { get; }
    DbSet<Comment> Comments { get; }
    DbSet<Domain.Entities.Photo> Photos { get; }
    DbSet<Conversations> Conversations { get; }
    DbSet<ConversationsParticipants> ConversationsParticipants { get; }
    DbSet<Messages> Messages { get; }
    DbSet<ConvesationFile> ConvesationsFiles { get; }
    DbSet<Domain.Entities.AppToken> AppTokens { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}

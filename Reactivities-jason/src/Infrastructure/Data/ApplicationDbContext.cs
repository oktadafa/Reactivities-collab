﻿using System.Reflection;
using Reactivities_jason.Application.Common.Interfaces;
using Reactivities_jason.Domain.Entities;
using Reactivities_jason.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Reactivities_jason.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<AppUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // public DbSet<TodoList> TodoLists => Set<TodoList>();

    // public DbSet<TodoItem> TodoItems => Set<TodoItem>();
    public DbSet<Activity> Activities => Set<Activity>();
    public DbSet<UserFollowing> UserFollowings => Set<UserFollowing>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<ActivityAttendee> ActivityAttendees => Set<ActivityAttendee>();
    public DbSet<Photo> Photos => Set<Photo>();
    public DbSet<AppToken> AppTokens => Set<AppToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        builder.Entity<ActivityAttendee>(x => x.HasKey(a => new { a.AppUserId, a.ActivityId }));
        builder.Entity<ActivityAttendee>().HasOne(u => u.AppUser).WithMany(x => x.ActivityAttendees).HasForeignKey(a => a.AppUserId);
        builder.Entity<ActivityAttendee>().HasOne(x => x.Activity).WithMany(x => x.Attendees).HasForeignKey(x => x.ActivityId);
        builder.Entity<Comment>().HasOne(a => a.Activity).WithMany(c => c.Comments).OnDelete(DeleteBehavior.Cascade);
        builder.Entity<Comment>().HasOne(a => a.CommentParent).WithMany(c => c.ReplyComments).OnDelete(DeleteBehavior.Cascade);
        builder.Entity<UserFollowing>(b =>
        {
            b.HasKey(k => new { k.ObserverId, k.TargetId });
            b.HasOne(o => o.Observer).WithMany(f => f.Followings).HasForeignKey(o => o.ObserverId).OnDelete(DeleteBehavior.Cascade);
            b.HasOne(o => o.Target).WithMany(f => f.Followers).HasForeignKey(p => p.TargetId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}

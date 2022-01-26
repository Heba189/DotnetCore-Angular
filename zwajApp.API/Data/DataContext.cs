using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using zwajApp.API.Models;

namespace Data
{
    public class DataContext:IdentityDbContext<User,Role,int,IdentityUserClaim<int>,
    UserRole,IdentityUserLogin<int>,IdentityRoleClaim<int>,IdentityUserToken<int>>
    {
         public  DataContext(DbContextOptions<DataContext> options):base(options){}

         public DbSet<Value> Values { get; set; }

      //     public DbSet<User> Users { get; set; }

          public DbSet<Photo> Photos { get; set; }

          public DbSet<Like> Likes { get; set; }

          public DbSet<Payment> Payments { get; set; }  
          
          public DbSet<Message> Messages { get; set; }  
          protected  override void OnModelCreating(ModelBuilder builder){

                base.OnModelCreating(builder);
                builder.Entity<UserRole>(
                    userRole =>{
                        userRole.HasKey(ur => new{ur.UserId , ur.RoleId});
                        userRole.HasOne(ur => ur.Role)
                        .WithMany(r => r.UserRoles)
                        .HasForeignKey(ur => ur.RoleId)
                        .IsRequired();

                        userRole.HasOne(ur => ur.User)
                        .WithMany(r => r.UserRoles)
                        .HasForeignKey(ur => ur.UserId)
                        .IsRequired();    
                    }
                );




                builder.Entity<Like>()
                .HasKey(k => new{k.LikeeId,k.LikerId});
                builder.Entity<Like>()
                .HasOne( I => I.Likee)
                .WithMany(u => u.Likers)
                .HasForeignKey(I =>I.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);
                
                 builder.Entity<Like>()
                .HasKey(k => new{k.LikeeId,k.LikerId});
                 builder.Entity<Like>()
                .HasOne( I => I.Liker)
                .WithMany(u => u.Likees)
                .HasForeignKey(I =>I.LikerId)
                .OnDelete(DeleteBehavior.Restrict);

                builder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

                 builder.Entity<Message>()
                .HasOne(m => m.Recipient)
                .WithMany(u => u.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

                builder.Entity<Photo>()
                .HasQueryFilter(p => p.IsApproved);   

          }
     
        
    }
}
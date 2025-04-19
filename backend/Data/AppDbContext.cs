using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OneManager.Models;

namespace OneManager.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ForumPost> ForumPosts { get; set; }

        public DbSet<ActivityLog> ActivityLogs { get; set; }
    }
}

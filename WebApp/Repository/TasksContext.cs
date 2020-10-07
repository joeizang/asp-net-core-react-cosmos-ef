using Microsoft.EntityFrameworkCore;
using WebApp.Models;

namespace WebApp.Repository
{
    public class TasksContext : DbContext
    {
        public DbSet<TaskItem> TaskItems { get; set; }

        public TasksContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.HasDefaultContainer(nameof(TaskItems));
            builder.Entity<TaskItem>().ToContainer(nameof(TaskItems));
        }
    }
}
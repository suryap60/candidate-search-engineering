using CandidateSearch.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CandidateSearch.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Candidate> Candidates => Set<Candidate>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasIndex(x => x.Email)
                .IsUnique();

            entity.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(x => x.PasswordHash)
                .IsRequired();
        });

        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.HasOne(x => x.User)
                .WithOne(x => x.Candidate)
                .HasForeignKey<Candidate>(x => x.UserId);

            entity.HasIndex(x => x.Education);

            entity.HasIndex(x => x.Gender);

            entity.HasIndex(x => x.Location);

            entity.HasIndex(x => x.CreatedAt);

            entity.HasIndex(x => x.UserId);
        });
    }
}
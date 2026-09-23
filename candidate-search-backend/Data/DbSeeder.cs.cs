using CandidateSearch.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CandidateSearch.Api.Data;

public static class DbSeeder
{
	public static async Task SeedAsync(AppDbContext db)
	{
		if (await db.Users.AnyAsync())
			return;

		var users = new List<User>
		{
			new()
			{
				Email = "anjali@example.com",
				PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"),
				CreatedAt = new DateTime(2026, 9, 1, 10, 0, 0, DateTimeKind.Utc),
				LastLoginAt = new DateTime(2026, 9, 21, 9, 30, 0, DateTimeKind.Utc)
			},
			new()
			{
				Email = "rahul@example.com",
				PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"),
				CreatedAt = new DateTime(2026, 9, 3, 11, 0, 0, DateTimeKind.Utc),
				LastLoginAt = new DateTime(2026, 9, 20, 14, 0, 0, DateTimeKind.Utc)
			},
			new()
			{
				Email = "arun@example.com",
				PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"),
				CreatedAt = new DateTime(2026, 9, 5, 9, 0, 0, DateTimeKind.Utc)
			},
			new()
			{
				Email = "meera@example.com",
				PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"),
				CreatedAt = new DateTime(2026, 9, 8, 13, 0, 0, DateTimeKind.Utc),
				LastLoginAt = new DateTime(2026, 9, 22, 10, 0, 0, DateTimeKind.Utc)
			},
			new()
			{
				Email = "neha@example.com",
				PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"),
				CreatedAt = new DateTime(2026, 9, 10, 15, 0, 0, DateTimeKind.Utc),
				LastLoginAt = new DateTime(2026, 9, 21, 16, 0, 0, DateTimeKind.Utc)
			}
		};

		db.Users.AddRange(users);
		await db.SaveChangesAsync();

		var candidates = new List<Candidate>
		{
			new()
			{
				UserId = users[0].Id,
				Name = "Anjali",
				DateOfBirth = new DateOnly(1998, 5, 12),
				Gender = "Female",
				Location = "Kochi",
				Education = "M.Tech",
				CreatedAt = users[0].CreatedAt
			},
			new()
			{
				UserId = users[1].Id,
				Name = "Rahul",
				DateOfBirth = new DateOnly(1996, 8, 20),
				Gender = "Male",
				Location = "Kochi",
				Education = "MBA",
				CreatedAt = users[1].CreatedAt
			},
			new()
			{
				UserId = users[2].Id,
				Name = "Arun",
				DateOfBirth = new DateOnly(2000, 2, 15),
				Gender = "Male",
				Location = "Thrissur",
				Education = "B.Tech",
				CreatedAt = users[2].CreatedAt
			},
			new()
			{
				UserId = users[3].Id,
				Name = "Meera",
				DateOfBirth = new DateOnly(1997, 11, 5),
				Gender = "Female",
				Location = "Kozhikode",
				Education = "MCA",
				CreatedAt = users[3].CreatedAt
			},
			new()
			{
				UserId = users[4].Id,
				Name = "Neha",
				DateOfBirth = new DateOnly(1999, 3, 25),
				Gender = "Female",
				Location = "Kochi",
				Education = "B.Tech",
				CreatedAt = users[4].CreatedAt
			}
		};

		db.Candidates.AddRange(candidates);
		await db.SaveChangesAsync();
	}
}
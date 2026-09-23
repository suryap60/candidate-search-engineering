using System;

namespace CandidateSearch.Api.Models;

public class Candidate
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateOnly DateOfBirth { get; set; }

    public string Gender { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string Education { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
}
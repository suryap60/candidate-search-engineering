using System;

namespace CandidateSearch.Api.DTOs.Candidates;

public class CandidateResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public int Age { get; set; }

    public string Gender { get; set; } = string.Empty;

    public string Education { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }
}
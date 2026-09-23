using System;

namespace CandidateSearch.Api.DTOs.Candidates;

public class CandidateSearchRequest
{
    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 20;

    public int? MinAge { get; set; }

    public int? MaxAge { get; set; }

    public string? Gender { get; set; }

    public string? Location { get; set; }

    public string? Education { get; set; }

    public DateOnly? CreatedFrom { get; set; }

    public DateOnly? CreatedTo { get; set; }

    public DateOnly? LastLoginFrom { get; set; }

    public DateOnly? LastLoginTo { get; set; }

    public string? SortBy { get; set; }

    public string? SortOrder { get; set; }
}
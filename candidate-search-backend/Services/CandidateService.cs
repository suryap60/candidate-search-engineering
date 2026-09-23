using CandidateSearch.Api.Data;
using CandidateSearch.Api.DTOs.Candidates;
using CandidateSearch.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CandidateSearch.Api.Services;

public class CandidateService : ICandidateService
{
    private readonly AppDbContext _db;

    public CandidateService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResponse<CandidateResponse>> SearchAsync(
        CandidateSearchRequest request,
        int currentUserId)
    {
        var query = _db.Candidates
            .AsNoTracking()
            .Where(x => x.UserId != currentUserId);

        // AGE FILTER

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if (request.MinAge.HasValue)
        {
            var maximumDateOfBirth =
                today.AddYears(-request.MinAge.Value);

            query = query.Where(
                x => x.DateOfBirth <= maximumDateOfBirth
            );
        }

        if (request.MaxAge.HasValue)
        {
            var minimumDateOfBirth =
                today.AddYears(-(request.MaxAge.Value + 1));

            query = query.Where(
                x => x.DateOfBirth > minimumDateOfBirth
            );
        }

        // GENDER FILTER

        if (!string.IsNullOrWhiteSpace(request.Gender))
        {
            query = query.Where(
                x => x.Gender == request.Gender
            );
        }

        // LOCATION FILTER

        if (!string.IsNullOrWhiteSpace(request.Location))
        {
            var location = request.Location.Trim().ToLowerInvariant();

            query = query.Where(
                x => x.Location.ToLower() == location
            );
        }

        // EDUCATION FILTER

        if (!string.IsNullOrWhiteSpace(request.Education))
        {
            var educations = request.Education
                .Split(
                    ',',
                    StringSplitOptions.RemoveEmptyEntries |
                    StringSplitOptions.TrimEntries
                );

            if (educations.Length > 0)
            {
                query = query.Where(
                    x => educations.Contains(x.Education)
                );
            }
        }

        // CREATED DATE FILTER

        if (request.CreatedFrom.HasValue)
        {
            var createdFromUtc = DateTime.SpecifyKind(
                request.CreatedFrom.Value.ToDateTime(TimeOnly.MinValue),
                DateTimeKind.Utc
            );

            query = query.Where(
                x => x.CreatedAt >= createdFromUtc
            );
        }

        if (request.CreatedTo.HasValue)
        {
            var createdToExclusiveUtc = DateTime.SpecifyKind(
                request.CreatedTo.Value
                    .AddDays(1)
                    .ToDateTime(TimeOnly.MinValue),
                DateTimeKind.Utc
            );

            query = query.Where(
                x => x.CreatedAt < createdToExclusiveUtc
            );
        }

        // LAST LOGIN FILTER

        if (request.LastLoginFrom.HasValue)
        {
            var lastLoginFromUtc = DateTime.SpecifyKind(
                request.LastLoginFrom.Value.ToDateTime(TimeOnly.MinValue),
                DateTimeKind.Utc
            );

            query = query.Where(
                x =>
                    x.User.LastLoginAt.HasValue &&
                    x.User.LastLoginAt.Value >= lastLoginFromUtc
            );
        }

        if (request.LastLoginTo.HasValue)
        {
            var lastLoginToExclusiveUtc = DateTime.SpecifyKind(
                request.LastLoginTo.Value
                    .AddDays(1)
                    .ToDateTime(TimeOnly.MinValue),
                DateTimeKind.Utc
            );

            query = query.Where(
                x =>
                    x.User.LastLoginAt.HasValue &&
                    x.User.LastLoginAt.Value < lastLoginToExclusiveUtc
            );
        }

        // TOTAL COUNT

        var totalCount = await query.CountAsync();

        // SORTING

        var sortBy = request.SortBy?
            .Trim()
            .ToLowerInvariant();

        var sortOrder = request.SortOrder?
            .Trim()
            .ToLowerInvariant();

        var descending = sortOrder == "desc";

        query = sortBy switch
        {
            "lastloginat" =>
                descending
                    ? query.OrderByDescending(x => x.User.LastLoginAt)
                    : query.OrderBy(x => x.User.LastLoginAt),

            "age" =>
                descending
                    ? query.OrderBy(x => x.DateOfBirth)
                    : query.OrderByDescending(x => x.DateOfBirth),

            "createdat" =>
                descending
                    ? query.OrderByDescending(x => x.CreatedAt)
                    : query.OrderBy(x => x.CreatedAt),

            _ =>
                query.OrderByDescending(x => x.CreatedAt)
        };

        // PAGINATION + PROJECTION

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new CandidateResponse
            {
                Id = x.Id,
                Name = x.Name,
                Age = CalculateAge(x.DateOfBirth),
                Gender = x.Gender,
                Education = x.Education,
                Location = x.Location,
                CreatedAt = x.CreatedAt,
                LastLoginAt = x.User.LastLoginAt
            })
            .ToListAsync();

        // RESPONSE

        return new PagedResponse<CandidateResponse>
        {
            Page = request.Page,
            PageSize = request.PageSize,
            TotalCount = totalCount,
            Items = items
        };
    }

    // AGE CALCULATION

    private static int CalculateAge(DateOnly dateOfBirth)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var age = today.Year - dateOfBirth.Year;

        if (dateOfBirth > today.AddYears(-age))
        {
            age--;
        }

        return age;
    }
}
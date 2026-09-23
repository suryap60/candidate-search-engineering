using CandidateSearch.Api.Models;
using System.Security.Claims;

namespace CandidateSearch.Api.Services.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user);

    string GenerateRefreshToken(User user);

    int AccessTokenExpirationSeconds { get; }

    ClaimsPrincipal? ValidateRefreshToken(string token);
}
using CandidateSearch.Api.Configuration;
using CandidateSearch.Api.Models;
using CandidateSearch.Api.Services.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CandidateSearch.Api.Services;

public class JwtService : IJwtService
{
    private const string TokenTypeClaim = "token_type";
    private const string RefreshTokenType = "refresh";

    private readonly JwtSettings _jwtSettings;

    public JwtService(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
    }

    public int AccessTokenExpirationSeconds =>
        _jwtSettings.AccessTokenExpirationMinutes * 60;

    public string GenerateAccessToken(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(TokenTypeClaim, "access")
        };

        return GenerateToken(
            claims,
            DateTime.UtcNow.AddMinutes(
                _jwtSettings.AccessTokenExpirationMinutes
            )
        );
    }

    public string GenerateRefreshToken(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(TokenTypeClaim, RefreshTokenType)
        };

        return GenerateToken(
            claims,
            DateTime.UtcNow.AddDays(
                _jwtSettings.RefreshTokenExpirationDays
            )
        );
    }

    public ClaimsPrincipal? ValidateRefreshToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return null;
        }

        var tokenHandler = new JwtSecurityTokenHandler();

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)
        );

        try
        {
            var principal = tokenHandler.ValidateToken(
                token,
                new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = _jwtSettings.Issuer,

                    ValidateAudience = true,
                    ValidAudience = _jwtSettings.Audience,

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                },
                out var validatedToken
            );

            if (validatedToken is not JwtSecurityToken jwtToken)
            {
                return null;
            }

            if (!string.Equals(
                    jwtToken.Header.Alg,
                    SecurityAlgorithms.HmacSha256,
                    StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            var tokenType = principal.FindFirst(TokenTypeClaim)?.Value;

            if (tokenType != RefreshTokenType)
            {
                return null;
            }

            return principal;
        }
        catch
        {
            return null;
        }
    }

    private string GenerateToken(
        IEnumerable<Claim> claims,
        DateTime expires)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}
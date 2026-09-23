using CandidateSearch.Api.Data;
using CandidateSearch.Api.DTOs.Auth;
using CandidateSearch.Api.Exceptions;
using CandidateSearch.Api.Models;
using CandidateSearch.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace CandidateSearch.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IJwtService _jwtService;

    public AuthService(
        AppDbContext db,
        IJwtService jwtService)
    {
        _db = db;
        _jwtService = jwtService;
    }

    public async Task RegisterAsync(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var existingUser = await _db.Users
            .AnyAsync(x => x.Email == email);

        if (existingUser)
        {
            throw new ConflictException(
                "An account with this email already exists."
            );
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(
            request.Password
        );

        var user = new User
        {
            Email = email,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);

        await _db.SaveChangesAsync();
    }

    public async Task<LoginResponse> LoginAsync(
        LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _db.Users
            .FirstOrDefaultAsync(x => x.Email == email);

        if (user is null ||
            !BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash))
        {
            throw new UnauthorizedException(
                "Invalid email or password."
            );
        }

        user.LastLoginAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var accessToken =
            _jwtService.GenerateAccessToken(user);

        var refreshToken =
            _jwtService.GenerateRefreshToken(user);

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresIn =
                _jwtService.AccessTokenExpirationSeconds
        };
    }

    public async Task<LoginResponse> RefreshTokenAsync(
        RefreshRequest request)
    {
        var principal =
            _jwtService.ValidateRefreshToken(
                request.RefreshToken
            );

        if (principal is null)
        {
            throw new UnauthorizedException(
                "Invalid or expired refresh token."
            );
        }

        var userIdClaim =
            principal.FindFirst(
                ClaimTypes.NameIdentifier
            );

        if (userIdClaim is null ||
            !int.TryParse(
                userIdClaim.Value,
                out var userId))
        {
            throw new UnauthorizedException(
                "Invalid refresh token."
            );
        }

        var user = await _db.Users
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user is null)
        {
            throw new UnauthorizedException(
                "Invalid refresh token."
            );
        }

        var accessToken =
            _jwtService.GenerateAccessToken(user);

        return new LoginResponse
        {
            AccessToken = accessToken,

            // Keep the existing refresh token
            // for this assessment implementation.
            RefreshToken = request.RefreshToken,

            ExpiresIn =
                _jwtService.AccessTokenExpirationSeconds
        };
    }
}
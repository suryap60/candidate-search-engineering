using CandidateSearch.Api.DTOs.Auth;
using CandidateSearch.Api.Models;
using CandidateSearch.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CandidateSearch.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterRequest request)
    {
        await _authService.RegisterAsync(request);

        return StatusCode(
            StatusCodes.Status201Created,
             ApiResponse<object>.Ok("Registration successful.")
        );
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);

        return Ok(
            ApiResponse<LoginResponse>.Ok(
                "Login successful.",
                response
            )
        );
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Refresh(
    RefreshRequest request)
    {
        var response = await _authService.RefreshTokenAsync(request);

        return Ok(
            ApiResponse<LoginResponse>.Ok(
                "Token refreshed successfully.",
                response
            )
        );
    }
}
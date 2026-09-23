using CandidateSearch.Api.DTOs.Auth;
using System.Threading.Tasks;

namespace CandidateSearch.Api.Services.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterRequest request);

    Task<LoginResponse> LoginAsync(LoginRequest request);

    Task<LoginResponse> RefreshTokenAsync(
        RefreshRequest request);
}
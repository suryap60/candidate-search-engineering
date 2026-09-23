using CandidateSearch.Api.DTOs.Candidates;
using CandidateSearch.Api.Models;
using CandidateSearch.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CandidateSearch.Api.Controllers;

[ApiController]
[Route("api/candidates")]
[Authorize]
public class CandidatesController : ControllerBase
{
    private readonly ICandidateService _candidateService;

    public CandidatesController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    [HttpGet("search")]
    public async Task<
        ActionResult<ApiResponse<PagedResponse<CandidateResponse>>>
    > Search([FromQuery] CandidateSearchRequest request)
    {
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier
        );

        if (userIdClaim is null ||
            !int.TryParse(userIdClaim.Value, out var currentUserId))
        {
            return Unauthorized(
                ApiResponse<object>.Fail("Unauthorized.")
            );
        }

        var result = await _candidateService.SearchAsync(
            request,
            currentUserId
        );

        return Ok(
            ApiResponse<PagedResponse<CandidateResponse>>.Ok(
                "Candidates retrieved successfully.",
                result
            )
        );
    }
}
using CandidateSearch.Api.DTOs.Candidates;
using System.Threading.Tasks;

namespace CandidateSearch.Api.Services.Interfaces;

public interface ICandidateService
{
    Task<PagedResponse<CandidateResponse>> SearchAsync(
        CandidateSearchRequest request,
        int currentUserId);
}
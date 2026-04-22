using Nexora.Api.Dtos.Requests;
using Nexora.Api.Dtos.Responses;

namespace Nexora.Api.Interfaces;

public interface IProjectService
{
    Task<ProjectResponseDto> CreateProjectAsync(CreateProjectRequestDto model, string userId);
    Task<IEnumerable<ProjectResponseDto>> GetFeedAsync();
}
using Nexora.Api.Dtos;
using Nexora.Api.Results;

namespace Nexora.Api.Interfaces;

public interface IUserService
{
    Task<UserResult> GetProfileAsync(string userId);
    Task<UserResult> UpdateProfileAsync(string userId, UpdateProfileDto model);
    Task<UserResult> ChangePasswordAsync(string userId, ChangePasswordDto model);
}
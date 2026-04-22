using Nexora.Api.Models;

namespace Nexora.Api.Services;

public interface ITokenService
{
    string GenerateJwtToken(ApplicationUser user);
}
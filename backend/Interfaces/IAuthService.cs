using Nexora.Api.Dtos;
using Nexora.Api.Results;

namespace Nexora.Api.Services;

public interface IAuthService
{
    Task<AuthResult> LoginAsync(LoginDto model);
    Task<AuthResult> RegisterAsync(RegisterDto model);
    Task<AuthResult> ConfirmEmailAsync(string email, string token);
    Task<AuthResult> ForgotPasswordAsync(ForgotPasswordDto model);
    Task<AuthResult> ResetPasswordAsync(ResetPasswordDto model);
}
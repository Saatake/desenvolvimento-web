using Microsoft.AspNetCore.Identity;
using Nexora.Api.Dtos.Requests;
using Nexora.Api.Enums;
using Nexora.Api.Interfaces;
using Nexora.Api.Models;
using Nexora.Api.Results;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace Nexora.Api.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthService> _logger;
    private readonly string _frontendUrl;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService,
        IEmailService emailService,
        IConfiguration configuration,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _emailService = emailService;
        _logger = logger;
        _frontendUrl = configuration["FrontendUrl"] ?? "http://localhost:3000";
    }

    public async Task<AuthResult> LoginAsync(LoginRequestDto model)
    {
        try
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                return Fail("dados inválidos");

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
                return Fail();

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (!result.Succeeded)
                return Fail();

            var token = _tokenService.GenerateJwtToken(user);

            return new AuthResult
            {
                Succeeded = true,
                Token = token
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro no login");

            return new AuthResult
            {
                Succeeded = false,
                Message = "erro no login"
            };
        }
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequestDto model)
    {
        try
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return new AuthResult
                {
                    Succeeded = false,
                    Message = "dados inválidos"
                };
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name ?? "",
                Course = model.Course ?? "",
                Bio = model.Bio ?? "",
                RoleType = ParseRoleType(model.RoleType),
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return new AuthResult
                {
                    Succeeded = false,
                    Errors = result.Errors.Select(e => e.Description)
                };
            }

            return new AuthResult
            {
                Succeeded = true,
                Message = "usuário criado com sucesso!"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro no registro");

            return new AuthResult
            {
                Succeeded = false,
                Message = "erro no registro"
            };
        }
    }

    public async Task<AuthResult> ConfirmEmailAsync(string email, string token)
    {
        return await Task.FromResult(new AuthResult
        {
            Succeeded = true,
            Message = "email desativado no modo dev"
        });
    }

    public async Task<AuthResult> ForgotPasswordAsync(ForgotPasswordRequestDto model)
    {
        return await Task.FromResult(new AuthResult
        {
            Succeeded = true,
            Message = "modo dev ativo"
        });
    }

    public async Task<AuthResult> ResetPasswordAsync(ResetPasswordRequestDto model)
    {
        return await Task.FromResult(new AuthResult
        {
            Succeeded = true,
            Message = "modo dev ativo"
        });
    }

    private static UserRole ParseRoleType(string? roleType)
    {
        if (!string.IsNullOrEmpty(roleType) && Enum.TryParse<UserRole>(roleType, true, out var role))
            return role;

        return UserRole.Estudante;
    }

    private static AuthResult Fail(string message = "usuário ou senha inválidos.")
    {
        return new AuthResult
        {
            Succeeded = false,
            IsUnauthorized = true,
            Message = message
        };
    }
}
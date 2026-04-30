using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Nexora.Api.Data;
using Nexora.Api.Models;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Nexora.Api.Services;
using Nexora.Api.Interfaces;
using Nexora.Api.Repositories;
using Nexora.Api.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// FRONTEND URL
var frontendUrl = builder.Configuration["FrontendUrl"] ?? "http://localhost:3000";

// DB
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// ✅ IDENTITY (CORRIGIDO - SEM CONFIRMAÇÃO DE EMAIL)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// ✅ JWT (TEM QUE SER IGUAL AO TOKEN SERVICE)
var key = "SUA_CHAVE_SUPER_SECRETA_AQUI_123456";
var keyBytes = Encoding.UTF8.GetBytes(key);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = "agora-api",

        ValidateAudience = true,
        ValidAudience = "agora-app",

        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});

// AUTH
builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(frontendUrl, "http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// SERVICES
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IEvaluationRepository, EvaluationRepository>();
builder.Services.AddScoped<IEvaluationService, EvaluationService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IRankingService, RankingService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// middleware erro global
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

// ORDEM CORRETA
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
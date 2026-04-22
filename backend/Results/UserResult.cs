using Nexora.Api.Dtos;

namespace Nexora.Api.Results;

public class UserResult
{
    public bool Succeeded { get; set; }
    public string Message { get; set; } = string.Empty;
    public IEnumerable<string> Errors { get; set; } = new List<string>();
    
    // Carrega os dados do aluno quando for o método GET
    public UserDto? Data { get; set; } 
    
    // Ajuda o Controller a saber se devolve 404 (NotFound) ou 400 (BadRequest)
    public bool IsNotFound { get; set; } = false; 
}
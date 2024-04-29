using Reactivities_jason.Domain.DTO;

namespace Reactivities_jason.Application.Common.Interfaces
{
    public interface ITokenConfiguration
    {
        Task<TokenExpireDTO> GetExpireBearer();
    }
}

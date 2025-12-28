using ChineseSaleApi.Dto;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IPackageCartService
    {
        Task<int> CreatePackageCart(PackageCartDto packageCartDto);
        Task<IEnumerable<PackageCartDto>> GetPackagesByUserId(int userId);
        Task UpdatePackageCart(PackageCartDto packageCartDto);
        Task DeletePackageCart(int id);
    }
}
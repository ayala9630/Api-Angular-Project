using ChineseSaleApi.Dto;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IPackageCartService
    {
        Task<int> CreatePackageCart(PackageCartDto packageCartDto);
        Task DeletePackageCart(int id);
        Task UpdatePackageCart(PackageCartDto packageCartDto);
    }
}
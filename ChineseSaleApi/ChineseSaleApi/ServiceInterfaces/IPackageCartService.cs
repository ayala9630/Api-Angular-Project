using ChineseSaleApi.Dto;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IPackageCartService
    {
        Task<int> CreatePackageCart(CreatePackageCartDto packageCartDto);
        Task DeletePackageCart(int id);
        Task UpdatePackageCart(PackageCartDto packageCartDto);
    }
}
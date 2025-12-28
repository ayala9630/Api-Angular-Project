using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IPackageCartRepository
    {
        Task<int> AddPackageCart(PackageCart packageCart);
        Task DeletePackageCart(int id);
        Task<IEnumerable<PackageCart>> GetAllPackageCarts();
        Task<PackageCart?> GetPackageCartById(int id);
        Task UpdatePackageCart(PackageCart packageCart);
    }
}
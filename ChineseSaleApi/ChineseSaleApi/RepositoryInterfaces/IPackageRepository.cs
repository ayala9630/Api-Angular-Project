using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IPackageRepository
    {
        Task<int> AddPackage(Package package);
        Task DeletePackage(int id);
        Task<IEnumerable<Package>> GetAllPackages();
        Task<Package?> GetPackage(int id);
        Task UpdatePackage(Package package);
    }
}
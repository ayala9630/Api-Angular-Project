using ChineseSaleApi.Dto;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IPackageService
    {
        Task<int> AddPackage(CreatePackageDto createPackageDto);
        Task DeletePackage(int id);
        Task<List<PackageDto>> GetAllPackages();
        Task<PackageDto?> GetPackageById(int id);
        Task<bool?> UpdatePackage(UpdatePackageDtos packageDto);
    }
}
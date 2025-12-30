using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Services
{
    public class PackageService : IPackageService
    {
        private readonly IPackageRepository _repository;
        public PackageService(IPackageRepository repository)
        {
            _repository = repository;
        }
        //create
        public async Task<int> AddPackage(CreatePackageDto createPackageDto)
        {
            Package package = new Package
            {
                Name = createPackageDto.Name,
                Description = createPackageDto.Description,
                NumOfCards = createPackageDto.NumOfCards,
                Price = createPackageDto.Price,
                LoterryId = createPackageDto.LoterryId
            };
            return await _repository.AddPackage(package);
        }
        //read
        public async Task<PackageDto?> GetPackageById(int id)
        {
            var package = await _repository.GetPackageById(id);
            if (package == null)
            {
                return null;
            }
            return new PackageDto
            {
                Id = package.Id,
                Name = package.Name,
                Description = package.Description,
                NumOfCards = package.NumOfCards,
                Price = package.Price,
                LoterryId = package.LoterryId
            };
        }
        public async Task<List<PackageDto>> GetAllPackages(int lotteryId)
        {
            var packages = await _repository.GetAllPackages(lotteryId);
            return packages.Select(package => new PackageDto
            {
                Id = package.Id,
                Name = package.Name,
                Description = package.Description,
                NumOfCards = package.NumOfCards,
                Price = package.Price,
                LoterryId = package.LoterryId
            }).ToList();
        }
        //update
        public async Task UpdatePackage(PackageDto packageDto)
        {
            var package = await _repository.GetPackageById(packageDto.Id);
            if (package != null)
            {
                package.Name = packageDto.Name??package.Name;
                package.Description = packageDto.Description??package.Description;
                package.NumOfCards = packageDto.NumOfCards!=0? packageDto.NumOfCards:package.NumOfCards;
                package.Price = packageDto.Price;
                package.LoterryId = packageDto.LoterryId;
                await _repository.UpdatePackage(package);
            }
        }
        //delete
        public async Task DeletePackage(int id)
        {
            await _repository.DeletePackage(id);
        }
    }
}
using System;
using System.Linq;
using System.Threading.Tasks;
using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;
using Microsoft.Extensions.Logging;

namespace ChineseSaleApi.Services
{
    public class PackageService : IPackageService
    {
        private readonly IPackageRepository _repository;
        private readonly ILogger<PackageService> _logger;

        public PackageService(IPackageRepository repository, ILogger<PackageService> logger)
        {
            _repository = repository;
            _logger = logger;
        }
        //create
        public async Task<int> AddPackage(CreatePackageDto createPackageDto)
        {
            try
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
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "AddPackage received a null argument: {@CreatePackageDto}", createPackageDto);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to add package.");
                throw;
            }
        }
        //read
        public async Task<PackageDto?> GetPackageById(int id)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get package by id {PackageId}.", id);
                throw;
            }
        }
        public async Task<List<PackageDto>> GetAllPackages(int lotteryId)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get all packages for lottery {LotteryId}.", lotteryId);
                throw;
            }
        }
        //update
        public async Task<bool?> UpdatePackage(UpdatePackageDto packageDto)
        {
            try
            {
                var package = await _repository.GetPackageById(packageDto.Id);
                if (package != null)
                {
                    package.Name = packageDto.Name ?? package.Name;
                    package.Description = packageDto.Description ?? package.Description;
                    package.NumOfCards = packageDto.NumOfCards ?? package.NumOfCards;
                    package.Price = packageDto.Price ?? package.Price;
                    package.LoterryId = packageDto.LoterryId ?? package.LoterryId;
                    await _repository.UpdatePackage(package);
                    return true;
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update package {PackageId}.", packageDto?.Id);
                throw;
            }
        }
        //delete
        public async Task DeletePackage(int id)
        {
            try
            {
                await _repository.DeletePackage(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete package {PackageId}.", id);
                throw;
            }
        }
    }
}
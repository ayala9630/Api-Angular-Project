using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
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
        private readonly IMapper _mapper;
        private readonly ILogger<PackageService> _logger;

        public PackageService(IPackageRepository repository, IMapper mapper, ILogger<PackageService> logger)
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }
        //create
        public async Task<int> AddPackage(CreatePackageDto createPackageDto)
        {
            try
            {
                Package package = _mapper.Map<Package>(createPackageDto);
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
                return _mapper.Map<PackageDto>(package);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get package by id {PackageId}.", id);
                throw;
            }
        }
        public async Task<UpdatePackageDto> GetPackageByIdUpdate(int id)
        {
            try
            {
                var package = await _repository.GetPackageById(id);
                if (package == null)
                {
                    return null;
                }
                return _mapper.Map<UpdatePackageDto>(package);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get package for update by id {PackageId}.", id);
                throw;
            }
        }
        public async Task<List<PackageDto>> GetAllPackages(int lotteryId)
        {
            try
            {
                var packages = await _repository.GetAllPackages(lotteryId);
                return packages.Select(package => _mapper.Map<PackageDto>(package)).ToList();
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
                    _mapper.Map(packageDto, package);
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
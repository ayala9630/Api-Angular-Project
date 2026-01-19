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
    public class PackageCartService : IPackageCartService
    {
        private readonly IPackageCartRepository _repository;
        private readonly ILogger<PackageCartService> _logger;

        public PackageCartService(IPackageCartRepository repository, ILogger<PackageCartService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        //create
        public async Task<int> CreatePackageCart(CreatePackageCartDto packageCartDto)
        {
            try
            {
                PackageCart packageCart = new PackageCart
                {
                    Quantity = packageCartDto.Quantity,
                    UserId = packageCartDto.UserId,
                    PackageId = packageCartDto.PackageId
                };
                return await _repository.AddPackageCart(packageCart);
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "CreatePackageCart received a null argument: {@PackageCartDto}", packageCartDto);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while creating a package cart for user {UserId}.", packageCartDto?.UserId);
                throw;
            }
        }

        //read
        public async Task<IEnumerable<PackageCartDto>> GetPackagesByUserId(int userId)
        {
            try
            {
                var packageCarts = await _repository.GetPackagesByUserId(userId);
                return packageCarts.Select(pc => new PackageCartDto
                {
                    Id = pc.Id,
                    Quantity = pc.Quantity,
                    UserId = pc.UserId,
                    PackageId = pc.PackageId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get package carts for user {UserId}.", userId);
                throw;
            }
        }

        //update
        public async Task<bool?> UpdatePackageCart(PackageCartDto packageCartDto)
        {
            try
            {
                PackageCart? packageCart = await _repository.GetPackageCartById(packageCartDto.Id);
                if (packageCart != null)
                {
                    packageCart.Quantity = packageCartDto.Quantity;
                    await _repository.UpdatePackageCart(packageCart);
                    return true;
                }
                return null;
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "UpdatePackageCart received a null argument: {@PackageCartDto}", packageCartDto);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update package cart {PackageCartId}.", packageCartDto?.Id);
                throw;
            }
        }

        //delete
        public async Task DeletePackageCart(int id)
        {
            try
            {
                await _repository.DeletePackageCart(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete package cart {PackageCartId}.", id);
                throw;
            }
        }
    }
}
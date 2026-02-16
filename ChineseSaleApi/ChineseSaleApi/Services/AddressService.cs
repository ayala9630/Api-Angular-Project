using System;
using System.Threading.Tasks;
using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;
using Microsoft.Extensions.Logging;

namespace ChineseSaleApi.Services
{
    public class AddressService : IAddressService
    {
        private readonly IAddressRepository _repository;
        private readonly ILogger<AddressService> _logger;

        public AddressService(IAddressRepository repository, ILogger<AddressService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        //create
        public async Task<int> AddAddressForUser(CreateAddressForUserDto address)
        {
            if (address == null) throw new ArgumentNullException(nameof(address));

            try
            {
                Address addrress2 = new Address
                {
                    City = address.City,
                    Street = address.Street,
                    Number = address.Number,
                    ZipCode = address.ZipCode
                };

                return await _repository.AddAddress(addrress2);
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "AddAddressForUser received a null argument.");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while adding an address for user.");
                throw;
            }
        }

        public async Task<int> AddAddressForDonor(CreateAddressForDonorDto address)
        {
            if (address == null) throw new ArgumentNullException(nameof(address));

            try
            {
                Address addrress2 = new Address
                {
                    City = address.City,
                    Street = address.Street,
                    Number = address.Number,
                    ZipCode = address.ZipCode
                };

                return await _repository.AddAddress(addrress2);
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "AddAddressForDonor received a null argument.");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while adding an address for donor.");
                throw;
            }
        }

        //read
        public async Task<AddressDto?> GetAddressById(int id)
        {
            if (id <= 0) throw new ArgumentException("Id must be greater than zero.", nameof(id));

            try
            {
                var address = await _repository.GetAddress(id);
                if (address == null)
                {
                    return null;
                }

                return new AddressDto
                {
                    Id = address.Id,
                    City = address.City,
                    Street = address.Street,
                    Number = address.Number,
                    ZipCode = address.ZipCode
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get address by id {AddressId}.", id);
                throw;
            }
        }

        //update
        public async Task<bool?> UpdateAddress(AddressDto addressDto)
        {
            if (addressDto == null) throw new ArgumentNullException(nameof(addressDto));

            try
            {
                var address = await _repository.GetAddress(addressDto.Id);
                if (address != null)
                {
                    address.City = addressDto.City ?? address.City;
                    address.Street = addressDto.Street ?? address.Street;
                    address.Number = addressDto.Number ?? address.Number;
                    address.ZipCode = addressDto.ZipCode ?? address.ZipCode;
                    await _repository.UpdateAddress(address);
                    return true;
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update address {AddressId}.", addressDto.Id);
                throw;
            }
        }
    }
}

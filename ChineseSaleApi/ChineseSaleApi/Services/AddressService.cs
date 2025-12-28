using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;

namespace ChineseSaleApi.Services
{
    public class AddressService : IAddressService
    {
        private readonly IAddressRepository _repository;
        public AddressService(IAddressRepository repository)
        {
            _repository = repository;
        }
        //create
        public async Task<int> AddAddressForUser(CreateAddressForUserDto address)
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
        public async Task<int> AddAddressForDonor(CreateAddressForDonorDto address)
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
        //read
        public async Task<AddressDto?> GetAddressById(int id)
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
        //update
        public async Task UpdateAddress(AddressDto addressDto)
        {
            var address = await _repository.GetAddress(addressDto.Id);
            if (address != null)
            {
                address.City = addressDto.City;
                address.Street = addressDto.Street;
                address.Number = addressDto.Number;
                address.ZipCode = addressDto.ZipCode;
                await  _repository.UpdateAddress(address);
            }
        }

    }
}

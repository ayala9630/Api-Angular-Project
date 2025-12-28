using ChineseSaleApi.Dto;

namespace ChineseSaleApi.Services
{
    public interface IAddressService
    {
        Task<int> AddAddressForDonor(CreateAddressForDonorDto address);
        Task<int> AddAddressForUser(CreateAddressForUserDto address);
        Task<AddressDto?> GetAddressById(int id);
        Task UpdateAddress(AddressDto addressDto);
    }
}
using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;
using Microsoft.EntityFrameworkCore;


namespace ChineseSaleApi.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IAddressService _addressService;
        public UserService(IUserRepository repository, IAddressService addressService)
        {
            _addressService = addressService;
            _repository = repository;
        }
        //create
        public async Task AddUser(CreateUserDto createUserDto)
        {
            int idAddress = await _addressService.AddAddressForUser(createUserDto.Address);
            User user = new User
            {
                UserName = createUserDto.Username,
                Password = createUserDto.Password,
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                Phone = createUserDto.Phone,
                Email = createUserDto.Email,
                AddressId = idAddress
            };
            await _repository.AddUser(user);
        }
        //read
        public async Task<UserDto?> GetUserById(int id)
        {
            var user = await _repository.GetUserById(id);
            if (user == null)
            {
                return null;
            }
            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                Email = user.Email,
                Address = user.Address != null ? new AddressDto
                {
                    Id = user.Address.Id,
                    City = user.Address.City,
                    Street = user.Address.Street,
                    Number = user.Address.Number,
                    ZipCode = user.Address.ZipCode
                } : null
            };
        }
        //update
        public async Task UpdateUser(UpdateUserDto userDto)
        {
            var user = await _repository.GetUserById(userDto.Id);
            await _addressService.UpdateAddress(userDto.Address);
            if (user != null)
            {
                user.FirstName = userDto.FirstName;
                user.LastName = userDto.LastName;
                user.Phone = userDto.Phone;
                user.Email = userDto.Email;
                await _repository.UpdateUser(user);
            }
        }

    }
}

using ChineseSaleApi.Dto;
using StoreApi.DTOs;

namespace ChineseSaleApi.Services
{
    public interface IUserService
    {
        Task AddUser(CreateUserDto createUserDto);
        Task<LoginResponseDto?> AuthenticateAsync(LoginRequestDto loginRequest);
        Task<UserDto?> GetUserById(int id);
        Task<bool?> UpdateUser(UpdateUserDto userDto);
    }
}
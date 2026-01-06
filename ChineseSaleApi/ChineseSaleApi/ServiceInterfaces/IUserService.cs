using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using StoreApi.DTOs;

namespace ChineseSaleApi.Services
{
    public interface IUserService
    {
        Task AddUser(CreateUserDto createUserDto);
        Task<LoginResponseDto?> AuthenticateAsync(LoginRequestDto loginRequest);
        Task<UserDto?> GetUserById(int id);
        Task<List<UserDto>> GetAllUsers();
        Task<PaginatedResultDto<UserDto>> GetUsersWithPagination(PaginationParamsdto paginationParams);
        Task<bool?> UpdateUser(UpdateUserDto userDto);
    }
}
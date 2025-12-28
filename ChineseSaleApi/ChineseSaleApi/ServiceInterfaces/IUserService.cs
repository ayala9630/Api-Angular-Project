using ChineseSaleApi.Dto;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IUserService
    {
        Task AddUser(CreateUserDto createUserDto);
        Task<UserDto?> GetUserById(int id);
        Task UpdateUser(UpdateUserDto userDto);
    }
}
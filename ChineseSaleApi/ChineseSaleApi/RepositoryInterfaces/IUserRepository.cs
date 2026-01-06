using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IUserRepository
    {
        Task<int> AddUser(User user);
        Task<IEnumerable<User>> GetAllUsers();
        Task<(IEnumerable<User> items, int totalcount)> GetUserWithPagination(int pageNumber, int pageSize);
        Task<User?> GetUserById(int id);
        Task<User?> GetUserByUserName(string userName);
        Task UpdateUser(User user);
        Task<bool> IsUserNameExists(string userName);
    }
}
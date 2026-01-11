using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IUserRepository
    {
        Task<int> AddUser(User user);
        Task<IEnumerable<User>> GetAllUsers();
<<<<<<< HEAD
        Task<(IEnumerable<User> items, int totalCount)> GetUsersWithPagination(int pageNumber, int pageSize);        Task<User?> GetUserById(int id);
=======
        Task<(IEnumerable<User> items, int totalcount)> GetUserWithPagination(int pageNumber, int pageSize);
        Task<User?> GetUserById(int id);
>>>>>>> main
        Task<User?> GetUserByUserName(string userName);
        Task UpdateUser(User user);
        Task<bool> IsUserNameExists(string userName);
    }
}
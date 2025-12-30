using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IUserRepository
    {
        Task<int> AddUser(User user);
        Task<IEnumerable<User>> GetAllUsers();
        Task<User?> GetUserById(int id);
        Task<User?> GetUserByUserName(string userName);
        Task UpdateUser(User user);
        Task<bool> IsUserNameExists(string userName);
    }
}
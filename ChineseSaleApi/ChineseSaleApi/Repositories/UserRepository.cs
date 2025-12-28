using ChineseSaleApi.Data;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using Microsoft.EntityFrameworkCore;

namespace ChineseSaleApi.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ChineseSaleContext _context;
        public UserRepository(ChineseSaleContext context)
        {
            _context = context;
        }
        //create
        public async Task<int> AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user.Id;
        }
        //read
        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users.Include(u=>u.Address).FirstOrDefaultAsync(u => u.Id == id);
        }
        public async Task<User?> GetUserByUserName(string userName)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        }
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }
        //update
        public async Task UpdateUser(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}

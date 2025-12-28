using ChineseSaleApi.Data;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using Microsoft.EntityFrameworkCore;

namespace ChineseSaleApi.Repositories
{
    public class DonorRepository : IDonorRepository
    {
        private readonly ChineseSaleContext _context;
        public DonorRepository(ChineseSaleContext context)
        {
            _context = context;
        }
        //create
        public async Task<int> AddDonor(Donor donor)
        {
            _context.Donors.Add(donor);
            await _context.SaveChangesAsync();
            return donor.Id;
        }
        //read
        public async Task<IEnumerable<Donor>> GetAllDonors()
        {
            return await _context.Donors.ToListAsync();
        }
        public async Task<Donor?> GetDonor(int id)
        {
            return await _context.Donors.FirstOrDefaultAsync(x => x.Id == id);
        }
        //update
        public async Task UpdateDonor(Donor donor)
        {
            _context.Donors.Update(donor);
            await _context.SaveChangesAsync();
        }
        //delete
        public async Task DeleteDonor(int id)
        {
            var gift = await _context.Donors.FirstOrDefaultAsync(x => x.Id == id);
            if (gift != null)
            {
                _context.Donors.Remove(gift);
                await _context.SaveChangesAsync();
            }
        }
    }
}

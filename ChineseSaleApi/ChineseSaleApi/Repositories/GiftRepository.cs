using ChineseSaleApi.Data;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using Microsoft.EntityFrameworkCore;

namespace ChineseSaleApi.Repositories
{ 
    public class GiftRepository : IGiftRepository
    {
        private readonly ChineseSaleContext _context;
        public GiftRepository(ChineseSaleContext context)
        {
            _context = context;
        }
        //create
        public async Task<int> AddGift(Gift gift)
        {
            _context.Gifts.Add(gift);
            await _context.SaveChangesAsync();
            return gift.Id;
        }
        //read
        public async Task<IEnumerable<Gift>> GetAllGifts(int lotteryId)
        {
            return await _context.Gifts.Include(c=>c.Cards).Where(l=>l.LotteryId==lotteryId).ToListAsync();
        }
        public async Task<Gift?> GetGiftById(int id)
        {
            return await _context.Gifts.Include(x=>x.Donor).Include(x=>x.Category).Include(x=>x.Lottery).FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<(IEnumerable<Gift> items, int totalCount)> GetGiftsWithPagination(int lotteryId,int pageNumber, int pageSize)
        {
            var query = _context.Gifts.Where(l => l.LotteryId == lotteryId).AsQueryable();
            var totalCount = await query.CountAsync();
            var gifts = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return (gifts, totalCount);
        }
        //update
        public async Task UpdateGift(Gift gift)
        {
            _context.Gifts.Update(gift);
            await _context.SaveChangesAsync();
        }
        //delete
        public async Task DeleteGift(int id)
        {
            var gift = await _context.Gifts.FirstOrDefaultAsync(x => x.Id == id);
            if (gift != null)
            {
                _context.Gifts.Remove(gift);
                await _context.SaveChangesAsync();
            }
        }
    }
}

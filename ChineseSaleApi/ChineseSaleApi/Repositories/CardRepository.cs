using ChineseSaleApi.Data;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using Microsoft.EntityFrameworkCore;

namespace ChineseSaleApi.Repositories
{
    public class CardRepository : ICardRepository
    {
        private readonly ChineseSaleContext _context;
        public CardRepository(ChineseSaleContext context)
        {
            _context = context;
        }
        //create
        public async Task<int> AddCard(Card card)
        {
            _context.Cards.Add(card);
            await _context.SaveChangesAsync();
            return card.Id;
        }
        //read
        public async Task<IEnumerable<Card>> GetAllCards(int lotteryId)
        {
            return await _context.Cards.Include(p => p.Gift).Where(x=>x.Gift.LotteryId==lotteryId).ToListAsync();
        }
        public async Task<IEnumerable<Card?>> GetCardByGiftId(int id)
        {
            return await _context.Cards.Include(g=>g.Gift).Include(u=>u.User).Where(x => x.GiftId == id).ToListAsync();
        }
        //update
        public async Task UpdateCard(Card card)
        {
            _context.Cards.Update(card);
            await _context.SaveChangesAsync();
        }
    }
}
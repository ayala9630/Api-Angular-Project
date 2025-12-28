using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface ICardRepository
    {
        Task<int> AddCard(Card card);
        Task<IEnumerable<Card>> GetAllCards();
        Task<IEnumerable<Card?>> GetCardByGiftId(int id);
        Task UpdateCard(Card card);
    }
}
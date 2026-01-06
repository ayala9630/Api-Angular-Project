using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface ICardRepository
    {
        Task<int> AddCard(Card card);
        Task<IEnumerable<Card>> GetAllCards(int lotteryId);
        Task<List<Card?>> GetCardByGiftId(int id);
        Task UpdateCardToWin(Card card);
        Task<bool> ResetWinnersByLotteryId(int lotteryId);
    }
}
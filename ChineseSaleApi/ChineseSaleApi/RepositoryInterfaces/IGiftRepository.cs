using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IGiftRepository
    {
        Task<int> AddGift(Gift gift);
        Task DeleteGift(int id);
        Task<IEnumerable<Gift>> GetAllGifts(int lotteryId);
        Task<Gift?> GetGiftById(int id);
        Task UpdateGift(Gift gift);
    }
}
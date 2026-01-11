using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IGiftRepository
    {
        Task<int> AddGift(Gift gift);
        Task DeleteGift(int id);
        Task<IEnumerable<Gift>> GetAllGifts(int lotteryId);
<<<<<<< HEAD
        Task<(IEnumerable<Gift> items, int totalCount)> GetGiftsWithPagination(int lotteryId, int pageNumber, int pageSize);
=======
        Task<(IEnumerable<Gift> items, int totalcount)> GetGiftsWithPagination(int lotteryId, int pageNumber, int pageSize);
>>>>>>> main
        Task<Gift?> GetGiftById(int id);
        Task UpdateGift(Gift gift);
    }
}
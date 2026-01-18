using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IGiftRepository
    {
        Task<int> AddGift(Gift gift);
        Task DeleteGift(int id);
        Task<IEnumerable<Gift>> GetAllGifts(int lotteryId);
        //Task<(IEnumerable<Gift> items, int totalCount)> GetGiftsWithPagination(int lotteryId, int pageNumber, int pageSize);
        Task<(IEnumerable<Gift> items, int totalCount)> GetGiftsSearchPagination(int lotteryId, int pageNumber, int pageSize, string? textSearch, string? type);

        Task<(IEnumerable<Gift> items, int totalCount)> GetGiftsByUserWithPagination(int lotteryId, int pageNumber, int pageSize);
        Task<Gift?> GetGiftById(int id);
        Task UpdateGift(Gift gift);
    }
}
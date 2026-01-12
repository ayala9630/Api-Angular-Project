using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IGiftRepository
    {
        Task<int> AddGift(Gift gift);
        Task DeleteGift(int id);
        Task<IEnumerable<Gift>> GetAllGifts(int lotteryId);
        Task<(IEnumerable<Gift> items, int totalCount)> GetGiftsWithPagination(int lotteryId, int pageNumber, int pageSize);
        Task<Gift?> GetGiftById(int id);
        Task<(IEnumerable<Gift> items, int totalCount)> GetGiftWithPaginationSortByPrice(int lotteryId,int pageNumber, int pageSize,bool ascending);
        Task<(IEnumerable<Gift> items, int totalCount)> GetGiftWithPaginationSortByCategory(int lotteryId,int pageNumber, int pageSize,bool ascending);
        Task UpdateGift(Gift gift);
    }
}
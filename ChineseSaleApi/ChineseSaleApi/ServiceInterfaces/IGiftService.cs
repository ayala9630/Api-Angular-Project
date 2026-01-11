using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IGiftService
    {
        Task<int> AddGift(CreateGiftDto createGiftDto);
        Task DeleteGift(int id);
        Task<GiftDto?> GetGiftById(int id);
        Task<PaginatedResultDto<GiftDto>> GetGiftsWithPagination(int lotteryId, PaginationParamsDto paginationParams);
        Task<IEnumerable<GiftWithOldPurchaseDto>> GetAllGifts(int lotteryId, int userId);
        Task<PaginatedResultDto<GiftDto>> GetGiftWithPaginationSortByCategory(int lotteryId, PaginationParamsDto paginationParams, bool ascending);
        Task<PaginatedResultDto<GiftDto>> GetGiftWithPaginationSortByPrice(int lotteryId, PaginationParamsDto paginationParams, bool ascending);
        Task<bool?> UpdateGift(UpdateGiftDto updateGiftDto);
    }
}
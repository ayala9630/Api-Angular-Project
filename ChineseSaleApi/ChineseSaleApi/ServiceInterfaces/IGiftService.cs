using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IGiftService
    {
        Task<int> AddGift(CreateGiftDto createGiftDto);
        Task DeleteGift(int id);
        Task<GiftDto?> GetGiftById(int id);
        //Task<PaginatedResultDto<GiftDto>> GetGiftsWithPagination(int lotteryId, PaginationParamsDto paginationParams);
        Task<IEnumerable<GiftWithOldPurchaseDto>> GetAllGifts(int lotteryId, int userId);
        Task<bool?> UpdateGift(UpdateGiftDto updateGiftDto);
        Task<PaginatedResultDto<GiftWithOldPurchaseDto>> GetGiftsByUserWithPagination(int lotteryId, int? userId, PaginationParamsDto paginationParams);
        Task<PaginatedResultDto<GiftWithOldPurchaseDto>> GetGiftsSearchPagination(int lotteryId, int? userId, PaginationParamsDto paginationParams, string? textSearch, string? type);
    }
}
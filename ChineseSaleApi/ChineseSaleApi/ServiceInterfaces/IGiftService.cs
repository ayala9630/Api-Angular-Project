using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IGiftService
    {
        Task<int> AddGift(CreateGiftDto createGiftDto);
        Task DeleteGift(int id);
        Task<GiftDto?> GetGiftById(int id);
        Task<PaginatedResultDto<GiftDto>> GetGiftsWithPagination(int lotteryId, PaginationParamsdto paginationParams);
        Task<IEnumerable<GiftWithOldPurchaseDto>> GetAllGifts(int lotteryId, int userId);
        Task<PaginatedResultDto<GiftDto>> GetGiftsWithPagination(int lotteryId, PaginationParamsDto paginationParams);
        Task<bool?> UpdateGift(UpdateGiftDto updateGiftDto);
    }
}
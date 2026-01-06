using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface ICardService
    {
        Task<int> AddCard(CreateCardDto createCardDto);
        Task<List<ListCardDto>> GetAllCarsds(int lotteryId);
        Task<PaginatedResultDto<ListCardDto>> GetCardsWithPagination(int lotteryId, PaginationParamsdto paginationParams);
        Task<CardDto?> GetCardByGiftId(int id);
        Task<bool> ResetWinnersByLotteryId(int lotteryId);
    }
}
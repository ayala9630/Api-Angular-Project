using ChineseSaleApi.Dto;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface ICardService
    {
        Task<int> AddCard(CreateCardDto createCardDto);
        Task<List<ListCardDto>> GetAllCarsds(int lotteryId);
        Task<CardDto?> GetCardByGiftId(int id);
    }
}
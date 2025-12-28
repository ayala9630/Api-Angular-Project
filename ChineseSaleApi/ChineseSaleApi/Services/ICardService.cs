using ChineseSaleApi.Dto;

namespace ChineseSaleApi.Services
{
    public interface ICardService
    {
        Task<int> AddCard(CreateCardDto createCardDto);
        Task<List<ListCardDto>> GetAllCarsds();
        Task<CardDto?> GetCardByGiftId(int id);
    }
}
using ChineseSaleApi.Dto;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IGiftService
    {
        Task<int> AddGift(CreateGiftDto createGiftDto);
        Task DeleteGift(int id);
        Task UpdateGift(UpdateGiftDto updateGiftDto);
    }
}
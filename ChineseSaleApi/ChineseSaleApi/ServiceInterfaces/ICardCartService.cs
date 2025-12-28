using ChineseSaleApi.Dto;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface ICardCartService
    {
        Task<int> CreateCardCar(CreateCardCartDto cardCartDto);
        Task DeleteCardCart(int id);
        Task UpdateCardCart(CardCartDto cardCartDto);
    }
}
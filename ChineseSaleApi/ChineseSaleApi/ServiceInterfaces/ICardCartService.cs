using ChineseSaleApi.Dto;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface ICardCartService
    {
        Task<int> CreateCardCar(CardCartDto cardCartDto);
        Task DeleteCardCart(int id);
        Task UpdateCardCart(CardCartDto cardCartDto);
    }
}
using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface ICardCartRepository
    {
        Task<int> AddCardCart(CardCart cardCart);
        Task DeleteCardCart(int id);
        Task<IEnumerable<CardCart>> GetAllCardCarts();
        Task<CardCart?> GetCardCartById(int id);
        Task UpdateCardCart(CardCart cardCart);
    }
}
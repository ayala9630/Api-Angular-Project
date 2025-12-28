using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Services
{
    public class CardCartService : ICardCartService
    {
        private readonly ICardCartRepository _repository;
        public CardCartService(ICardCartRepository repository)
        {
            _repository = repository;
        }
        //create
        public async Task<int> CreateCardCar(CardCartDto cardCartDto)
        {
            CardCart cardCart = new CardCart
            {
                Quantity = cardCartDto.Quantity,
                UserId = cardCartDto.UserId,
                GiftId = cardCartDto.GiftId
            };
            return await _repository.AddCardCart(cardCart);
        }
        //read
        public async Task<IEnumerable<CardCartDto>> GetCardCartsByUserId(int userId)
        {
            var cardCarts = await _repository.GetCardCartsByUserId(userId);
            return cardCarts.Select(cc => new CardCartDto
            {
                Id = cc.Id,
                Quantity = cc.Quantity,
                UserId = cc.UserId,
                GiftId = cc.GiftId
            });
        }
        //update
        public async Task UpdateCardCart(CardCartDto cardCartDto)
        {
            CardCart? cardCart = await _repository.GetCardCartById(cardCartDto.Id);
            if (cardCart != null)
            {
                cardCart.Quantity = cardCartDto.Quantity;
                await _repository.UpdateCardCart(cardCart);
            }
        }
        //delete
        public async Task DeleteCardCart(int id)
        {
            await _repository.DeleteCardCart(id);
        }
    }
}
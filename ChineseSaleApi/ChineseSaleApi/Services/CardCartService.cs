using System;
using System.Linq;
using System.Threading.Tasks;
using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;
using Microsoft.Extensions.Logging;

namespace ChineseSaleApi.Services
{
    public class CardCartService : ICardCartService
    {
        private readonly ICardCartRepository _repository;
        private readonly ILogger<CardCartService> _logger;

        public CardCartService(ICardCartRepository repository, ILogger<CardCartService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        //create
        public async Task<int> CreateCardCar(CreateCardCartDto cardCartDto)
        {
            try
            {
                CardCart cardCart = new CardCart
                {
                    Quantity = cardCartDto.Quantity,
                    UserId = cardCartDto.UserId,
                    GiftId = cardCartDto.GiftId
                };
                return await _repository.AddCardCart(cardCart);
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "CreateCardCar received a null argument: {@CardCartDto}", cardCartDto);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while creating a card cart for user {UserId}.", cardCartDto?.UserId);
                throw;
            }
        }

        //read
        public async Task<IEnumerable<CardCartDto>> GetCardCartsByUserId(int userId)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get card carts for user {UserId}.", userId);
                throw;
            }
        }

        //update
        public async Task<bool?> UpdateCardCart(UpdateQuantityDto cardCartDto)
        {
            try
            {
                CardCart? cardCart = await _repository.GetCardCartById(cardCartDto.Id);
                if (cardCart != null)
                {
                    cardCart.Quantity = cardCartDto.Quantity;
                    await _repository.UpdateCardCart(cardCart);
                    return true;
                }
                return null;
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "UpdateCardCart received a null argument: {@CardCartDto}", cardCartDto);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update card cart {CardCartId}.", cardCartDto?.Id);
                throw;
            }
        }

        //delete
        public async Task DeleteCardCart(int id)
        {
            try
            {
                await _repository.DeleteCardCart(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete card cart {CardCartId}.", id);
                throw;
            }
        }
    }
}
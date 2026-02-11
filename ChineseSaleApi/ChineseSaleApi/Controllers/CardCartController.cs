using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardCartController : ControllerBase
    {
        private readonly ICardCartService _service;
        private readonly ILogger<CardCartController> _logger;

        public CardCartController(ICardCartService service, ILogger<CardCartController> logger)
        {
            _service = service;
            _logger = logger;
        }

        //read
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCardCartsByUserId(int userId)
        {
            try
            {
                var cards = await _service.GetCardCartsByUserId(userId);
                if (cards == null)
                    return NotFound();
                return Ok(cards);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Failed to get card carts for user {UserId}.", userId);
                return StatusCode(500, ex+"An unexpected error occurred while retrieving card carts.");
            }
        }

        //create
        [HttpPost]
        public async Task<IActionResult> CreateCardCart([FromBody] CreateCardCartDto cardCartDto)
        {
            try
            {
                var id = await _service.CreateCardCar(cardCartDto);
                return CreatedAtAction(nameof(CreateCardCart), new { id = id }, id);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Failed to create card cart for user {UserId}.", cardCartDto?.UserId);
                return StatusCode(500, "An unexpected error occurred while creating the card cart.");
            }
        }

        //update
        [HttpPut]
        public async Task<IActionResult> UpdateCardCart([FromBody] UpdateQuantityDto cardCartDto)
        {
            try
            {
                var success = await _service.UpdateCardCart(cardCartDto);
                if (success == null)
                    return NotFound();
                return NoContent();
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Failed to update card cart {CardCartId}.", cardCartDto?.Id);
                return StatusCode(500, "An unexpected error occurred while updating the card cart.");
            }
        }

        //delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCardCart(int id)
        {
            try
            {
                await _service.DeleteCardCart(id);
                return NoContent();
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Failed to delete card cart {CardCartId}.", id);
                return StatusCode(500, "An unexpected error occurred while deleting the card cart.");
            }
        }
    }
}
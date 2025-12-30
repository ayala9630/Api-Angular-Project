using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;
using System.Threading.Tasks;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardCartController : ControllerBase
    {
        private readonly ICardCartService _service;

        public CardCartController(ICardCartService service)
        {
            _service = service;
        }
        //read
        [HttpGet]
        public async Task<IActionResult> GetCardCartsByUserId(int userId)
        {
            var cards = await _service.GetCardCartsByUserId(userId);
            if (cards == null)
                return NotFound();
            return Ok(cards);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> CreateCardCart([FromBody] CreateCardCartDto cardCartDto)
        {
            var id = await _service.CreateCardCar(cardCartDto);
            return CreatedAtAction(nameof(CreateCardCart), new { id = id }, id);
        }
        //update
        [HttpPut]
        public async Task<IActionResult> UpdateCardCart([FromBody]CardCartDto cardCartDto)
        {
            var success =  await _service.UpdateCardCart(cardCartDto);
            if(success == null)
                return NotFound();
            return NoContent();
        }
        //delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCardCart(int id)
        {
            await _service.DeleteCardCart(id);
            return NoContent();
        }
    }
}
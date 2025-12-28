using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;

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
        //create
        [HttpPost]
        public async Task<IActionResult> CreateCardCart([FromBody] CardCartDto cardCartDto)
        {
            var id = await _service.CreateCardCar(cardCartDto);
            return CreatedAtAction(nameof(CreateCardCart), new { id = id }, id);
        }
        //update
        [HttpPut]
        public async Task<IActionResult> UpdateCardCart([FromBody]CardCartDto cardCartDto)
        {
            await _service.UpdateCardCart(cardCartDto);
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
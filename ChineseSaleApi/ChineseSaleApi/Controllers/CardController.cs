using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.ServiceInterfaces;
using ChineseSaleApi.Dto;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardController : ControllerBase
    {
        private readonly ICardService _service;

        public CardController(ICardService service)
        {
            _service = service;
        }
        //read
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var cards = await _service.GetAllCarsds();
            return Ok(cards);

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCardByGiftId(int id)
        {
            var card = await _service.GetCardByGiftId(id);
            if (card == null)
            {
                return NotFound();
            }
            return Ok(card);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> CreateCard(CreateCardDto createCardDto)
        {
            var id = await _service.AddCard(createCardDto);
            return CreatedAtAction(nameof(CreateCard), new { id = id }, id);
        }

    }
}
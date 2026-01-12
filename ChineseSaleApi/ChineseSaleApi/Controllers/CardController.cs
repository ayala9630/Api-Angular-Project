using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.ServiceInterfaces;
using ChineseSaleApi.Dto;
using Microsoft.AspNetCore.Authorization;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CardController : ControllerBase
    {
        private readonly ICardService _service;

        public CardController(ICardService service)
        {
            _service = service;
        }
        //read
        [HttpGet("lottery/{lotteryId}")]
        public async Task<IActionResult> Get(int lotteryId)
        {
            var cards = await _service.GetAllCarsds(lotteryId);
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
        [HttpGet("pagination/{lotteryId}")]
        public async Task<IActionResult> GetCardsWithPagination(int lotteryId,[FromQuery] PaginationParamsDto paginationParams)
        {
            var cards = await _service.GetCardsWithPagination(lotteryId, paginationParams);
            // Response.Headers.Add("X-Total-Count", totalCount.ToString());
            return Ok(cards);
        }
        [HttpGet("pagination/sortByValue/{lotteryId}")]
        public async Task<IActionResult> GetCardsWithPaginationSortByValue(int lotteryId, [FromQuery] PaginationParamsDto paginationParams, [FromQuery] bool ascending)
        {
            var cards = await _service.GetCardsWithPaginationSortByValue(lotteryId, paginationParams, ascending);
            return Ok(cards);
        }
        [HttpGet("pagination/sortByPurchases/{lotteryId}")]
        public async Task<IActionResult> GetCardsWithPaginationSortByPurchases(int lotteryId, [FromQuery] PaginationParamsDto paginationParams, [FromQuery] bool ascending)
        {
            var cards = await _service.GetCardsWithPaginationSortByPurchases(lotteryId, paginationParams, ascending);
            return Ok(cards);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> CreateCard(CreateCardDto createCardDto)
        {
            var id = await _service.AddCard(createCardDto);
            return CreatedAtAction(nameof(CreateCard), new { id = id }, id);
        }

        [HttpPut]
        public async Task<IActionResult> ResetWinnersByLotteryId(int lotteryId)
        {
            await _service.ResetWinnersByLotteryId(lotteryId);
            return NoContent();
        }
    }
}
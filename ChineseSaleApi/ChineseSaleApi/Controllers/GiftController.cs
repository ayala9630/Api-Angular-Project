using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;
using ChineseSaleApi.Models;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GiftController : ControllerBase
    {
        private readonly IGiftService _service;

        public GiftController(IGiftService service)
        {
            _service = service;
        }
        //read
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGiftById(int id)
        {
            var gift = await _service.GetGiftById(id);
            if (gift == null)
            {
                return NotFound();
            }
            return Ok(gift);
        }
        [HttpGet("user/{userId}/lottery/{lotteryId}")]
        public async Task<IActionResult> GetAllGifts(int lotteryId, int userId)
        {
            var gifts = await _service.GetAllGifts(lotteryId, userId);
            return Ok(gifts);
        }
        [HttpGet("lottery/{lotteryId}/pagination")]
        public async Task<IActionResult> GetGiftsWithPagination([FromQuery] PaginationParamsdto paginationParamsDto,int lotteryId)
        {
            var pagedGifts = await _service.GetGiftsWithPagination(lotteryId, paginationParamsDto);
            return Ok(pagedGifts);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> AddGift([FromBody] CreateGiftDto gift)
        {
            var createdGiftId = await _service.AddGift(gift);
            return CreatedAtAction(nameof(GetGiftById), new { id = createdGiftId }, gift);
        }
        //update
        [HttpPut]
        public async Task<IActionResult> UpdateGift([FromBody] UpdateGiftDto gift)
        {
            var success = await _service.UpdateGift(gift);
            if(success==null)
                return NotFound();
            return NoContent();
        }
        //delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGift(int id)
        {
            await _service.DeleteGift(id);
            return NoContent();
        }
    }
}
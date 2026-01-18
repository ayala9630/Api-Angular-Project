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
        //[HttpGet("lottery/{lotteryId}/pagination")]
        //public async Task<IActionResult> GetGiftsWithPagination(int lotteryId, [FromQuery] PaginationParamsDto paginationParams)
        //{
        //    var pagedGifts = await _service.GetGiftsWithPagination(lotteryId, paginationParams);
        //    return Ok(pagedGifts);
        //}
        [HttpGet("lottery/{lotteryId}/pagination")]
        public async Task<IActionResult> GetGiftsByUserWithPagination(int lotteryId,[FromQuery] int? userId, [FromQuery] PaginationParamsDto paginationParams)
        {
            var pagedGifts = await _service.GetGiftsByUserWithPagination(lotteryId, userId, paginationParams);
            return Ok(pagedGifts);
        }
        [HttpGet("lottery/{lotteryId}/search-pagination")]
        public async Task<IActionResult> GetGiftsSearchPagination(int lotteryId, [FromQuery] int? userId, [FromQuery] PaginationParamsDto paginationParams, [FromQuery] string? name, [FromQuery] string? donor)
        {
            if (name != null)
            {
                var pagedGiftsName = await _service.GetGiftsSearchPagination(lotteryId,userId, paginationParams, name, "name");
                return Ok(pagedGiftsName);
            }
            else if (donor != null)
            {
                var pagedGiftsDonor = await _service.GetGiftsSearchPagination(lotteryId,userId, paginationParams, donor, "donor");
                return Ok(pagedGiftsDonor);
            }
            else
            {
                var pagedGifts = await _service.GetGiftsSearchPagination(lotteryId,userId, paginationParams,null,null);
                return Ok(pagedGifts);
            }
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
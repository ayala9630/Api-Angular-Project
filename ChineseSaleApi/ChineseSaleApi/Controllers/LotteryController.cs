using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;
using Microsoft.Extensions.Logging;
using System;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LotteryController : ControllerBase
    {
        private readonly ILotteryService _service;
        private readonly ILogger<LotteryController> _logger;

        public LotteryController(ILotteryService service, ILogger<LotteryController> logger)
        {
            _service = service;
            _logger = logger;
        }

        //read
        [HttpGet]
        public async Task<IActionResult> GetAllLotteries()
        {
            try
            {
                var lotteries = await _service.GetAllLotteries();
                return Ok(lotteries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get all lotteries.");
                return StatusCode(500, "An unexpected error occurred while retrieving lotteries.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLotteryById(int id)
        {
            try
            {
                var lottery = await _service.GetLotteryById(id);
                if (lottery == null)
                {
                    return NotFound();
                }
                return Ok(lottery);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get lottery by id {LotteryId}.", id);
                return StatusCode(500, "An unexpected error occurred while retrieving the lottery.");
            }
        }

        //create
        [HttpPost]
        public async Task<IActionResult> AddLottery([FromBody] CreateLotteryDto lottery)
        {
            try
            {
                await _service.AddLottery(lottery);
                return Created(nameof(GetLotteryById), lottery);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to add lottery.");
                return StatusCode(500, "An unexpected error occurred while adding the lottery.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLottery([FromBody] UpdateLotteryDto lottery)
        {
            try
            {
                var success = await _service.UpdateLottery(lottery);
                if (success == null)
                    return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update lottery {LotteryId}.", lottery?.Id);
                return StatusCode(500, "An unexpected error occurred while updating the lottery.");
            }
        }

        //delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLottery(int id)
        {
            try
            {
                await _service.DeleteLottery(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete lottery {LotteryId}.", id);
                return StatusCode(500, "An unexpected error occurred while deleting the lottery.");
            }
        }

        [HttpPut]
        [Route("DrawWinners/{giftId}")]
        public async Task<IActionResult> DrawWinners(int giftId)
        {
            try
            {
                var winner = await _service.Lottery(giftId);
                return Ok("The winner is " + winner.FirstName + " " + winner.LastName + "!!! ");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to draw winner for gift {GiftId}.", giftId);
                return StatusCode(500, "An unexpected error occurred while drawing a winner.");
            }
        }
    }
}
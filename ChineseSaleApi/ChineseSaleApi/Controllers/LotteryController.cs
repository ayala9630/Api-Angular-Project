using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LotteryController : ControllerBase
    {
        private readonly ILotteryService _service;

        public LotteryController(ILotteryService service)
        {
            _service = service;
        }
        //read
        [HttpGet]
        public async Task<IActionResult> GetAllLotteries()
        {
            var lotteries = await _service.GetAllLotteries();
            return Ok(lotteries);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLotteryById(int id)
        {
            var lottery = await _service.GetLotteryById(id);
            if (lottery == null)
            {
                return NotFound();
            }
            return Ok(lottery);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> AddLottery([FromBody] CreateLotteryDto lottery)
        {
            await _service.AddLottery(lottery);
            return Created(nameof(GetLotteryById), lottery);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateLottery([FromBody] UpdateLotteryDto lottery)
        {
            var success = await _service.UpdateLottery(lottery);
            if (success == null)
                return NotFound();
            return NoContent();
        }
        //delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLottery(int id)
        {
            await _service.DeleteLottery(id);
            return NoContent();
        }

        [HttpPut]
        [Route("DrawWinners/{giftId}")]
        public async Task<IActionResult> DrawWinners(int giftId)
        {
            try
            {
                var winner = await _service.Lottery(giftId);
                return Ok("The winner is +" + winner.FirstName + " " + winner.LastName + "!!! ");

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
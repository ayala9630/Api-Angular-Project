using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;
using ChineseSaleApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonorController : ControllerBase
    {
        private readonly IDonorService _service;
        private readonly ILotteryService _lotteryService;


        public DonorController(IDonorService service,ILotteryService lotteryService)
        {
            _service = service;
            _lotteryService = lotteryService;
        }
        //read
        [HttpGet]
        public async Task<IActionResult> GetAllDonors()
        {
            var donors = await _service.GetAllDonors();
            return Ok(donors);
        }
        [HttpGet("{lotteryId}/{id}")]
        public async Task<IActionResult> GetDonorById(int id,int lotteryId)
        {
            var donor = await _service.GetDonorById(id,lotteryId);
            if (donor == null)
            {
                return NotFound();
            }
            return Ok(donor);
        }
        [HttpGet("{lotteryId}")]
        public async Task<IActionResult> GetDonorByLotteryId(int lotteryId)
        {
            if(await _lotteryService.GetLotteryById(lotteryId)==null)
                return NotFound();
            var donors = await _service.GetDonorByLotteryId(lotteryId);
            return Ok(donors);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> AddDonor([FromBody] CreateDonorDto donorDto)
        {
            var donorId = await _service.AddDonor(donorDto);
            return Ok(donorId);//CreatedAtAction(nameof(GetDonorById), new { id = donorId}, donorId);

        }
        //update
        [HttpPut]
        public async Task<IActionResult> UpdateDonor([FromBody] UpdateDonorDto donor)
        {
            bool? success = await _service.UpdateDonor(donor);
            if(success == null)
                return NotFound();
            return NoContent();
        }
        //update lottery donor
        [HttpPut("lottery/{donorId}/{lotteryId}")]
        public async Task<IActionResult> AddLotteryToDonor(int donorId, int lotteryId)
        {
            bool? success = await _service.AddLotteryToDonor(donorId, lotteryId);
            if (success == null)
                return NotFound();
            return NoContent();
        }
        //delete
        [HttpDelete("lottery/{lotteryId}")]
        public async Task<IActionResult> DeleteDonor(int id,int lotteryId)
        {
            if(await _service.DeleteDonor(id,lotteryId)==null)
                return NotFound();
            return NoContent();
        }
    }
}
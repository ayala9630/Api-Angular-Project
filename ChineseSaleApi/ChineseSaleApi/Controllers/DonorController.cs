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
        [HttpGet("id")]
        public async Task<IActionResult> GetDonorById(int id)
        {
            var donor = await _service.GetDonorById(id);
            if (donor == null)
            {
                return NotFound();
            }
            return Ok(donor);
        }
        [HttpGet("lottery")]
        public async Task<IActionResult> GetDonorByLotteryId(int lottery)
        {
            if(await _lotteryService.GetLotteryById(lottery)==null)
                return NotFound();
            var donors = await _service.GetDonorByLotteryId(lottery);
            return Ok(donors);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> AddDonor([FromBody] CreateDonorDto donorDto)
        {
            var donorId = await _service.AddDonor(donorDto);
            return CreatedAtAction(nameof(GetDonorById), new { id = donorId }, null);
        }
        //update
        [HttpPut]
        public async Task<IActionResult> UpdateDonor([FromBody] DonorDto donor)
        {
            var existingDonor = await _service.GetDonorById(donor.Id);
            if (existingDonor == null)
            {
                return NotFound();
            }
            await _service.UpdateDonor(donor);
            return NoContent();
        }
        //delete
        [HttpDelete("id")]
        public async Task<IActionResult> DeleteDonor(int id)
        {
            var existingDonor = await _service.GetDonorById(id);
            if (existingDonor == null)
            {
                return NotFound();
            }
            await _service.DeleteDonor(id);
            return NoContent();
        }
    }
}
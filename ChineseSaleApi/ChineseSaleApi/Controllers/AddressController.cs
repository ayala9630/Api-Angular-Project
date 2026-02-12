using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.ServiceInterfaces;
using ChineseSaleApi.Dto;
using Microsoft.Extensions.Logging;
using System;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _service;
        private readonly ILogger<AddressController> _logger;

        public AddressController(IAddressService service, ILogger<AddressController> logger)
        {
            _service = service;
            _logger = logger;
        }

        //read
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAddressById(int id)
        {
            try
            {
                var address = await _service.GetAddressById(id);
                if (address == null)
                {
                    return NotFound();
                }
                return Ok(address);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get address by id {AddressId}.", id);
                return StatusCode(500, "An unexpected error occurred while retrieving the address.");
            }
        }

        //create
        [HttpPost("user")]
        public async Task<IActionResult> AddAddressForUser([FromBody] CreateAddressForUserDto addressDto)
        {
            try
            {
                var addressId = await _service.AddAddressForUser(addressDto);
                return CreatedAtAction(nameof(GetAddressById), new { id = addressId }, addressId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to add address for user.");
                return StatusCode(500, "An unexpected error occurred while adding the address.");
            }
        }

        [HttpPost("donor")]
        public async Task<IActionResult> AddAddressForDonor([FromBody] CreateAddressForDonorDto addressDto)
        {
            try
            {
                var addressId = await _service.AddAddressForDonor(addressDto);
                return CreatedAtAction(nameof(GetAddressById), new { id = addressId }, addressId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to add address for donor.");
                return StatusCode(500, "An unexpected error occurred while adding the address.");
            }
        }

        //update
        [HttpPut]
        public async Task<IActionResult> UpdateAddress([FromBody] AddressDto addressDto)
        {
            try
            {
                bool? success = await _service.UpdateAddress(addressDto);
                if (success == null)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update address {AddressId}.", addressDto?.Id);
                return StatusCode(500, "An unexpected error occurred while updating the address.");
            }
        }
    }
}

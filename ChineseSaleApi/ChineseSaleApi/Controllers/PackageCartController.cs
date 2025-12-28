using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageCartController : ControllerBase
    {
        private readonly IPackageCartService _service;

        public PackageCartController(IPackageCartService service)
        {
            _service = service;
        }
        //read
        [HttpGet]
        public IActionResult GetPackageCartByUserId(int userId)
        {
            var packages =  _service.GetPackagesByUserId(userId);
            if (packages == null)
                return NotFound();
            return Ok(packages);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> CreatePackageCart([FromBody] PackageCartDto packageCartDto)
        {
            var id = await _service.CreatePackageCart(packageCartDto);
            return CreatedAtAction(nameof(CreatePackageCart), new { id = id }, id);
        }
        //update
        [HttpPut]
        public async Task<IActionResult> UpdatePackageCart([FromBody]PackageCartDto packageCartDto)
        {
            await _service.UpdatePackageCart(packageCartDto);
            return NoContent();
        }
        //delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePackageCart(int id)
        {
            await _service.DeletePackageCart(id);
            return NoContent();
        }
    }
}
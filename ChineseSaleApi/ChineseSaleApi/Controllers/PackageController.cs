using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;
using ChineseSaleApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : ControllerBase
    {
        private readonly IPackageService _service;

        public PackageController(IPackageService service)
        {
            _service = service;
        }
        //read
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPackageById(int id)
        {
            var package = await _service.GetPackageById(id);
            if (package == null)
            {
                return NotFound();
            }
            return Ok(package);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllPackages()
        {
            var packages = await _service.GetAllPackages();
            return Ok(packages);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> AddPackage([FromBody] CreatePackageDto createPackageDto)
        {
            var id = await _service.AddPackage(createPackageDto);
            return CreatedAtAction(nameof(GetPackageById), new { id = id }, id);
        }
        //update
        [HttpPut]
        public async Task<IActionResult> UpdatePackage([FromBody] PackageDto packageDto)
        {
            await _service.UpdatePackage(packageDto);
            return NoContent();
        }
        //delete
        [HttpDelete]
        public async Task<IActionResult> DeletePackage(int id)
        {
            await _service.DeletePackage(id);
            return NoContent();
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;

        public CategoryController(ICategoryService service)
        {
            _service = service;
        }
        //read
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _service.GetAllCategories();
            return Ok(categories);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _service.GetCategoryById(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] CreateCategoryDto category)
        {
            await _service.AddCategory(category);
            return Created(nameof(GetCategoryById), category);
        }
        //delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            await _service.DeleteCategory(id);
            return NoContent();
        }
    }
}
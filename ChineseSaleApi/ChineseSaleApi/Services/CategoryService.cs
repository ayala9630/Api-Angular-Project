using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            _repository = repository;
        }
        //create
        public async Task AddCategory(CreateCategoryDto categoryDto)
        {
            Category category = new Category
            {
                Name = categoryDto.Name
            };
            await _repository.AddCategory(category);
        }
        //read
        public async Task<CategoryDto?> GetCategoryById(int id)
        {
            var category = await _repository.GetCategory(id);
            if (category == null)
            {
                return null;
            }
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            };
        }
        public async Task<List<CategoryDto>> GetAllCategories()
        {
            var categories = await _repository.GetAllCategories();
            return categories.Select(category => new CategoryDto
            {
                Id = category.Id,
                Name = category.Name
            }).ToList();
        }
        //delete
        public async Task DeleteCategory(int id)
        {
            await _repository.DeleteCategory(id);
        }
    }
}

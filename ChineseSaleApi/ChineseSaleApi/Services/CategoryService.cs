using System;
using System.Linq;
using System.Threading.Tasks;
using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;
using Microsoft.Extensions.Logging;

namespace ChineseSaleApi.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(ICategoryRepository repository, ILogger<CategoryService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        //create
        public async Task AddCategory(CreateCategoryDto categoryDto)
        {
            try
            {
                Category category = new Category
                {
                    Name = categoryDto.Name
                };
                await _repository.AddCategory(category);
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "AddCategory received a null argument: {@CategoryDto}", categoryDto);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while adding a category.");
                throw;
            }
        }

        //read
        public async Task<CategoryDto?> GetCategoryById(int id)
        {
            try
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get category by id {CategoryId}.", id);
                throw;
            }
        }

        public async Task<List<CategoryDto>> GetAllCategories()
        {
            try
            {
                var categories = await _repository.GetAllCategories();
                return categories.Select(category => new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get all categories.");
                throw;
            }
        }

        //delete
        public async Task DeleteCategory(int id)
        {
            try
            {
                await _repository.DeleteCategory(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete category {CategoryId}.", id);
                throw;
            }
        }
    }
}

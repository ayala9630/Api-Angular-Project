using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Services
{
    public class GiftService : IGiftService
    {
        private readonly IGiftRepository _repository;
        public GiftService(IGiftRepository repository)
        {
            _repository = repository;
        }
        //create
        public async Task<int> AddGift(CreateGiftDto createGiftDto)
        {
            Gift gift = new Gift
            {
                Name = createGiftDto.Name,
                Description = createGiftDto.Description,
                Price = createGiftDto.Price,
                GiftValue = createGiftDto.GiftValue,
                ImageUrl = createGiftDto.ImageUrl,
                IsPackageAble = createGiftDto.IsPackageAble,
                DonorId = createGiftDto.DonorId,
                CategoryId = createGiftDto.CategoryId,
                LotteryId = createGiftDto.LotteryId,
            };
            return await _repository.AddGift(gift);
        }
        //read
        //update
        public async Task UpdateGift(UpdateGiftDto updateGiftDto)
        {
            var existingGift = await _repository.GetGiftById(updateGiftDto.Id);
            if (existingGift != null)
            {

                existingGift.Name = updateGiftDto.Name;
                existingGift.Description = updateGiftDto.Description;
                existingGift.Price = updateGiftDto.Price;
                existingGift.GiftValue = updateGiftDto.GiftValue;
                existingGift.ImageUrl = updateGiftDto.ImageUrl;
                existingGift.IsPackageAble = updateGiftDto.IsPackageAble;
                existingGift.DonorId = updateGiftDto.DonorId;
                existingGift.CategoryId = updateGiftDto.CategoryId;
                existingGift.LotteryId = updateGiftDto.LotteryId;
                await _repository.UpdateGift(existingGift);
            }
        }
        //delete
        public async Task DeleteGift(int id)
        {
            await _repository.DeleteGift(id);
        }
    }

}

using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Services
{
    public class GiftService : IGiftService
    {
        private readonly IGiftRepository _repository;
        private readonly ILotteryRepository _lotteryRepository;
        public GiftService(IGiftRepository repository, ILotteryRepository lotteryRepository)
        {
            _repository = repository;
            _lotteryRepository = lotteryRepository;
        }
        //create
        public async Task<int> AddGift(CreateGiftDto createGiftDto)
        {
            Lottery? lottery = await _lotteryRepository.GetLotteryById(createGiftDto.LotteryId);
            if (lottery?.StartDate < DateTime.Now)
                throw new Exception("Gifts cannot be added after the raffle has started.");
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
        public async Task<GiftDto?> GetGiftById(int id)
        {
            var gift = await _repository.GetGiftById(id);
            if (gift == null)
            {
                return null;
            }
            return new GiftDto
            {
                Id = gift.Id,
                Name = gift.Name,
                Description = gift.Description,
                Price = gift.Price,
                GiftValue = gift.GiftValue,
                ImageUrl = gift.ImageUrl,
                IsPackageAble = gift.IsPackageAble,
                DonorName = gift.Donor?.FirstName + " " + gift.Donor?.LastName ?? "",
                CategoryName = gift.Category?.Name ?? "",
                LotteryId = gift.LotteryId,
            };
        }
        //update
        public async Task<bool?> UpdateGift(UpdateGiftDto updateGiftDto)
        {
            if (updateGiftDto.LotteryId != 0)
            {
                Lottery? lottery = await _lotteryRepository.GetLotteryById(updateGiftDto.LotteryId);
                if (lottery?.StartDate < DateTime.Now)
                    throw new Exception("Gifts cannot be updated after the raffle has started.");
            }
            var gift = await _repository.GetGiftById(updateGiftDto.Id);
            if (gift != null)
            {

                gift.Name = updateGiftDto.Name ?? gift.Name;
                gift.Description = updateGiftDto.Description??gift.Description;
                gift.Price = updateGiftDto.Price ?? gift.Price;
                gift.GiftValue = updateGiftDto.GiftValue ?? gift.GiftValue;
                gift.ImageUrl = updateGiftDto.ImageUrl ?? gift.ImageUrl;
                gift.IsPackageAble = updateGiftDto.IsPackageAble ?? gift.IsPackageAble;
                gift.DonorId = updateGiftDto.DonorId ?? gift.DonorId;
                gift.CategoryId = updateGiftDto.CategoryId ?? gift.CategoryId;
                gift.LotteryId = updateGiftDto.LotteryId!=0?updateGiftDto.LotteryId: gift.LotteryId;
                await _repository.UpdateGift(gift);
                return true;
            }
            return null;
        }
        //delete
        public async Task DeleteGift(int id)
        {
            Gift? gift = await _repository.GetGiftById(id);
            Lottery? lottery = await _lotteryRepository.GetLotteryById(gift?.LotteryId??0);
            if (lottery?.StartDate < DateTime.Now)
                throw new Exception("Gifts cannot be deleted after the raffle has started.");
            await _repository.DeleteGift(id);
        }
    }

}

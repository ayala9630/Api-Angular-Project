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
    public class GiftService : IGiftService
    {
        private readonly IGiftRepository _repository;
        private readonly ILotteryRepository _lotteryRepository;
        private readonly ILogger<GiftService> _logger;

        public GiftService(IGiftRepository repository, ILotteryRepository lotteryRepository, ILogger<GiftService> logger)
        {
            _repository = repository;
            _lotteryRepository = lotteryRepository;
            _logger = logger;
        }
        //create
        public async Task<int> AddGift(CreateGiftDto createGiftDto)
        {
            try
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
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "AddGift received a null argument: {@CreateGiftDto}", createGiftDto);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while adding a gift for lottery {LotteryId}.", createGiftDto?.LotteryId);
                throw;
            }
        }
        //read
        public async Task<GiftDto?> GetGiftById(int id)
        {
            try
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
                    CompanyName = gift.Donor?.CompanyName ?? "",
                    CompanyLogoUrl = gift.Donor?.CompanyIcon ?? "",
                    CategoryName = gift.Category?.Name ?? "",
                    LotteryId = gift.LotteryId,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get gift by id {GiftId}.", id);
                throw;
            }
        }

        public async Task<IEnumerable<GiftWithOldPurchaseDto>> GetAllGifts(int lotteryId, int userId)
        {
            try
            {
                var gifts = await _repository.GetAllGifts(lotteryId);
                return gifts.Select(gifts => new GiftWithOldPurchaseDto
                {
                    Id = gifts.Id,
                    Name = gifts.Name,
                    Price = gifts.Price,
                    GiftValue = gifts.GiftValue,
                    ImageUrl = gifts.ImageUrl,
                    IsPackageAble = gifts.IsPackageAble,
                    OldPurchaseCount = gifts.Cards?.Where(x => x.UserId == userId).Count() ?? 0
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get all gifts for lottery {LotteryId}.", lotteryId);
                throw;
            }
        }

        public async Task<PaginatedResultDto<GiftWithOldPurchaseDto>> GetGiftsByUserWithPagination(int lotteryId, int? userId, PaginationParamsDto paginationParams)
        {
            try
            {
                var (gifts, totalCount) = await _repository.GetGiftsByUserWithPagination(lotteryId, paginationParams.PageNumber, paginationParams.PageSize);
                var giftDto = gifts.Select(gift => new GiftWithOldPurchaseDto
                {
                    Id = gift.Id,
                    Name = gift.Name,
                    Price = gift.Price,
                    GiftValue = gift.GiftValue,
                    ImageUrl = gift.ImageUrl,
                    IsPackageAble = gift.IsPackageAble,
                    OldPurchaseCount = userId != null ? gift.Cards.Count(x => x.UserId == userId) : 0
                }).ToList();
                return new PaginatedResultDto<GiftWithOldPurchaseDto>
                {
                    Items = giftDto,
                    TotalCount = totalCount,
                    PageNumber = paginationParams.PageNumber,
                    PageSize = paginationParams.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get gifts by user with pagination for lottery {LotteryId}.", lotteryId);
                throw;
            }
        }


        public async Task<PaginatedResultDto<GiftWithOldPurchaseDto>> GetGiftsSearchPagination(int lotteryId, int? userId, PaginationParamsDto paginationParams, string? textSearch, string? type)
        {
            try
            {
                var (gifts, totalCount) = await _repository.GetGiftsSearchPagination(lotteryId, paginationParams.PageNumber, paginationParams.PageSize, textSearch, type);
                var giftDto = gifts.Select(gift => new GiftWithOldPurchaseDto
                {
                    Id = gift.Id,
                    Name = gift.Name,
                    Price = gift.Price,
                    GiftValue = gift.GiftValue,
                    ImageUrl = gift.ImageUrl,
                    IsPackageAble = gift.IsPackageAble,
                    OldPurchaseCount = userId != null ? gift.Cards.Count(x => x.UserId == userId) : 0
                }).ToList();
                return new PaginatedResultDto<GiftWithOldPurchaseDto>
                {
                    Items = giftDto,
                    TotalCount = totalCount,
                    PageNumber = paginationParams.PageNumber,
                    PageSize = paginationParams.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to search gifts for lottery {LotteryId}.", lotteryId);
                throw;
            }
        }


        //update
        public async Task<bool?> UpdateGift(UpdateGiftDto updateGiftDto)
        {
            try
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
                    gift.Description = updateGiftDto.Description ?? gift.Description;
                    gift.Price = updateGiftDto.Price ?? gift.Price;
                    gift.GiftValue = updateGiftDto.GiftValue ?? gift.GiftValue;
                    gift.ImageUrl = updateGiftDto.ImageUrl ?? gift.ImageUrl;
                    gift.IsPackageAble = updateGiftDto.IsPackageAble ?? gift.IsPackageAble;
                    gift.DonorId = updateGiftDto.DonorId ?? gift.DonorId;
                    gift.CategoryId = updateGiftDto.CategoryId ?? gift.CategoryId;
                    gift.LotteryId = updateGiftDto.LotteryId != 0 ? updateGiftDto.LotteryId : gift.LotteryId;
                    await _repository.UpdateGift(gift);
                    return true;
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update gift {GiftId}.", updateGiftDto?.Id);
                throw;
            }
        }
        //delete
        public async Task DeleteGift(int id)
        {
            try
            {
                Gift? gift = await _repository.GetGiftById(id);
                Lottery? lottery = await _lotteryRepository.GetLotteryById(gift?.LotteryId ?? 0);
                if (lottery?.StartDate < DateTime.Now)
                    throw new Exception("Gifts cannot be deleted after the raffle has started.");
                await _repository.DeleteGift(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete gift {GiftId}.", id);
                throw;
            }
        }
    }

}

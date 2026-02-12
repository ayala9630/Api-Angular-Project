using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;
using Microsoft.Extensions.Logging;

namespace ChineseSaleApi.Services
{
    public class DonorService : IDonorService
    {
        private readonly IDonorRepository _repository;
        private readonly IAddressService _addressService;
        private readonly ICardRepository _cardRepository;
        private readonly ICardService _cardService;
        private readonly ILogger<DonorService> _logger;

        public DonorService(IDonorRepository repository, IAddressService addressService, ICardRepository cardRepository, ICardService cardService, ILogger<DonorService> logger)
        {
            _repository = repository;
            _addressService = addressService;
            _cardRepository = cardRepository;
            _cardService = cardService;
            _logger = logger;
        }

        //create
        public async Task<int> AddDonor(CreateDonorDto donorDto)
        {
            try
            {
                var idAddress = await _addressService.AddAddressForDonor(donorDto.CompanyAddress);
                Donor donor = new Donor
                {
                    FirstName = donorDto.FirstName,
                    LastName = donorDto.LastName,
                    CompanyName = donorDto.CompanyName,
                    CompanyEmail = donorDto.CompanyEmail,
                    CompanyPhone = donorDto.CompanyPhone,
                    CompanyIcon = donorDto.CompanyIcon,
                    CompanyAddressId = idAddress,
                };
                return await _repository.AddDonor(donor);
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "AddDonor received a null argument: {@DonorDto}", donorDto);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while adding a donor.");
                throw;
            }
        }

        //read
        public async Task<SingelDonorDto?> GetDonorById(int id, int lotteryId, PaginationParamsDto paginationParamsdto)
        {
            try
            {
                var donor = await _repository.GetDonorById(id);
                if (donor == null)
                {
                    return null;
                }

                var cards = await GetAllCards_Fallback(lotteryId);

                Dictionary<string, int> dict = new();

                var donorGifts = donor.Gifts?.Where(g => g.DonorId == id && g.LotteryId == lotteryId) ?? Enumerable.Empty<Gift>();

                foreach (var gift in donorGifts)
                {
                    var count = cards.Count(c => c.GiftId == gift.Id);
                    dict[gift.Name ?? string.Empty] = count;
                }

                return new SingelDonorDto
                {
                    Id = donor.Id,
                    FirstName = donor.FirstName,
                    LastName = donor.LastName,
                    CompanyName = donor.CompanyName,
                    CompanyIcon = donor.CompanyIcon,
                    Gifts = dict
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get donor by id {DonorId} for lottery {LotteryId}.", id, lotteryId);
                throw;
            }
        }
        public async Task<DonorDto?> GetDonorByIdSimple(int id, int lotteryId)
        {
            try
            {
                var donor = await _repository.GetDonorById(id);
                if (donor == null)
                {
                    return null;
                }
                return new DonorDto
                {
                    Id = donor.Id,
                    CompanyAddressId = donor.CompanyAddressId,
                    CompanyEmail = donor.CompanyEmail,
                    CompanyIcon = donor.CompanyIcon,
                    CompanyName = donor.CompanyName,
                    CompanyPhone = donor.CompanyPhone,
                    FirstName = donor.FirstName,
                    LastName = donor.LastName
                };

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get donor by id {DonorId} for lottery {LotteryId}.", id, lotteryId);
                throw;
            }
        }
        private async Task<IEnumerable<Models.Card>> GetAllCards_Fallback(int lotteryId)
        {
            try
            {
                return await _cardRepository.GetAllCards(lotteryId);
            }
            catch
            {
                return Enumerable.Empty<Models.Card>();
            }
        }

        //by lotterry id
        public async Task<IEnumerable<DonorDto?>> GetDonorByLotteryId(int lottery)
        {
            try
            {
                var donors = await _repository.GetDonorByLotteryId(lottery);
                return donors.Select(donor => new DonorDto
                {
                    Id = donor.Id,
                    FirstName = donor.FirstName,
                    LastName = donor.LastName,
                    CompanyName = donor.CompanyName,
                    CompanyEmail = donor.CompanyEmail,
                    CompanyPhone = donor.CompanyPhone,
                    CompanyIcon = donor.CompanyIcon,
                    CompanyAddressId = donor.CompanyAddressId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get donors by lottery id {LotteryId}.", lottery);
                throw;
            }
        }

        //all
        public async Task<IEnumerable<DonorDto>> GetAllDonors()
        {
            try
            {
                var donors = await _repository.GetAllDonors();
                return donors.Select(donor => new DonorDto
                {
                    Id = donor.Id,
                    FirstName = donor.FirstName,
                    LastName = donor.LastName,
                    CompanyName = donor.CompanyName,
                    CompanyEmail = donor.CompanyEmail,
                    CompanyPhone = donor.CompanyPhone,
                    CompanyIcon = donor.CompanyIcon,
                    CompanyAddressId = donor.CompanyAddressId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get all donors.");
                throw;
            }
        }

        //with pagination
        public async Task<PaginatedResultDto<DonorDto>> GetDonorsWithPagination(int lottery, PaginationParamsDto paginationParams)
        {
            try
            {
                var (donors, totalCount) = await _repository.GetDonorsWithPagination(lottery, paginationParams.PageNumber, paginationParams.PageSize);
                var donorDtos = donors.Select(donor => new DonorDto
                {
                    Id = donor.Id,
                    FirstName = donor.FirstName,
                    LastName = donor.LastName,
                    CompanyName = donor.CompanyName,
                    CompanyEmail = donor.CompanyEmail,
                    CompanyPhone = donor.CompanyPhone,
                    CompanyIcon = donor.CompanyIcon,
                    CompanyAddressId = donor.CompanyAddressId
                });
                return new PaginatedResultDto<DonorDto>
                {
                    Items = donorDtos,
                    TotalCount = totalCount,
                    PageNumber = paginationParams.PageNumber,
                    PageSize = paginationParams.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get donors with pagination for lottery {LotteryId}.", lottery);
                throw;
            }
        }

        public async Task<PaginatedResultDto<DonorDto>> GetDonorsNameSearchedPagination(int lottery, PaginationParamsDto paginationParams, string textSearch)
        {
            try
            {
                var (donors, totalCount) = await _repository.GetDonorsNameSearchedPagination(lottery, paginationParams.PageNumber, paginationParams.PageSize, textSearch);
                var donorDtos = donors.Select(donor => new DonorDto
                {
                    Id = donor.Id,
                    FirstName = donor.FirstName,
                    LastName = donor.LastName,
                    CompanyName = donor.CompanyName,
                    CompanyEmail = donor.CompanyEmail,
                    CompanyPhone = donor.CompanyPhone,
                    CompanyIcon = donor.CompanyIcon,
                    CompanyAddressId = donor.CompanyAddressId
                });
                return new PaginatedResultDto<DonorDto>
                {
                    Items = donorDtos,
                    TotalCount = totalCount,
                    PageNumber = paginationParams.PageNumber,
                    PageSize = paginationParams.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get donors by name search for lottery {LotteryId}.", lottery);
                throw;
            }
        }
        public async Task<PaginatedResultDto<DonorDto>> GetDonorsEmailSearchedPagination(int lottery, PaginationParamsDto paginationParams, string textSearch)
        {
            try
            {
                var (donors, totalCount) = await _repository.GetDonorsEmailSearchedPagination(lottery, paginationParams.PageNumber, paginationParams.PageSize, textSearch);
                var donorDtos = donors.Select(donor => new DonorDto
                {
                    Id = donor.Id,
                    FirstName = donor.FirstName,
                    LastName = donor.LastName,
                    CompanyName = donor.CompanyName,
                    CompanyEmail = donor.CompanyEmail,
                    CompanyPhone = donor.CompanyPhone,
                    CompanyIcon = donor.CompanyIcon,
                    CompanyAddressId = donor.CompanyAddressId
                });
                return new PaginatedResultDto<DonorDto>
                {
                    Items = donorDtos,
                    TotalCount = totalCount,
                    PageNumber = paginationParams.PageNumber,
                    PageSize = paginationParams.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get donors by email search for lottery {LotteryId}.", lottery);
                throw;
            }
        }

        //update
        public async Task<bool?> UpdateDonor(UpdateDonorDto donor)
        {
            try
            {
                Donor? donor1 = await _repository.GetDonorById(donor.Id);
                if (donor1 == null)
                {
                    return null;
                }
                donor1.CompanyPhone = donor.CompanyPhone ?? donor1.CompanyPhone;
                donor1.CompanyEmail = donor.CompanyEmail ?? donor1.CompanyEmail;
                donor1.CompanyIcon = donor.CompanyIcon ?? donor1.CompanyIcon;
                donor1.CompanyName = donor.CompanyName ?? donor1.CompanyName;
                donor1.CompanyAddressId = donor.CompanyAddressId ?? donor1.CompanyAddressId;
                donor1.FirstName = donor.FirstName ?? donor1.FirstName;
                donor1.LastName = donor.LastName ?? donor1.LastName;
                await _repository.UpdateDonor(donor1);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update donor {DonorId}.", donor?.Id);
                throw;
            }
        }
        //add lottery to donor
        public async Task<bool?> AddLotteryToDonor(int donorId, int lotteryId)
        {
            try
            {
                return await _repository.UpdateLotteryDonor(donorId, lotteryId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to add lottery {LotteryId} to donor {DonorId}.", lotteryId, donorId);
                throw;
            }
        }
        //delete
        public async Task<bool?> DeleteDonor(int id, int lotteryId)
        {
            try
            {
                Donor? donor = await _repository.GetDonorById(id);
                if (donor == null)
                {
                    return null;
                }
                if (donor.Lotteries.Count() > 1)
                    return await _repository.DeleteLotteryDonor(id, lotteryId);
                return await _repository.DeleteDonor(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete donor {DonorId} from lottery {LotteryId}.", id, lotteryId);
                throw;
            }
        }
    }
}

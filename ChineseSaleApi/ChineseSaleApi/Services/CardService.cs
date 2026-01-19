using System;
using System.Linq;
using System.Threading.Tasks;
using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;
using System.ComponentModel;
using Microsoft.Extensions.Logging;

namespace ChineseSaleApi.Services
{
    public class CardService : ICardService
    {
        private readonly ICardRepository _repository;
        private readonly ILogger<CardService> _logger;
        public CardService(ICardRepository repository, ILogger<CardService> logger)
        {
            _repository = repository;
            _logger = logger;
        }
        //create
        public async Task<int> AddCard(CreateCardDto createCardDto)
        {
            try
            {
                Card card = new Card
                {
                    UserId = createCardDto.UserId,
                    GiftId = createCardDto.GiftId,
                };
                return await _repository.AddCard(card);
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(ex, "AddCard received a null argument: {@CreateCardDto}", createCardDto);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while adding a card.");
                throw;
            }
        }
        //read
        public async Task<List<ListCardDto>> GetAllCarsds(int lotteryId)
        {
            try
            {
                var cards = await _repository.GetAllCards(lotteryId);
                return cards.GroupBy(x => new { x.Gift.Id, x.Gift.Name, x.Gift.ImageUrl })
                            .Select(g => new ListCardDto
                            {
                                GiftId = g.Key.Id,
                                GiftName = g.Key.Name,
                                ImageUrl = g.Key?.ImageUrl??"",
                                Quantity = g.Count()
                            }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get all cards for lottery {LotteryId}.", lotteryId);
                throw;
            }
        }

        public async Task<PaginatedResultDto<ListCardDto>> GetCardsWithPagination(int lotteryId, PaginationParamsDto paginationParams)
        {
            try
            {
                var items = await _repository.GetAllCards(lotteryId);
                int totalCount = items.GroupBy(x => x.Gift.Id).Count();
                var cardDtos = items.GroupBy(x => new { x.Gift.Id, x.Gift.Name, x.Gift.ImageUrl })
                            .Select(g => new ListCardDto
                            {
                                GiftId = g.Key.Id,
                                GiftName = g.Key.Name,
                                ImageUrl = g.Key?.ImageUrl ?? "",
                                Quantity = g.Count()
                            })
                            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                            .Take(paginationParams.PageSize)
                            .ToList();

                return new PaginatedResultDto<ListCardDto>
                {
                    Items = cardDtos,
                    TotalCount = totalCount
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get paginated cards for lottery {LotteryId}.", lotteryId);
                throw;
            }
        }

        public async Task<PaginatedResultDto<ListCardDto>> GetCardsWithPaginationSortByValue(int lotteryId, PaginationParamsDto paginationParams, bool ascending)
        {
            try
            {
                var items = await _repository.GetAllCards(lotteryId);
                int totalCount = items.GroupBy(x => x.Gift.Id).Count();
                var cardDtos = items.GroupBy(x => new { x.Gift.Id, x.Gift.Name,x.Gift.GiftValue, x.Gift.ImageUrl })
                            .Select(g => new ListCardDto
                            {
                                GiftId = g.Key.Id,
                                GiftName = g.Key.Name,
                                ImageUrl = g.Key?.ImageUrl ?? "",
                                GiftValue = g.Key?.GiftValue,
                                Quantity = g.Count()
                            })
                            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                            .Take(paginationParams.PageSize);

                cardDtos = ascending ? cardDtos.OrderBy(x => x.GiftValue).ToList() : cardDtos.OrderByDescending(x => x.GiftValue).ToList();

                return new PaginatedResultDto<ListCardDto>
                {
                    Items = cardDtos,
                    TotalCount = totalCount
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get paginated cards sorted by value for lottery {LotteryId}.", lotteryId);
                throw;
            }
        }

        public async Task<PaginatedResultDto<ListCardDto>> GetCardsWithPaginationSortByPurchases(int lotteryId, PaginationParamsDto paginationParams, bool ascending)
        {
            try
            {
                var items = await _repository.GetAllCards(lotteryId);
                int totalCount = items.GroupBy(x => x.Gift.Id).Count();
                var cardDtos = items.GroupBy(x => new { x.Gift.Id, x.Gift.Name, x.Gift.GiftValue, x.Gift.ImageUrl })
                            .Select(g => new ListCardDto
                            {
                                GiftId = g.Key.Id,
                                GiftName = g.Key.Name,
                                ImageUrl = g.Key?.ImageUrl ?? "",
                                GiftValue = g.Key?.GiftValue,
                                Quantity = g.Count()
                            })
                            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                            .Take(paginationParams.PageSize);

                cardDtos = ascending ? cardDtos.OrderBy(x => x.Quantity).ToList() : cardDtos.OrderByDescending(x => x.Quantity).ToList();

                return new PaginatedResultDto<ListCardDto>
                {
                    Items = cardDtos,
                    TotalCount = totalCount
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get paginated cards sorted by purchases for lottery {LotteryId}.", lotteryId);
                throw;
            }
        }

        public async Task<CardDto?> GetCardByGiftId(int id)
        {
            try
            {
                var cards = await _repository.GetCardByGiftId(id);
                if (cards == null) return null;
                var groupCards = cards.GroupBy(x => new { x.UserId, x.GiftId, x.Gift?.Name, x.User?.FirstName, x.User?.LastName })
                                .Select(g => new
                                {
                                    UserFirstName = g.Key.FirstName,
                                    UserLastName = g.Key.LastName,
                                    GiftId = g.Key.GiftId,
                                    GiftName = g.Key.Name,
                                    Count = g.Count()
                                }).ToList();
                Dictionary<string, int> dict = new();

                foreach (var item in groupCards)
                {
                    dict.Add(item.UserFirstName + " " + item.UserLastName, item.Count);
                }
                return groupCards.Select(x => new CardDto
                {
                    GiftId = x.GiftId,
                    GiftName = x.GiftName,
                    CardPurchases = dict
                }).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get card by gift id {GiftId}.", id);
                throw;
            }
        }

        public async Task<bool> ResetWinnersByLotteryId(int lotteryId)
        {
            try
            {
                return await _repository.ResetWinnersByLotteryId(lotteryId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to reset winners for lottery {LotteryId}.", lotteryId);
                throw;
            }
        }
    }
}
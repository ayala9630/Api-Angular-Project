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
    public class LotteryService : ILotteryService
    {
        private readonly ILotteryRepository _repository;
        private readonly ICardRepository _cardRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<LotteryService> _logger;

        public LotteryService
            (
            ILotteryRepository repository,
            ICardRepository cardRepository,
            IUserRepository userRepository,
            ILogger<LotteryService> logger
            )
        {
            _repository = repository;
            _cardRepository = cardRepository;
            _userRepository = userRepository;
            _logger = logger;
        }
        //create
        public async Task AddLottery(CreateLotteryDto lotteryDto)
        {
            try
            {
                if (lotteryDto.EndDate <= lotteryDto.StartDate)
                {
                    throw new ArgumentException("Lottery end date must be after start date.");
                }

                List<LotteryDto> lotteries = await GetAllLotteries();
                if (lotteries.Count > 0)
                {
                    var prevLottery = lotteries.OrderByDescending(l => l.Id).First();
                    if (prevLottery != null && prevLottery.EndDate >= lotteryDto.StartDate)
                    {
                        throw new ArgumentException("New lottery's start date must be after the previous lottery's end date.");
                    }
                }
                Lottery lottery = new Lottery
                {
                    Name = lotteryDto.Name,
                    StartDate = lotteryDto.StartDate,
                    EndDate = lotteryDto.EndDate
                };
                await _repository.AddLottery(lottery);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to add lottery.");
                throw;
            }
        }
        //read
        public async Task<List<LotteryDto>> GetAllLotteries()
        {
            try
            {
                var lotteries = await _repository.GetAllLotteries();
                return lotteries.Select(lottery => new LotteryDto
                {
                    Id = lottery.Id,
                    Name = lottery.Name,
                    StartDate = lottery.StartDate,
                    EndDate = lottery.EndDate,
                    TotalCards = lottery.TotalCards,
                    TotalSum = lottery.TotalSum,
                    IsDone = lottery.IsDone
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get all lotteries.");
                throw;
            }
        }
        public async Task<LotteryDto?> GetLotteryById(int id)
        {
            try
            {
                var lottery = await _repository.GetLotteryById(id);
                if (lottery == null)
                {
                    return null;
                }
                return new LotteryDto
                {
                    Id = lottery.Id,
                    Name = lottery.Name,
                    StartDate = lottery.StartDate,
                    EndDate = lottery.EndDate,
                    TotalCards = lottery.TotalCards,
                    TotalSum = lottery.TotalSum,
                    IsDone = lottery.IsDone
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get lottery by id {LotteryId}.", id);
                throw;
            }
        }

        //update
        public async Task<bool?> UpdateLottery(UpdateLotteryDto lotteryDto)
        {
            try
            {
                if (lotteryDto.EndDate <= lotteryDto.StartDate)
                {
                    throw new ArgumentException("Lottery end date must be after start date.");
                }
                var lottery = await _repository.GetLotteryById(lotteryDto.Id);
                if (lottery == null)
                {
                    return null;
                }
                if (lottery.StartDate <= DateTime.Now)
                {
                    throw new ArgumentException("Cannot update a lottery that already started.");
                }

                lottery.Name = lotteryDto.Name ?? lottery.Name;
                lottery.StartDate = lotteryDto.StartDate ?? lottery.StartDate;
                lottery.EndDate = lotteryDto.EndDate ?? lottery.EndDate;
                lottery.TotalCards = lotteryDto.TotalCards ?? lottery.TotalCards;
                lottery.TotalSum = lotteryDto.TotalSum ?? lottery.TotalSum;
                lottery.IsDone = lotteryDto.IsDone ?? lottery.IsDone;
                await _repository.UpdateLottery(lottery);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update lottery {LotteryId}.", lotteryDto?.Id);
                throw;
            }
        }

        //delete
        public async Task DeleteLottery(int id)
        {
            try
            {
                var lottery = await _repository.GetLotteryById(id);
                if (lottery == null)
                {
                    throw new Exception("Lottery not found.");
                }
                if (lottery.StartDate <= DateTime.Now)
                {
                    throw new Exception("Cannot delete a lottery that already started.");
                }
                await _repository.DeleteLottery(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete lottery {LotteryId}.", id);
                throw;
            }
        }

        public async Task<bool> UpdateWin(Card card)
        {
            try
            {
                card.IsWin = true;
                await _cardRepository.UpdateCardToWin(card);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update win for card {CardId}.", card?.Id);
                throw;
            }
        }

        public async Task<UserDto?> Lottery(int giftId)
        {
            try
            {
                List<Card?> cardsList = await _cardRepository.GetCardByGiftId(giftId);
                if (cardsList == null || !cardsList.Any())
                {
                    throw new Exception("No cards available for the specified gift.");
                }
                int winnerCardNumber = new Random().Next(1, cardsList.Count() + 1);
                User? winnerUser = await _userRepository.GetUserById(cardsList[winnerCardNumber - 1].UserId);
                if (winnerUser == null)
                {
                    throw new Exception("Winner user not found.");
                }
                await UpdateWin(cardsList[winnerCardNumber - 1]);
                return new UserDto
                {
                    Id = winnerUser.Id,
                    Username = winnerUser.UserName,
                    FirstName = winnerUser.FirstName,
                    LastName = winnerUser.LastName,
                    Phone = winnerUser.Phone,
                    Email = winnerUser.Email
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to run lottery for gift {GiftId}.", giftId);
                throw;
            }
        }
    }
}
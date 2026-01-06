using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Services
{
    public class LotteryService : ILotteryService
    {
        private readonly ILotteryRepository _repository;
        private readonly ICardRepository _cardRepository;
        private readonly IUserRepository _userRepository;
        public LotteryService
            (
            ILotteryRepository repository,
            ICardRepository cardRepository,
            IUserRepository userRepository
            )
        {
            _repository = repository;
            _cardRepository = cardRepository;
            _userRepository = userRepository;
        }
        //create
        public async Task AddLottery(CreateLotteryDto lotteryDto)
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
        //read
        public async Task<List<LotteryDto>> GetAllLotteries()
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
        public async Task<LotteryDto?> GetLotteryById(int id)
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
        //update
        public async Task<bool?> UpdateLottery(UpdateLotteryDto lotteryDto)
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

        //delete
        public async Task DeleteLottery(int id)
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

        public async Task <bool> UpdateWin(Card card)
        {
            card.IsWin = true;
            await _cardRepository.UpdateCardToWin(card);
            return true;
        }

        public async Task<UserDto?> Lottery(int giftId)
        {
            List<Card?> cardsList = await _cardRepository.GetCardByGiftId(giftId);
            int winnerCardNumber = new Random().Next(1, cardsList.Count() + 1);
            User? winnerUser = await _userRepository.GetUserById(cardsList[winnerCardNumber - 1].UserId);
            if (winnerUser == null) {
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
    }
}
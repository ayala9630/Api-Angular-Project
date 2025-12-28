using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Services
{
    public class LotteryService : ILotteryService
    {
        private readonly ILotteryRepository _repository;
        public LotteryService(ILotteryRepository repository)
        {
            _repository = repository;
        }
        //create
        public async Task AddLottery(CreateLotteryDto lotteryDto)
        {
            if (lotteryDto.EndDate <= lotteryDto.StartDate)
            {
                throw new ArgumentException("Lottery end date must be after start date.");
            }
            
            List<LotteryDto> lotteries = await GetAllLotteries();
            var prevLottery = lotteries.OrderByDescending(l => l.Id).First();
            if (prevLottery != null && prevLottery.EndDate >= lotteryDto.StartDate)
            {
                throw new ArgumentException("New lottery's start date must be after the previous lottery's end date.");
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
        public async Task UpdateLottery(LotteryDto lotteryDto)
        {
            if (lotteryDto.EndDate <= lotteryDto.StartDate)
            {
                throw new ArgumentException("Lottery end date must be after start date.");
            }
            var lottery = await _repository.GetLotteryById(lotteryDto.Id);
            if (lottery == null)
            {
                ///////////////////return null;
            }
            if (lottery.StartDate <= DateTime.Now)
            {
                throw new ArgumentException("Cannot update a lottery that already started.");
            }

            lottery.Name = lotteryDto.Name;
            lottery.StartDate = lotteryDto.StartDate;
            lottery.EndDate = lotteryDto.EndDate;
            lottery.TotalCards = lotteryDto.TotalCards;
            lottery.TotalSum = lotteryDto.TotalSum;
            lottery.IsDone = lotteryDto.IsDone;
            await _repository.UpdateLottery(lottery);
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
    }
}
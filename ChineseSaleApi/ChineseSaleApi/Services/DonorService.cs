using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Services
{
    public class DonorService : IDonorService
    {
        private readonly IDonorRepository _repository;
        private readonly IAddressService _addressService;
        private readonly ICardRepository _cardRepository;
        public DonorService(IDonorRepository repository, IAddressService addressService,ICardRepository cardRepository)
        {
            _repository = repository;
            _addressService = addressService;
            _cardRepository= cardRepository;
        }
        //create
        public async Task<int> AddDonor(CreateDonorDto donorDto)
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
        //read
        public async Task<SingelDonorDto?> GetDonorById(int id, int lotteryId)
        {
            Dictionary<string,int> dict = new();

            var donor = await _repository.GetDonorById(id);
            if (donor == null)
            {
                return null;
            }
            var cards = await _cardRepository.GetAllCards(lotteryId);
            var donorGifts = cards.Where(x=>x.Gift.DonorId==id).GroupBy(g => new {  g.GiftId,g.Gift.Name})
                             .Select(x => new
                             {
                                 GiftName = x.Key.Name,
                                 Count = x.Count(),
                             });
            foreach (var item in donorGifts)
            {
                dict.Add(item.GiftName, item.Count);
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
        //by lotterry id
        public async Task<IEnumerable<DonorDto?>> GetDonorByLotteryId(int lottery)
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
        //all
        public async Task<IEnumerable<DonorDto>> GetAllDonors()
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
        //update
        public async Task<bool?> UpdateDonor(UpdateDonorDto donor)
        {
            Donor? donor1 = await _repository.GetDonorById(donor.Id);
            if (donor1 == null)
            {
                return null;
            }
            donor1.CompanyPhone = donor.CompanyPhone??donor1.CompanyPhone;
            donor1.CompanyEmail = donor.CompanyEmail ?? donor1.CompanyEmail;
            donor1.CompanyIcon = donor.CompanyIcon ?? donor1.CompanyIcon;
            donor1.CompanyName = donor.CompanyName ?? donor1.CompanyName;
            donor1.CompanyAddressId = donor.CompanyAddressId ?? donor1.CompanyAddressId;
            donor1.FirstName = donor.FirstName ?? donor1.FirstName;
            donor1.LastName = donor.LastName ?? donor1.LastName;
            await _repository.UpdateDonor(donor1);
            return true;
        }
        //add lottery to donor
        public async Task<bool?> AddLotteryToDonor(int donorId, int lotteryId)
        {
            return await _repository.UpdateLotteryDonor(donorId, lotteryId);
        }
        //delete
        public async Task<bool?> DeleteDonor(int id,int lotteryId)
        {
            Donor? donor = await _repository.GetDonorById(id);
            if (donor == null)
            {
                return null;
            }
            if (donor.Lotteries.Count() > 0)
                return await _repository.DeleteLotteryDonor(id, lotteryId);
            return await _repository.DeleteDonor(id);
        }
    }
}

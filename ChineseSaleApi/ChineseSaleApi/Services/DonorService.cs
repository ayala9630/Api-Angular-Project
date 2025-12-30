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
        public async Task UpdateDonor(DonorDto donor)
        {
            if (await _repository.GetDonorById(donor.Id) == null)
            {
                throw new Exception("Donor not found");
            }
            Donor donor1 = new Donor
            {
                Id = donor.Id,
                FirstName = donor.FirstName ,
                LastName = donor.LastName,
                CompanyName = donor.CompanyName,
                CompanyEmail = donor.CompanyEmail,
                CompanyPhone = donor.CompanyPhone,
                CompanyIcon = donor.CompanyIcon,
                CompanyAddressId = donor.CompanyAddressId
            };
            await _repository.UpdateDonor(donor1);
        }
        //delete
        public async Task DeleteDonor(int id)
        {
            await _repository.DeleteDonor(id);
        }
    }
}

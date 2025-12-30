using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IDonorService
    {
        Task<int> AddDonor(CreateDonorDto donorDto);
        Task DeleteDonor(int id);
        Task<IEnumerable<DonorDto>> GetAllDonors();
        Task<IEnumerable<DonorDto?>> GetDonorByLotteryId(int lottery);
        Task<SingelDonorDto?> GetDonorById(int id, int lotteryId);
        Task UpdateDonor(DonorDto donor);
    }
}
using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IDonorRepository
    {
        Task<int> AddDonor(Donor donor);
        Task<IEnumerable<Donor>> GetAllDonors();
        Task<Donor?> GetDonorById(int id);
        Task UpdateDonor(Donor donor);
        Task<bool?> UpdateLotteryDonor(int donorId, int lotteryId);
        Task<IEnumerable<Donor>> GetDonorByLotteryId(int lottery);
        Task<bool?> DeleteDonor(int id);
        Task<bool?> DeleteLotteryDonor(int donorId, int lotteryId);
    }
}
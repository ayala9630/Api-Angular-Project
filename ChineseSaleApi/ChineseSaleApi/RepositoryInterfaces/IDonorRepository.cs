using ChineseSaleApi.Models;

namespace ChineseSaleApi.RepositoryInterfaces
{
    public interface IDonorRepository
    {
        Task<int> AddDonor(Donor donor);
        Task DeleteDonor(int id);
        Task<IEnumerable<Donor>> GetAllDonors();
        Task<Donor?> GetDonorById(int id);
        Task UpdateDonor(Donor donor);
        Task<IEnumerable<Donor>> GetDonorByLotteryId(int lottery);
    }
}
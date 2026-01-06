using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;

namespace ChineseSaleApi.ServiceInterfaces
{
    public interface IDonorService
    {
        Task<int> AddDonor(CreateDonorDto donorDto);
        Task<IEnumerable<DonorDto>> GetAllDonors();
        Task<IEnumerable<DonorDto?>> GetDonorByLotteryId(int lottery);
        Task<SingelDonorDto?> GetDonorById(int id, int lottery, PaginationParamsdto paginationParamsdto);
        Task<bool?> AddLotteryToDonor(int donorId, int lotteryId);
        Task<bool?> UpdateDonor(UpdateDonorDto donor);
        Task<bool?> DeleteDonor(int id, int lotteryId);
    }
}
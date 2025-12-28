using ChineseSaleApi.RepositoryInterfaces;

namespace ChineseSaleApi.Services
{
    public class DonorService
    {
        private readonly IDonorRepository _repository;
        public DonorService(IDonorRepository repository)
        {
            _repository = repository;
        }
    }
}

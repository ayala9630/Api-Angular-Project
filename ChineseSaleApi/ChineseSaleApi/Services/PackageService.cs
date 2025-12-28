using ChineseSaleApi.RepositoryInterfaces;

namespace ChineseSaleApi.Services
{
    public class PackageService
    {
        private readonly IPackageRepository _repository;
        public PackageService(IPackageRepository repository)
        {
            _repository = repository;
        }
    }
}
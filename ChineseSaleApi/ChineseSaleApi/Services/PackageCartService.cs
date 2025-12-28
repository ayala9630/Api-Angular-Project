using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Services
{
    public class PackageCartService : IPackageCartService
    {
        private readonly IPackageCartRepository _repository;
        public PackageCartService(IPackageCartRepository repository)
        {
            _repository = repository;
        }
        //create
        public async Task<int> CreatePackageCart(PackageCartDto packageCartDto)
        {
            PackageCart packageCart = new PackageCart
            {
                Quantity = packageCartDto.Quantity,
                UserId = packageCartDto.UserId,
                PackageId = packageCartDto.PackageId
            };
            return await _repository.AddPackageCart(packageCart);
        }
        //read
        //update
        public async Task UpdatePackageCart(PackageCartDto packageCartDto)
        {
            PackageCart? packageCart = await _repository.GetPackageCartById(packageCartDto.Id);
            if (packageCart != null)
            {
                packageCart.Quantity = packageCartDto.Quantity;
                await _repository.UpdatePackageCart(packageCart);
            }
        }
        //delete
        public async Task DeletePackageCart(int id)
        {
            await _repository.DeletePackageCart(id);
        }
    }
}
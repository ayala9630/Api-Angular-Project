using System;

namespace ChineseSaleApi.Dto
{
    public class AddressDto
    {
        public int Id { get; set; }
        public string City { get; set; } = null!;
        public string Street { get; set; } = null!;
        public int? Number { get; set; }
        public int? ZipCode { get; set; }
    }
    public class CreateAddressForUserDto
    {
        public string City { get; set; } = null!;
        public string Street { get; set; } = null!;
        public int? Number { get; set; }
        public int? ZipCode { get; set; }
        public int UserId { get; set; }
    }
    public class CreateAddressForDonorDto
    {
        public string City { get; set; } = null!;
        public string Street { get; set; } = null!;
        public int? Number { get; set; }
        public int? ZipCode { get; set; }
        public int DonorId { get; set; }
    }
}
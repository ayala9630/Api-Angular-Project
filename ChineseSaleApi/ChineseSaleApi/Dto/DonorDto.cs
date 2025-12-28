using System;

namespace ChineseSaleApi.Dto
{
    public class DonorDto
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string CompanyName { get; set; } = null!;
        public string CompanyEmail { get; set; } = null!;
        public string? CompanyPhone { get; set; }
        public string? CompanyIcon { get; set; }
        public int CompanyAddressId { get; set; }
    }
}
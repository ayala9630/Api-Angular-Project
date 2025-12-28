using System;

namespace ChineseSaleApi.Dto
{
    public class PackageCartDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public int UserId { get; set; }
        public int PackageId { get; set; }
    }
}
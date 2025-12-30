using System;
using System.ComponentModel.DataAnnotations;

namespace ChineseSaleApi.Dto
{
    public class PackageCartDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public int UserId { get; set; }
        public int PackageId { get; set; }
    }
    public class CreatePackageCartDto
    {
        public int Quantity { get; set; }
        public int UserId { get; set; }
        public int PackageId { get; set; }
    }
    public class UpdateQuantityDto
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}
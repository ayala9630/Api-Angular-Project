using System;

namespace ChineseSaleApi.Dto
{
    public class CreateGiftDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int? Price { get; set; }
        public int? GiftValue { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsPackageAble { get; set; }
        public int DonorId { get; set; }
        public int? CategoryId { get; set; }
        public int LotteryId { get; set; }
    }
    public class UpdateGiftDto
    {
        public int Id { get; set; }
        public string? Name { get; set; } = null!;
        public string? Description { get; set; }
        public int? Price { get; set; }
        public int? GiftValue { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsPackageAble { get; set; }
        public int? DonorId { get; set; }
        public int? CategoryId { get; set; }
        public int LotteryId { get; set; }
    }
    public class GiftDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int? Price { get; set; }
        public int? GiftValue { get; set; }
        public string? ImageUrl { get; set; }
        public bool? IsPackageAble { get; set; }
        public string? DonorName { get; set; }
        public string? CategoryName { get; set; }
        public int LotteryId { get; set; }
    }
}
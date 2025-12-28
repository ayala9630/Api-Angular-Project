using System;

namespace ChineseSaleApi.Dto
{
    public class PackageDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int NumOfCards { get; set; }
        public int Price { get; set; }
        public int LoterryId { get; set; }
    }
    public class CreatePackageDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int NumOfCards { get; set; }
        public int Price { get; set; }
        public int LoterryId { get; set; }
    }

}
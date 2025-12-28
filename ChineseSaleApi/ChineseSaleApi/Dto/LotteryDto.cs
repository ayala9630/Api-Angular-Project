using System;

namespace ChineseSaleApi.Dto
{
    public class LotteryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? TotalCards { get; set; }
        public int? TotalSum { get; set; }
        public bool IsDone { get; set; }
    }
    public class CreateLotteryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
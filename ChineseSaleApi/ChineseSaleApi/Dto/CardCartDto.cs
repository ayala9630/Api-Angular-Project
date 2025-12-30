using System;
using System.ComponentModel.DataAnnotations;

namespace ChineseSaleApi.Dto
{
    public class CardCartDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public int UserId { get; set; }
        public int GiftId { get; set; }
    }
    public class CreateCardCartDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public int UserId { get; set; }
        public int GiftId { get; set; }
    }
}
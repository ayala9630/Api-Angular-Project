using System;

namespace ChineseSaleApi.Dto
{
    public class ListCardDto
    {
        public string GiftName { get; set; }
        public string ImageUrl { get; set; }
        public int Quantity { get; set; }
        public int GiftId { get; set; }
        public UserDto WinUser { get; set; }
    }
    public class CardDto
    {
        public int GiftId { get; set; }
        public string GiftName { get; set; }
        public IDictionary<string, int> CardPurchases { get; set; }
    }
    public class CreateCardDto
    {
        public int UserId { get; set; }
        public int GiftId { get; set; }
    }
    public class UpdateCardDto
    {
        public int Id { get; set; }
        public bool IsWin { get; set; }
    }
}
using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;

namespace ChineseSaleApi.Services
{
    public class CardService : ICardService
    {
        private readonly ICardRepository _repository;
        public CardService(ICardRepository repository)
        {
            _repository = repository;
        }
        //create
        public async Task<int> AddCard(CreateCardDto createCardDto)
        {
            Card card = new Card
            {
                UserId = createCardDto.UserId,
                GiftId = createCardDto.GiftId,
            };
            return await _repository.AddCard(card);
        }
        //read
        public async Task<List<ListCardDto>> GetAllCarsds(int lotteryId)
        {
            var cards = await _repository.GetAllCards(lotteryId);
            return cards.GroupBy(x => new { x.Gift.Id, x.Gift.Name, x.Gift.ImageUrl })
                        .Select(g => new ListCardDto
                        {
                            GiftId = g.Key.Id,
                            GiftName = g.Key.Name,
                            ImageUrl = g.Key?.ImageUrl??"",
                            Quantity = g.Count()
                        }).ToList();
        }

        public async Task<CardDto?> GetCardByGiftId(int id)
        {
            var cards = await _repository.GetCardByGiftId(id);
            if (cards == null) return null;
            var groupCards = cards.GroupBy(x => new { x.UserId, x.GiftId, x.Gift?.Name, x.User?.FirstName, x.User?.LastName })
                            .Select(g => new
                            {
                                UserFirstName = g.Key.FirstName,
                                UserLastName = g.Key.LastName,
                                GiftId = g.Key.GiftId,
                                GiftName = g.Key.Name,
                                Count = g.Count()
                            }).ToList();
            Dictionary<string, int> dict = new();

            foreach (var item in groupCards)
            {
                dict.Add(item.UserFirstName + " " + item.UserLastName, item.Count);
            }
            return groupCards.Select(x => new CardDto
            {
                GiftId = x.GiftId,
                GiftName = x.GiftName,
                CardPurchases = dict
            }).FirstOrDefault();
        }
    }
}
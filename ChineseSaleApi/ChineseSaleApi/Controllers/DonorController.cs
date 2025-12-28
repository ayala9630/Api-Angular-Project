using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Services;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonorController : ControllerBase
    {
        private readonly DonorService _service;

        public DonorController(DonorService service)
        {
            _service = service;
        }
    }
}
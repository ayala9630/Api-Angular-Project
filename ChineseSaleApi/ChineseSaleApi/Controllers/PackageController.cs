using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Services;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : ControllerBase
    {
        private readonly PackageService _service;

        public PackageController(PackageService service)
        {
            _service = service;
        }
    }
}
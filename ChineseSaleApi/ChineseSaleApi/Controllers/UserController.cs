using Microsoft.AspNetCore.Mvc;
using ChineseSaleApi.Dto;
using ChineseSaleApi.ServiceInterfaces;
using ChineseSaleApi.Services;
using StoreApi.DTOs;

namespace ChineseSaleApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            var user = await _service.AuthenticateAsync(loginDto);
            if (user == null)
            {
                return Unauthorized();
            }
            return Ok(user);
        }

        //read
        [HttpGet]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _service.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        //create
        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] CreateUserDto createUserDto)
        { 
            await _service.AddUser(createUserDto);
            return CreatedAtAction(nameof(GetUserById), new { Id = createUserDto.Username }, createUserDto);
        }
        //update
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto userDto)
        {
            var success =await _service.UpdateUser(userDto);
            if (success == null)
                return NotFound();
            return NoContent();
        }
    }
}
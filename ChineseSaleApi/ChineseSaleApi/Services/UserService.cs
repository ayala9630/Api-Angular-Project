using ChineseSaleApi.Dto;
using ChineseSaleApi.Models;
using ChineseSaleApi.Repositories;
using ChineseSaleApi.RepositoryInterfaces;
using ChineseSaleApi.ServiceInterfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StoreApi.DTOs;
using StoreApi.Services;


namespace ChineseSaleApi.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;
        private readonly IAddressService _addressService;
        private readonly ITokenService _tokenService;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly ILogger<UserService> _logger;

        public UserService(
            IEmailService emailService,
            IUserRepository repository, 
            IAddressService addressService,
            ITokenService tokenService, 
            IConfiguration configuration,
            ILogger<UserService> logger
            )
        {
            _tokenService = tokenService;
            _configuration = configuration;
            _addressService = addressService;
            _repository = repository;
            _emailService = emailService;
            _logger = logger;
        }
        //create
        public async Task AddUser(CreateUserDto createUserDto)
        {
            if(await _repository.IsUserNameExists(createUserDto.Username))
            {
                throw new Exception("Username already exists");
            }
            int idAddress = await _addressService.AddAddressForUser(createUserDto.Address);
            User user = new User
            {
                UserName = createUserDto.Username,
                Password = HashPassword(createUserDto.Password),
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                Phone = createUserDto.Phone,
                Email = createUserDto.Email,
                AddressId = idAddress
            };
            _emailService.SendEmail(new EmailRequestDto()
            {
                To = createUserDto.Email,
                Subject = "Welcome to Chinese Sale!",
                Body = $"Hello {createUserDto.FirstName},\n\nThank you for registering at Chinese Sale. We're excited to have you on board!\n\nBest regards,\nChinese Sale Team"
            });
            await _repository.AddUser(user);
        }
        //read
        public async Task<UserDto?> GetUserById(int id)
        {
            var user = await _repository.GetUserById(id);
            if (user == null)
            {
                return null;
            }
            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                Email = user.Email,
                Address = user.Address != null ? new AddressDto
                {
                    Id = user.Address.Id,
                    City = user.Address.City,
                    Street = user.Address.Street,
                    Number = user.Address.Number,
                    ZipCode = user.Address.ZipCode
                } : null
            };
        }
        //update
        public async Task<bool?> UpdateUser(UpdateUserDto userDto)
        {
            var user = await _repository.GetUserById(userDto.Id);
            if (userDto.Address != null)
            {
                await _addressService.UpdateAddress(userDto.Address);
            }
            if(userDto.Email!= null && userDto.Email!=user.Email)
            {
                var allUsers = await _repository.GetAllUsers();
                if (allUsers.Any(u => u.Email == userDto.Email))
                {
                    throw new Exception("Email already exists");
                }
            }
            if (user != null)
            {
                user.FirstName = userDto.FirstName ?? user.FirstName;
                user.LastName = userDto.LastName ?? user.LastName;
                user.Phone = userDto.Phone ?? user.Phone;
                user.Email = userDto.Email ?? user.Email;
                await _repository.UpdateUser(user);
                return true;
            }
            return null;
        }

        public async Task<LoginResponseDto?> AuthenticateAsync(LoginRequestDto loginRequest)
        {
            var user = await _repository.GetUserByUserName(loginRequest.UserName);

            if (user == null)
            {
                return null;
            }

            var hashedPassword = HashPassword(loginRequest.Password);
            if (user.Password != hashedPassword)
            {
                return null;
            }

            var token = _tokenService.GenerateToken(user.Id, user.Email, user.FirstName, user.LastName);
            var expiryMinutes = _configuration.GetValue<int>("JwtSettings:ExpiryMinutes", 60);

            _emailService.SendEmail(new EmailRequestDto()
            {
                To = user.Email,
                Subject = "New Login Notification",
                Body = $"Hello {user.FirstName},\n\nWe noticed a new login to your account. If this was you, no further action is needed. If you did not log in, please reset your password immediately.\n\nBest regards,\nChinese Sale Team"
            });
            _logger.LogInformation($"User {user.UserName} logged in successfully.");
            return new LoginResponseDto
            {
                Token = token,
                TokenType = "Bearer",
                ExpiresIn = expiryMinutes * 60,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.UserName,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Phone = user.Phone,
                    Email = user.Email,
                    Address = user.Address != null ? new AddressDto
                    {
                        Id = user.Address.Id,
                        City = user.Address.City,
                        Street = user.Address.Street,
                        Number = user.Address.Number,
                        ZipCode = user.Address.ZipCode
                    } : null
                }
            };
        }
        private static string HashPassword(string password)
        {
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
}

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
                Body = BuildWelcomeHtml(createUserDto.FirstName)
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
        public async Task<List<UserDto>> GetAllUsers()
        {
            var users = await _repository.GetAllUsers();
            return users.Select(user => new UserDto
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
            }).ToList();
        }

        public async Task<PaginatedResultDto<UserDto>> GetUsersWithPagination(PaginationParamsdto paginationParams)
        {
            var (items, totalCount) = await _repository.GetUsersWithPagination(paginationParams.PageNumber,paginationParams.PageSize);
            List<UserDto> userDto = items.Select(user => new UserDto
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
            }).ToList();
            return new PaginatedResultDto<UserDto>
            {
                Items = userDto,
                TotalCount = totalCount,
                PageNumber = paginationParams.PageNumber,
                PageSize = paginationParams.PageSize
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
                Subject = "התראת כניסה חדשה 🔔",
                Body = BuildLoginNotificationHtml(user.FirstName, DateTime.UtcNow)
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

        private static string BuildLoginNotificationHtml(string firstName, DateTime loginTimeUtc)
        {
            var loginTimeLocal = loginTimeUtc.ToLocalTime().ToString("f");
            return $@"<!doctype html>
<html lang=""he"">
  <head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>התראת כניסה — Chinese Sale</title>
  </head>
  <body style=""margin:0;padding:0;background:#fff8f0;font-family:Arial,Helvetica,sans-serif;color:#333;direction:rtl;text-align:right;"">
    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width:680px;margin:28px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #fde8d6;box-shadow:0 6px 18px rgba(0,0,0,0.06);"">
      <tr>
        <td style=""background:linear-gradient(90deg,#ff9a76 0%,#ffd36b 100%);padding:22px 24px;color:#fff;text-align:right;"">
          <h1 style=""margin:0;font-size:22px;line-height:1.1;"">✨ Chinese Sale</h1>
          <p style=""margin:6px 0 0;font-size:13px;opacity:0.95;"">נעים לראות אותך!</p>
        </td>
      </tr>
      <tr>
        <td style=""padding:22px 24px;"">
          <div style=""display:flex;flex-direction:row-reverse;align-items:center;gap:14px;margin-bottom:12px;"">
            <div style=""width:56px;height:56px;border-radius:50%;background:linear-gradient(180deg,#ffefc4,#ffd36b);display:flex;align-items:center;justify-content:center;font-size:28px;"">🎈</div>
            <div>
              <p style=""margin:0;font-size:18px;font-weight:600;color:#222;"">שלום {firstName}!</p>
              <p style=""margin:4px 0 0;font-size:13px;color:#666;"">זוהתה כניסה חדשה לחשבונך.</p>
            </div>
          </div>

          <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" style=""width:100%;margin:10px 0 18px;border-radius:8px;background:#fff7ee;padding:12px;border:1px dashed #ffe1c7;"">
            <tr>
              <td style=""font-size:13px;color:#6b4a2f;"">
                <strong>מתי:</strong> {loginTimeLocal}
              </td>
            </tr>
            <tr>
              <td style=""padding-top:8px;font-size:13px;color:#6b4a2f;"">
                <strong>מיקום:</strong> לא נרשם — במידה ולא הכרת את הפעולה, אבטח את החשבון.
              </td>
            </tr>
          </table>

          <p style=""margin:0 0 18px;font-size:14px;color:#444;line-height:1.45;"">
            אם זו הייתה אתה — כל שנדרש הוא לשמוח. אם לא — יש ללחוץ על הכפתור מטה כדי לאבטח את חשבונך.
          </p>

          <p style=""margin:0 0 20px;"">
            <a href=""#"" style=""display:inline-block;padding:12px 20px;background:linear-gradient(90deg,#ff7a59,#ffb86b);color:#fff;border-radius:28px;text-decoration:none;font-weight:700;font-size:14px;"">לאבטח את החשבון</a>
          </p>

          <hr style=""border:none;border-top:1px solid #f4e6da;margin:18px 0;"" />

          <p style=""margin:0;font-size:13px;color:#8b6b52;"">בברכה,<br/>צוות Chinese Sale 🎉</p>
        </td>
      </tr>
      <tr>
        <td style=""background:#fffaf6;padding:14px 18px;font-size:12px;color:#b0855a;text-align:center;"">
          זו הודעה אוטומטית — במידה ויש צורך בעזרה השב להודעה זו או בקר במרכז העזרה.
        </td>
      </tr>
    </table>
  </body>
</html>";
        }

        private static string BuildWelcomeHtml(string firstName)
        {
            return $@"<!doctype html>
<html lang=""he"">
  <head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>ברוכים הבאים — Chinese Sale</title>
  </head>
  <body style=""margin:0;padding:0;background:#f0fff9;font-family:Arial,Helvetica,sans-serif;color:#223;direction:rtl;text-align:right;"">
    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width:680px;margin:28px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6fbf2;box-shadow:0 6px 18px rgba(0,0,0,0.04);"">
      <tr>
        <td style=""background:linear-gradient(90deg,#62d2a2 0%,#8ef3d1 100%);padding:22px 24px;color:#fff;text-align:right;"">
          <h1 style=""margin:0;font-size:22px;"">ברוכים הבאים ל‑Chinese Sale 🎉</h1>
          <p style=""margin:6px 0 0;font-size:13px;opacity:0.95;"">שמחים שהצטרפת — בוא נתחיל לקנות!</p>
        </td>
      </tr>
      <tr>
        <td style=""padding:22px 24px;"">
          <div style=""display:flex;flex-direction:row-reverse;align-items:center;gap:14px;margin-bottom:12px;"">
            <div style=""width:64px;height:64px;border-radius:12px;background:linear-gradient(180deg,#fff9e6,#ffd36b);display:flex;align-items:center;justify-content:center;font-size:30px;"">✨</div>
            <div>
              <p style=""margin:0;font-size:18px;font-weight:700;color:#114;"">שלום {firstName} — ברוך הבא!</p>
              <p style=""margin:6px 0 0;font-size:14px;color:#3b5a54;"">הכנו עבורך מבצעים מיוחדים.</p>
            </div>
          </div>

          <p style=""margin:0 0 16px;font-size:14px;color:#334;"">
            התחיל/י לגלוש במבצעים של היום או צפה בהמלצות האישיות שלך.
          </p>

          <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" style=""width:100%;margin:12px 0 18px;"">
            <tr>
              <td style=""width:50%;padding-right:8px;"">
                <a href=""#"" style=""display:block;padding:12px 10px;background:#fff;border-radius:10px;border:1px solid #e6f2eb;text-align:center;text-decoration:none;color:#1a7f63;font-weight:700;"">עיין במבצעים</a>
              </td>
              <td style=""width:50%;padding-left:8px;"">
                <a href=""#"" style=""display:block;padding:12px 10px;background:linear-gradient(90deg,#62d2a2,#8ef3d1);border-radius:10px;text-align:center;text-decoration:none;color:#fff;font-weight:700;"">ההמלצות שלי</a>
              </td>
            </tr>
          </table>

          <p style=""margin:0;font-size:13px;color:#6b776f;"">תהנה/י מההנחות הבלעדיות ותהנה/י מהקניות!</p>

          <div style=""margin-top:18px;font-size:13px;color:#7a7f7b;"">
            <p style=""margin:0;"">בברכה,<br/><strong>צוות Chinese Sale</strong> ❤️</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style=""background:#f7fffb;padding:14px 18px;font-size:12px;color:#2f8b6f;text-align:center;"">
          אתה/את מקבל/ת הודעה זו כיוון שנרשמת באתר Chinese Sale. נהל/י העדxxx בחשבונך.
        </td>
      </tr>
    </table>
  </body>
</html>";
        }
    }
}

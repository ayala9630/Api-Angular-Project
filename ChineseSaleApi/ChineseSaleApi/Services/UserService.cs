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
                Subject = "ברוכים הבאים ל‑Chinese Sale — הרשמתך להגרלה",
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
                Subject = "התראת כניסה — Chinese Sale",
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
<html lang=""he"" dir=""rtl"">
  <head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>התראת כניסה — Chinese Sale</title>
  </head>
  <body style=""margin:0;padding:0;background:#fbfaf8;font-family:Arial, Helvetica, sans-serif;color:#1b1b1b;direction:rtl;text-align:right;"">
    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width:720px;margin:36px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e9e6e2;box-shadow:0 8px 28px rgba(20,20,20,0.06);"">
      <tr>
        <td style=""background:#0f2230;padding:26px 30px;color:#f3e9db;text-align:right;"">
          <h1 style=""margin:0;font-size:22px;font-weight:700;"">Chinese Sale — עדכון חשבון</h1>
          <p style=""margin:6px 0 0;font-size:13px;opacity:0.92;color:#d8cdb6;"">הודעה בטוחה ומכובדת</p>
        </td>
      </tr>
      <tr>
        <td style=""padding:28px 30px;"">
          <p style=""margin:0 0 12px;font-size:16px;color:#111;"">שלום {firstName},</p>
          <p style=""margin:0 0 16px;font-size:14px;color:#333;line-height:1.6;"">זוהתה כניסה חדשה לחשבונך בתאריך: <strong>{loginTimeLocal}</strong>.</p>

          <p style=""margin:0 0 18px;font-size:14px;color:#333;"">אם זו פעולה שלא בוצעה על ידך — אנא שנה את הסיסמה באופן מיידי ופנה לתמיכה.</p>

          <p style=""margin:0 0 18px;"">
            <a href=""#"" style=""display:inline-block;padding:12px 20px;background:#b8873e;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;"">אבטח את החשבון</a>
          </p>

          <p style=""margin:18px 0 0;font-size:13px;color:#6b655f;"">בברכה,<br/><strong>צוות Chinese Sale</strong></p>
        </td>
      </tr>
      <tr>
        <td style=""background:#fbf8f6;padding:14px 18px;font-size:12px;color:#8b7a62;text-align:center;"">
          הודעה אוטומטית — במידה ויש צורך בעזרה יש להשיב להודעה זו או לגשת למרכז העזרה שלנו.
        </td>
      </tr>
    </table>
  </body>
</html>";
        }

        private static string BuildWelcomeHtml(string firstName)
        {
            // מכובד, מזמין, ממוקד בהגרלות סיניות ועוסק בהצטרפות והשתתפות
            return $@"<!doctype html>
<html lang=""he"" dir=""rtl"">
  <head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>ברוכים הבאים — Chinese Sale</title>
  </head>
  <body style=""margin:0;padding:0;background:#fbfaf8;font-family:Arial, Helvetica, sans-serif;color:#1b1b1b;direction:rtl;text-align:right;"">
    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width:720px;margin:36px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #ece6df;box-shadow:0 10px 36px rgba(12,18,23,0.06);"">
      <tr>
        <td style=""background:#071926;padding:28px 34px;color:#f6ead0;text-align:right;"">
          <h1 style=""margin:0;font-size:24px;font-weight:700;"">ברוכים הבאים ל‑Chinese Sale</h1>
          <p style=""margin:6px 0 0;font-size:13px;opacity:0.9;color:#d9cfa6;"">הצטרפתך מאפשרת השתתפות בהגרלות סיניות מובחרות</p>
        </td>
      </tr>
      <tr>
        <td style=""padding:30px 34px;"">
          <p style=""margin:0 0 14px;font-size:16px;color:#111;"">שלום {firstName},</p>

          <p style=""margin:0 0 16px;font-size:14px;color:#333;line-height:1.6;"">
            תודה על הרשמתך. חשבונך מוכן להשתתפות בהגרלות הסיניות היוקרתיות שאנו מארגנים — הזדמנויות לזכייה במבחר פרסים נבחרים.
          </p>

          <p style=""margin:0 0 18px;font-size:14px;color:#333;"">
            תוכלו להתחיל בכמה לחיצות: בדוק/י את דף ההגרלות, רכש/י כרטיס והמתן להודעה על מועד ההגרלה.
          </p>

          <p style=""margin:0 0 18px;"">
            <a href=""#"" style=""display:inline-block;padding:12px 20px;background:#c59d5f;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;"">עבור להגרלות</a>
            <a href=""#"" style=""display:inline-block;margin-right:10px;padding:12px 20px;background:#f3efe2;color:#3b2f20;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;border:1px solid #ead6a7;"">החשבון שלי</a>
          </p>

          <p style=""margin:22px 0 0;font-size:13px;color:#6b6156;"">אנו מאחלים בהצלחה ובהנאה — צוות Chinese Sale</p>
        </td>
      </tr>
      <tr>
        <td style=""background:#fbf8f6;padding:14px 18px;font-size:12px;color:#8b7a62;text-align:center;"">
          קיבלת הודעה זו כי נרשמת ל‑Chinese Sale. נהל/י העדפות בתיבת ההגדרות של החשבון.
        </td>
      </tr>
    </table>
  </body>
</html>";
        }

        // הודעות המיועדות ספציפית להגרלה — מכובדות, ברורות ובשפה עברית
        private static string BuildLotteryEntryConfirmationHtml(string firstName, string lotteryName, DateTime entryTimeUtc, string ticketNumber)
        {
            var entryLocal = entryTimeUtc.ToLocalTime().ToString("f");
            return $@"<!doctype html>
<html lang=""he"" dir=""rtl"">
  <head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>אישור השתתפות — {lotteryName}</title>
  </head>
  <body style=""margin:0;padding:0;background:#fbfaf8;font-family:Arial, Helvetica, sans-serif;color:#1b1b1b;direction:rtl;text-align:right;"">
    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width:720px;margin:36px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #ece6df;box-shadow:0 8px 28px rgba(12,18,23,0.06);"">
      <tr>
        <td style=""background:#0d2b3a;padding:24px 28px;color:#f4ead3;text-align:right;"">
          <h1 style=""margin:0;font-size:20px;font-weight:700;"">אישור השתתפות — {lotteryName}</h1>
        </td>
      </tr>
      <tr>
        <td style=""padding:24px 28px;"">
          <p style=""margin:0 0 12px;font-size:16px;color:#111;"">שלום {firstName},</p>
          <p style=""margin:0 0 12px;font-size:14px;color:#333;line-height:1.6;"">
            קיבלנו את הרשמתך להגרלה: <strong>{lotteryName}</strong>.
          </p>

          <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" style=""width:100%;margin:12px 0 18px;background:#fbf7f2;padding:12px;border-radius:8px;border:1px solid #efe6db;"">
            <tr>
              <td style=""font-size:14px;color:#3b382f;""><strong>מתי נרשמת:</strong> {entryLocal}</td>
            </tr>
            <tr>
              <td style=""padding-top:8px;font-size:14px;color:#3b382f;""><strong>מספר כרטיס:</strong> {ticketNumber}</td>
            </tr>
          </table>

          <p style=""margin:0 0 18px;font-size:14px;color:#333;"">
            שים/י לב: פרטי ההגרלה ומועד העריכה יישלחו בהודעת תזכורת לפני ביצוע ההגרלה.
          </p>

          <p style=""margin:0 0 18px;"">
            <a href=""#"" style=""display:inline-block;padding:12px 20px;background:#c59d5f;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;"">צפה בכרטיסים שלי</a>
          </p>

          <p style=""margin:0;font-size:13px;color:#6b6156;"">בהצלחה רבה,<br/><strong>צוות Chinese Sale</strong></p>
        </td>
      </tr>
      <tr>
        <td style=""background:#fbf8f6;padding:14px 18px;font-size:12px;color:#8b7a62;text-align:center;"">
          זוהי הודעה אוטומטית — לשאלות ופרטים התקשרו/פנו לתמיכה.
        </td>
      </tr>
    </table>
  </body>
</html>";
        }

        private static string BuildLotteryDrawAnnouncementHtml(string lotteryName, DateTime drawDateUtc)
        {
            var drawLocal = drawDateUtc.ToLocalTime().ToString("f");
            return $@"<!doctype html>
<html lang=""he"" dir=""rtl"">
  <head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>הודעה על הגרלה קרובה — {lotteryName}</title>
  </head>
  <body style=""margin:0;padding:0;background:#fbfaf8;font-family:Arial, Helvetica, sans-serif;color:#1b1b1b;direction:rtl;text-align:right;"">
    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width:720px;margin:36px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #ece6df;box-shadow:0 8px 28px rgba(12,18,23,0.06);"">
      <tr>
        <td style=""background:#0d2b3a;padding:24px 28px;color:#f4ead3;text-align:right;"">
          <h1 style=""margin:0;font-size:20px;font-weight:700;"">התזכורת להגרלה — {lotteryName}</h1>
        </td>
      </tr>
      <tr>
        <td style=""padding:24px 28px;"">
          <p style=""margin:0 0 12px;font-size:14px;color:#333;"">שלום,</p>
          <p style=""margin:0 0 16px;font-size:14px;color:#333;line-height:1.6;"">
            ברצוננו להזכיר שההגרלה <strong>{lotteryName}</strong> תתקיים ב־<strong>{drawLocal}</strong>.
          </p>

          <p style=""margin:0 0 16px;font-size:14px;color:#333;"">
            יש לוודא שלכרטיסיך סטטוס תקין — פרטי הזכייה יישלחו לניצחון בהודעה נפרדת.
          </p>

          <p style=""margin:0 0 18px;"">
            <a href=""#"" style=""display:inline-block;padding:12px 20px;background:#b8873e;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;"">צפה בפרטי ההגרלה</a>
          </p>

          <p style=""margin:0;font-size:13px;color:#6b6156;"">בברכה,<br/><strong>צוות Chinese Sale</strong></p>
        </td>
      </tr>
      <tr>
        <td style=""background:#fbf8f6;padding:14px 18px;font-size:12px;color:#8b7a62;text-align:center;"">
          הודעה אוטומטית — לקבלת סיוע יש להשיב להודעה זו או לפנות לשירות הלקוחות.
        </td>
      </tr>
    </table>
  </body>
</html>";
        }

        private static string BuildWinnerNotificationHtml(string firstName, string lotteryName, string prize, string claimInstructions)
        {
            return $@"<!doctype html>
<html lang=""he"" dir=""rtl"">
  <head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>מזל טוב — זכית בהגרלה {lotteryName}</title>
  </head>
  <body style=""margin:0;padding:0;background:#fbfaf8;font-family:Arial, Helvetica, sans-serif;color:#1b1b1b;direction:rtl;text-align:right;"">
    <table role=""presentation"" width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""max-width:720px;margin:36px auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #ece6df;box-shadow:0 8px 28px rgba(12,18,23,0.06);"">
      <tr>
        <td style=""background:#0d2b3a;padding:26px 28px;color:#f4ead3;text-align:right;"">
          <h1 style=""margin:0;font-size:22px;font-weight:700;"">מזל טוב — זכית ב־{lotteryName}</h1>
        </td>
      </tr>
      <tr>
        <td style=""padding:26px 28px;"">
          <p style=""margin:0 0 12px;font-size:16px;color:#111;"">שלום {firstName},</p>

          <p style=""margin:0 0 12px;font-size:15px;color:#333;line-height:1.6;"">
            אנו שמחים להודיע כי זכית בפרס: <strong>{prize}</strong>.
          </p>

          <p style=""margin:0 0 16px;font-size:14px;color:#333;"">
            כדי לקבל את הפרס: {claimInstructions}
          </p>

          <p style=""margin:0 0 18px;"">
            <a href=""#"" style=""display:inline-block;padding:12px 20px;background:#b8873e;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;"">פרטי קבלת הפרס</a>
          </p>

          <p style=""margin:0;font-size:13px;color:#6b6156;"">בהערכה רבה,<br/><strong>צוות Chinese Sale</strong></p>
        </td>
      </tr>
      <tr>
        <td style=""background:#fbf8f6;padding:14px 18px;font-size:12px;color:#8b7a62;text-align:center;"">
          זוהי הודעה רשמית — לשאלות יש להשיב להודעה זו או לפנות לשירות הלקוחות.
        </td>
      </tr>
    </table>
  </body>
</html>";
        }
    }
}

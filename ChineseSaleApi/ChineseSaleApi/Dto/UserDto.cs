using System;

namespace ChineseSaleApi.Dto
{
    public class CreateUserDto
    {
        public string Username { get; set; }
        public string? Password { get; set; }
        public string? FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public CreateAddressForUserDto? Address { get; set; }
    }
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string? FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public AddressDto? Address { get; set; }
        public bool IsAdmin { get; set; }
    }
    public class UpdateUserDto
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public AddressDto? Address { get; set; }
    }
}
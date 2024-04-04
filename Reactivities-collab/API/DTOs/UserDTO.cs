namespace API.DTOs
{
    public class UserDTO
    {
        public string DisplayName { get; set; }

        public string Token { get; set; }

        public string Image {get;set;}

        public string Username { get; set; }

        public bool EmailVerify { get; set; }

        public DateTime? expireVerifyCode {get;set;}

        public string Email { get; set; }
    }
}
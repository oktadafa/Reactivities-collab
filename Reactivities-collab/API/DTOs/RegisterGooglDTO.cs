
namespace API.DTOs
{
    public class RegisterGoogleDTO : RegisterDTO
    {
        public new string Password{get;set;}

        public string Photo{get;set;}
    }
}
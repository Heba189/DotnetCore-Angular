using System.ComponentModel.DataAnnotations;

namespace zwajApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }
        [StringLength(8,MinimumLength=4,ErrorMessage="لا تزيد كلمة السر عن تمانية حروف ولا تقل عن اربعة")]
        [Required]
        public string Password { get; set; }
    }
}
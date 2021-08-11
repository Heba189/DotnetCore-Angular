using System;
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
        [Required]
        public string Gender{ get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateofBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public DateTime Created { get; set; }
        [Required]
        public DateTime LastActive { get; set; }
        public UserForRegisterDto()
        {
            Created = DateTime.Now;
            LastActive =DateTime.Now;
        }
    }
}
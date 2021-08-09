using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using zwajApp.API.Data;
using zwajApp.API.Dtos;
using zwajApp.API.Models;
using AutoMapper;
namespace zwajApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config,IMapper mapper)
        {
           _mapper = mapper;
           _config = config;
            _repo = repo;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto UserForRegisterDto)
        {
            UserForRegisterDto.Username = UserForRegisterDto.Username.ToLower();
            if (await _repo.UserExists(UserForRegisterDto.Username))
                return BadRequest("هذا المستخدم سجل من قبل.");
            var userTocreate = new User
            {
                Username = UserForRegisterDto.Username
            };

            var CreatedUser = await _repo.Register(userTocreate, UserForRegisterDto.Password);
            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
         
            // try
            // {
                
           
            var userFromRepo = await _repo.Login(userForLoginDto.username.ToLower(), userForLoginDto.password);
            if (userFromRepo == null) return Unauthorized();
            var claims = new[]{
                new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name,userFromRepo.Username)
            };
           // var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var key = Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:Token").Value);

            var creds = new SigningCredentials(new SymmetricSecurityKey(key)
                              ,SecurityAlgorithms.HmacSha512);
            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var user =_mapper.Map<UserForListDto>(userFromRepo);
            return Ok(new{
                token = tokenHandler.WriteToken(token),
                user
            });
            // }
            // catch
            // {
            //    return StatusCode(500,"Api is very tired");
            // }

        }

    }
}
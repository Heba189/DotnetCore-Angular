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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace zwajApp.API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMapper _mapper;
        // private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;

        private UserManager<User> _UserManager ;
        private SignInManager<User> _SignInManager ;

        public AuthController( IConfiguration config,IMapper mapper,UserManager<User> userManager,
        SignInManager<User> signInManager
        )
        {
           _mapper = mapper;
            _UserManager = userManager;
            _SignInManager = signInManager;
            _config = config;
            
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto UserForRegisterDto)
        {
            // UserForRegisterDto.Username = UserForRegisterDto.Username.ToLower();
            // if (await _repo.UserExists(UserForRegisterDto.Username))
            //     return BadRequest("هذا المستخدم سجل من قبل.");
            // var userTocreate = new User
            // {
            //     Username = UserForRegisterDto.Username
            // };
            var userTocreate = _mapper.Map<User>(UserForRegisterDto);
            // var CreatedUser = await _repo.Register(userTocreate, UserForRegisterDto.Password);
            var result =await _UserManager.CreateAsync(userTocreate, UserForRegisterDto.Password);
            var returnUser = _mapper.Map<UserForDetailsDto>(userTocreate); 
            if(result.Succeeded){
              return CreatedAtRoute("GetUser", new{Controller="Users",id=userTocreate.Id},returnUser);
            }
            return BadRequest(result.Errors);    

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
         
            // try
            // {
                
           
            // var userFromRepo = await _repo.Login(userForLoginDto.username.ToLower(), userForLoginDto.password);
            // if (userFromRepo == null) return Unauthorized();


            //cut for identity
        //     var claims = new[]{
        //         new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
        //         new Claim(ClaimTypes.Name,userFromRepo.UserName)
        //     };
        //    // var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
        //     var key = Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:Token").Value);

        //     var creds = new SigningCredentials(new SymmetricSecurityKey(key)
        //                       ,SecurityAlgorithms.HmacSha512);
        //     var tokenDescriptor = new SecurityTokenDescriptor{
        //         Subject = new ClaimsIdentity(claims),
        //         Expires = DateTime.Now.AddDays(1),
        //         SigningCredentials = creds
        //     };
        //     var tokenHandler = new JwtSecurityTokenHandler();
        //     var token = tokenHandler.CreateToken(tokenDescriptor);

            // var user =_mapper.Map<UserForListDto>(userFromRepo);
            // return Ok(new{
            //     // token = tokenHandler.WriteToken(token),
            //     token = GenerateJWTToken(userFromRepo),
            //     user
            // });
            // }
            // catch
            // {
            //    return StatusCode(500,"Api is very tired");
            // }

            var user = await _UserManager.FindByNameAsync(userForLoginDto.username);
            var result= await _SignInManager.CheckPasswordSignInAsync(user,userForLoginDto.password,false);
            if(result.Succeeded){
                var appUser = await _UserManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(
                    u => u.NormalizedUserName == userForLoginDto.username.ToUpper()
                );
            var userToReturn = _mapper.Map<UserForListDto>(appUser);
             return Ok(new{
                token = GenerateJWTToken(appUser).Result,
                user =userToReturn
            });    
            }
            return Unauthorized();

        }

        private async Task<string>  GenerateJWTToken(User user){
              var claims = new List<Claim>{
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Name,user.UserName)
            };
            var roles =await _UserManager.GetRolesAsync(user);
            foreach(var role in roles){
                claims.Add(new Claim(ClaimTypes.Role,role));
            }
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
            return tokenHandler.WriteToken(token);

        }
    }
}
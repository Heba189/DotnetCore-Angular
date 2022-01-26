using System.Collections.Generic;
using System.Linq;
using Data;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using zwajApp.API.Models;

namespace zwajApp.API.Data
{
    public class TrialData
    {
        // private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;

        // public TrialData(DataContext context)
        // {
        //     _context = context;
        // }

        public TrialData(UserManager<User> userManager, RoleManager<Role> roleManager
        )
        {
            _userManager = userManager;
           _roleManager = roleManager;
        }
        public void TrialUsers(){
            if(!_userManager.Users.Any()){
                
            
            var userData = System.IO.File.ReadAllText("Data/UserTrialData.json");
            var users =JsonConvert.DeserializeObject<List<User>>(userData);
            var roles =new List<Role>{
                new Role{Name="Admin"},
                new Role{Name="Moderator"},
                new Role{Name="Member"},
                new Role{Name="VIP"},
            };
            foreach(var role in roles){
                _roleManager.CreateAsync(role).Wait();
            }
            foreach(var user in users){
                // byte[] passwordHash,passwordSalt;
                // createPasswordHash("password",out passwordHash,out passwordSalt);
                // user.PasswordHash = passwordHash;
                // user.PasswordSalt = passwordSalt;
                // user.UserName = user.UserName.ToLower();
                // _context.Add(user);
                
                // user.Photos.ToList().ForEach(p => p.IsApproved = true);
                _userManager.CreateAsync(user,"password").Wait();
                _userManager.AddToRoleAsync(user,"Member").Wait();
            }
            
            var adminUser =new User{
                UserName ="Admin"
            };
            IdentityResult result = _userManager.CreateAsync(adminUser,"password").Result;
            var admin=_userManager.FindByNameAsync("Admin").Result;
            _userManager.AddToRolesAsync(admin,new[]{"Admin","Moderator"}).Wait();
            // _context.SaveChanges();

}
        }

        // private void createPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        // {
        //     using(var hmac = new System.Security.Cryptography.HMACSHA512()){
        //         passwordSalt = hmac.Key;
        //         passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        //     } 
        // }
    }
}
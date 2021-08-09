using System;
using System.Threading.Tasks;
using Data;
using Microsoft.EntityFrameworkCore;
using zwajApp.API.Models;

namespace zwajApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;

        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x=>x.Username == username);
            if(user == null) return null;
            if(!verifyPasswordHash(password, user.PasswordSalt,user.PasswordHash))
            return null;
            return user;
        }

        private bool verifyPasswordHash(string password, byte[] passwordSalt, byte[] passwordHash)
        {
               using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt)){     
                var ComputeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for(int i =0 ; i<ComputeHash.Length; i++){
                  if(ComputeHash[i] != passwordHash[i]){
                    return false;
                  }
                   
                } 
                   return true;
               }
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash,passwordSalt;
            createPasswordHash(password , out passwordHash, out passwordSalt);
            user.PasswordSalt = passwordSalt;
            user.PasswordHash = passwordHash;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;    
        }

        private void createPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512()){
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            } 
        }

        public async Task<bool> UserExists(string username)
        {
            if( await _context.Users.AnyAsync(x => x.Username == username)){
                return true;
            }   return false;
        }
    }
}
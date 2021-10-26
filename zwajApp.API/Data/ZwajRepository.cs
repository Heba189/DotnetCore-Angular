using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data;
using Microsoft.EntityFrameworkCore;
using zwajApp.API.Helpers;
using zwajApp.API.Models;

namespace zwajApp.API.Data
{
    public class ZwajRepository : IzwajRepository
    {
        private readonly DataContext _context;

        public ZwajRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<IEnumerable<Message>> GetConversation(int userId, int RecipientId)
        {
           var messages = await _context.Messages.Include(m => m.Sender).ThenInclude(u => u.Photos)
            .Include(m => m.Recipient).ThenInclude(u => u.Photos).Where(m => m.RecipientId == userId && m.SenderId == RecipientId && m.RecipientDeleted ==false || m.RecipientId == RecipientId && m.SenderDeleted == false &&m.SenderId == userId)
            .OrderByDescending(m => m.MessageSent).ToListAsync();
            return messages;
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(l => l.LikerId == userId && 
            l.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
            return await _context.Photos.Where(u => u.userId == userId).FirstOrDefaultAsync(p=> p.IsMain);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages.Include(m => m.Sender).ThenInclude(u => u.Photos)
            .Include(m => m.Recipient).ThenInclude(u => u.Photos).AsQueryable();
            switch (messageParams.MessageType)
            {
                case "Inbox":
                messages = messages.Where(m => m.RecipientId == messageParams.userId);
                break;

                case "Outbox":
                messages = messages.Where(m => m.SenderId == messageParams.userId &&
                m.RecipientDeleted == false
                );    
                 break;
                default:
                messages = messages.Where(m => m.RecipientId == messageParams.userId && m.IsRead == false &&
                m.RecipientDeleted == false &&
                m.SenderDeleted == false
                ); 
                break;
            }
            messages = messages.OrderByDescending(m => m.MessageSent);
            return await PagedList<Message>.CreateAsync(messages,messageParams.PageNumber,messageParams.PageSize);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo =await _context.Photos.FirstOrDefaultAsync(p=>p.Id == id);
            return photo;
        }

        public async Task<int> GetUnreadMessagesForUser(int userId)
        {
            var messages = await _context.Messages.Where(m => m.IsRead == false && m.RecipientId == userId).ToListAsync();
            var count = messages.Count();
            return count;

        }

        public async Task<User> GetUser(int id)
        {
            var user =await _context.Users.Include(u=>u.Photos).FirstOrDefaultAsync(u=>u.Id == id);
            return user;
        }
        //public async Task<IEnumerable<User>> GetUsers()
        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
        //    var users = await _context.Users.Include(u=>u.Photos).ToListAsync();
        //    return users; 
         
        var users =  _context.Users.Include(u=>u.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
        users = users.Where(u => u.Id != userParams.userId);
        users = users.Where(u => u.Gender == userParams.Gender); 
        if(userParams.MinAge != 18 || userParams.MaxAge !=99){
            var minDob = DateTime.Today.AddYears(-userParams.MaxAge -1);
            var maxDob =DateTime.Today.AddYears(-userParams.MinAge);
            users = users.Where(u => u.DateofBirth >=minDob && u.DateofBirth <= maxDob);
        }
       if(userParams.likers){
           var userLikers =await GetUserLikes(userParams.userId ,userParams.likers);
           users = users.Where(u => userLikers.Contains(u.Id));
       }
         if(userParams.Likees){
           var userLikees =await GetUserLikes(userParams.userId ,userParams.likers);
           users = users.Where(u => userLikees.Contains(u.Id));
       }
          if(!string.IsNullOrEmpty(userParams.orderBy)){
            switch (userParams.orderBy)
            {
                case "created":
                users = users.OrderByDescending(u => u.Created);
                break;
                default:
                users = users.OrderByDescending(u => u.LastActive);
                break;
            }
        }
        return await PagedList<User>.CreateAsync(users,userParams.PageNumber,userParams.PageSize);
        }

        public async Task<bool> saveAll()
        {
           return await _context.SaveChangesAsync() > 0;
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id,bool Likers){
            var user =await _context.Users.Include(u => u.Likers).Include(u => u.Likees).FirstOrDefaultAsync(u => u.Id == id);

           if(Likers){
               return user.Likers.Where(u => u.LikeeId == id).Select(l => l.LikerId);
           }else{
               return user.Likees.Where(u => u.LikerId == id).Select(l => l.LikeeId);
           }   
           
        }
        
    }
}
using System.Collections.Generic;
using System.Threading.Tasks;
using zwajApp.API.Helpers;
using zwajApp.API.Models;

namespace zwajApp.API.Data
{
    public interface IzwajRepository
    {
        void Add<T>(T entity) where T:class;
        void Delete<T>(T entity) where T:class;
        Task<bool> saveAll();
        // Task<IEnumerable<User>> GetUsers();
        Task<PagedList<User>> GetUsers(UserParams userParams);
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhoto(int userId);
        Task<Like> GetLike(int userId,int recipientId);

        Task<Message> GetMessage(int id);
        Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<Message>> GetConversation(int userId,int RecipientId);
        Task<int> GetUnreadMessagesForUser(int userId);
        Task<Payment> GetPaymentForUser(int userId);
    }
}

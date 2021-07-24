using System.Collections.Generic;
using System.Threading.Tasks;
using zwajApp.API.Models;

namespace zwajApp.API.Data
{
    public interface IzwajRepository
    {
        void Add<T>(T entity) where T:class;
        void Delete<T>(T entity) where T:class;
        Task<bool> saveAll();
        Task<IEnumerable<User>> GetUsers();
        Task<User> GetUser(int id);

    }
}

using System.Threading.Tasks;

namespace zwajApp.API
{
    internal interface IZwajRepository
    {
        Task GetUsers();
    }
}
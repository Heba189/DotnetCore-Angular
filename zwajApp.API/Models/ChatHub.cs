using Microsoft.AspNetCore.SignalR;
namespace zwajApp.API.Models
{
    public class ChatHub:Hub
    {
        public async void refresh(){
         await Clients.All.SendAsync("refresh");
        } 

        public async void count(){
         await Clients.All.SendAsync("count");
        }
    }

    
}
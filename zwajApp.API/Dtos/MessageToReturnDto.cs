using System;
using zwajApp.API.Models;

namespace zwajApp.API.Dtos
{
    public class MessageToReturnDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public User SenderKnownAs { get; set; }
        public User SenderPhotoUrl { get; set; }
        public int RecipientId { get; set; }
        public User RecipientKnownAs { get; set; }
        public User RecipientPhotoUrl { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime? DateRead {get;set;}
        public DateTime MessageSent { get; set; }
       
    }
}
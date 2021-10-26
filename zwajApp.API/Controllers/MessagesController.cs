using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using zwajApp.API.Data;
using zwajApp.API.Dtos;
using zwajApp.API.Helpers;
using zwajApp.API.Models;

namespace zwajApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController: ControllerBase
    {
        private readonly IzwajRepository _repo;
        private readonly IMapper _mapper;

        public MessagesController(IzwajRepository repo, IMapper mapper)
        { 
             _repo = repo;
             _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId ,[FromQuery] MessageParams messageParams){
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            messageParams.userId = userId;
            var MessageFromRepo = await _repo.GetMessagesForUser(messageParams);
            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(MessageFromRepo);
            Response.AddPagination(MessageFromRepo.CurrentPage , MessageFromRepo.PageSize , MessageFromRepo.TotalCount ,MessageFromRepo.TotalPages);
            return Ok(messages);

        }
         [HttpGet("{id}",Name ="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId,int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            var messageFromRepo = await _repo.GetMessage(id);
            if(messageFromRepo == null)
            return NotFound();
            return Ok(messageFromRepo);
        }
         [HttpPost]
          public async Task<IActionResult> CreateMessage(int userId,MessageForCreationDto messageForCreationDto){
              var sender = await _repo.GetUser(userId);
              if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
              return Unauthorized();  
              messageForCreationDto.SenderId = userId;
              var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);
              if(recipient == null)
              return BadRequest("لم يتم الوصول للمرسل اليه");
              var message = _mapper.Map<Message>(messageForCreationDto);
              _repo.Add(message);
              
              if(await _repo.saveAll()){
                 var MessageToReturn = _mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("GetMessage",new{id=message.Id},MessageToReturn);    
              }
              throw new Exception("حدثت مشكلة اثناء حفظ الرسالة الجديدة");
         }

            [HttpGet("chat/{recipientId}")]
            public async Task<IActionResult> GetConversation(int userId, int recipientId){
                    if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                    return Unauthorized();
                    var messageFromRepo = await _repo.GetConversation(userId ,recipientId);
                    var MessageToReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageFromRepo);
                    return Ok(MessageToReturn);
            }
	    [HttpGet("count")]
        public async Task<IActionResult> GetUnreadMessagesForUser(int userId){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            var count = await _repo.GetUnreadMessagesForUser( int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(count);
        }

        [HttpPost("read/{id}")]
        public async Task<IActionResult> MarkMessageAsRead(int userId,int id){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();
             var message = await _repo.GetMessage(id);
             if(message.RecipientId != userId)
             return Unauthorized();
            message.IsRead = true;
            message.DateRead=DateTime.Now;
            await _repo.saveAll();
            return NoContent();
       }
         [HttpPost("{id}")]   
         public async Task<IActionResult> DeleteMessage(int id,int userId){
             if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();
             var message = await _repo.GetMessage(id);
             if(message.SenderId == userId)
             message.SenderDeleted = true;
             if(message.RecipientId == userId)
             message.RecipientDeleted = true;
             if(message.SenderDeleted && message.RecipientDeleted)
             _repo.Delete(message);
             if(await _repo.saveAll())
             return NoContent();
             throw new Exception("حدث خطا اثناء حذف الرسالة");

         } 
     

         }
}
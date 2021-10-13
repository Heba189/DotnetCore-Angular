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
        public async Task<IActionResult> GetMessagesForUser(int userId , [FromQuery]MessageParams messageParams){
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
              if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
              return Unauthorized();  
              messageForCreationDto.SenderId = userId;
              var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);
              if(recipient == null)
              return BadRequest("لم يتم الوصول للمرسل اليه");
              var message = _mapper.Map<Message>(messageForCreationDto);
              _repo.Add(message);
              var MessageToReturn = _mapper.Map<MessageForCreationDto>(message);
              if(await _repo.saveAll())
              return CreatedAtRoute("GetMessage",new{id=message.Id},MessageToReturn);
              throw new Exception("حدثت مشكلة اثناء حفظ الرسالة الجديدة");
         }
    }
    



}
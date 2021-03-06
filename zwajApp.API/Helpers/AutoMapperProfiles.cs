using System.Linq;
using AutoMapper;
using zwajApp.API.Dtos;
using zwajApp.API.Models;

namespace zwajApp.API.Helpers
{
    public class AutoMapperProfiles:Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User,UserForDetailsDto>()
           .ForMember(dest =>dest.PhotoURL ,opt =>{opt.MapFrom(src =>src.Photos.FirstOrDefault(
               p => p.IsMain).Url);})
            .ForMember(dest => dest.Age,opt =>{opt.ResolveUsing(src => src.DateofBirth.CalculateAge());});
            CreateMap<User,UserForListDto>()
            .ForMember(dest =>dest.PhotoURL ,opt =>{opt.MapFrom(src =>src.Photos.FirstOrDefault(
               p => p.IsMain).Url);})
            .ForMember(dest => dest.Age,opt =>{opt.ResolveUsing(src => src.DateofBirth.CalculateAge());});
            CreateMap<Photo,PhtoForDetailsDto>();
            CreateMap<UserForUpdateDto,User>();
            CreateMap<UserForUpdateDto,User>();
            CreateMap<Photo,PhotoForReturnDto>();
            CreateMap<PhotoCreateDto,Photo>();
            CreateMap<UserForRegisterDto,User>();
            CreateMap<MessageForCreationDto,Message>();
            CreateMap<MessageForCreationDto,Message>().ReverseMap();
            CreateMap<Message,MessageToReturnDto>().ForMember(dest =>dest.SenderPhotoUrl ,opt =>{opt.MapFrom(src =>src.Sender.Photos.FirstOrDefault(
               p => p.IsMain).Url);}).ForMember(dest =>dest.RecipientPhotoUrl ,opt =>{opt.MapFrom(src =>src.Recipient.Photos.FirstOrDefault(
               p => p.IsMain).Url);});
        }
    }
     
}
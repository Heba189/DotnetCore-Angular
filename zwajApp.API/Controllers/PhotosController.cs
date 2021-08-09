using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using zwajApp.API.Data;
using zwajApp.API.Dtos;
using zwajApp.API.Helpers;
using zwajApp.API.Models;


namespace zwajApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
   public class PhotosController:ControllerBase
   {
        private readonly IzwajRepository _repo;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IMapper _mapper;
        public Cloudinary _cloudinary;
        public PhotosController(IzwajRepository repo,IOptions<CloudinarySettings> cloudinaryConfig,IMapper mapper  )
      {
            _repo = repo;
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            Account acc =new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(acc);
        } 
        [HttpGet("{id}",Name ="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id){
            var photoFromRepository =await _repo.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepository);
            return Ok(photo);
            
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId,[FromForm]PhotoCreateDto photoCreateDto )
        {
            if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
               return Unauthorized(); 
            }

            var userFromRepo =await _repo.GetUser(userId);
            var file =photoCreateDto.File;
            var uploadResult = new ImageUploadResult();
            if(file != null && file.Length > 0){
                using(var stream =file.OpenReadStream()){
                    var uploadParams = new ImageUploadParams(){
                        File = new FileDescription(file.Name, stream),
                        Transformation=new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }

            }

            photoCreateDto.Url = uploadResult.Uri.ToString(); 
            photoCreateDto.PublicId = uploadResult.PublicId;
            var photo=_mapper.Map<Photo>(photoCreateDto);
            if(!userFromRepo.Photos.Any(p=>p.IsMain))
                photo.IsMain =true;
            userFromRepo.Photos.Add(photo);
            if(await _repo.saveAll()){
                var PhotoToReturn =_mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto",new{id =photo.Id},PhotoToReturn);
            }
            
            return BadRequest("خطا ف اضافة الصورة");
    
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId,int id){
             if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
               return Unauthorized(); 
               var userFromRepo =await _repo.GetUser(userId);
               if(!userFromRepo.Photos.Any(p => p.Id == id)) 
               return Unauthorized(); 
               var DesiredMainPhoto =await _repo.GetPhoto(id);
               if(DesiredMainPhoto.IsMain)
               return BadRequest("هذه هي الصورة الاساسية بالفعل");
               var currentMainPhoto = await _repo.GetMainPhoto(userId);
               currentMainPhoto.IsMain =false;
               DesiredMainPhoto.IsMain =true;
               if(await _repo.saveAll())
                   return NoContent();
                   return BadRequest("لا يمكن تعديل الصورة الاساسية");
               
        }
        [HttpDelete("{id}")]
            public async Task<IActionResult> DeletePhoto(int userId , int id){
                    if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                    return Unauthorized(); 
                    var userFromRepo =await _repo.GetUser(userId);
                    if(!userFromRepo.Photos.Any(p => p.Id == id)) 
                    return Unauthorized(); 
                    var Photo =await _repo.GetPhoto(id);
                    if(Photo.IsMain)
                    return BadRequest("لا يمكن حذف الصورة الاساسية");
                    if(Photo.PublicId != null){
                        var deleteParams = new DeletionParams(Photo.PublicId);
                        var result = this._cloudinary.Destroy(deleteParams);
                        if(result.Result == "ok"){
                            _repo.Delete(Photo);
                        }
                    };
                   if(Photo.PublicId == null){
                        _repo.Delete(Photo);
                    }
                    if(await _repo.saveAll())
                    return Ok();
                    return BadRequest("فشل حذف الصورة");
            }

       }
      

    

}
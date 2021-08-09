import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() photos:Photo[];
@Output() getMemberPhotoChange = new EventEmitter<string>();
user:User;
hasBaseDropZoneOver=false;
baseUrl =environment.apiUrl;
currentMainPhoto:Photo;
uploader:FileUploader;
  //#region Declartions
  [key: string]: any;
  //#endregion
  
  constructor(private authService:AuthService ,private userSer:UserService , private alertify:AlertifyService, private route:ActivatedRoute) { 
  }

  ngOnInit(){
    this.initializeUploader();
    // this.route.data.subscribe(data =>{
    //   this.user = data['user']
    // })
  }
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 initializeUploader(){
  
   this.uploader = new FileUploader({
    url:this.baseUrl +'users/' + this.authService.decodedToken.nameid +'/photos',
    authToken : 'Bearer ' +localStorage.getItem('token'),
    isHTML5 :true,
    allowedFileType:['image'],
    removeAfterUpload:true,
    autoUpload :false,
    maxFileSize:10*1024*1024
   });
   this.uploader.onAfterAddingFile=(file:any)=>{
     file.withCredentials =false;
   };
   this.uploader.onSuccessItem=(item:any,Response:any,status:any,headers:any)=>{
      if(Response){
        const res:Photo= JSON.parse(Response);
        const photo={
          id:res.id,
          url:res.url,
          dateAdded:res.dateAdded,
          isMain:res.isMain
        };
        this.photos.push(photo);
      }
   }
 }

setMainPhoto(photo:Photo){
  debugger;
  this.userSer.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(
  next=>{
      this.currentMainPhoto = this.photos.filter(phto => phto.isMain === true)[0];
      this.currentMainPhoto.isMain =false;
      photo.isMain =true;
      //this.user.photoURL = photo.url;
     // this.getMemberPhotoChange.emit(photo.url);
     this.authService.changeMemberPhoto(photo.url);
     this.authService.currentUser.photoURL= photo.url;
     localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
    },
   error =>{this.alertify.error("لم يتم التعديل ");}
  )

}

delete(id:number){
  this.alertify.confirm("هل تريد حذف تلك الصورة",()=>{
    this.userSer.deletePhoto(this.authService.decodedToken.nameid,id).subscribe(
      ()=>{
        this.photos.splice(this.photos.findIndex(p=>p.id === id),1);
        this.alertify.success("تم حذف الصورة بنجاح");
      },
      error =>{
        this.alertify.error("حدث خطأ اثناء حذف الصورة");
      }
    )
  })
}
}

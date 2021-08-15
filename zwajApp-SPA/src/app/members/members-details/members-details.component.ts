import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'protractor';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';


@Component({
  selector: 'app-members-details',
  templateUrl: './members-details.component.html',
  styleUrls: ['./members-details.component.css']
})
export class MembersDetailsComponent implements OnInit {
user:User;
created:string;
age:string;
lastActive:any;
options:any={weekday:'long',year:'numeric',month:'long',day:'numeric'};
showIntro:boolean =true;
showlook:boolean =true;
galleryOptions: NgxGalleryOptions[]=[];
galleryImages: NgxGalleryImage[]=[];

  constructor(public userService: UserService, private alertify: AlertifyService, private route:ActivatedRoute) { }

  ngOnInit(){
   // this.loadUser();
   this.route.data.subscribe(Date =>{
    this.user=  Date['user']
   })

   
  this.galleryOptions = [
    {
        width: '600px',
        height: '400px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview:false
    }
//     // max-width 800
//     // {
//     //     breakpoint: 800,
//     //     width: '100%',
//     //     height: '600px',
//     //     imagePercent: 80,
//     //     thumbnailsPercent: 20,
//     //     thumbnailsMargin: 20,
//     //     thumbnailMargin: 20
//     // },
//   //   max-width 400
//   //   {
//   //       breakpoint: 400,
//   //       preview: false
//   //  }
 ];

  this.galleryImages = this.getImages();
  this.created = new Date(this.user.created).toLocaleString('ar-EG', this.options).replace('،','');
  this.age = this.user.age.toLocaleString('ar-EG');
 
};



  getImages(){
    const imagesUrls=[];
    for(let i=0; i<this.user.photos.length; i++){
      imagesUrls.push({
        small: this.user.photos[i].url,
        medium:this.user.photos[i].url,
        big: this.user.photos[i].url
      })
    };
    return imagesUrls;
  }
  // loadUser(){
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
  //     (user:User) =>{
  //       this.user = user
  //     },
  //     error=>{
  //       this.alertify.error(error)
  //     }
  //   )
  // }



}

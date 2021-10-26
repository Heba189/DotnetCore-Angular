import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { ErrorInterceptorProvider } from '../_services/error.interceptor';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  model:any ={};
  photoUrl:string;
  count:string;
  hubConnection:HubConnection;
  constructor(public userService:UserService,public authService:AuthService, private alertify:AlertifyService,private router:Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl=>this.photoUrl = photoUrl)

    this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(
      res => {this.authService.unreadCount.next(res.toString());
      this.authService.latestUnreadCount.subscribe(res => {this.count = res})
      }
    )

    this.hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5001/chat").build();
    this.hubConnection.start();
    this.hubConnection.on('count', () => {
      setTimeout(() => {
            this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(res=>{
              this.authService.unreadCount.next(res.toString());
              this.authService.latestUnreadCount.subscribe(res=>{this.count=res;});
                   });
          }, 0);
  });
  }

  login(){
   // console.log(this.model);
   this.authService.login(this.model).subscribe(
     next =>{this.alertify.success('تم الدخول بنجاح');
      this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(res=>{
      this.authService.unreadCount.next(res.toString());
      this.authService.latestUnreadCount.subscribe(res=>{this.count=res;});
      });
    },
     error =>{this.alertify.error(error)},
     ()=>{
       this.router.navigate(['/members']);
     }
   )
  }

  // loggedIn(){
  //   const token = localStorage.getItem('token');
  //   return !! token
  // }
    loggedIn(){
    return this.authService.loggedIn();
  }
  loggedout(){
    localStorage.removeItem('token');
    this.authService.decodedToken = null;

    localStorage.removeItem('user');
    this.authService.currentUser=null;

    this.alertify.message('تم الخروج');
    this.router.navigate(['/home']);
  
  }
}

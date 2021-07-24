import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { ErrorInterceptorProvider } from '../_services/error.interceptor';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  model:any ={};
  constructor(public authService:AuthService, private alertify:AlertifyService,private router:Router) { }

  ngOnInit() {
  }

  login(){
   // console.log(this.model);
   this.authService.login(this.model).subscribe(
     next =>{this.alertify.success('تم الدخول بنجاح')},
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
    this.alertify.message('تم الخروج');
    this.router.navigate(['/home']);
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
registerMode:boolean =false;
//values :any;

  constructor(private http:HttpClient ,private authService:AuthService,private router:Router) { 
    
  }
  cancelRegister(mode:boolean){
    this.registerMode = mode;
  }
  ngOnInit() {
    //this.getValue();
    if(this.authService.loggedIn()){
      this.router.navigate(['/members']);
    }
  }
  registerToggle(){
    this.registerMode = true;
  }
  // getValue(){
  //   this.http.get('http://localhost:5000/api/values').subscribe(
  //     response =>{this.values = response;},
  //     error =>{console.log(error);}
      
  //   )
  // }
}

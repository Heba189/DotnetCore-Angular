import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
model:any={};
//@Input() valuesFromRegister:any;
@Output() cancelRegister= new EventEmitter();
  constructor(private authService:AuthService, private alertify:AlertifyService) { }

  ngOnInit() {
  }

  register(){
   this.authService.register(this.model).subscribe(
     ()=>{this.alertify.success('تم الاشتراك')},
     error =>{this.alertify.error(error)}
   )
    
  }
  cancel(){
   
    this.cancelRegister.emit(false);
  }
}
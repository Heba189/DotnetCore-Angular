import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
registerForm:FormGroup;
@Output() cancelRegister= new EventEmitter();
  constructor(private authService:AuthService, private alertify:AlertifyService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username:new FormControl('',Validators.required),
      password:new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
      confirmPassword:new FormControl('',Validators.required)
    },this.passwordMatchValidator)
  }
  passwordMatchValidator(form:FormGroup){
   return form.get('password').value === form.get('confirmPassword').value? null :{'mismatch':true};
  }
  register(){
  //  this.authService.register(this.model).subscribe(
  //    ()=>{this.alertify.success('تم الاشتراك')},
  //    error =>{this.alertify.error(error)}
  //  )
  
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}

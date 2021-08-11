import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale } from 'ngx-bootstrap/locale';
import { User } from '../_models/user';
import { Router } from '@angular/router';
defineLocale('ar', arLocale);


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
user:User;
//@Input() valuesFromRegister:any;
registerForm:FormGroup;
local='ar';
bsConfig :Partial<BsDaterangepickerConfig>;
@Output() cancelRegister= new EventEmitter();
  constructor(private router:Router , private authService:AuthService,private localeService: BsLocaleService, private alertify:AlertifyService , private fb:FormBuilder) { 
    this.localeService.use(this.local);
  }

  ngOnInit() {
    // this.registerForm = new FormGroup({
    //   username:new FormControl('',Validators.required),
    //   password:new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
    //   confirmPassword:new FormControl('',Validators.required)
    // },this.passwordMatchValidator)
    this.createRegisterForm();
    this.bsConfig ={
      containerClass :'theme-red',
      showWeekNumbers:false
    }
  }
  /* form builder  */
  createRegisterForm(){
    this.registerForm = this.fb.group({
      gender:['رجل'],
      knownAs:['',Validators.required],
      dateOfBirth:[null,Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      username:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',Validators.required]
    },{validator:this.passwordMatchValidator})
  }
  passwordMatchValidator(form:FormGroup){
   return form.get('password').value === form.get('confirmPassword').value? null :{'mismatch':true};
  }
  register(){
  //  this.authService.register(this.model).subscribe(
  //    ()=>{this.alertify.success('تم الاشتراك')},
  //    error =>{this.alertify.error(error)}
  //  )
  if(this.registerForm.valid){
    this.user = Object.assign({}, this.registerForm.value);
    this.authService.register(this.user).subscribe(
      ()=>{this.alertify.success('تم الاشتراك بنجاح')},
      error =>{this.alertify.error(error)},
      ()=>{
        this.authService.login(this.user).subscribe(
          ()=>{
            this.router.navigate(['/members']);
          }
        )
      }
    )
  }
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
@Input() user:User;
  constructor(private authService:AuthService,private userSer:UserService,private alertify:AlertifyService) { 
  }

  ngOnInit(): void {
    // console.log(this.user)
  }

  sendLike(id:number){
    this.userSer.sendLike(this.authService.decodedToken.nameid,id).subscribe(
      () =>{this.alertify.success('لقد قمت بالاعجاب ب'+ this.user.knownAs);},
      error =>{this.alertify.error(error);}
    )
  }

}

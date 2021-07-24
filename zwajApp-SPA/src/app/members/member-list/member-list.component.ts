import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
   users:User[]=[];
  constructor(public userService: UserService, private alertify: AlertifyService ,private route:ActivatedRoute) { }

  ngOnInit(){
    //this.loadUsers();
    this.route.data.subscribe(data =>{
      this.users = data['users']
    })
  }
  // loadUsers() {
  //   debugger;
  //   this.userService.getUsers().subscribe((users: User[]) => {
  //     this.users = users;
  //   },
  //     error => {
  //       this.alertify.error(error)
  //     }
  //   )

  // }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Pagination, PaginationResult } from 'src/app/_models/Pagination';
import { forEachChild } from 'typescript';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';
declare var $: any;
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
   users:User[];
   user:User=JSON.parse(localStorage.getItem('user'));
   genderList=[{value:"رجل",display:"رجال"},{value:"إمرأة",display:"نساء"}];
   userParams:any ={};
  pagination:Pagination;
  constructor(public userService: UserService, private alertify: AlertifyService ,private route:ActivatedRoute) {
  
   }
   pageChanged(event: PageChangedEvent): void {
     debugger
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
  ngOnInit(){
    debugger

    this.route.data.subscribe(data =>{
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    })
    this.userParams.gender= this.user.gender === 'رجل'? 'إمرأة':'رجل';
    this.userParams.minAge =18;
    this.userParams.maxAge =99;
    this.userParams.orderBy="lastActive";
  }
  resetFilter(){
    debugger
    this.userParams.gender= this.user.gender === 'رجل'? 'إمرأة':'رجل';
    this.userParams.minAge =18;
    this.userParams.maxAge =99;
    this.loadUsers(); 
  }

  loadUsers() {
    debugger;
    this.userService.getUsers(this.pagination.currentPage,this.pagination.itemsPerPage ,this.userParams).subscribe((res:PaginationResult<User[]>) => {
      this.pagination =res.pagination;
      this.users =res.result;
    },
      error => this.alertify.error(error)
    );
    // setTimeout(() =>{
    //   for(let index =1; index < this.pagination.totalPages + 1; index++){
    //     document.getElementsByClassName('page-link')[index + 1].innerHTML = Number
    //     (document.getElementsByClassName('page-link')[index +1].innerHTML).toLocaleString('ar-E')
    //   }
    // }, 0.01);

  }

}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Pagination, PaginationResult } from '../_models/Pagination';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
users:User[];
pagination:Pagination;
likeParam:string;
  constructor(private authService:AuthService,private userService:UserService,private route:ActivatedRoute,private alertify:AlertifyService) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data=>{
        this.users =data['users'].result;
        this.pagination =data['users'].pagination;
      }
    )
    this.likeParam ='Likers';  
    
  }

  loadUsers() {
    debugger;
  
    this.userService.getUsers(this.pagination.currentPage,this.pagination.itemsPerPage ,null,this.likeParam).subscribe((res:PaginationResult<User[]>) => {
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

  };

  pageChanged(event: PageChangedEvent): void {
    debugger
   this.pagination.currentPage = event.page;
   this.loadUsers();
 }
}

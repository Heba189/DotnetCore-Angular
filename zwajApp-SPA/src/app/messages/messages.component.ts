import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Message } from '../_models/message';
import { Pagination, PaginationResult } from '../_models/Pagination';

import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
messages:Message[];
pagination:Pagination;
messageType='Unread';
  constructor(private userService:UserService ,private authService:AuthService ,private route:ActivatedRoute ,private alertify:AlertifyService) { }

  ngOnInit(): void {
    debugger
    this.route.data.subscribe(
      data=>{
        
        this.messages =data['messages'].result;
        this.pagination =data['messages'].pagination;
        console.log(" this.messages", this.messages)
        console.log(" this.pagination", this.pagination)
      }
    )
  }

loadMessages(){
  debugger
  this.userService.getMessages(this.authService.decodedToken.nameid,this.pagination.currentPage,this.pagination.itemsPerPage,this.messageType).subscribe(
    (res:PaginationResult<Message[]>) =>{
      this.messages =res.result;
      this.pagination =res.pagination;
    },
    error => this.alertify.error(error)
  )
}
pageChanged(event:PageChangedEvent):void{
  this.pagination.currentPage = event.page;
  this.loadMessages();
}
DeleteMessage(id:number){
this.alertify.confirm('أنت متاكد من حذف تلك الرسالة',()=>{
  this.userService.DeleteMessage(id,this.authService.decodedToken.nameid).subscribe(()=>{
   this.messages.splice(this.messages.findIndex(m => m.id == id),1);
   this.alertify.success('تم حذف الرسالة بنجاح');
  },
  error => this.alertify.error(error)
  )
})
}
}

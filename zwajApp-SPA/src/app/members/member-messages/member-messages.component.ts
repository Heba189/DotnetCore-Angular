import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HubConnectionBuilder,HubConnection } from '@aspnet/signalr';
import { tap } from 'rxjs/operators';
import { Message } from 'src/app/_models/message';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit ,AfterViewChecked{
@Input() recipientId:number;
@ViewChild('panel') panel:ElementRef;
messages:Message[];
newMessage:any={};
hubConnection2:HubConnection;
  constructor(private userService:UserService,private authService:AuthService,private alertify:AlertifyService) { }

  ngOnInit(): void {
    this.loadMessages();
    this.hubConnection2 = new HubConnectionBuilder().withUrl("http://localhost:5001/chat").build();
    this.hubConnection2.start();

    this.authService.hubConnection.start();
    this.authService.hubConnection.on("refresh",()=>{
      // setTimeout(()=>{
        this.loadMessages();
      // },600);
    })
  }
  ngAfterViewChecked(): void {
    this.panel.nativeElement.scrollTop = this.panel.nativeElement.scrollHeight;
  }
  loadMessages(){
  const  currentUserId = +this.authService.decodedToken.nameid;
    this.userService.GetConversation(this.authService.decodedToken.nameid,this.recipientId)
    .pipe(
     tap(messages=>{
      
         for (const message of messages) {
           if(message.isRead === false && message.recipientId === currentUserId)
           {this.userService.markAsRead(currentUserId,message.id);}
            };
       
     })
   )
    .subscribe(
      messages =>{
        this.messages = messages.reverse();
      },
      error =>{
        this.alertify.error(error);
      },
      ()=>{ 
      
        setTimeout(() => {
         
          this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(res=>{
            this.authService.unreadCount.next(res.toString());
            setTimeout(() => {
                           
              this.userService.GetConversation(this.authService.decodedToken.nameid, this.recipientId).subscribe( messages=>this.messages=messages.reverse());
                              
              }, 3000);
             
                  });
                            
         }, 1000);
       
         }
    )

  }

  sendMessage(){
    debugger
    this.newMessage.recipientId =this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid,this.newMessage).subscribe(
      (message:Message) =>{
        this.messages.push(message);
        this.newMessage.content='';
        this.authService.hubConnection.invoke("refresh");
      } ,error =>{this.alertify.error(error)},
      ()=>{ 
        setTimeout(() => {
        this.hubConnection2.invoke('count');
        this.userService.GetConversation(this.authService.decodedToken.nameid, this.recipientId).subscribe(messages => {
           this.messages = messages.reverse();
          });
        }, 0);
      }

    )

  }
}

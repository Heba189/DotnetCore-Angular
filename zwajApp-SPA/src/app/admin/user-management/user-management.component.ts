import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
users:User[];
bsModalRef?: BsModalRef;
  constructor(private adminSer:AdminService, private alertify:AlertifyService,private modalService: BsModalService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }
getUsersWithRoles(){
  this.adminSer.getUsersWithRoles().subscribe(
    (users:User[])=>{ this.users = users},
    error =>{
      this.alertify.error('حدثت مشكلة في جلب المستخدمين');
    }
  )
}
editRolesModal(user:User){
  
 const  initialState= {
    user,
    roles : this.getRolesArray(user),
    
  };
  this.bsModalRef = this.modalService.show(RolesModalComponent, {initialState});
  // this.bsModalRef.content.closeBtnName = 'Close';
  this.bsModalRef.content.updateSelectedRoles.subscribe((values)=>{
    const rolesToUpdate ={
      roleNames:[...values.filter(el => el.checked === true).map(el=>el.value)]
    };
    if(rolesToUpdate){
      this.adminSer.updateUserRoles(user,rolesToUpdate).subscribe(
        ()=>{
          user.roles =[...rolesToUpdate.roleNames];

        },error => this.alertify.error(error)
      )
    }
  })
}
public getRolesArray(user:User) {
  const roles = [];
  const userRoles = user.roles as any[];
  const availableRoles: any[] = [
    {name: 'مدير النظام', value: 'Admin'},
    {name: 'مشرف', value: 'Moderator'},
    {name: 'عضو', value: 'Member'},
    {name: 'مشترك', value: 'VIP'},
  ];

  availableRoles.forEach(aRole=>{
    let isMatch =false;
    userRoles.forEach(uRole=>{
      if(aRole.value===uRole){
        isMatch=true;
        aRole.checked = true;
        roles.push(aRole);
        return;
       }
    })
    if(!isMatch){
      aRole.checked=false;
      roles.push(aRole);
    }
  })
  return roles;
}

}

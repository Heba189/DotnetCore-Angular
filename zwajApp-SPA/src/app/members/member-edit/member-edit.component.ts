import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm!: NgForm;
 
user:any;
  constructor(private route:ActivatedRoute,private alertify: AlertifyService ) { }

  ngOnInit(){
    // this.editForm.reset(this.user);
    this.route.data.subscribe(Data =>{
      this.user=Data['useredit']
    })

  }
  updateUser(){
    this.alertify.success('تم تعديل الملف الشخصي بنجاح');
  }
}

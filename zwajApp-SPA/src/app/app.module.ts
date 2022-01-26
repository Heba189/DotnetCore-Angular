import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { AppComponent } from './app.component';

import {  HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { AlertifyService } from './_services/alertify.service';
import {TimeAgoPipe} from 'time-ago-pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { AuthGuard } from './_guards/auth.guard';
import { UserService } from './_services/user.service';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MembersDetailsComponent } from './members/members-details/members-details.component';
import { MembersDetailsResolver } from './_resolvers/memberDetails.reslover';
import { MembersListResolver } from './_resolvers/memberList.reslover';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MembersEditResolver } from './_resolvers/member-Edit.reslover';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgPipesModule} from 'ngx-pipes';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgTimePastPipeModule } from 'ng-time-past-pipe';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ListResolver } from './_resolvers/lists.resolver';
import { MessageResolver } from './_resolvers/message.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './_directives/has-role.directive';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { AdminService } from './_services/admin.service';
import { RolesModalComponent } from './admin/roles-modal/roles-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
export function tokenGetter() {
  return localStorage.getItem("token");
}

//export class TimeAgoExtendsPipe extends TimeAgoPipe {}

@NgModule({
  declarations: [	
   
      AppComponent,
      NavbarComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MembersDetailsComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      MemberMessagesComponent,
      PaymentComponent,
      AdminPanelComponent,
      HasRoleDirective,
      UserManagementComponent,
      PhotoManagementComponent,
      RolesModalComponent
       
   ],
  
  imports: [
  
    BrowserModule,
    AppRoutingModule,
    NgTimePastPipeModule,
    HttpClientModule,
    FormsModule,
    NgPipesModule,
    ReactiveFormsModule,
    FileUploadModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001"],
        disallowedRoutes: ["localhost:5001/api/auth"],
      },
    }),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    NgxGalleryModule
  ],
  providers: [AuthService, ErrorInterceptorProvider,AlertifyService,AuthGuard,PreventUnsavedChangesGuard,UserService,MembersDetailsResolver,MembersListResolver,MembersEditResolver,ListResolver,MessageResolver,
    AdminService],
  entryComponents:[RolesModalComponent],  
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

export function tokenGetter() {
  return localStorage.getItem("token");
}
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
      MemberEditComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5000"],
        disallowedRoutes: ["localhost:5000/api/auth"],
      },
    }),
    TabsModule.forRoot(),
    NgxGalleryModule
  ],
  providers: [AuthService, ErrorInterceptorProvider,AlertifyService,AuthGuard,PreventUnsavedChangesGuard,UserService,MembersDetailsResolver,MembersListResolver,MembersEditResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MembersDetailsComponent } from './members/members-details/members-details.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { ListResolver } from './_resolvers/lists.resolver';
import { MembersEditResolver } from './_resolvers/member-Edit.reslover';
import { MembersDetailsResolver } from './_resolvers/memberDetails.reslover';
import { MembersListResolver } from './_resolvers/memberList.reslover';
import { MessageResolver } from './_resolvers/message.resolver';

export const appRoutes: Routes = [
    {path:'',component:HomeComponent},
    {path:'',
      runGuardsAndResolvers:'always',
      canActivate:[AuthGuard],
      children:[
            {path:'members',component:MemberListComponent,resolve:{
              users:MembersListResolver
            }
          },
           {path:'member/edit',component:MemberEditComponent,resolve:{
             useredit:MembersEditResolver
           }, canDeactivate:[PreventUnsavedChangesGuard]},
           
            {path:'members/:id',component:MembersDetailsComponent,resolve:{
              user:MembersDetailsResolver
            }},
           
            {path:'lists',component:ListsComponent, resolve:{
              users:ListResolver
            }},
            {path:'messages',component:MessagesComponent,resolve:{
              messages:MessageResolver
            }}
      ]  
    },
    // {path:'home',component:HomeComponent},
   
    {path:'**',redirectTo:'',pathMatch:'full'}
];
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MembersDetailsComponent } from './members/members-details/members-details.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { MembersDetailsResolver } from './_resolvers/memberDetails.reslover';
import { MembersListResolver } from './_resolvers/memberList.reslover';

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
            {path:'members/:id',component:MembersDetailsComponent,resolve:{
              user:MembersDetailsResolver
            }},
            {path:'lists',component:ListsComponent},
            {path:'messages',component:MessagesComponent}
      ]  
    },
    // {path:'home',component:HomeComponent},
   
    {path:'**',redirectTo:'',pathMatch:'full'}
];
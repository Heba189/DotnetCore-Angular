import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from"rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { HubConnectionBuilder } from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
jwtHelper = new JwtHelperService();
baseUrl=environment.apiUrl+'auth/';
decodedToken :any;
currentUser:User;
paid:boolean=false;
photoUrl = new BehaviorSubject<string>('../../assets/img/img1.jpg');
currentPhotoUrl = this.photoUrl.asObservable();

unreadCount = new BehaviorSubject<string>('');
latestUnreadCount = this.unreadCount.asObservable();
hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5001/chat").build();

constructor(private http:HttpClient) { }

login(model:any){
  return this.http.post(this.baseUrl+'login',model).pipe(
    map((Response:any)=>{
      const user = Response;
      if(user){
        localStorage.setItem('token',user.token);
        localStorage.setItem('user',JSON.stringify(user.user))
        this.decodedToken = this.jwtHelper.decodeToken(user.token);
        //console.log(this.decodedToken);
        this.currentUser =user.user;
        this.changeMemberPhoto(this.currentUser.photoURL);
      
      }
    })
  )


}
changeMemberPhoto(newPhotoUrl :string){
  this.photoUrl.next(newPhotoUrl);
}
register(model:any){
  return this.http.post(this.baseUrl+'register',model);
}
loggedIn(){
  try{
    const token:any = localStorage.getItem('token');
    return ! this.jwtHelper.isTokenExpired(token);
    }catch{
      return false;
    }
}
roleMatch(AllowedRoles:Array<string>):boolean{
  let isMatch =false;
  const userRoles = this.decodedToken.role as Array<String>;
  AllowedRoles.forEach(el =>{
    if(userRoles.includes(el)){
      isMatch =true;
      return;
    }
  });
  return isMatch;
}
}

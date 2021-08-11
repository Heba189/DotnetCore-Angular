import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from"rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
jwtHelper = new JwtHelperService();
baseUrl=environment.apiUrl+'auth/';
decodedToken :any;
currentUser:User;
photoUrl = new BehaviorSubject<string>('../../assets/img/img1.jpg');
currentPhotoUrl = this.photoUrl.asObservable();
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
}

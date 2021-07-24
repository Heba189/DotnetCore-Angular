import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from"rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
jwtHelper = new JwtHelperService();
baseUrl=environment.apiUrl+'auth/';
decodedToken :any;
constructor(private http:HttpClient) { }

login(model:any){
  return this.http.post(this.baseUrl+'login',model).pipe(
    map((Response:any)=>{
      const user = Response;
      if(user){
        localStorage.setItem('token',user.token);
        this.decodedToken = this.jwtHelper.decodeToken(user.token);
        console.log(this.decodedToken);
      }
    })
  )


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
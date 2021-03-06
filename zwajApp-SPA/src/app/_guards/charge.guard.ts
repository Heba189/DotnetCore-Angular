import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ChargeGuard implements CanActivate {

  constructor(private AuthService:AuthService,private userService:UserService,private router:Router){}
  canActivate(): boolean {
    this.userService.getpaymentForUser(this.AuthService.currentUser.id).subscribe(
      res =>{
        if(res == null ) return true;
        else{
          this.router.navigate(['messages']);
          return false;
        }
      }

    );
    return true;
  }
  
}

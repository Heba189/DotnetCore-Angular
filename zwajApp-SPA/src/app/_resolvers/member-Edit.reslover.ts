import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";
import { UserService } from "../_services/user.service";


@Injectable()
export class MembersEditResolver implements Resolve<User>{

    constructor(private authService:AuthService,private userService:UserService,private router:Router,private alertify:AlertifyService) {  
    }
    resolve(route:ActivatedRouteSnapshot):Observable<User | any>{
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error =>{
                this.alertify.error('يوجد مشكلة ف عرض البيانات');
                this.router.navigate(['/members']);
                return of(null);

            }
             
            )
        )
    }
}
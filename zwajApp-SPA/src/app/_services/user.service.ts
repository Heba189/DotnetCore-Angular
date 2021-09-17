import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginationResult } from '../_models/Pagination';
import { User } from '../_models/user';

// const httpOptions={
//   headers:new HttpHeaders({
//     'Authorization':'Bearer '+localStorage.getItem('token')
//   })
// };
@Injectable({
  providedIn: 'root'
})
export class UserService {
baseUrl=environment.apiUrl+'users/';
  constructor(private http:HttpClient) { }

  getUsers(page?,itemsPerPage?,userParams?):Observable<PaginationResult<User[]>>{
    // return this.http.get<User[]>(this.baseUrl, httpOptions);
    const paginationResult :PaginationResult<User[]> = new PaginationResult<User[]>();
    let params = new HttpParams();
    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber',page);
      params = params.append('pageSize',itemsPerPage);
    }
    if(userParams != null){
      params = params.append('minAge',userParams.minAge);
      params = params.append('maxAge',userParams.maxAge);
      params = params.append('gender',userParams.gender);
      params = params.append('orderBy',userParams.orderBy);
    }
    return this.http.get<User[]>(this.baseUrl,{observe:'response',params}).pipe(
      map(response =>{
        paginationResult.result = response.body;
        if(response.headers.get('Pagination') != null){
          paginationResult.pagination=JSON.parse(response.headers.get('Pagination'))
        }
        return paginationResult;
      })
    );


  }
  getUser(id:number):Observable<User>{
    // return this.http.get<User>(this.baseUrl+id, httpOptions);
    return this.http.get<User>(this.baseUrl+id);
  }
  updateUser(id:number,user:User){
    return this.http.put(this.baseUrl+id,user);
  }
  setMainPhoto(userId:number,id:number){
    return this.http.post(this.baseUrl + userId+'/photos/'+id+'/setMain',{});
  }
  deletePhoto(userId:number,id:number){
    return this.http.delete(this.baseUrl + userId+'/photos/'+id);
  }

}

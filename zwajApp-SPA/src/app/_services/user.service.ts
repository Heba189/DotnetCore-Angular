import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { jsDocComment } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
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

  getUsers(page?,itemsPerPage?,userParams?,likeParam?):Observable<PaginationResult<User[]>>{
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
    if(userParams === 'Likers'){
      params = params.append('Likers','true');  
    }
    if(userParams === 'Likees'){
      params = params.append('Likees','true');  
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
  sendLike(id:number,recipientId:number){
    return this.http.post(this.baseUrl + id+'/like/'+recipientId,{});
  }
  getMessages(id:number,page?,itemsPerPage?,messageType?):Observable<PaginationResult<Message[]>>{
    const paginationResult :PaginationResult<Message[]> = new PaginationResult<Message[]>();
    let params = new HttpParams();
    params = params.append('MessageType',messageType);
    if(page != null && itemsPerPage != null){
      params = params.append('pageNumber' ,page);
      params = params.append('pageSize',itemsPerPage);
    }
    return this.http.get<Message[]>(this.baseUrl+id+'/messages',{observe:'response',params}).pipe(
      map(response =>{
        paginationResult.result = response.body;
        if(response.headers.get('Pagination') != null){
          debugger
          paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));

        }
        console.log("paginationResult",paginationResult);
        return paginationResult;
      })
    )
  }
  sendMessage(id:number,message:Message){
    return this.http.post(this.baseUrl+id+'/messages',message)
  }
  GetConversation(id:number,recipientId:number){
  return  this.http.get<Message[]>(this.baseUrl+id+'/messages/chat/'+recipientId);
  }
  getUnreadCount(userId){
    return  this.http.get(this.baseUrl+userId+'/messages/count/');
  }
  markAsRead(userId:number,messageId:number){
    return this.http.post(this.baseUrl+userId+'/messages/read/'+messageId,{}).subscribe();
  }
  DeleteMessage(id:number,userId:number){
    return this.http.post(this.baseUrl+userId+'/messages/'+id,{});

  }
}

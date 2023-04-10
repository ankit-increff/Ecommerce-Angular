import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { user, userInfo, usersJson } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  users !: Observable<usersJson>;
  currentUser = new Subject<userInfo>();

  setCurrentUser(user:userInfo){
    this.currentUser.next(user);
  }
  getCurrentUser():Observable<userInfo>{
    return this.currentUser.asObservable();
  }
  
  getUsers() {
    this.users = this.http.get<usersJson>('../../assets/json/users.json');
    return this.users;
  } 
}

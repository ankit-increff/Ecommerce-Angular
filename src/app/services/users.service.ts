import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { USERINFO, USERSJSON } from '../interfaces/user.types';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users !: Observable<USERSJSON>;
  currentUser = new BehaviorSubject<USERINFO>({email: 'guest', name: "Guest" });
  getCurrentUser$ = this.currentUser.asObservable();
  userData !: USERINFO;
  
  constructor(private http: HttpClient) { }

  setCurrentUser(user: USERINFO) {
    this.currentUser.next(user);
    this.userData = user;
  }

  getCurrentUser(): Observable<USERINFO> {
    return this.currentUser.asObservable();
  }

  getUsers() {
    this.users = this.http.get<USERSJSON>('../../assets/json/users.json');
    return this.users;
  }

  logoutHandler() {
    localStorage.removeItem('loggedInUser');
    this.setCurrentUser({name: 'Guest', email:'guest'});
  }
}

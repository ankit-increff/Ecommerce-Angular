import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { userInfo, usersJson } from '../interfaces/user.types';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  users !: Observable<usersJson>;
  currentUser = new BehaviorSubject<userInfo>({email: '0', name: "Guest" });
  getCurrentUser$ = this.currentUser.asObservable();
  userData !: userInfo;

  setCurrentUser(user: userInfo) {
    this.currentUser.next(user);
    this.userData = user;
  }

  getCurrentUser(): Observable<userInfo> {
    return this.currentUser.asObservable();
  }

  getUsers() {
    this.users = this.http.get<usersJson>('../../assets/json/users.json');
    return this.users;
  }

  logoutHandler() {
    localStorage.removeItem('loggedInUser');
    this.setCurrentUser({name: 'Guest', email:'0'});
  }
}

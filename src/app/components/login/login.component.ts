import { Component } from '@angular/core';
import { user, userInfo } from '../../interfaces/user';
import { UsersService } from '../../services/users.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent {
  constructor(private userService: UsersService, private route: Router, private toastService:ToastService) { }

  users !: user[];

  ngOnInit() {
    this.userService.getUsers().subscribe(data => {
      this.users = data.credentials;
    });

    this.userService.getCurrentUser$.subscribe(data => {
      console.warn(data);
      if(data.email!='0') this.route.navigate(['/']);   //handle
    }) 
  }

  loginHandler(data: user) {
    const userWithEmail = this.users.find(user => user.email == data.email);
    if(userWithEmail) {
      if(userWithEmail.password == data.password) {
        let userDetail:userInfo = {
          email: userWithEmail.email,
          name: userWithEmail.name
        }
        localStorage.setItem('loggedInUser', JSON.stringify(userDetail));
        this.userService.setCurrentUser(userDetail);
        this.route.navigate(['/']);
      } else {
        this.toastService.handleError('invalid password')
      }
    } else {
      this.toastService.handleError("invalid email");
    }    
  }

 
}

import { Component } from '@angular/core';
import { USER, USERINFO } from '../../interfaces/user.types';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent {
  users !: USER[];
  
  constructor(private userService: UsersService, private route: Router, private toastService:ToastService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(data => {
      this.users = data?.credentials;
    });

    this.userService.getCurrentUser$.subscribe(data => {
      if(data?.email!='guest') 
      {
        this.route.navigate(['/']); 
        this.toastService.handleSuccess('Already logged in!')
      }
    }) 
  }

  loginHandler(data: USER) {
    const userWithEmail = this.users?.find(user => user?.email == data?.email);
    if(userWithEmail) {
      if(userWithEmail?.password == data?.password) {
        let userDetail:USERINFO = {
          email: userWithEmail?.email,
          name: userWithEmail?.name
        }
        localStorage.setItem('loggedInUser', JSON.stringify(userDetail));
        this.userService.setCurrentUser(userDetail);
        this.route.navigate(['/']);
        this.toastService.handleSuccess('Logged in successfully')
      } else {
        this.toastService.handleError('invalid password')
      }
    } else {
      this.toastService.handleError("invalid email");
    }    
  }
}

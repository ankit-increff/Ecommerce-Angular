import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  userName: string = 'Guest';

  constructor(private usersService: UsersService) {}
  ngOnInit(): void {
    this.usersService.getCurrentUser().subscribe(data => {
      if(data) this.userName = data.name.split(' ')[0];
    })
  }
}

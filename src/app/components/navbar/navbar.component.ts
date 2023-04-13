import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  userName: string = 'Guest';
  cartQuantity: number = 0;


  constructor(private usersService: UsersService, private cartService: CartService) {}
  ngOnInit(): void {
    this.userName = this.usersService.userData.name.split(' ')[0];
    this.usersService.getCurrentUser().subscribe(data => {
      if(data) this.userName = data.name.split(' ')[0];
    })
    this.cartService.totalQuantity.subscribe(data => {
      this.cartQuantity = data;
    })
  }
}

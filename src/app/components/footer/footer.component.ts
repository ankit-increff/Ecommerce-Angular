import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  date = new Date();

  ngOnInit(): void {
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }
}

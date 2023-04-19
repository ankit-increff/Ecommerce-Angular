import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
declare var bootstrap: any;

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {

  constructor(private toastService: ToastService) {}
  message: string = "";

  ngOnInit() {    
    this.toastService.showToast.subscribe(data => {
      this.message = data.message;
      if(data.type == 'success')  {
        const toastElement= document.getElementById('successToast')
        const toast = new bootstrap.Toast(toastElement)
        toast.show()
        
      } else if(data.type == 'error') {
        const toastElement= document.getElementById('errorToast')
        const toast = new bootstrap.Toast(toastElement)
        toast.show()
      }
    })
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
declare var bootstrap: any;

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {

  constructor(private toastService: ToastService) {}
  successMessage: string = "";
  errorMessage: string = "";

  @ViewChild('successToast') successToastRef!: ElementRef
  @ViewChild('errorToast') errorToastRef!: ElementRef

  successToast!:any;
  errorToast!:any;

  ngAfterViewInit() {
    this.successToast = new bootstrap.Toast(this.successToastRef.nativeElement);
    this.errorToast = new bootstrap.Toast(this.errorToastRef.nativeElement);

  }
  ngOnInit() {    
    this.toastService.showToast.subscribe(data => {
      if(data.type == 'success')  {
        this.successMessage = data.message;
        this.errorToast.hide();
        this.successToast.show();
        
      } else if(data.type == 'error') {
        this.errorMessage = data.message;
        this.successToast.hide();
        this.errorToast.show();
      }
    })
  }
}

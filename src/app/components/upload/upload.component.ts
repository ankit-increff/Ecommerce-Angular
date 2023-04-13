import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  constructor() {}

  uploadHandler(input:any) {
    console.log(input);
  }
  submitHandler(input:any) {
    console.log(input);
  }

  previewHandler(input:any) {
    console.log(input);
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UploadService } from '../../providers/upload.service'
import { LoginService } from '../../providers/login.service'
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  flag: Number = 0;




  constructor(private formBuilder: FormBuilder, private uploadService: UploadService, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    
    this.loginService.checkSessionStorage()
    this.loginService.navigateByRole(this.constructor.name)
    this.fileUploadForm = this.formBuilder.group({
      rvsi: [''],
      sp2: ['']

    });


  }



  // function when file is selected
  onFileSelect(event) {

    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length == 2) {
      const file1 = event.target.files[0];
      const file2 = event.target.files[1];
  
      if (!_.includes(af, file1.type || file2.type)) {
        alert('Only EXCEL Docs Allowed!');
      }
      else {
        this.fileUploadForm.get('rvsi').setValue(file1);
        this.fileUploadForm.get('sp2').setValue(file2);
        this.flag = 0;
     
      }
    }
    else {
      this.flag = 1;
    }
  }

  onFormSubmit() {

    if (this.flag == 1) {
      alert("you must choose 2 files")
      return;

    }
    else {
      if (!this.fileUploadForm.get('rvsi').value && !this.fileUploadForm.get('sp2').value) {
        alert('No files selected');
        return false;
      }

      const formData = new FormData();
      formData.append('rvsi', this.fileUploadForm.get('rvsi').value);
      formData.append('sp2', this.fileUploadForm.get('sp2').value)

      this.uploadService.uploadFile(formData).subscribe((res) => {
        console.log(res)
        this.router.navigate(['/report'])
      }, (err) => {
        console.log(err.message);
      })
    }
  }
}
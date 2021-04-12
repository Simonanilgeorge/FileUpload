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
  fl1: any;
  fl2: any;

 

  constructor(private formBuilder: FormBuilder, private uploadService: UploadService, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    
    this.loginService.checkSessionStorage()
    this.loginService.navigateByRole(this.constructor.name)
    this.fileUploadForm = this.formBuilder.group({
      rvsi: [''],
      sp2: ['']

    });
    this.fl1 = null;
    this.fl2 = null;

  }


  // function when file is selected
  onFileSelect(event) {

    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    //console.log(event.target.files.length)
    if (event.target.files.length == 1) {

      if (this.fl1 == null){
        const file1 = event.target.files[0];
        this.fl1 = 1;
        this.fileUploadForm.get('rvsi').setValue(file1);
        
      }
      else if(this.fl1 != null && this.fl2 == null){
        const file2 = event.target.files[0];
        this.fl2 = 1;
        this.fileUploadForm.get('sp2').setValue(file2);
      }
      else{
        alert("Two files has been choosen already. Please click ok to continue.")
        this.onFormSubmit();

      }
    
    }
    else if (event.target.files.length == 2) {
      this.fl1 = 1;
      this.fl2 = 1;
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
      
      alert("More than 2 files has been choosen")
      return false;
    }
  }

  onFormSubmit() {

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
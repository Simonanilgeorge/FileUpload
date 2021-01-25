import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {UploadService} from '../../providers/upload.service'
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

  constructor(private formBuilder: FormBuilder,private uploadService:UploadService) { }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      myfile: ['']
    });
  }

  onFileSelect(event) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // console.log(file);

      if (!_.includes(af, file.type)) {
        alert('Only EXCEL Docs Allowed!');
      } else {
        this.fileInputLabel = file.name;
        this.fileUploadForm.get('myfile').setValue(file);
      }
    }
  }

  onFormSubmit() {

    if (!this.fileUploadForm.get('myfile').value) {
      alert('Please fill valid details!');
      return false;
    }

    const formData = new FormData();
    formData.append('formFile', this.fileUploadForm.get('myfile').value);
    formData.append('agentId', '007');

    this.uploadService.uploadFile(formData).subscribe((res)=>{
      console.log(res);
      if (res.statusCode === 200) {
        // Reset the file input
        this.uploadFileInput.nativeElement.value = "";
        this.fileInputLabel = undefined;
      }
      
    },(err)=>{
      console.log("error");
      

    })
  
  }

}

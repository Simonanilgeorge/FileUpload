import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
      rvsi: [''],
      sp2:['']

    });
  }

  onFileSelect(event) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const  rvsi= event.target.files[0];
      const sp2=event.target.files[1];
      // console.log(file);
      console.log("event.target.files")
      // console.log(event.target.files[1])

      if (!_.includes(af, rvsi.type && sp2.type)) {
        alert('Only EXCEL Docs Allowed!');
      } else {

        console.log("you have selected an excel document");
        
      
        this.fileUploadForm.get('rvsi').setValue(rvsi);
        this.fileUploadForm.get('sp2').setValue(sp2);

        console.log(  this.fileUploadForm.get('rvsi').value)
        console.log(  this.fileUploadForm.get('sp2').value)
      }
    }
  }

  onFormSubmit() {

    // if (!this.fileUploadForm.get('rvsi').value&&!this.fileUploadForm.get('sp2').value) {
    //   alert('Please fill valid details!');
    //   return false;
    // }

    const formData = new FormData();
    

    formData.append('rvsi', this.fileUploadForm.get('rvsi').value);
    formData.append('sp2',this.fileUploadForm.get('sp2').value)


    console.log("FormData")
    console.log(formData)
    // console.log(formData.get('rvsi'));
    // console.log(formData.get('sp2'));
    
    // console.log(this.fileUploadForm.value);
    

    this.uploadService.uploadFile(formData).then((res)=>{
      console.log(res);
      console.log("successful upload")
      
    },(err)=>{
      console.log("error");
      

    })
  
  }

}

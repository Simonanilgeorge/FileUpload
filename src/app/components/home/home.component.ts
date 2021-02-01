import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder,FormControl,Validators} from '@angular/forms';
import {UploadService} from '../../providers/upload.service'
import * as _ from 'lodash';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  myFiles:string [] = [];

  myForm = new FormGroup({
   name: new FormControl('', [Validators.required, Validators.minLength(3)]),
   file: new FormControl('', [Validators.required])
 });
  constructor(private formBuilder: FormBuilder,private uploadService:UploadService) { }

  ngOnInit(): void {

  }
  get f(){
    return this.myForm.controls;
  }

  onFileChange(event) {

        for (var i = 0; i < event.target.files.length; i++) { 
            this.myFiles.push(event.target.files[i]);
        }
  }

  submit(){
    const formData = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) { 
      formData.append("file[]", this.myFiles[i]);
    }

    this.uploadService.uploadFile(formData).subscribe((res)=>{
      console.log(res);
      
    },(err)=>{
      console.log(err.message);
      
    })

    // this.http.post('http://localhost:8001/upload.php', formData)
    //   .subscribe(res => {
    //     console.log(res);
    //     alert('Uploaded Successfully.');
    //   })
  }

}

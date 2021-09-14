import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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


  clicked = false;
  rvsiFileName = "Select rvsi";
  sp2FileName = "Select sp2";
  flag = 0;
  message = "Success";
  toastStatus
  toast: Boolean = false;
  fileUploadForm: FormGroup;
  fileInputLabel: string;

  constructor(private formBuilder: FormBuilder, private uploadService: UploadService, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {

    this.loginService.checkSessionStorage()
    this.loginService.navigateByRole(this.constructor.name)
    this.fileUploadForm = this.formBuilder.group({
      rvsi: ['', Validators.required],
      sp2: ['', Validators.required]
    });
  }

  get rvsi() {
    return this.fileUploadForm.get("rvsi");
  }

  get sp2() {
    return this.fileUploadForm.get("sp2");
  }

  // function when file is selected
  onFileSelect(event, name) {

    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']

    if (!_.includes(af, event.target.files[0].type)) {

      this.toast = true;
      event.target.value = null
      
      this.showToastMessage("Only Excel file allowed !","error")

      return;
    }


    if (name === "rvsi") {

      this.rvsiFileName = event.target.files[0].name;
      this.rvsi.setValue(event.target.files[0]);

    }
    else {
      this.sp2FileName = event.target.files[0].name;
      this.sp2.setValue(event.target.files[0]);
    }

  }

  onFormSubmit() {

    if (this.fileUploadForm.status == "INVALID") {
      this.toast = true;
      this.showToastMessage("Select both the files","warning")
 
      return false;
    }

    this.flag = 1;
    const formData = new FormData();
    formData.append('rvsi', this.rvsi.value);
    formData.append('sp2', this.sp2.value)

    this.uploadService.uploadFile(formData).subscribe((res) => {


      if (res.response != "Invalid file") {
        this.router.navigate(['/report'])
      }

      else {
        this.showToastMessage(res.response,"error");
        this.flag=0;
      }

    }, (err) => {
      console.log(err.message);
    })
  }



  showToastMessage(message,status) {
    this.message = message;
    this.toastStatus=`${status}`
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 3000)
  }


}
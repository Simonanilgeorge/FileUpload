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

  titles:String[]=[];
  datas:any=null;
  div1:boolean=true;
  div2:boolean=false;

  constructor(private formBuilder: FormBuilder,private uploadService:UploadService) { }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      rvsi: [''],
      sp2:['']

    });
    
  }


  reload(){
    window.location.reload();
  }
  divFunction(){
    this.div1=!this.div1;
    this.div2=!this.div2;
    
}

  onFileSelect(event) {
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length > 0) {
      const file1 = event.target.files[0];
      const file2 = event.target.files[1];
      // console.log(file);

      if (!_.includes(af, file1.type && file2.type)) {
        alert('Only EXCEL Docs Allowed!');
        
      } else {
        this.fileUploadForm.get('rvsi').setValue(file1);
        this.fileUploadForm.get('sp2').setValue(file2);
        //console.log(this.fileUploadForm.value);
      }
    }
  }

  

  onFormSubmit() {

    if (!this.fileUploadForm.get('rvsi').value && !this.fileUploadForm.get('sp2').value) {
      alert('Please fill valid details!');
      return false;
    }

    const formData = new FormData();
    formData.append('rvsi', this.fileUploadForm.get('rvsi').value);
    formData.append('sp2',this.fileUploadForm.get('sp2').value)


    this.uploadService.uploadFile(formData).subscribe((res)=>{
      console.log(res);

      this.datas=JSON.parse(res);


      this.datas.forEach((data)=>{
        for(let d in data){
          if(this.titles.includes(d) || d=="Task_Name" || d=="null" || d=="Grand_total"){
            continue;

          }
          else{
            this.titles.push(d)
          }
        }
      })

      this.titles=this.titles.sort();
      this.divFunction();
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
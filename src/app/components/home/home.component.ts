import { Component, OnInit } from '@angular/core';

import * as XLSX from 'xlsx';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  data:[][]
  constructor() { }

  ngOnInit(): void {

  }
  onFileChange(evt:any){
    const target:DataTransfer=<DataTransfer>(evt.target);
    if(target.files.length!=1){
      throw new Error('cannot use multiple files');
      
    }
    const reader:FileReader=new FileReader();
    reader.onload=(e:any)=>{
      const bstr:string=e.target.result;
      const wb:XLSX.WorkBook=XLSX.read(bstr,{type:'binary'});
      const wsname:string=wb.SheetNames[0]
      const ws:XLSX.WorkSheet=wb.Sheets[wsname]
      console.log(ws);
      // To display the data as an array
      this.data=(XLSX.utils.sheet_to_json(ws,{header:1}))

      console.log(this.data);
      
      
    };
    reader.readAsBinaryString(target.files[0]);
  }


}

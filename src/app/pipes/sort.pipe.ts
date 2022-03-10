import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})


export class SortPipe implements PipeTransform {
  flag=false;
  transform(value: any, args:any): any {
    let data=value;

    if(args){
 
    if(this.flag){
      data.sort((a,b)=>{
        if(a[`${args}`]>b[`${args}`]){
          return 1;
        }
        else {
          return -1;
        }
      }) 
    }
    else{
      data.sort((a,b)=>{
        if(a[`${args}`]>b[`${args}`]){
          return -1;
        }
        else {
          return 1;
        }
      }) 
    }
    this.flag=!this.flag;
  }
    return data;
  }

}
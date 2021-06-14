import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'columnsort'
})
export class ColumnsortPipe implements PipeTransform {

  transform(value: any, args:any): any {


    let data = value
    let filteredData = []
  
    filteredData = data.filter((data) => {
    return data.empcode.toLowerCase().includes(args.empcode.toLowerCase()) && data.doj.toLowerCase().includes(args.doj.toLowerCase()) 
    && data.search.toLowerCase().includes(args.search.toLowerCase()) && data.client.toLowerCase().includes(args.client.toLowerCase()) 
    && data.task.toLowerCase().includes(args.task.toLowerCase()) && data.name.toLowerCase().includes(args.name.toLowerCase())
    })
    return filteredData

    }
  
  }
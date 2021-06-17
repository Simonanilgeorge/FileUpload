import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'columnsort'
})
export class ColumnsortPipe implements PipeTransform {

  transform(value: any, args:any): any {

// change emp_code to empcode in python
    let data = value
    let filteredData = []
  
    filteredData = data.filter((data) => {
    return data.empcode.toLowerCase().startsWith(args.empcode.toLowerCase()) && data.doj.toLowerCase().startsWith(args.doj.toLowerCase()) 
    && data.search.toLowerCase().startsWith(args.search.toLowerCase()) && data.client.toLowerCase().startsWith(args.client.toLowerCase()) 
    && data.task.toLowerCase().startsWith(args.task.toLowerCase()) && data.name.toLowerCase().startsWith(args.name.toLowerCase())
    })
    return filteredData

    }
  
  }
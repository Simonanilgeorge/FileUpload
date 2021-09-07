
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'columnsort'
})
export class ColumnsortPipe implements PipeTransform {

  transform(value: any, args:any): any {

// change emp_code to empcode in python
    let filteredData = value
    let keys = Object.keys(args)
    keys.forEach((key)=> {
      // call returnFilteredData function for each key
      filteredData = this.returnFilteredData(filteredData, key, args)
    })

    return filteredData
    }
    
    returnFilteredData(data, key, columnFilter) {
    
      if(columnFilter[key]!=""){
          let filteredData = data.filter((data) => {
            
          return data[key].toLowerCase().startsWith(columnFilter[key].toLowerCase())
      })
      return filteredData
      }
      else{
          return data
      }
  }
  
  }
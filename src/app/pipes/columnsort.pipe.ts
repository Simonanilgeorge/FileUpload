import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'columnsort'
})
export class ColumnsortPipe implements PipeTransform {

  transform(value: any, args:any): any {


    console.log("value")
    console.log(value)
    console.log("args")
    console.log(args)
    // let newDate
    // if (args.date != ""){
    // var datePipe = new DatePipe("en-US");
    // newDate = datePipe.transform(args.date, 'dd-MM-yyyy');
    // }
    // else{
    //   newDate = ""
    // }
    // let data = value
    // let filteredData = []
  
    // filteredData = data.filter((data) => {
    // return data.order_number.includes(args.orderNumber) && data.date.includes(newDate) && data.status.includes(args.status)
    // && data.Client.includes(args.Client) && data.Task.includes(args.Task) && data.Process.includes(args.Process)
    // })
    // return filteredData
    }
  
  }
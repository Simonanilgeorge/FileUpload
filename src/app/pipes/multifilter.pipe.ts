import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
name: 'multifilter'
})
export class MultifilterPipe implements PipeTransform {

transform(value: any, args:any): any {



  let newDate
  if (args.date != ""){
  var datePipe = new DatePipe("en-US");
  newDate = datePipe.transform(args.date, 'dd-MM-yyyy');
  }
  else{
    newDate = ""
  }
  let data = value
  let filteredData = []


  filteredData = data.filter((data) => {
  return data.order_number.toLowerCase().startsWith(args.orderNumber.toString().toLowerCase()) && data.date.includes(newDate) && data.status.includes(args.status)
  && data.client.includes(args.client) && data.task.includes(args.task) && data.process.includes(args.process)
  })

  return filteredData
  }

}
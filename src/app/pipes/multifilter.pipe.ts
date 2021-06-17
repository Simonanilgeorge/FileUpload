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
  return data.order_number.toLowerCase().startsWith(args.orderNumber.toLowerCase()) && data.date.startsWith(newDate) && data.status.startsWith(args.status)
  && data.Client.startsWith(args.Client) && data.Task.startsWith(args.Task) && data.Process.startsWith(args.Process)
  })
  return filteredData
  }

}
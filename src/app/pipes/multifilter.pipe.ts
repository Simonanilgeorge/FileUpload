import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
name: 'multifilter'
})
export class MultifilterPipe implements PipeTransform {

transform(value: any, args:any): any {

let data = value
let filteredData = []

filteredData = data.filter((data) => {
return data.order_number.includes(args.orderNumber) && data.date.includes(args.date) && data.status.includes(args.status)
&& data.Client.includes(args.Client) && data.Task.includes(args.Task) && data.Process.includes(args.Process)
})

return filteredData
}

}
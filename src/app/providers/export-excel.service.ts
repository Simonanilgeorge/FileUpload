import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx'; 

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }



  exportToExcel(element,fileName){
    
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element,{dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
    
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }
  
}

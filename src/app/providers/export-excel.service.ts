import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx'; 
// import XLSX from 'sheetjs-style'; 

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
    ws['!rows'][0] = { hidden: true };
    
    XLSX.writeFile(wb, fileName);
  }
  
}

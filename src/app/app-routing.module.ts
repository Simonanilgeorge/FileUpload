import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component'
import {LoginComponent} from './components/login/login.component'
import {LandingPageComponent} from './components/landing-page/landing-page.component'
import {FileReportComponent} from './components/file-report/file-report.component'
import {EmployeesendreportComponent} from './components/employeesendreport/employeesendreport.component';
import {EmployeeReportComponent} from './components/employee-report/employee-report.component';
import {OrderListComponent} from './components/order-list/order-list.component';
// import {TableComponent} from './components/table/table.component'
import {MonthlyReportComponent} from './components/monthly-report/monthly-report.component';
import {ClientReportComponent} from './components/client-report/client-report.component';
import {AddEmployeeComponent} from './components/add-employee/add-employee.component';
import {ViewEmployeeComponent} from './components/view-employee/view-employee.component';
import {YearlyClientReportComponent} from './components/yearly-client-report/yearly-client-report.component'
import { from } from 'rxjs';


const routes: Routes = [
{path:'',pathMatch:'full',component: LoginComponent},
{path:'addemployee',component: AddEmployeeComponent},
{path:'viewemployees',component: ViewEmployeeComponent},

{path:'clientreport',component: ClientReportComponent},
{path:'monthlyreport',component:MonthlyReportComponent},
{path:'home',component:LandingPageComponent},
{path:'upload',component:HomeComponent},
{path:'report',component:FileReportComponent},
{path:'sendreport',component:EmployeesendreportComponent},
// {path:'sendreport/:id',component:EmployeesendreportComponent},
{path:'viewmystatus',component:OrderListComponent},
{path:'viewreport',component:EmployeeReportComponent},
{path:'viewyearlyreport',component:EmployeeReportComponent},
{path:'yearlyclientreport',component:YearlyClientReportComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

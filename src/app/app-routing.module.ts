import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component'
import {LoginComponent} from './components/login/login.component'
import {LandingPageComponent} from './components/landing-page/landing-page.component'
import {FileReportComponent} from './components/file-report/file-report.component'
import {EmployeesendreportComponent} from './components/employeesendreport/employeesendreport.component';
import {EmployeeReportComponent} from './components/employee-report/employee-report.component';
const routes: Routes = [


{path:'',pathMatch:'full',component: LoginComponent},
{path:'home',component:LandingPageComponent},
{path:'upload',component:HomeComponent},
{path:'report',component:FileReportComponent},
{path:'sendreport',component:EmployeesendreportComponent},
{path:'viewreport',component:EmployeeReportComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

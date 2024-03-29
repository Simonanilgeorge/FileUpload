import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './services/token-interceptor.service';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FileReportComponent } from './components/file-report/file-report.component';
import { EmployeesendreportComponent } from './components/employeesendreport/employeesendreport.component';
import { EmployeeReportComponent } from './components/employee-report/employee-report.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderListComponent } from './components/order-list/order-list.component';
import { TableComponent } from './components/table/table.component';
import { ToastComponent } from './components/toast/toast.component';
import { MonthlyReportComponent } from './components/monthly-report/monthly-report.component';
import { ClientReportComponent } from './components/client-report/client-report.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './components/view-employee/view-employee.component';
import { SortPipe } from './pipes/sort.pipe';
import { MultifilterPipe } from './pipes/multifilter.pipe';
import { ColumnsortPipe } from './pipes/columnsort.pipe';
import { YearlyClientReportComponent } from './components/yearly-client-report/yearly-client-report.component';
import { YearlyEmployeeReportComponent } from './components/yearly-employee-report/yearly-employee-report.component';
import { HelpComponent } from './components/help/help.component';
import { AddRoleComponent } from './components/add-role/add-role.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { IncentiveReportComponent } from './components/incentive-report/incentive-report.component';
import { DropdownSearchComponent } from './components/dropdown-search/dropdown-search.component';
import { TargetTableComponent } from './components/target-table/target-table.component';
import { AddTargetComponent } from './components/add-target/add-target.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LandingPageComponent,
    NavbarComponent,
    FileReportComponent,
    EmployeesendreportComponent,
    EmployeeReportComponent,
    OrderListComponent,
    TableComponent,
    ToastComponent,
    MonthlyReportComponent,
    ClientReportComponent,
    AddEmployeeComponent,
    ViewEmployeeComponent,
    SortPipe,
    MultifilterPipe,
    ColumnsortPipe,
    YearlyClientReportComponent,
    YearlyEmployeeReportComponent,
    HelpComponent,
    AddRoleComponent,
    ResetPasswordComponent,
    DropdownComponent,
    IncentiveReportComponent,
    DropdownSearchComponent,
    TargetTableComponent,
    AddTargetComponent,


  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SearchPipeModule
    // RouterModule
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptorService,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

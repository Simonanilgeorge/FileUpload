import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FileReportComponent } from './components/file-report/file-report.component';
import { EmployeesendreportComponent } from './components/employeesendreport/employeesendreport.component';
import { EmployeeReportComponent } from './components/employee-report/employee-report.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LandingPageComponent,
    NavbarComponent,
    FileReportComponent,
    EmployeesendreportComponent,
    EmployeeReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

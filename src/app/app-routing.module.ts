import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component'
import {LoginComponent} from './components/login/login.component'
import {LandingPageComponent} from './components/landing-page/landing-page.component'
import {FileReportComponent} from './components/file-report/file-report.component'
const routes: Routes = [


{path:'',pathMatch:'full',component: LoginComponent},
{path:'home',component:LandingPageComponent},
{path:'upload',component:HomeComponent},
{path:'report',component:FileReportComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

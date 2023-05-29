import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';
import { DataTablesModule } from 'angular-datatables'; 
import { AdminpanelRoutingModule } from './adminpanel-routing.module';
import { AdminNavbarComponent } from 'src/app/partials/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from 'src/app/partials/admin-sidebar/admin-sidebar.component';
import { AgentsComponent } from './agents/agents.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { SettingsComponent } from './settings/settings.component';
import { SubUsersComponent } from './sub-users/sub-users.component';
import { TelantDetailComponent } from './telant-detail/telant-detail.component';
import { TelantListComponent} from './telant-list/telant-list.component';
import { ApplicantListComponent } from './applicant-list/applicant-list.component';
import { MatTableModule,MatSortModule,MatFormFieldModule,MatInputModule,MatPaginatorModule, MatDialogModule , } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { CreditsLedgerComponent } from './credits-ledger/credits-ledger.component';
import { CreditsListComponent } from './credits-list/credits-list.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { JobSummaryComponent } from './job-summary/job-summary.component';
import { JobAdsComponent } from './job-ads/job-ads.component';
import { VideoApproveComponent } from './video-approve/video-approve.component';
import { SafePipee } from '../provider/auth.service';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {DatePipe} from '@angular/common';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { EmploymentHistoryComponent } from './employment-history/employment-history.component';

@NgModule({
  declarations: [
    AdminNavbarComponent,
    AdminSidebarComponent,
    AgentsComponent, 
    CompanyListComponent, 
    EmployeeListComponent, 
    SettingsComponent, 
    SubUsersComponent, 
    TelantDetailComponent,
    TelantListComponent,
    ApplicantListComponent,
    CreditsLedgerComponent,
    CreditsListComponent,
    JobSummaryComponent,
    JobAdsComponent,
    VideoApproveComponent,
    SafePipee,
    AnnouncementComponent,

    AddAnnouncementComponent,

    EmploymentHistoryComponent
    ],
 
  imports: [
    CommonModule,
    ChartsModule,
    AdminpanelRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    MatDialogModule,
    NgbModule,
    Ng5SliderModule,
    DataTablesModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule ,
    MatSelectModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
  
    
  ],
  providers: [DatePipe],
})
export class AdminpanelModule { }

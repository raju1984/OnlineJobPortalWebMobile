import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentsComponent } from './agents/agents.component';
import { ApplicantListComponent } from './applicant-list/applicant-list.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { SettingsComponent } from './settings/settings.component';
import { SubUsersComponent } from './sub-users/sub-users.component';
import { TelantDetailComponent } from './telant-detail/telant-detail.component';
import { TelantListComponent } from './telant-list/telant-list.component';
import { CreditsListComponent } from './credits-list/credits-list.component';
import { CreditsLedgerComponent } from './credits-ledger/credits-ledger.component';
import { JobSummaryComponent } from './job-summary/job-summary.component';
import { JobAdsComponent } from './job-ads/job-ads.component';
import { VideoApproveComponent } from './video-approve/video-approve.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { EmploymentHistoryComponent } from './employment-history/employment-history.component';
const routes: Routes = [
  {
    path: "agentlist",
    component: AgentsComponent,
    pathMatch: "full"
  },
{
  path: "credits",
  component: CreditsListComponent,
  pathMatch: "full"

},
{
  path: "creditsledger",
  component: CreditsLedgerComponent,
  pathMatch: "full"

},
  {
    path: "matching",
    component: ApplicantListComponent,
    pathMatch: "full"
  },
  {
    path: "companylist",
    component: CompanyListComponent,
    pathMatch: "full"
  },
   {
    path: "employeelist",
    component: EmployeeListComponent,
    pathMatch: "full"
  },
  {
    path: "settings",
    component: SettingsComponent,
    pathMatch: "full"
  },
  {
    path: "subusers",
    component: SubUsersComponent,
    pathMatch: "full"
  },
  {
    path: "telantdetail",
    component: TelantDetailComponent,
    pathMatch: "full"
  },
  {
    path: "telantlist",
    component: TelantListComponent,
    pathMatch: "full"
  },
  {
    path: "jobsummary",
    component: JobSummaryComponent,
    pathMatch: "full"
  },
  {
    path: "jobads",
    component: JobAdsComponent,
    pathMatch: "full"
  },
  {
    path: "viewvideo",
    component: VideoApproveComponent,
    pathMatch: "full"
    
  },{
    path: "announcements",
    component: AnnouncementComponent,
    pathMatch: "full"
    
  },
  {
    path: "addannouncements",
    component: AddAnnouncementComponent,
    pathMatch: "full"
  },
  {
    path: "employmentHistory",
    component: EmploymentHistoryComponent,
    pathMatch: "full"
    
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminpanelRoutingModule { }


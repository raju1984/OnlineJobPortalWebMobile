import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyCultureComponent } from './company-culture/company-culture.component';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditCompanyProfileComponent } from './edit-company-profile/edit-company-profile.component';
import { ReviewComponent } from './review/review.component';
import { SummaryComponent } from './summary/summary.component';
import { CompanyCultureStartComponent } from './company-culture-start/company-culture-start.component';
import { CompanyCreditLedgerComponent } from './company-credit-ledger/company-credit-ledger.component';
const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    pathMatch: "full"
  },
  {
    path: "company_culture",
    component: CompanyCultureStartComponent,
    pathMatch: "full"
  },
  {
    path: "companyculture",
    component: CompanyCultureComponent,
    pathMatch: "full"
  },
  {
    path: "talentprofile",
    component: TalentProfileComponent,
    pathMatch: "full"
  },
  {
    path: "changepassword",
    component: ChangePasswordComponent,
    pathMatch: "full"
  },
  {
    path: "editprofile",
    component: EditProfileComponent,
    pathMatch: "full"

  },
  {
    path: "editcompanyprofile",
    component: EditCompanyProfileComponent,
    pathMatch: "full"

  }, 
  {
    path: "review",
    component: ReviewComponent,
    pathMatch: "full"
  },
  {
    path: "summary",
    component: SummaryComponent,
    pathMatch: "full"
  },
  {
    path: "reviewcreditbalance",
    component: CompanyCreditLedgerComponent,
    pathMatch: "full"

  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

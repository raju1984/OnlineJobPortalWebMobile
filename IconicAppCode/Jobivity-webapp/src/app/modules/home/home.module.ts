import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavComponent } from '../../partials/nav/nav.component';
import { SidenavComponent } from '../../partials/sidenav/sidenav.component';
import { AuthService, AssetPipe, AssetsC,SafePipe,DateTimeFormatPipe } from '../provider/auth.service';
import { CompanyCultureComponent } from './company-culture/company-culture.component';
import { TalentProfileComponent } from './talent-profile/talent-profile.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditCompanyProfileComponent } from './edit-company-profile/edit-company-profile.component';
import { DataTablesModule } from 'angular-datatables';
import { ReviewComponent } from './review/review.component';
import { SummaryComponent } from './summary/summary.component';
import { CompanyCultureStartComponent } from './company-culture-start/company-culture-start.component';
import { CompanyCreditLedgerComponent } from './company-credit-ledger/company-credit-ledger.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ImageCropperModule } from 'ngx-image-cropper';
import {DatePipe} from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatTableModule,MatSortModule,MatFormFieldModule,MatInputModule,MatPaginatorModule, MatSelectModule } from '@angular/material';

@NgModule({
  declarations: [
    DashboardComponent,
    NavComponent,
    SidenavComponent,
    CompanyCultureComponent,
    TalentProfileComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    EditCompanyProfileComponent,
    AssetsC,
    SafePipe,
    DateTimeFormatPipe,
    ReviewComponent,
    SummaryComponent,
    CompanyCultureStartComponent,
    CompanyCreditLedgerComponent
   
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule ,
    MatSelectModule,
    NgbModule,
    Ng5SliderModule,
    DataTablesModule,
    NgxPaginationModule,
    ImageCropperModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [AuthService, AssetPipe,DatePipe]
})
export class HomeModule { }

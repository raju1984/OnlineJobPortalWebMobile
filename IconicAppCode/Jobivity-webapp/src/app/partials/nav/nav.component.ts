import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AssetPipe } from 'src/app/modules/provider/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent implements OnInit {
  // variable Declaration
  url: string;
  name: string;
  isapprove: string;
  flag: boolean = false;
  companyName: string;
  isCredeit: boolean = false;
 // companyName: string;
  emailVerified:any;
  jobCount:any;
  api_key:string;
  totalCredit:number;

  constructor(public route: Router, public auth: AuthService, public Piper: AssetPipe) { 
    this.api_key = this.auth.getToken();
    this.checkVerifyUser();
    this.finalCredit();
  }
 
  ngOnInit() {
    this.name = this.auth.getName();
    this.companyName = this.auth.getCompanyName();
    this.isapprove = this.auth.getIsApproveName();
    this.url = this.Piper.transform("/images/logo-white.png");
    if (this.isapprove == "0") {
      this.flag = false;
    }
    else {
      this.flag = true;
    }
  }
  checkVerifyUser(){
    this.auth.checkCompanyVerify(this.api_key).subscribe(res => {
      this.emailVerified = res['email_verified'];
      this.jobCount = res['job_count'];
      if(this.emailVerified == 1 &&  this.jobCount > 0){
        this.isCredeit = true;
      }
    });
  }
  finalCredit(){
    this.auth.getFinalCredit(this.api_key).subscribe(res => {
      if(res['balance'] == null){
        this.totalCredit = 0;
      }else{
        this.totalCredit = res['balance'];
      }
     
    });
  }
  LogOut() {
    this.auth.logout();
    this.route.navigate(["/auth/login"])
  }
  changePassword() {
    this.route.navigate(["/home/changepassword"])
  }

  onIconClick() {
    this.route.navigate(["/home/dashboard"])
  }
  editProfile() {
    this.route.navigate(["/home/editprofile"])
  }
  editCompanyProfile() {
    this.route.navigate(["/home/editcompanyprofile"])
  }
  reviewCredit(){
    this.route.navigate(["/home/reviewcreditbalance"]);
  }
}

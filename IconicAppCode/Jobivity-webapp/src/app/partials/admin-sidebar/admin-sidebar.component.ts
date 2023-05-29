import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AssetPipe } from 'src/app/modules/provider/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

  constructor(public route: Router, public auth: AuthService, public Piper: AssetPipe) { }
  url: string;
  role:any;
  ngOnInit() {
    this.url = this.Piper.transform("/images/icon.png");
    this.role = localStorage.getItem('role');
    console.log(this.role);
  }

  LogOut() {
    this.auth.logout();
    this.route.navigate(["/auth/adminlogin"])
  }
  Users(){
    this.route.navigate(["/admin/subusers"]);
  }
}

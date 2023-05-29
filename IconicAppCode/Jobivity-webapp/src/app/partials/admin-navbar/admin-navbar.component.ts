import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AssetPipe } from 'src/app/modules/provider/auth.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {

  constructor(public route: Router, public auth: AuthService, public Piper: AssetPipe) { }
  url: string;
  ngOnInit() {
    this.url = this.Piper.transform("/images/logo-white.png");
  }
  onIconClick() {
    this.route.navigate(["/admin/companylist"])
  }
}

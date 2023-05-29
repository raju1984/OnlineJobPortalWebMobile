import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/provider/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(public route: Router, public auth: AuthService) { }

  ngOnInit() {
  }

  LogOut() {
    this.auth.logout();
    this.route.navigate(["/auth/login"])
  }
  




}

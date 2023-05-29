import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-culture-start',
  templateUrl: './company-culture-start.component.html',
  styleUrls: ['./company-culture-start.component.css']
})
export class CompanyCultureStartComponent implements OnInit {

  constructor(public route: Router,) { }

  ngOnInit() {
    
  }
  //Rediect to Company Culture Page
  getstart() {
    this.route.navigate(["/home/companyculture"]);
  }

}



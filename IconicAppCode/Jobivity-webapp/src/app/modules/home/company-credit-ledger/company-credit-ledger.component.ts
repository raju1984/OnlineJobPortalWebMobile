import { Component, OnInit } from '@angular/core';
import { CreditLedgerList } from 'src/Provider/Comman/Comman';
import { AuthService } from '../../provider/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-company-credit-ledger',
  templateUrl: './company-credit-ledger.component.html',
  styleUrls: ['./company-credit-ledger.component.css'],
  providers: [Title]
})

export class CompanyCreditLedgerComponent implements OnInit {
  // Variable Declaration
  api_key:string;
  listCount:number;
  creditLedgerList:CreditLedgerList[];
  math = Math;
  page:number;
  collection = [];
  p:any;
  countArray: Array<{index: number}> = []; 
  constructor(public auth: AuthService,private spinner: NgxSpinnerService,
    private title: Title) { 
      this.title.setTitle(' Jobtiviti -Credits ledger');
      this.api_key = this.auth.getToken();
    }

  ngOnInit() {
    this.page = 1;
    this.getCreditLedgerListByid(this.page);
  }
  
   // List Of All Company Credit Ledger 
   getCreditLedgerList(page:number){
    this.spinner.show();
    this.auth.getCreditLedgerById(this.api_key,page).subscribe(res => {
      this.spinner.hide();  
       let listCount =  res["count"];
       //let listCount = 81;
      if(listCount > 20){
        let count = listCount / 20;
        let dataCount = this.math.ceil(count);
        for(let i= 1; i <= dataCount;i++){
          this.countArray.push({ index: i});
        } 
      }
      else{
        this.countArray.push({index:1})
      }
      this.creditLedgerList = res["data"];
      console.log(this.creditLedgerList);
    })
   
  }
  getCreditLedgerListByid(page:number){
    this.auth.getCreditLedgerById(this.api_key,page).subscribe(res => {
      this.spinner.hide();    
      this.creditLedgerList = res["data"];
    })
  }
  

}



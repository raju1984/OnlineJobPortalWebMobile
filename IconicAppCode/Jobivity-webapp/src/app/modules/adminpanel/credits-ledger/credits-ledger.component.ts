import { Component, OnInit,ElementRef ,ViewChild} from '@angular/core';
import { CreditLedger,CreditLedgerList } from 'src/Provider/Comman/Comman';
import { FormBuilder, FormControl, Validators, FormGroup ,AbstractControl} from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';
import { AuthService } from '../../provider/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-credits-ledger',
  templateUrl: './credits-ledger.component.html',
  styleUrls: ['./credits-ledger.component.css'],
  providers: [Title]
})


export class CreditsLedgerComponent implements OnInit {
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  // Variable Declaration
  api_key:string;
  CreditForm: FormGroup;
  submitted = false;
  company_id:number;
  companyName:string;
  creditLedgerList:CreditLedgerList[];
  message:string;
  p:any;
  constructor(public formBuilder: FormBuilder,public auth: AuthService,public route: Router,private spinner: NgxSpinnerService,
    private title: Title, private aroute: ActivatedRoute,) { 
      this.title.setTitle(' Jobtiviti - Credit Ledger');
      this.api_key = this.auth.getToken();
      // Form Validation
      this.CreditForm = this.formBuilder.group(
        {   
          descriptions: new FormControl("",Validators.compose([Validators.required])),
          balance: new FormControl("",Validators.compose([Validators.required,Validators.pattern("^[0-9]*$")])),
          balancetype: new FormControl("",Validators.compose([Validators.required])),
        });
       
    }

  ngOnInit() {
    this.aroute.queryParams
    .subscribe(params => {
      this.company_id = params["Id"];
      this.companyName = params["Name"];
    });
    this.getCreditLedgerList();
  }

  get f() { return this.CreditForm.controls; }
  // Add Credit Ladger
  submitForm(){
    this.submitted = true;
    if (this.CreditForm.invalid) {
      return;
    }
    let creditsledger: CreditLedger = {
      api_token: this.api_key,
      descriptions: this.CreditForm.value.descriptions,
      balance: this.CreditForm.value.balance,
      balancetype: this.CreditForm.value.balancetype,
      company_id:this.company_id,
    }
    this.auth.addCreditLedger(creditsledger).subscribe(res => {
       this.message = res['status'];
       this.CreditForm.reset()
        this.submitted = false;
       this.getCreditLedgerList();
    }); 
  }
  
  // List Credit Ledger
  getCreditLedgerList(){
    this.spinner.show();
    this.auth.getCreditLedgerlist(this.api_key, this.company_id).subscribe(res => {
      this.spinner.hide();   
      this.creditLedgerList = res;
    })
   
  }
  backbutton() {
    this.route.navigate(["/admin/credits"]);
  }
  discardCard(){
    this.CreditForm.reset()
    this.submitted = false;
    this.message= "";
  }
}

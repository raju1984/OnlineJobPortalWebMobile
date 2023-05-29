import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../provider/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { employeeList, UpdateCompanyData,Department, states,countryClas, JobAddsList,TalentProfilList,industries, category, employeeData, uploadCertificate } from 'src/Provider/Comman/Comman';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormControl, Validators, FormGroup ,AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  providers: [Title]
})

export class EmployeeListComponent implements OnInit {
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  // Variable declare
  api_key: string;
  employeeList: employeeList[];
  talentProfileList:TalentProfilList[];
  jobAdsList:JobAddsList[];
  DepartmentList: Department[] = [];
  department_name:string;
  //adminList:any;
  submitted = false;
  EditCompanyForm: FormGroup;
  company_id: number;
  companyName: string;
  tabStatus:string;
  updateCompany: UpdateCompanyData;
  StateList: states[];
  IndustryList: industries[];
  categoryList: category[];
  website: string;
  address1: string;
  address2: string;
  area:any; 
  Postcode:any; 
  country:any;
  name: any;
  email: any;
  contact: any;
  category_type: number = 0;
  registration_no: string;
  SelectedCompany: string = "Select Company";
  SizeOfCompany: string;
  state: number = 0;
  Industry: number = 0;
  Id: number;
  categoryName: string;
  message: string;
  countrylist: countryClas[];
  adminList: employeeData={
    id: 0,
    name: "",
    email:"",
    is_verified: 0,
    contact:"",
    company_id: 0,
    email_verified: 0,
  };
  certificate:File=null;
  certificate_url:string;
  certificate_name:string;
  certificateView:boolean;
  comId:any;
  com_id:any;
  comp_logo:any;
  constructor(public auth: AuthService, public route: Router, public formBuilder: FormBuilder,private spinner: NgxSpinnerService, private aroute: ActivatedRoute,
    private title: Title) {
    this.api_key = this.auth.getToken();
    this.title.setTitle(' Jobtiviti - Employee List');
    // Form Validation
    this.EditCompanyForm = this.formBuilder.group(
      {   
        CompanyRegistrationNumber: new FormControl("",Validators.compose([Validators.required])),
        companyName: new FormControl("",Validators.compose([Validators.required])),
        CompanyAddress: new FormControl("",Validators.compose([Validators.required])),
        CompanyAddress1: new FormControl(""),
        area: new FormControl("",Validators.compose([Validators.required])),
        Postcode: new FormControl("",Validators.compose([Validators.required])),
        country: new FormControl("",Validators.compose([Validators.required])),
        state: new FormControl("",Validators.compose([Validators.required])),
        CompanyWebsite: new FormControl(""),
        job_position:new FormControl("",Validators.compose([Validators.required])),
        Industry: new FormControl("",Validators.compose([Validators.required])),
        SizeOfCompany: new FormControl("",Validators.compose([Validators.required])),
        category_type: new FormControl("",Validators.compose([Validators.required])),
        name: new FormControl("",Validators.compose([Validators.required])),
        email: new FormControl("",Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),  
        contact: new FormControl("",Validators.compose([Validators.required])),
    });
  }

  get f() { return this.EditCompanyForm.controls; }

  ngOnInit() {
    this.aroute.queryParams
      .subscribe(params => {
        this.company_id = params["Id"];
        this.companyName = params["Name"];
        this.tabStatus = params["Type"];
        this.getemployeeList();
        this.getComAdminList();
        this.getDepartment();
        this.ondetailclick(params["Id"]);
        this.GetStateList();
        this.GetIndustryList();
      });
      this.GetCountryList();
  }
 
  // Get All Company Employee List
  getemployeeList() {
    this.spinner.show();
    this.auth.getEmployeelist(this.api_key, this.company_id).subscribe(res => {
      console.log(res);
      this.spinner.hide();
      this.employeeList = res[0];
    })
  }

  // Get Company admin
  getComAdminList(){
    this.auth.getComAdminlist(this.api_key, this.company_id).subscribe(res => {
      this.adminList = res[0];
    })
  }

  // Get Department List
  getDepartment() {
    this.auth.getDepartment().subscribe(x => {
      this.DepartmentList = x;
    });
  }
 
   // Get Company Talent Profiles
   getTalentProfileList(){
    this.auth.getComTalentProfilelist(this.api_key, this.company_id).subscribe(res => {
     this.talentProfileList = res;
     this.talentProfileList.forEach(x => {
     this.DepartmentList.forEach(m => {
     if (m.id == x.department_id) {
        x["department_name"] =  m.department_name;
      }
     });
  });
    })
  }

   // Get Job Ads 
   getJobAdsList(){
    this.auth.getComJobAdslist(this.api_key, this.company_id).subscribe(res => {
     this.jobAdsList = res;
     this.jobAdsList.forEach(x => {
     this.DepartmentList.forEach(m => {
     if (m.id == x.department_id) {
        x["department_name"] =  m.department_name;
      }
     });
  });
    })
  }


  // Click on Back(Cross) Button
  backbutton() {
    this.route.navigate(["/admin/companylist"], { queryParams: { active:  this.tabStatus } });
  }

 // Get Country List
  GetCountryList() {
    this.auth.getCountryList().subscribe(x => {
      this.countrylist = x;
    });
  }

  // Get Category List
  GetCategoryList() {
    this.auth.getCompCategoryList().subscribe(x => {
      this.categoryList = x;
      x.forEach(y => {
        if (y.value == this.category_type) {
          this.categoryName = y.text;
      }
      }) 
    });
  }

  // Get State List
  GetStateList() {
    this.auth.getState().subscribe(x => {
      this.StateList = x;
    });
  }
  
  // Get Industry List
  GetIndustryList() {
    this.auth.getIndustries().subscribe(x => {
      this.IndustryList = x;
    });
  }

  // Set Company detail when update Company
  ondetailclick(id: string) {
    this.comId = id;
    this.message = "";
    this.certificateView = true;
    this.getUploadCer();
    this.auth.companyDetail(this.api_key, id).subscribe(x => {
      if (x['status'] == "success") {
        this.comp_logo = x["comlogo"];
        this.Id = x["data"].id;
        this.address1 = x["addressdata"].address1;
        this.website = x["data"].website;
        console.log( this.website);
        this.category_type = x["data"].category_type;
        this.SizeOfCompany = x["data"].size_of_company;
        this.registration_no = x["data"].registration_no == "0" ? "" : x["data"].registration_no;
        this.EditCompanyForm.controls['CompanyRegistrationNumber'].setValue(x["data"].registration_no);
        this.EditCompanyForm.controls['companyName'].setValue(x["data"].company_name);
        this.EditCompanyForm.controls['CompanyAddress'].setValue(x["addressdata"].address1);
        this.EditCompanyForm.controls['CompanyAddress1'].setValue(x["addressdata"].address2);
        this.EditCompanyForm.controls['area'].setValue(x["addressdata"].area);
        this.EditCompanyForm.controls['Postcode'].setValue(x["addressdata"].postal_code);
        this.EditCompanyForm.controls['country'].setValue( x["addressdata"].country_id);
        this.EditCompanyForm.controls['state'].setValue( x["addressdata"].state_id);
        this.EditCompanyForm.controls['CompanyWebsite'].setValue( x["data"].website);
        this.EditCompanyForm.controls['job_position'].setValue( x["user"].job_position);
        this.EditCompanyForm.controls['SizeOfCompany'].setValue(x["data"].size_of_company);
        this.EditCompanyForm.controls['Industry'].setValue(x["data"].industry);
        this.EditCompanyForm.controls['category_type'].setValue( x["data"].category_type);
        this.EditCompanyForm.controls['name'].setValue( x["user"].name);
        this.EditCompanyForm.controls['email'].setValue( x["user"].email);
        this.EditCompanyForm.controls['contact'].setValue(x["user"].contact);
        this.GetCategoryList();
      }
    });
  }

  // Update Company
  updateCompanyData(){
    this.submitted = true;
    if (this.EditCompanyForm.invalid) {
      return;
    }
    this.updateCompany = {
      api_token: this.api_key,
      company_name: this.EditCompanyForm.value.companyName,
      id: this.Id,
      industry: this.EditCompanyForm.value.Industry,
      size_of_company:  this.EditCompanyForm.value.SizeOfCompany,
      state: this.EditCompanyForm.value.state,
      website: this.EditCompanyForm.value.CompanyWebsite,
      job_position: this.EditCompanyForm.value.job_position,
      address1: this.EditCompanyForm.value.CompanyAddress,
      address2: this.EditCompanyForm.value.CompanyAddress1,
      area: this.EditCompanyForm.value.area,
      Postcode:this.EditCompanyForm.value.Postcode,
      country:this.EditCompanyForm.value.country,
      name: this.EditCompanyForm.value.name,
      email:this.EditCompanyForm.value.email,
      contact:this.EditCompanyForm.value.contact,
      category_type: this.EditCompanyForm.value.category_type,
      registration_no: this.EditCompanyForm.value.CompanyRegistrationNumber,
    }
      this.spinner.show();
      this.auth.updateCompany(this.updateCompany).subscribe(res => {
        this.spinner.hide();
        debugger;
        if (res["status"] == "success") {
          this.message = "Company updated";
          this.closeAddExpenseModal.nativeElement.click();
        }
      })
  }
  sendVerifyMail(id){
    this.auth.sendUserVerifyMail(this.api_key, id).subscribe(res => {
      if (res["status"] == "success") {
      console.log(res["message"]);
      }
    })
    
  }
  getUploadCer(){
   
    let gewCMM: uploadCertificate = {
      token: this.api_key,
      com_id:  this.comId
    }
   
    this.auth.getCMMCertificate(gewCMM).subscribe(res => {
      if (res['code'] === 200) {
         this.certificate_url = res['certificate_url'];
         this.certificate_name = res['certificate'];
         if(this.certificate_name == undefined){
           this.certificateView = false;
         }
      
      }
    });
    
   }
    // Uploading SSM Certificate
    uploadSsm(event) {
      this.certificate = <File>event.target.files[0];
      console.log(this.certificate);
      this.uploadCertificate();
   }
   
   uploadCertificate(){
     this.spinner.show();
     this.com_id = this.comId ;
     const fd = new FormData();
     fd.append('image', this.certificate);
     fd.append('com_id', this.com_id ); 
     this.auth.uploadCMMCertificate(fd).subscribe(res => {  
       this.getUploadCer(); 
       this.spinner.hide();
       this.certificateView = true;
      
    });
    
    }
 
}

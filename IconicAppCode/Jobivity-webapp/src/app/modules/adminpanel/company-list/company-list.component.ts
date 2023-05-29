import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { companyList, poststringcompany, countryClas,states, industries, category, UpdateCompanyData, AddComment, GetComment, editCompanyProfile, uploadCertificate } from 'src/Provider/Comman/Comman';
import { AuthService } from '../../provider/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
  providers: [Title]
})

export class CompanyListComponent implements OnInit {
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Variable declare
  submitted = false;
  EditCompanyForm: FormGroup;
  api_key: string;
  mapPathUrl: any;
  companyList: companyList[] = [];
  activeCompanylist: companyList[];
  rejectCompanylist:companyList[];
  newCompanylist: companyList[];
  countrylist: countryClas[]
  search: string;
  type: number;
  activesearch: string;
  rejectsearch: string;
  activeShow: string;
  poststring: poststringcompany;
  updateCompany: UpdateCompanyData;
  StateList: states[];
  IndustryList: industries[];
  categoryList: category[];
  category_type: number = 0;
  registration_no: string;
  SelectedCompany: string = "Select Company";
  SizeOfCompany: string = "Select Company Size";
  Id: number;
  message: string;
  com_Id:any;
  comment:any;
  commentsArray:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<companyList> = new Subject();
  role:any;
  penCompanyList:any;
  actCompanyList:any;
  displayedColumns = [];
  companyId: string;
  comName:string;
  certificate:File=null;
  certificate_url:string;
  certificate_name:string;
  certificateView:boolean;
  comId:any;
  com_id:any;
  // CSV Export
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    useBom: true,
    noDownload: false,
    headers: ["ID", "Company", "Administrator", "Phone","Email","Registration Date"]
  };
  csvOptionss = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    useBom: true,
    noDownload: false,
    headers:  ["Email", "Name", "Company", "Phone Number","Event","Referrer","Invited On","Status"]
  };
  // Mat Table
  displayedColumnss: string[] = ['newid','company_name', 'name','job_position', 'contact','referrer','days','action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;

    constructor(public auth: AuthService,public route: Router,private spinner: NgxSpinnerService,
      private aroute: ActivatedRoute,public formBuilder: FormBuilder,private title: Title,private sanitizer: DomSanitizer) {
      this.api_key = this.auth.getToken(); // Get api token in global variable
      this.mapPathUrl = this.auth.mapPathUrl;
      this.role = localStorage.getItem('role');
      this.title.setTitle(' Jobtiviti - Company List');
      this.dtOptions = {
         paging: false,
         searching: true
       };
      this.aroute.queryParams.subscribe(params => {
        this.com_Id = params["com_id"];
      })
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
          job_position: new FormControl("",Validators.compose([Validators.required])),
          Industry: new FormControl("",Validators.compose([Validators.required])),
          SizeOfCompany: new FormControl("",Validators.compose([Validators.required])),
          category_type: new FormControl("",Validators.compose([Validators.required])),
          name: new FormControl("",Validators.compose([Validators.required])),
          email: new FormControl("",Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),
          contact: new FormControl("",Validators.compose([Validators.required])),
      });

  }
  get f() { return this.EditCompanyForm.controls; }
  //fileUrl;
  ngOnInit() {
    this.aroute.queryParams.subscribe(params => {
      this.com_Id = params["com_id"];
      if(params["com_id"] != undefined)
        {
          this.companyId = params["com_id"];
          this.getComment(this.companyId);
          document.getElementById("openModalButton1").click();

        }
    })

    // const data = 'some text';
    // const datas = "http://localhost/apiJob/public/ssm_certificate/1562147769.png";
    // const blob = new Blob([data], { type: 'png' });
    // let URL= "http://localhost/apiJob/public/ssm_certificate/1562147769.png";
    // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL);


  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.aroute.queryParams
      .subscribe(params => {
        this.activeShow = params["active"];
        if (this.activeShow == "Active") {
          this.onactivelick();
        }
        else if(this.activeShow == "Reject") {
          this.onRejectClick();
        }
        else {
          this.getcompanylist();
          this.activeShow = "";
        }
        this.GetStateList();
        this.GetIndustryList();
        this.GetCategoryList();
      });
    this.GetCountryList();
    this.onActivesearch();
    this.onRejectSearch();
}

// Export CSV File of pending company list
 downloadCSV(){
    this.auth.getCompanyListCsv().subscribe(res=> {
    this.penCompanyList = res["com"];
    if (this.penCompanyList != undefined) {
      const newArray =  this.penCompanyList.map(o => {
        let id =  10000 + o.id;
        return { id: "EMP-" +  id , company: o.company_name,admin: o.name,contact: o.contact,email: o.email,date:o.created_at };
      });
      new  AngularCsv(newArray, "Pending Company List", this.csvOptions);
    }
    });
  }
 // Export CSV File of pending company list
 downActiveCSV(){
  this.auth.getActiveCompanyListCsv().subscribe(res=> {
  this.actCompanyList = res["com"];
  if (this.actCompanyList != undefined) {
    const newArray =  this.actCompanyList.map(o => {
      let id =  10000 + o.id;
      return { id: "EMP-" +  id , company: o.company_name,admin: o.name,contact: o.contact,email: o.email,date:o.created_at };
    });
    new  AngularCsv(newArray, "Active Company List", this.csvOptions);
  }
  });
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

  // Get Company list and bind all new company
  getcompanylist() {
    this.companyList = [];
    this.type = 0;
    if (this.search == undefined) {
      this.search = "";
    }
    else {
      this.search = "";
    }
    this.auth.getAllCompanylist(this.api_key, this.search, this.type).subscribe(res => {
      this.companyList = res["companyList"];
      this.newCompanylist = [];
      this.companyList.forEach(x => {
        if (x.is_verify == 0) {
          let id = (10000 + x.id).toString();
          x["newid"] = "EMP - " + id;
           let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
           let firstDate = new Date();
           let secondDate = new Date(x.created_at);
           let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
           x["days"] = diffDays;
          this.newCompanylist.push(x);
        }
      });
      this.dataSource = new MatTableDataSource(this.newCompanylist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  // Active Company List
  onactivelick() {
    this.companyList = [];
    this.type = 1;
    if (this.search == undefined) {
      this.activesearch = "";
    }
    else {
      this.activesearch = "";
    }
    this.auth.getAllCompanylist(this.api_key, this.activesearch, this.type).subscribe(res => {
      this.companyList = res["companyList"];
      this.activeCompanylist = [];
      this.companyList.forEach(x => {
        if (x.is_verify == 1) {
          let id = (10000 + x.id).toString();
          x['newid'] = 'EMP - ' + id;
          this.activeCompanylist.push(x);
        }
      });
    });
  }
 // Search Active Company
  onActivesearch() {
    if (this.activesearch != undefined) {
      if (this.activesearch.length >= 3) {
        this.type = 1;
        this.auth.getAllCompanylist(this.api_key, this.activesearch, this.type).subscribe(res => {
          this.companyList = res["companyList"];
          this.activeCompanylist = [];
          this.companyList.forEach(x => {
            if (x.is_verify == 1) {
              let id = (10000 + x.id).toString();
				    	x['newid'] = 'EMP - ' + id;
              this.activeCompanylist.push(x);
            }
          });
        });
      }
      else {
        this.onactivelick();
      }
    }
  }

  // Reject Company List
  onRejectClick(){
    this.companyList = [];
    this.type = 2;
    if (this.search == undefined) {
      this.rejectsearch = "";
    }
    else {
      this.rejectsearch = "";
    }
    this.auth.getAllCompanylist(this.api_key, this.rejectsearch, this.type).subscribe(res => {
      this.companyList = res["companyList"];
      this.rejectCompanylist = [];
      this.companyList.forEach(x => {
        if (x.is_verify == 2) {
          this.rejectCompanylist.push(x);
        }
      });
    });

  }

  // Search Active Company
  onRejectSearch() {
    if (this.rejectsearch != undefined) {
      if (this.rejectsearch.length >= 3) {
        this.type = 2;
        this.auth.getAllCompanylist(this.api_key, this.rejectsearch, this.type).subscribe(res => {
          this.companyList = res["companyList"];
          this.rejectCompanylist = [];
          this.companyList.forEach(x => {
            if (x.is_verify == 2) {
              this.rejectCompanylist.push(x);
            }
          });
        });
      }
      else {
        this.onRejectClick();
      }
    }
  }

  onactionclick(id: string) {
    this.companyId = id;
  }

  // Add Comment For Company
  addComment(){
    let AddCom: AddComment = {
      company_id: this.companyId,
      api_token: this.api_key,
      comment:this.comment,
    }
    this.auth.addAdminComment(AddCom).subscribe(res => {
      this.getComment(this.companyId);
    });

  }

  // All Commment List
  getComment(id: string){
    let GetCom: GetComment = {
      company_id: id,
    }
    this.companyId=id;
    this.auth.getAdminComment(GetCom).subscribe(res => {
      this.commentsArray = res['comments'];
      this.comName = res['company_name'];
      });
      this.comment = "";
  }

  nullComId(){
    this.companyId = " ";
    this.comment = "";
    this.commentsArray=[];
    this.route.navigate(["/admin/companylist"]);
  }

  // Accepting the company
  onactiveclick() {
    if (this.companyId != undefined && this.companyId != null) {
      this.poststring = {
        company_id: this.companyId,
        api_token: this.api_key,
        type: "1", //for accept company

      };
      this.companyId = null;
      this.auth.updateCompanyStatus(this.poststring).subscribe(x => {
        if (x['status'] == "success") {
          this.getcompanylist();
        }
      });
    }

  }
  // Rejecting the company
  onRejectclick() {
    if (this.companyId != undefined && this.companyId!=null) {
      this.poststring = {
        company_id: this.companyId,
        api_token: this.api_key,
        type: "2", //for reject company

      };
      this.companyId = null;
      this.auth.updateCompanyStatus(this.poststring).subscribe(x => {
        if (x['status'] == "success") {
          this.getcompanylist();
        }
      });
    }

  }
  // When we click on Company Detail
  onclickcompany(id: string, name: string,tab:string) {
    this.route.navigate(["/admin/employeelist"], { queryParams: { Id: id , Name:name,Type:tab } });
  };

  // Set value to Update Company Form
  ondetailclick(id: string) {
    this.comId = id;
    this.certificateView = true;
    this.getUploadCer();
    this.message = "";
    this.auth.companyDetail(this.api_key, id).subscribe(x => {
     if (x['status'] == "success") {
       console.log(x["addressdata"].address2);
        this.Id = x["data"].id;
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
      }
    });
  }

  // Update Company Data By Id
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
      size_of_company: this.EditCompanyForm.value.SizeOfCompany,
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
          this.EditCompanyForm.reset();
          this.getcompanylist();
        }
      })
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

sendVerifyMail(id){
  this.auth.sendCompanyVerifyMail(this.api_key, id).subscribe(res => {
    if (res["status"] == "success") {

    }
  })

}
invitationList=[];
downloadinviList=[];
onInvitationClick(){
  this.auth.getInvititationList(this.api_key).subscribe(res => {
    if (res["code"] == '200') {
    this.invitationList = res["data"];
    }
  })
}
downloadInvitationCSV(){
  this.auth.getInvititationList(this.api_key).subscribe(res=> {
    if (res["code"] == '200') {
        this.downloadinviList = res["data"];
        if (this.downloadinviList != undefined) {
          const newArray =  this.downloadinviList.map(o => {
            let id =  10000 + o.id;
            return { email: o.email,name:o.name,company: o.company,contact: o.phone_number,event:o.event,referrer:o.referrer,initedon:o.invited_on ,status:o.status};
          });
          new  AngularCsv(newArray, "Invitation List", this.csvOptionss);
        }
    }
  });

}
redirectToInvitation(){
  debugger
  this.route.navigate([],{skipLocationChange: true}).then(result => { window.open( this.mapPathUrl+'/public/salesagent','_blank'); });
   
}
}


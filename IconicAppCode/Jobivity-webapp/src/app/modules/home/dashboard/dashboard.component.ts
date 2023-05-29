import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { AuthService, AssetPipe } from '../../provider/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Question, editCompanyProfile, CompanyCulturePoint, CategorialPoints, jobseekListType, TalentDelClass, TalentProfile, TalentClass, TalentDetail, jobseakerdata, Department,jobseakerList } from 'src/Provider/Comman/Comman';
import { Options } from 'ng5-slider';
import { Title } from '@angular/platform-browser';
import { Sort } from '@angular/material/sort';
import { MatPaginator} from '@angular/material/paginator';
import { MixpanelService } from '../../mixpanel/mixpanel.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [Title]
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('openModal') openModal: ElementRef;
  @ViewChild('companyModal') companyModal: ElementRef;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  WorkingStyleLeft: string = "Traditional";
  WorkingStyleRight: string = "Flexible";
  FormalityLeft: string = "Formal";
  FormalityRight: string = "Casual";
  InternalStructureLeft: string = "Serious & Structured";
  InternalStructureRight: string = "Flexibly & Fun";
  TalentManagementLeft: string = "Autonomy";
  TalentManagementRight: string = "Structured";
  PersonalGrowthLeft: string = "Unhindered";
  PersonalGrowthRight: string = "Encouraged";
  WorkingStyleValue: number;
  FormalityValue: number;
  InternalStructureValue: number;
  TalentManagementValue: number;
  PersonalGrowthValue: number;
  WorkingStyleMax: number = 10;
  FormalityMax: number = 12;
  InternalStructureMax: number = 8;
  TalentManagementMax: number = 17;
  PersonalGrowthMax: number = 8;
  gaugeType = "semi";
  gaugeLabel = "Speed";
  gaugethick = 20;
  lenghts: number;
  urlImage2: string;
  user_id: string;
  // Show Content ShowMore
  wordCOunt: number;
  addNum = 10000;
  companyProgress: boolean;
  // For talent Prifile
  TalentProfileList: TalentProfile[];
  urlUser: string;
  IsDetail: boolean = false;
  loadProgress: boolean = false;
  AddImag: string;
  profileID: any;
  public canvasWidth = 300;
  api_url:any;
  mapPathUrl: any;

  InternalStructureOperation: Options = {
    floor: 0,
    ceil: this.InternalStructureMax,
    step: 1,
    noSwitching: true,
    hidePointerLabels: true,
    readOnly: true,
    showSelectionBar: true,
    hideLimitLabels: true
  };
  WorkingStyleOperation: Options = {
    floor: 0,
    ceil: this.WorkingStyleMax,
    step: 1,
    noSwitching: true,
    hidePointerLabels: true,
    readOnly: true,
    showSelectionBar: true,
    hideLimitLabels: true
  };
  TalentManagementOperation: Options = {
    floor: 0,
    ceil: this.TalentManagementMax,
    step: 1,
    noSwitching: true,
    hidePointerLabels: true,
    readOnly: true,
    showSelectionBar: true,
    hideLimitLabels: true
  };
  FormalityOperation: Options = {
    floor: 0,
    ceil: this.FormalityMax,
    step: 1,
    noSwitching: true,
    hidePointerLabels: true,
    readOnly: true,
    showSelectionBar: true,
    hideLimitLabels: true
  };
  PersonalGrowthOperation: Options = {
    floor: 0,
    ceil: this.PersonalGrowthMax,
    step: 1,
    noSwitching: true,
    hidePointerLabels: true,
    readOnly: true,
    showSelectionBar: true,
    hideLimitLabels: true
  };

  api_key: string;
  baseUrl:string;
  questionlist: Question[];
  culturePoint: CompanyCulturePoint[];
  point: CategorialPoints = {
    WorkingStyle: 0,
    Formality: 0,
    InternalStructure: 0,
    TalentManagement: 0,
    PersonalGrowth: 0
  };
  
  DepartmentList: Department[] = [];
  preScreenjobList: any[] = [];
  courceName: string;
  universtyName: string;
  jobseekerList:any[] = [];
  connectedJobList:any[] = [];
  rejectedJobList:any[] = [];
  referencesJobList:any[] = [];

  defaultImg: string;
  talentData: TalentClass = {
    id: 0,
    name: "",
    photo: this.defaultImg,
    graduation_year: "",
    aspiration_message: "",
    university_name: "",
    customeuniversity: "",
    email: ""
  };

  talentFeedList: TalentDetail[];
  talentFeed: TalentDetail;
  scoreTypeList:any;


  

  constructor(public auth: AuthService, public route: Router, private spinner: NgxSpinnerService,
    public Piper: AssetPipe, private title: Title, private aroute: ActivatedRoute,private mixpanelService: MixpanelService) {
    this.api_key = this.auth.getToken();
    this.api_url = this.auth.PublicUrl;
    this.mapPathUrl = this.auth.mapPathUrl;
    this.title.setTitle(' Jobtiviti - Dashboard');
  }

  ngOnInit() {
    this.aroute.queryParams
      .subscribe(params => {
        if (params["showid"] == 1) {
          this.checkVerifyCompanyVeiw()
        }
        this.urlUser = this.Piper.transform("/images/user.jpg");
        this.AddImag = this.Piper.transform("/images/add.png");
        this.urlImage2 = this.Piper.transform("/images/bg4.png");
        this.getCompanyProfile();
        this.getdepartmentlist();
        this.getScoreTypeList();
      });
  }
 // Status For Company Profile is Completed or Not  
  getCompanyProfile() {
    this.spinner.show();
    let editCPO: editCompanyProfile = {
      token: this.api_key,
    }
    this.auth.getCompanyProfileData(editCPO).subscribe(res => {
      if (res['code'] === 201) {
        this.spinner.hide();
        this.companyProgress = true;
        this.IsDetail = false;
        this.loadProgress = false;
        console.log(this.companyProgress);
      }
      else if (res['code'] === 202) {
        this.spinner.hide();
        this.companyProgress = true;
        this.IsDetail = false;
        this.loadProgress = false;
        console.log(this.companyProgress);
      } else {
        this.companyProgress = false;
        this.IsDetail = false;
        this.loadProgress = false;
        this.getcompanyculture();
        this.getPrescreenSeakerlist();
        this.getAlljobSeeker();
        console.log(this.companyProgress);
      }
    });
  }
  checkVeiw() {
    if (this.loadProgress == false) {
      if (this.TalentProfileList.length == 0) {
        this.openModal.nativeElement.click();
      }
    }
  }

  checkVerifyCompanyVeiw() {
    this.companyModal.nativeElement.click();
  }

 // Check Company Culture is Completed Or Not 
  getcompanyculture() {
    this.auth.getCompanyCulturePoints(this.api_key).subscribe(x => {
      this.spinner.hide();
      this.culturePoint = x;
      this.culturePoint.forEach(each => {

        if (each.company_culture_answers != undefined && each.company_culture_answers != null) {
          if (each.company_culture_answers.categorialPoints != undefined) {
            if (each.company_culture_answers.categorialPoints.WorkingStyle != undefined) {
              this.point.WorkingStyle = this.point.WorkingStyle + each.company_culture_answers.categorialPoints.WorkingStyle;
            }
            if (each.company_culture_answers.categorialPoints.Formality != undefined) {
              this.point.Formality = this.point.Formality + each.company_culture_answers.categorialPoints.Formality;
            }
            if (each.company_culture_answers.categorialPoints.InternalStructure != undefined) {
              this.point.InternalStructure = this.point.InternalStructure + each.company_culture_answers.categorialPoints.InternalStructure;
            }
            if (each.company_culture_answers.categorialPoints.TalentManagement != undefined) {
              this.point.TalentManagement = this.point.TalentManagement + each.company_culture_answers.categorialPoints.TalentManagement;
            }
            if (each.company_culture_answers.categorialPoints.PersonalGrowth != undefined) {
              this.point.PersonalGrowth = this.point.PersonalGrowth + each.company_culture_answers.categorialPoints.PersonalGrowth;
            }
            this.IsDetail = true;
            this.loadProgress = false;
          }
          else {
            this.IsDetail = false;
            this.loadProgress = true;
          }
        }
        else {
          this.IsDetail = false;
          this.loadProgress = true;
        }

      });

      this.WorkingStyleValue = this.point.WorkingStyle;
      this.FormalityValue = this.point.Formality;
      this.InternalStructureValue = this.point.InternalStructure;
      this.TalentManagementValue = this.point.TalentManagement;
      this.PersonalGrowthValue = this.point.PersonalGrowth;
      this.gettalentprofileUser();

    });
  }
 // Get Department List
  getdepartmentlist() {
    this.auth.getDepartment().subscribe(res => {
      this.DepartmentList = res;
      console.log(res);
    })
  }
   // Get Score List
  getScoreTypeList() {
    this.auth.getScoreList().subscribe(res => {
      this.scoreTypeList = res;
      console.log(res);
    })
  }
 // Get all Talent Profile
  gettalentprofileUser() {
    this.auth.gettalentprofile(this.api_key).subscribe(res => {
      this.TalentProfileList = res["data"];
      console.log(this.TalentProfileList);
      this.lenghts = this.TalentProfileList.length;
      this.TalentProfileList.forEach(x => {
        this.DepartmentList.forEach(m => {
          console.log(1);
          if (m.id == x.department_id) {
            x["DepartmentName"] = m.department_name;
          }

        });
        this.wordCOunt = 0;
        let i = 0;
        x.dispLength = x.talent_profile_questions.length;
        x.jobdisp = "";
        x.talent_profile_questions.forEach(y => {
          if (i == 0) {
            x.jobdisp = y.text;
            i++;
          }
          else {
            x.jobdisp = x.jobdisp + ", " + y.text;
          }
        });
        x.isShowLessdata = true;
        x.isShowMoredata = false;
        x.WordLength = x.jobdisp.length;
      });
      this.checkVeiw();
    });

  }
 // Edit talent profile
  editprofile(id: any) {
    this.route.navigate(["/home/talentprofile"], { queryParams: { Id: id } });
  }
 // See Summary page
  onClickSummaryPage(id:any) {
    this.route.navigate(["/home/summary"], { queryParams: { id:+ id   } });
  }
  onClickjobPage(id:any) {
    this.route.navigate(["/home/summary"], { queryParams: { id:+ id , activejob : 1} });
  }
 // Review Interview Question with video
  onClickReviewProfile(user_id:any,job_id:any) {
    this.mixpanelService.track("Button Click",{"name": "View Interview Video","job ad": job_id});
   this.route.navigate([],{skipLocationChange: true}).then(result => { window.open( this.mapPathUrl+'/home/review?user_id=' + user_id + '&job_id=' + job_id, '_blank'); });
   }
 // Create Talent Profile
  createProfile() {
    this.route.navigate(["/home/talentprofile"], { queryParams: { Id: 0 } });
  }
 // Company Culture
  OncompanyClick() {
    this.route.navigate(["/home/company_culture"]);
  }
 // Company Culture
  getstart() {
    this.route.navigate(["/home/company_culture"]);
  }
  // Edit Company Profile
  createCompany() {
    this.route.navigate(["/home/editcompanyprofile"]);
  }
 
  ShowMoreData(Profile: TalentProfile) {
    Profile.isShowLessdata = !Profile.isShowLessdata;
    Profile.isShowMoredata = !Profile.isShowMoredata;
  }
  score:any;
  getAlljobSeeker(){
    this.auth.getalljobseaker(this.api_key).subscribe(res => {
      console.log(res);
      this.jobseekerList = res;
      if (this.jobseekerList != undefined) {
        this.jobseekerList.forEach(x  => {
          this.courceName = "";
          this.universtyName = "";
          if (x.user_course_list != undefined) {
            x.user_course_list.forEach(y => {
              if (this.courceName == "") {
                this.courceName = y.course_name;
              }
              else {
                this.courceName = this.courceName + ", " + y.course_name;
              }
            });
          }
          if (x.coursescustom != undefined) {
            x.coursescustom.forEach(y => {
              if (this.courceName == "") {
                this.courceName = y.course_name;
              }
              else {
                this.courceName = this.courceName + ", " + y.course_name;
              }
            });
          }
          x["courceName"] = this.courceName;
          if (x.universityData.length>0) {
            console.log(x.universityData[0]["university_name"]);
            x["universityname"] = x.universityData[0]["university_name"];
          }
          this.scoreTypeList.forEach(jt => {
            if(x.score == jt.value){
              x["score"] = jt.text;
            }
           });



        });
      }
      this.jobseekerList = this.jobseekerList.slice();
     
    });
  }

  sortData(sort: Sort) {
    const data = this.jobseekerList.slice();
    if (!sort.active || sort.direction === '') {
      this.jobseekerList = data;
      return;
    }

    this.jobseekerList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'job_title': return this.compare(a.job_title, b.job_title, isAsc);
        case 'score': return this.compare(a.score, b.score, isAsc);
        case 'expireDays': return this.compare(a.expireDays, b.expireDays, isAsc);
        default: return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  

  getConectedjobSeeker(){
    this.auth.getConectedjobSeeker(this.api_key, jobseekListType.Connect).subscribe(res => {
      this.connectedJobList = res;
    
      if (this.connectedJobList != undefined) {
        this.connectedJobList.forEach(x  => {
          this.courceName = "";
          this.universtyName = "";
          if (x.user_course_list != undefined) {
            x.user_course_list.forEach(y => {
              if (this.courceName == "") {
                this.courceName = y.course_name;
              }
              else {
                this.courceName = this.courceName + ", " + y.course_name;
              }
            });
          }
          if (x.coursescustom != undefined) {
            x.coursescustom.forEach(y => {
              if (this.courceName == "") {
                this.courceName = y.course_name;
              }
              else {
                this.courceName = this.courceName + ", " + y.course_name;
              }
            });
          }
          x["courceName"] = this.courceName;
          if (x.universityData.length>0) {
            console.log(x.universityData[0]["university_name"]);
            x["universityname"] = x.universityData[0]["university_name"];
          }
          this.scoreTypeList.forEach(jt => {
            if(x.score == jt.value){
              x["score"] = jt.text;
            }
           });
          
        });
      }
    });
  }

  getRejectedjobSeeker() {
    this.auth.getConectedjobSeeker(this.api_key, jobseekListType.Reject).subscribe(res => {
      console.log(res);
      this.rejectedJobList = res;
    
      if (this.rejectedJobList != undefined) {
        this.rejectedJobList.forEach(x  => {
          this.courceName = "";
          this.universtyName = "";
          if (x.user_course_list != undefined) {
            x.user_course_list.forEach(y => {
              if (this.courceName == "") {
                this.courceName = y.course_name;
              }
              else {
                this.courceName = this.courceName + ", " + y.course_name;
              }
            });
          }
          if (x.coursescustom != undefined) {
            x.coursescustom.forEach(y => {
              if (this.courceName == "") {
                this.courceName = y.course_name;
              }
              else {
                this.courceName = this.courceName + ", " + y.course_name;
              }
            });
          }
          x["courceName"] = this.courceName;
          if (x.universityData.length>0) {
            console.log(x.universityData[0]["university_name"]);
            x["universityname"] = x.universityData[0]["university_name"];
          }
          this.scoreTypeList.forEach(jt => {
            if(x.score == jt.value){
              x["score"] = jt.text;
            }
           });
          
        });
      }
    });
  }

  getReferencesjobSeeker() {
    this.auth.getConectedjobSeeker(this.api_key, jobseekListType.KeepforReference).subscribe(res => {
      console.log(res);
      this.referencesJobList = res;
    
      if (this.referencesJobList != undefined) {
        this.referencesJobList.forEach(x  => {
          this.courceName = "";
          this.universtyName = "";
          if (x.user_course_list != undefined) {
            x.user_course_list.forEach(y => {
              if (this.courceName == "") {
                this.courceName = y.course_name;
              }
              else {
                this.courceName = this.courceName + ", " + y.course_name;
              }
            });
          }
          if (x.coursescustom != undefined) {
            x.coursescustom.forEach(y => {
              if (this.courceName == "") {
                this.courceName = y.course_name;
              }
              else {
                this.courceName = this.courceName + ", " + y.course_name;
              }
            });
          }
          x["courceName"] = this.courceName;
          if (x.universityData.length>0) {
            console.log(x.universityData[0]["university_name"]);
            x["universityname"] = x.universityData[0]["university_name"];
          }
          this.scoreTypeList.forEach(jt => {
            if(x.score == jt.value){
              x["score"] = jt.text;
            }
           });
          
        });
      }
    });
  }
  
  getPrescreenSeakerlist() {
    if (this.api_key != undefined) {
      this.auth.getShortListedjobSeeker(this.api_key, jobseekListType.Prescreen).subscribe(res => {
        this.preScreenjobList = res;
        console.log( this.preScreenjobList);
         if (this.preScreenjobList != undefined) {
        this.preScreenjobList.forEach(x  => {
          this.courceName = "";
          this.universtyName = "";
          if (x.user_course_list != undefined) {
            x.user_course_list.forEach(y => {
              if (this.courceName == "") {
                this.courceName = y.course_name;
              }
              else {
                this.courceName = this.courceName + ", " + y.course_name;
              }
            });
          }
          if (x.coursescustom != undefined) {
            x.coursescustom.forEach(y => {
              if (this.courceName == "") {
                this.courceName = y.course_name;
              }
              else {
                this.courceName = this.courceName + ", " + y.course_name;
              }
            });
          }
          x["courceName"] = this.courceName;
         if (x.universityData.length>0) {
            console.log(x.universityData[0]["university_name"]);
            x["universityname"] = x.universityData[0]["university_name"];
          }
          this.scoreTypeList.forEach(jt => {
            if(x.score == jt.value){
              x["score"] = jt.text;
            }
           });
          
        });
      }
      });
    }
  }

  getSeakerDetaiul(id: number) {
    if (this.api_key != undefined && id != undefined) {
      this.spinner.show();
      this.auth.getDetailofSeaker(this.api_key, id).subscribe(res => {
        this.spinner.hide();
        this.talentFeedList = res;
        this.talentFeed = this.talentFeedList[0];
        if (this.talentFeed.user != undefined) {
          this.talentData = new TalentClass;
          this.talentData.id = this.talentFeed.user.id;
          this.talentData.name = this.talentFeed.user.name;
          this.talentData.graduation_year = this.talentFeed.user.graduation_year;
          this.talentData.aspiration_message = this.talentFeed.user.aspiration_message;
          this.talentData.university_name = this.talentFeed.universityData[0].university_name == undefined ? " " : this.talentFeed.universityData[0].university_name;
          if (this.talentFeed.user.photo == undefined) {
            this.talentData.photo = this.defaultImg;
          }
        }
      });
    }
  }

  onactionsetID(id: any) {
    this.profileID = id;
  }

  // Delete talent Profile
  removeProfileID() {
    this.profileID = "";
  }
  deleteprofile() {
    let talentDataDel: TalentDelClass = {
      id: this.profileID,
    }
    this.auth.delTalentDetail(talentDataDel).subscribe(res => {
      console.log(res);
      this.gettalentprofileUser();
    });
  }
 
  preScreeningUser(user_id: any,job_id:any){
      this.auth.assignPrescrrening(this.api_key,user_id,job_id).subscribe(res => {
        if(res['code'] === 200){
          this.mixpanelService.track("Button Click",{"name": "Shortlist","job ad": job_id});
          this.getAlljobSeeker();
          
        }
      })
  }
  rejectApplicantUser(user_id: any,job_id:any){
    this.auth.rejectApplicantCandidate(this.api_key,user_id,job_id).subscribe(res => {
      if(res['code'] === 200){
        this.getAlljobSeeker();
        
      }
    })
}
 // Connect Invitation to Applicant
  onClickConnectProfile(user_id: any,job_id:any){
    this.auth.assignConnectUser(this.api_key,user_id,job_id).subscribe(res => {
      if(res['code'] === 200){
        this.mixpanelService.track("Button Click",{"name": "Request Connect","job ad": job_id});
        this.getPrescreenSeakerlist();
        
      }
    })
  }
  // Reject Invitation to Applicant
  onClickRejectProfile(user_id: any,job_id:any){
  this.auth.assignRejectUser(this.api_key,user_id,job_id).subscribe(res => {
    if(res['code'] === 200){
      this.getPrescreenSeakerlist();
      
    }
  })
}
// Keep For reference Invitation to Applicant
onClickKeepForRefeProfile(user_id: any,job_id:any){
  this.auth.assignKeepForReference(this.api_key,user_id,job_id).subscribe(res => {
    if(res['code'] === 200){
      this.getPrescreenSeakerlist();
    }
  })
}
pay_user_id:number;
pay_job_id:number;

onClickPaybutton(user_id: any,job_id:any){
this.pay_user_id = user_id;
this.pay_job_id = job_id;
}
paymsg:string;
// Click to pay
onClickPay(user_id: any,job_id:any){
  this.pay_user_id = user_id;
  this.pay_job_id = job_id;
  this.auth.payForApplicant(this.api_key,this.pay_user_id,this.pay_job_id).subscribe(res => {
    if(res['code'] === 200){
      this.paymsg = res['confirm_msg'];
      document.getElementById("payPopUp").click();
    }
    else{
      alert(res['error_msg']);
      this.getPrescreenSeakerlist();
    }
  })

}
onClickPayFinal(){
  this.auth.payForApplicantFinal(this.api_key,this.pay_user_id,this.pay_job_id).subscribe(res => {
    if(res['code'] === 200){  
      this.mixpanelService.track("Button Click",{"name": "Finalise Connect","job ad": this.pay_job_id});
      this.closeAddExpenseModal.nativeElement.click();
      this.getPrescreenSeakerlist();
    }
  })
}

}

import { Component, OnInit ,ElementRef ,ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService, AssetPipe } from '../../provider/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { states, groupQuestion, industries, Department } from 'src/Provider/Comman/Comman';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-job-ads',
  templateUrl: './job-ads.component.html',
  styleUrls: ['./job-ads.component.css']
})

export class JobAdsComponent implements OnInit {
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef; 
  @ViewChild('closeAddModal') closeAddModal: ElementRef;
  api_key:any;
  talentJobList: any = [];
  StateList: states[];
  JoinTimeList = [];
  JobTypeList = [];
  jobId:number;
  RejectionForm: FormGroup;
  submitted = false;
  reasons:any;
  jobStatus:string;
  jobTitle:any;
  vacancy:number;
  createdDate:any;
  minSalary:number;
  maxSalary:number;
  jobDescription:any;
  jobDetail_description:any;
  comLogo:any;
  comName:any;
  visiblity:any;
  math = Math;
  lastCount:number;
  countArray: Array<{index: number}> = []; 
  pageval:number;
  talentData: any;
  JobPostionList: any[] = [];
  jobpostion: any;
  state:any;
  desArray: any[] = [];
  Description: string;
  JobType:string;
  groups: any[] = [];
  academic: groupQuestion[] = [];
  hardSkill: groupQuestion[] = [];
  WorkExp: groupQuestion[] = [];
  IndustryList: industries[];
  industry: any[] = [];
  itemList: any[] = [];
  relivList: any[] = [];
  otherDegree: any[] = [];
  university: any[] = [];
  depart: any[] = [];
  DepartmentList: Department[] = [];
  hardSkillList: any[] = [];
  expireDays:any;

  pageval1:number;
  countArray1: Array<{index: number}> = [];
  apptalentJobList:any=[];
  dummyImage:any;
  
  constructor( public auth: AuthService, public route: Router,
    public Piper: AssetPipe, private title: Title, private aroute: ActivatedRoute,public formBuilder: FormBuilder) { 
      this.title.setTitle(' Jobtiviti - Job Ad');
      this.dummyImage=this.Piper.transform("/images/company.png");
      this.api_key = this.auth.getToken();
      this.GetStateList();
      this.getJoinTimelist();
      this.getJobTypelist();
      this.GetJobPosition();
      this.getdepartmentlist();
      this.getindustrydata();
      this.getreliventList();
      this.callhardSkill();
      this.listJobAdss(1);
      this.approvedlistJobAdss(1);
      
      // Validation
      this.RejectionForm = this.formBuilder.group(
        {
          reasons: new FormControl("",Validators.compose([Validators.required])),
        });
  }
  get f() { return this.RejectionForm.controls; }
  // Get State List
  GetStateList() {
    this.auth.getState().subscribe(x => {
      this.StateList = x;
    });
  }
  // Get Join Time List
  getJoinTimelist() {
    this.auth.getJoinTime().subscribe(res => {
      this.JoinTimeList = res;

    })
  }
   // Get Job type  List
   getJobTypelist() {
    this.auth.getJobType().subscribe(res => {
      this.JobTypeList = res;

    })
  }
    // Get Job Position List
    GetJobPosition() {
      this.auth.getJobPositions().subscribe(x => {
        this.JobPostionList = x;
  
      });
    }
    // Get Industries Data
  getindustrydata() {
    this.auth.getIndustries().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.industry_name });
      });
      this.industry = this.itemList;
    });
  }
    // Calling all Function
  getreliventList() {
    this.auth.getReliventDegree().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.degree_name });
      });
      this.relivList = this.itemList;

    });

    this.auth.getOtherDegree().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.degree_name });
      });
      this.otherDegree = this.itemList;
    });
  }
  // Get Department List
  getdepartmentlist() {
    this.auth.getDepartment().subscribe(res => {
      this.DepartmentList = res;
      this.itemList = [];
      res.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.department_name });
      });
      this.depart = this.itemList;
    })
  }
    // Get Skill
  callhardSkill() {
      this.auth.getHandSkill().subscribe(x => {
        this.itemList = [];
        x.forEach(y => {
          this.itemList.push({ value: y.id.toString(), label: y.skill_name });
        });
  
        this.hardSkillList = this.itemList;
  
      });
    }

  ngOnInit() {
  }
  
  
//  For pagination
  listJobAdss(page:number) {
    this.pageval = page ;
    this.auth.jobsAdsListt(this.api_key,page).subscribe(res => {
      let listCount =  res["count"];
      if(listCount > 20){
        let count = listCount / 20;
        let dataCount = this.math.ceil(count);
        this.lastCount = dataCount;
        for(let i= 1; i <= dataCount;i++){
          this.countArray.push({ index: i});
        } 
      }
      else{
        this.countArray.push({index:1})
      }
      
      this.talentJobList = res['data'];
      if (this.talentJobList != undefined) {
        this.talentJobList.forEach(x => {
         
          if (x.state_id != undefined) {
            this.StateList.forEach(s => {
              if (s.id == x.state_id) {
                x["stateName"] = s.state_name;
              }

            })
          }
          this.JoinTimeList.forEach(jtm => {
            if (x.join_time == jtm.value) {
              x["join_time"] = jtm.text;
            }
          });
          this.JobTypeList.forEach(jt => {
            if (x.job_type == jt.value) {
              x["job_type"] = jt.text;
            }
          });
        });
      }
    });

  }
  listJobAdsss(page:number) {
    this.pageval = page ;
    this.auth.jobsAdsListt(this.api_key,page).subscribe(res => {

      this.talentJobList = res['data'];
      if (this.talentJobList != undefined) {
        this.talentJobList.forEach(x => {
         
          if (x.state_id != undefined) {
            this.StateList.forEach(s => {
              if (s.id == x.state_id) {
                x["stateName"] = s.state_name;
              }

            })
          }
          this.JoinTimeList.forEach(jtm => {
            if (x.join_time == jtm.value) {
              x["join_time"] = jtm.text;
            }
          });
          this.JobTypeList.forEach(jt => {
            if (x.job_type == jt.value) {
              x["job_type"] = jt.text;
            }
          });
        });
      }
    });

  }
  
  //  For pagination
  approvedlistJobAdss(page:number) {
    this.pageval1 = page ;
    this.auth.appjobsAdsListt(this.api_key,page).subscribe(res => {
      let listCount =  res["count"];
      if(listCount > 20){
        let count = listCount / 20;
        let dataCount = this.math.ceil(count);
        this.lastCount = dataCount;
        for(let i= 1; i <= dataCount;i++){
          this.countArray1.push({ index: i});
        } 
      }
      else{
        
        this.countArray1.push({index:1});
        console.log(this.countArray1);
      }
      
      this.apptalentJobList = res['data'];
      if (this.apptalentJobList != undefined) {
        this.apptalentJobList.forEach(x => {
         
          if (x.state_id != undefined) {
            this.StateList.forEach(s => {
              if (s.id == x.state_id) {
                x["stateName"] = s.state_name;
              }

            })
          }
          this.JoinTimeList.forEach(jtm => {
            if (x.join_time == jtm.value) {
              x["join_time"] = jtm.text;
            }
          });
          this.JobTypeList.forEach(jt => {
            if (x.job_type == jt.value) {
              x["job_type"] = jt.text;
            }
          });
        });
      }
    });

  }
  approvedlistJobAdsss(page:number) {
    this.pageval1 = page ;
    this.auth.appjobsAdsListt(this.api_key,page).subscribe(res => {
      this.apptalentJobList = res['data'];
      if (this.apptalentJobList != undefined) {
        this.apptalentJobList.forEach(x => {
         
          if (x.state_id != undefined) {
            this.StateList.forEach(s => {
              if (s.id == x.state_id) {
                x["stateName"] = s.state_name;
              }

            })
          }
          this.JoinTimeList.forEach(jtm => {
            if (x.join_time == jtm.value) {
              x["join_time"] = jtm.text;
            }
          });
          this.JobTypeList.forEach(jt => {
            if (x.job_type == jt.value) {
              x["job_type"] = jt.text;
            }
          });
        });
      }
    });

  }

  viewMockUp(id:number){
    
    this.jobId = id;
    
    this.auth.viewJobAd(this.jobId,this.api_key).subscribe(res => {
      if(res['code'] === 200){

        console.log(res['data']);
        this.jobTitle = res['data'].title;
        this.vacancy = res['data'].no_of_vacancy;
        this.minSalary = res['data'].min_salary;
        this.maxSalary = res['data'].max_slaray;
        this.createdDate = res['data'].create_date;
        this.jobDescription = res['data'].descriptions;
        this.jobDetail_description = res['jobDetail_description'];
        this.comName =  res['data'].company_name;
        this.comLogo =  res['data'].company_logo;
        this.visiblity =  res['data'].company_visible;
        // Talent Data
        this.expireDays = res['data'].expireDays;
        this.talentData = res['talentdata'];

        this.JobPostionList.forEach(jp => {
          if (jp.id == this.talentData.position_level) {
            this.jobpostion = jp.position_name;
          }
        });
        this.JobTypeList.forEach(jt => {
          if (res['data'].job_type == jt.value) {
            this.JobType = jt.text;
          }
        });
        console.log(this.StateList);
        this.StateList.forEach(s => {
          if (res['data'].state_id == s.id) {
              this.state = s.state_name;
              console.log(this.state);
            } 
        });
        this.desArray = this.talentData.talent_profile_questions;
        this.talentData.talent_profile_questions.forEach(x => {
          if (this.Description == undefined) {
            this.Description = x.text;
          }
          else {
            this.Description = this.Description + "&#10;" + x.text;
          }
        });

        this.auth.getTalentprofile(this.api_key).subscribe(res1 => {
          this.groups = res1;
          this.academic = res1["Academic"];
          this.hardSkill = res1["Hard_Skills"];
          this.WorkExp = res1["Work_Experience"];
          this.academic.forEach(text => {
            text.isSen = true;
            text.question_options.forEach(m => {
              m.Detail = [];
              m["Detailpreview"] = "";
              this.talentData.talent_profile_answere.forEach(y => {
                if (m.question_id == y.question_id && m.id == y.question_option_id) {
                  if (m.type == "1") {
                    if (m.slug == "op57") {
                      m.isSen = true;
                      this.otherDegree.forEach(re => {
                        if (re.value == y.question_answer_id) {
                          m.Detail.push(re);
                          console.log(re.label);
                          if(m["Detailpreview"]=="")
                          {
                            m["Detailpreview"]=re.label;
                            
                          }
                          else{
                            m["Detailpreview"]= m["Detailpreview"]+", "+re.label;
                          }
                        }
                      });
                    } else if (m.slug == "op58") {
                      m.isSen = true;
                      this.otherDegree.forEach(re => {
                        if (re.value == y.question_answer_id) {
                          m.Detail.push(re);
                          console.log(m["Detailpreview"]);
                          if(m["Detailpreview"]=="")
                          {
                            m["Detailpreview"]=re.label;
                          }
                          else{
                            m["Detailpreview"]= m["Detailpreview"]+", "+re.label;
                          }
                        }
                      });
                    } else if (m.slug == "op78") {
                      m.isSen = true;
                      this.otherDegree.forEach(re => {
                        if (re.value == y.question_answer_id) {
                          m.Detail.push(re);
                          console.log(m["Detailpreview"]);
                          if(m["Detailpreview"]=="")
                          {
                            m["Detailpreview"]=re.label;
                          }
                          else{
                            m["Detailpreview"]= m["Detailpreview"]+", "+re.label;
                          }
                        }
                      });
                    } else if (m.slug == "op60") {
                      m.isSen = true;
                      this.university.forEach(re => {
                        if (re.value == y.question_answer_id) {
                          m.Detail.push(re);
                          console.log(m["Detailpreview"]);
                          if(m["Detailpreview"]=="")
                          {
                            m["Detailpreview"]=re.label;
                          }
                          else{
                            m["Detailpreview"]= m["Detailpreview"]+", "+re.label;
                          }
                        }
                      });
                    }
                    else if (m.slug == "op82") {
                      m.isSen = true;
                      this.otherDegree.forEach(re => {
                        if (re.value == y.question_answer_id) {
                          m.Detail.push(re);
                          if(m["Detailpreview"]=="")
                          {
                            m["Detailpreview"]=re.label;
                          }
                          else{
                            m["Detailpreview"]= m["Detailpreview"]+", "+re.label;
                          }
                        }
                      });
                    }
                  }
                  else if (m.type == "2") {
                    m.isSen = true;
                  }
                  else if (m.type == "0") {
                    m.isSen = true;
                  }
                }

              });
              if (m.slug == "op57") {
                if ( this.talentData.custom_degree != undefined &&  this.talentData.custom_degree != null) {

                  this.talentData.custom_degree.forEach(cust => {
                    if (cust.question_slug == "op57") {
                      m.isSen = true;
                      m.Detail.push({ value: "0", label: cust.degree_name });
                      if(m["Detailpreview"]=="")
                      {
                        m["Detailpreview"]=cust.degree_name;
                      }
                      else{
                        m["Detailpreview"]= m["Detailpreview"]+", "+cust.degree_name;
                      }
                    }
                  });

                }
              }
              if (m.slug == "op58") {
                if ( this.talentData.custom_degree != undefined &&  this.talentData.custom_degree != null) {
                  this.talentData.custom_degree.forEach(cust => {
                    if (cust.question_slug == "op58") {
                      m.isSen = true;
                      m.Detail.push({ value: "0", label: cust.degree_name });
                      if(m["Detailpreview"]=="")
                      {
                        m["Detailpreview"]=cust.degree_name;
                      }
                      else{
                        m["Detailpreview"]= m["Detailpreview"]+", "+cust.degree_name;
                      }
                    }
                  });

                }
              }
              if (m.slug == "op78") {
                if (this.talentData.custom_degree != undefined && this.talentData.custom_degree != null) {
                  this.talentData.custom_degree.forEach(cust => {
                    if (cust.question_slug == "op78") {
                      m.isSen = true;
                      m.Detail.push({ value: "0", label: cust.degree_name });
                      if(m["Detailpreview"]=="")
                      {
                        m["Detailpreview"]=cust.degree_name;
                      }
                      else{
                        m["Detailpreview"]= m["Detailpreview"]+", "+cust.degree_name;
                      }
                    }
                  });

                }
              }

              else if (m.slug == "op60") {

                if (this.talentData.custom_university != undefined && this.talentData.custom_university != null) {
                  this.talentData.custom_university.forEach(cust => {
                    m.isSen = true;
                    m.Detail.push({ value: "0", label: cust.university_name });
                    if(m["Detailpreview"]=="")
                    {
                      m["Detailpreview"]=cust.university_name;
                    }
                    else{
                      m["Detailpreview"]= m["Detailpreview"]+", "+cust.university_name;
                    }

                  });
                }
              }
            });

          });

          this.WorkExp.forEach(text => {
            text.isSen = true;
            text.question_options.forEach(m => {
              m.Detail = [];
              m["Detailpreview"]="";
              this.talentData.talent_profile_answere.forEach(y => {
                if (m.question_id == y.question_id && m.id == y.question_option_id) {

                  if (m.type == "1") {
                    if (m.slug == "op73") {
                      m.isSen = true;
                      this.depart.forEach(re => {
                        if (re.value == y.question_answer_id.toString()) {
                          m.Detail.push(re);
                          if(m["Detailpreview"]=="")
                          {
                            m["Detailpreview"]=re.label;
                          }
                          else{
                            m["Detailpreview"]= m["Detailpreview"]+", "+re.label;
                          }
                        }
                      });
                    }
                    if (m.slug == "op74") {
                      m.isSen = true;
                      this.industry.forEach(re => {
                        if (re.value == y.question_answer_id) {
                          m.Detail.push(re);
                          if(m["Detailpreview"]=="")
                          {
                            m["Detailpreview"]=re.label;
                          }
                          else{
                            m["Detailpreview"]= m["Detailpreview"]+", "+re.label;
                          }
                        }
                      });
                    }
                  }
                  else if (m.type == "2" && m.slug == "op67") {
                    m.isSen = true;
                  }
                  else if (m.type == "0") {
                    if (m.slug == "op72") {
                      m.isSen = true;
                    }
                    else if (m.slug == "op68") {
                      m.isSen = true;
                    }
                    else if (m.slug == "op69") {
                      m.isSen = true;
                    }
                    else if (m.slug == "op70") {
                      m.isSen = true;
                    }
                  }
                }

              });

            });

          });
          this.hardSkill.forEach(text => {
            text.isSen = true;
            text.question_options.forEach(m => {
              m.Detail = [];
              this.talentData.talent_profile_answere.forEach(y => {
                if (m.question_id == y.question_id && m.id == y.question_option_id) {
                  if (text.slug == "q19") {
                    if (m.type == "1") {
                      m.isSen = true;
                      this.hardSkillList.forEach(re => {
                        if (re.value == y.question_answer_id) {
                          m.Detail.push(re);
                          if(m["Detailpreview"]=="")
                          {
                            m["Detailpreview"]=re.label;
                          }
                          else{
                            m["Detailpreview"]= m["Detailpreview"]+", "+re.label;
                          }
                        }
                      });

                    }
                  }
                  else if (text.slug == "q21") {
                    if (m.type == "0") {
                      m.isSen = true;
                    }
                  }
                 
               
                }
              });
              if (m.slug == "op80") {
                if (this.talentData.custom_language_r != undefined && this.talentData.custom_language_r != null) {
                  this.talentData.custom_language_r.forEach(cust => {
                    m.isSen = true;
                    m.Detail.push({ value: "0", label: cust.custom_language });
                  });
                }
              }
              if (m.slug == "op81") {
                if (this.talentData.custom_language_w != undefined && this.talentData.custom_language_w != null) {
                  this.talentData.custom_language_w.forEach(cust => {
                    m.isSen = true;
                    m.Detail.push({ value: "0", label: cust.custom_language });

                  });
                }
              }
            });

          });
        });

      }
    })

  }

  editJobStatus(id:number,status:string){
    this.jobId = id;
    this.jobStatus = status;
  }

  // Approve Job
  approveJob(){
    this.auth.approveJobAd(this.jobId,this.jobStatus,this.api_key).subscribe(res => {
      if(res['code'] === 200){
        this.closeAddExpenseModal.nativeElement.click();
        this.listJobAdsss(this.pageval);
      }
    })

  }

  // Reject Job
  rejectJob(){
      this.submitted = true;
      if (this.RejectionForm.invalid) {
        return;
      }
      this.reasons =  this.RejectionForm.value.reasons;
      this.auth.rejectJobAd(this.jobId,this.jobStatus,this.api_key,this.reasons).subscribe(res => {
        if(res['code'] === 200){
          this.closeAddModal.nativeElement.click();
          this.submitted = false;
          this.RejectionForm.reset();
          this.listJobAdsss(this.pageval);
        }
      })
  }
  closeModel(){
    this.submitted = false;
    this.RejectionForm.reset();
  }

}

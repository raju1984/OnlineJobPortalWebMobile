import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService, AssetPipe } from '../../provider/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { questions, states, addJobData, Department, groupQuestion, industries } from 'src/Provider/Comman/Comman';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MixpanelService } from '../../mixpanel/mixpanel.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  providers: [Title]
})

export class SummaryComponent implements OnInit {
  @ViewChild('ref') ref: ElementRef;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild('openAddExpenseModal') openAddExpenseModal: ElementRef;

  tId: any;
  api_key: any;
  user_id: any;
  talentData: any;
  AddJobsForm: FormGroup;
  submitted = false;
  talentJobList: any = [];
  DepartmentList: Department[] = [];
  JoinTimeList = [];
  NationalityTypeList = [];
  JobTypeList = [];
  StateList: states[];
  QuestionList: questions[] = [];
  QuestionList2: questions[] = [];
  QuestionList3: questions[] = [];
  message: any;
  jobData: any;
  edit_id: any;
  job_status:any;
  // Set api Text 
  relivList: any[] = [];
  otherDegree: any[] = [];
  university: any[] = [];
  industry: any[] = [];
  hardSkillList: any[] = [];
  itemList: any[] = [];
  tellusmore: string;
  JobPostionList: any[] = [];
  edit: string = "0";
  insertdata: any;
  depart: any[] = [];

  department_name: any;
  talentDesData: any;
  name: string;
  state: string;
  Description: string;
  jobpostion: any;
  groups: any[] = [];
  academic: groupQuestion[] = [];
  hardSkill: groupQuestion[] = [];
  WorkExp: groupQuestion[] = [];
  IndustryList: industries[];
  desArray: any[] = [];

  nameofPosition: any[] = [];
  flag: boolean = false;
  list: any[] = [];
  dataList: any[] = [];

  languges: any[] = [];
  jobTitle: any;
  company_visible: boolean = false;
  itemChecked: boolean = false;

  previewScreen: boolean = true;
  public flagcall: boolean;
  comName: any;
  today = new Date();
  jstoday = '';
  com_logo: any;
  minDate: Date;
  maxDate: Date;
  isReadOnly:boolean = false;
  reasonArray:any=[];
  jobName:string;
  // min = new Date().toJSON().split('T')[0];
  //max = new Date().toJSON().split('T')[0];
  constructor(public formBuilder: FormBuilder, public auth: AuthService, public route: Router,
    public Piper: AssetPipe, private title: Title, private aroute: ActivatedRoute,
    private datePipe: DatePipe,private mixpanelService: MixpanelService) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 3);
    this.maxDate.setDate(this.maxDate.getDate() + 13);
    // console.log(this.datePipe.transform(this.maxdate,"yyyy-MM-dd"));

    this.title.setTitle(' Jobtiviti - Talent Summary');
    this.com_logo = localStorage.getItem("logo");
    this.api_key = this.auth.getToken();
    this.user_id = this.auth.getId();
    this.comName = this.auth.getCompanyName();
    this.edit_id = undefined;
    this.company_visible = false;
    console.log(this.company_visible);
    // Form Validation
    this.AddJobsForm = this.formBuilder.group(
      {
        title: new FormControl("", Validators.compose([Validators.required])),
        descriptions: new FormControl("", Validators.compose([Validators.required])),
        state_id: new FormControl("", Validators.compose([Validators.required])),
        min_salary: new FormControl("", Validators.compose([Validators.required,Validators.min(1)])),
        max_slaray: new FormControl("", Validators.compose([Validators.required])),
        no_of_vacancy: new FormControl("", Validators.compose([Validators.required,Validators.min(1)])),
        join_time: new FormControl("", Validators.compose([Validators.required])),
        job_type: new FormControl("", Validators.compose([Validators.required])),
        nationality_id: new FormControl("", Validators.compose([Validators.required])),
        questions1: new FormControl("", Validators.compose([Validators.required])),
        questions2: new FormControl("", Validators.compose([Validators.required])),
        questions3: new FormControl("", Validators.compose([Validators.required])),
        expire_date: new FormControl("", [this.compareTwoDates]),
      },
      { validator: this.maxSalaryValidation }
    );
    this.jstoday = formatDate(this.today, 'd MMM y', 'en-US', '+0530');
   
    Observable.interval(2000 * 60).subscribe((val) => {
      if (this.flagcall) {
        this.saveData();
      }
    });
  }
  maxSalaryValidation(c: AbstractControl): { maxValue: boolean } {
    if (c.get("min_salary").value > c.get("max_slaray").value) {
      return { maxValue: true };
    }
  }

  compareTwoDates(c: AbstractControl): { Passinvalid: boolean } {
    const minDate = new Date();
    const maxDate = new Date();
    minDate.setDate(minDate.getDate() + 2);
    maxDate.setDate(maxDate.getDate() + 13);
    if (new Date(minDate) <= new Date(c.value) && new Date(maxDate) >= new Date(c.value)) {
      return null;
    }
    else {
      return { Passinvalid: true };
    }
  }

  get f() { return this.AddJobsForm.controls; }

  ngOnInit() {
    this.aroute.queryParams.subscribe(params => {
      if (params["id"] != ' ') {
        this.tId = params["id"];
        this.getdepartmentlist();
        this.getJoinTimelist();
        this.GetJobPosition();
        this.getJobTypelist();
        this.getNationalityTypelist();
        this.GetQuestionList();
        this.GetQuestionList2();
        this.GetQuestionList3();
        this.GetStateList();
        this.getlanguage();
        this.callhardSkill();
        this.getindustrydata();
        this.getuniverstiyperfice();
        this.getnameOfJon();
        this.getreliventList();
      
        if (params["job"] == undefined) {
          this.edit = "0";
          if (params["activejob"] != undefined) {
            this.edit = params["activejob"];
            this.listJob('Active');
          }
        } else {
          this.edit = params["job"];
          document.getElementById("openModalButton").click();
          this.listJob('Active');
        }
        this.gettalentDetail();
      }
    });
    this.itemChecked = false;
  }
  expireDays:number;
  // Click On Edit Profile
  editJobData(id: any) {
    this.edit_id = id;
    this.setjobData();
    this.previewScreen=true;
  }
  cloneJobData(id: any){
    this.auth.geteditData(id).subscribe(res => {
      this.jobData = res['data'];
      if (res['code'] === 200) {
        this.AddJobsForm.controls['title'].setValue(this.jobData['title']);
        this.AddJobsForm.controls['descriptions'].setValue(this.jobData['descriptions']);
        this.AddJobsForm.controls['state_id'].setValue(this.jobData['state_id']);
        this.AddJobsForm.controls['min_salary'].setValue(this.jobData['min_salary']);
        this.AddJobsForm.controls['max_slaray'].setValue(this.jobData['max_slaray']);
        this.AddJobsForm.controls['no_of_vacancy'].setValue(this.jobData['no_of_vacancy']);
        this.AddJobsForm.controls['join_time'].setValue(this.jobData['join_time']);
        this.AddJobsForm.controls['job_type'].setValue(this.jobData['job_type']);
        this.AddJobsForm.controls['nationality_id'].setValue(this.jobData['nationality_type']);
        this.AddJobsForm.controls['questions1'].setValue(this.jobData['quessData'][0].question_id);
        this.AddJobsForm.controls['questions2'].setValue(this.jobData['quessData'][1].question_id);
        this.AddJobsForm.controls['questions3'].setValue(this.jobData['quessData'][2].question_id);
        this.jstoday = this.jobData['created_att'];
        this.job_status = this.jobData['job_status'];
        this.isReadOnly = false;
        this.itemChecked = this.jobData['company_visible']==true?false:true;

        var diff = Math.abs(this.AddJobsForm.value.expire_date.getTime() - this.today.getTime());
        this.expireDays = Math.ceil(diff / (1000*3600*24)); 

        setTimeout(() => {
          this.GetQuestionList2();
          this.GetQuestionList3();
        }, 100)
      }
    });

  }

  // Set Job Data when we update jobs
  setjobData() {
    if (this.edit_id != null && this.edit_id != undefined && this.edit_id != ' ') {
      this.auth.geteditData(this.edit_id).subscribe(res => {
        this.jobData = res['data'];
        if (res['code'] === 200) {
          this.AddJobsForm.controls['title'].setValue(this.jobData['title']);
          this.AddJobsForm.controls['descriptions'].setValue(this.jobData['descriptions']);
          this.AddJobsForm.controls['state_id'].setValue(this.jobData['state_id']);
          this.AddJobsForm.controls['min_salary'].setValue(this.jobData['min_salary']);
          this.AddJobsForm.controls['max_slaray'].setValue(this.jobData['max_slaray']);
          this.AddJobsForm.controls['no_of_vacancy'].setValue(this.jobData['no_of_vacancy']);
          this.AddJobsForm.controls['join_time'].setValue(this.jobData['join_time']);
          this.AddJobsForm.controls['job_type'].setValue(this.jobData['job_type']);
          this.AddJobsForm.controls['nationality_id'].setValue(this.jobData['nationality_type']);
          this.AddJobsForm.controls['questions1'].setValue(this.jobData['quessData'][0].question_id);
          this.AddJobsForm.controls['questions2'].setValue(this.jobData['quessData'][1].question_id);
          this.AddJobsForm.controls['questions3'].setValue(this.jobData['quessData'][2].question_id);
          this.jstoday = this.jobData['created_att'];
          this.expireDays = this.jobData['expireDays'];
          this.AddJobsForm.controls['expire_date'].setValue(this.datePipe.transform(this.jobData['expire_date'], "M/d/yyyy"));
          this.job_status = this.jobData['job_status'];
          if(this.job_status === 'Approved' || this.job_status === 'Pending' ){ 
            this.isReadOnly = true;
           
          }
          else{
            this.isReadOnly = false;
          }
          this.itemChecked = this.jobData['company_visible'];
          setTimeout(() => {
            this.GetQuestionList2();
            this.GetQuestionList3();
          }, 100)
        }
      });
    }
  }

  // Close Model Pop up
  closeModel() {
    this.submitted = false;
    this.edit_id = undefined;
    this.AddJobsForm.reset();
    this.Description = "";
    this.itemChecked = false;
    this.flagcall = false;
    localStorage.removeItem('storeObj' + this.user_id + this.tId);
  }
  // onClickedOutside(e: Event) {
  //    console.log(e);
  //    console.log("dgf");
  //   this.submitted = false;
  //   this.edit_id = undefined;
  //   this.AddJobsForm.reset();
  //   this.Description = "";
  //   this.itemChecked = false;
  //   this.flagcall = false;
  // }

  // Delete Job
  directdeleteJobData(id: any) {
    this.auth.deleteJob(id).subscribe(res => {
      this.listJob('Active');
    });
  }
  deleteJobData() {
    this.auth.deleteJob(this.edit_id).subscribe(res => {
      this.listJob('Active');
    });
  }


  // CheckBox Value
  toggleVisibility(e) {
    this.company_visible = e.target.checked;
    this.itemChecked=e.target.checked;
    console.log(this.company_visible);
  }

  // Add Job
  addJobs() {
    this.submitted = true;
    if (this.AddJobsForm.invalid) {
      return;
    }
    // this.datePipe.transform(this.today, 'h:MM:ss');
    let latest_date = "23:59:59";
    console.log(this.AddJobsForm.value.expire_date);
    let addJobs: addJobData = {
      title: this.AddJobsForm.value.title,
      descriptions: this.AddJobsForm.value.descriptions,
      state_id: this.AddJobsForm.value.state_id,
      min_salary: this.AddJobsForm.value.min_salary,
      max_slaray: this.AddJobsForm.value.max_slaray,
      no_of_vacancy: this.AddJobsForm.value.no_of_vacancy,
      join_time: this.AddJobsForm.value.join_time,
      nationality_id: this.AddJobsForm.value.nationality_id,
      job_type: this.AddJobsForm.value.job_type,
      questions1: this.AddJobsForm.value.questions1,
      questions2: this.AddJobsForm.value.questions2,
      questions3: this.AddJobsForm.value.questions3,
      token: this.api_key,
      talent_id: this.tId,
      edit_id: this.edit_id,
      company_visible: this.company_visible==true?false:true,
      
      expire_date: this.datePipe.transform(this.AddJobsForm.value.expire_date, "yyyy-MM-dd" + ' ' + latest_date)
    }
    console.log(addJobs);
    if (this.edit_id != null && this.edit_id != undefined && this.edit_id != ' ') {

      this.auth.editJobs(addJobs).subscribe(res => {
        if (res['code'] === 200) {
          this.mixpanelService.track("Button Click",{"name": "Submit Job Ad"});
          this.message = res['message'];
          this.edit_id = undefined;
          this.AddJobsForm.reset();
          this.previewScreen = true;
          //this.closeAddExpenseModal.nativeElement.click();
          this.listJob('Active');
          this.submitted = false;
          document.getElementById("confirmJobModel").click();
        }
        else {
          this.message = res['message'];
        }
      });
    }
    else {
      localStorage.removeItem('storeObj' + this.user_id + this.tId);
      this.auth.addJobs(addJobs).subscribe(res => {
        if (res['code'] === 200) {
          this.mixpanelService.track("Button Click",{"name": "Submit Job Ad"});
          this.message = res['message'];
          //this.closeAddExpenseModal.nativeElement.click();
          this.AddJobsForm.reset();
          this.listJob('Active');
          this.submitted = false;
          this.itemChecked = false;
          this.previewScreen = true;
          this.flagcall = false;
          document.getElementById("confirmJobModel").click();
        }
        else {
          this.message = res['message'];
        }
      });

    }

  }

  // All Job Listing
  listJob(type:string) {
    this.talentJobList=[];
    this.edit_id = undefined;
    this.auth.talentListjobs(this.tId,type).subscribe(res => {
      this.talentJobList = res['data'];
      if (this.talentJobList != undefined) {
        this.talentJobList.forEach(x => {
          if (x.questionData != undefined) {
            x.questionData.forEach(y => {
              this.QuestionList.forEach(q => {
                if (y.question_id != undefined) {
                  if (y.question_id == q.id) {
                    y["quesName"] = q.question;
                  }
                }
              });
            });
          }
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

  // Get State List
  GetStateList() {
    this.auth.getState().subscribe(x => {
      this.StateList = x;
    });
  }

  // Get Job Position List
  GetJobPosition() {
    this.auth.getJobPositions().subscribe(x => {
      this.JobPostionList = x;

    });
  }

  // Get Question List
  GetQuestionList() {
    this.auth.getQuestions().subscribe(x => {
      this.QuestionList = x;
      console.log(this.QuestionList);
      this.QuestionList2 = this.QuestionList;
      this.QuestionList3 = this.QuestionList;
    });
  }
  GetQuestionList2() {

    if (this.AddJobsForm.value.questions1 != null) {
      this.QuestionList2 = [];
      this.QuestionList2 = this.QuestionList.filter(data => data.id !== this.AddJobsForm.value.questions1);
    }
    console.log(this.QuestionList2);
  }
  GetQuestionList3() {

    if (this.AddJobsForm.value.questions1 != null) {
      this.QuestionList3 = [];
      this.QuestionList2 = this.QuestionList2.filter(data => data.id !== this.AddJobsForm.value.questions1);
      this.QuestionList3 = this.QuestionList2.filter(data => data.id !== this.AddJobsForm.value.questions2);
    }
    console.log(this.QuestionList3);
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

  // Get Nationality List
  getNationalityTypelist() {
    this.auth.getNationalityType().subscribe(res => {
      this.NationalityTypeList = res;

    })
  }

  // Get Talent Detail
  gettalentDetail() {
    if (this.tId != '') {
      this.auth.getTalentSummary(this.tId, this.api_key).subscribe(res => {
        this.talentData = res;
        console.log(this.talentData);
        this.name = res.name;
        this.DepartmentList.forEach(m => {
          if (m.id == this.talentData.department_id) {
            this.department_name = m.department_name;
          }
        });

        this.JobPostionList.forEach(jp => {
          if (jp.id == this.talentData.position_level) {
            this.jobpostion = jp.position_name;
          }
        });

        this.StateList.forEach(s => {
          if (res["state"] != undefined) {
            if (s.id == res["state"]) {
              this.state = s.state_name;
            }
          }
        });

        this.desArray = res.talent_profile_questions;
        res.talent_profile_questions.forEach(x => {
          //this.talentData
          if (this.Description == undefined) {
            this.Description = x.text;
          }
          else {
            this.Description = this.Description + "&#10;" + x.text;
          }
          //this.jobDescription = this.Description;
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
              res.talent_profile_answere.forEach(y => {
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
                if (res.custom_degree != undefined && res.custom_degree != null) {

                  res.custom_degree.forEach(cust => {
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
                if (res.custom_degree != undefined && res.custom_degree != null) {
                  res.custom_degree.forEach(cust => {
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
                if (res.custom_degree != undefined && res.custom_degree != null) {
                  res.custom_degree.forEach(cust => {
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

                if (res.custom_university != undefined && res.custom_university != null) {
                  res.custom_university.forEach(cust => {
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
              res.talent_profile_answere.forEach(y => {
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
              res.talent_profile_answere.forEach(y => {
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
                  else if (text.slug == "q22") {
                    if (m.type == "5") {
                      m.isSen = true;
                      this.tellusmore = y.tell_us;
                    }
                  } else if (text.slug == "q23") {
                    m.isSen = true;
                    if (m.type == "1") {
                      m.isSen = true;
                      this.languges.forEach(re => {
                        if (re.value == y.question_answer_id) {
                          m.Detail.push(re);
                        }
                      });

                    }
                  }
                  else if (text.slug == "q24") {
                    m.isSen = true;
                    if (m.type == "1") {
                      m.isSen = true;
                      this.languges.forEach(re => {
                        if (re.value == y.question_answer_id) {
                          m.Detail.push(re);
                        }
                      });

                    }

                  }
                }
              });
              if (m.slug == "op80") {
                if (res.custom_language_r != undefined && res.custom_language_r != null) {
                  res.custom_language_r.forEach(cust => {
                    m.isSen = true;
                    m.Detail.push({ value: "0", label: cust.custom_language });
                  });
                }
              }
              if (m.slug == "op81") {
                if (res.custom_language_w != undefined && res.custom_language_w != null) {
                  res.custom_language_w.forEach(cust => {
                    m.isSen = true;
                    m.Detail.push({ value: "0", label: cust.custom_language });

                  });
                }
              }
            });

          });
        });

      });
    }

  }

  // Get Position List
  getnameOfJon() {
    this.nameofPosition = [];
    this.auth.getPositions().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.position_name });
      });
      this.nameofPosition = this.itemList;
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

  // Get university Data
  getuniverstiyperfice() {
    this.auth.getUniversity().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.university_name });
      });
      this.university = this.itemList;
    });
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

  // Get Language list
  getlanguage() {
    this.auth.getLanguageSkill().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.languages_name });
      });
      this.languges = this.itemList;

    });
  }

  // Click on Home Icon
  onIconClick() {
    this.route.navigate(["/home/dashboard"])
  }

  // When Click on Add Job Button
  oncreate() {

       this.submitted = false;
       this.edit_id = undefined;
       this.AddJobsForm.reset();
       this.isReadOnly = false;

    this.flagcall = true;

    if (this.name != undefined) {
      this.jobTitle = this.name;
    }
    else {
      this.name = this.jobTitle;
    }
    this.previewScreen = true;

    const storeJob = JSON.parse(localStorage.getItem("storeObj" + this.user_id + this.tId));
    if (storeJob) {
      if (storeJob.user_id == this.user_id) {
        document.getElementById("openCookieModal").click();
      }
    }
    else {
      document.getElementById("openModalButton").click();
    }
     

  }

  ngOnDestroy() {
    this.flagcall = false;
  }

  // Save Data in Storage
  saveData() {
    var myObj = {
      data: this.AddJobsForm.value,
      user_id: this.user_id
    };
    localStorage.setItem("storeObj" + this.user_id + this.tId, JSON.stringify(myObj));
  }

  // Set Storage Data
  setCookieData() {
    document.getElementById("openModalButton").click();
    const setCookieJob = JSON.parse(localStorage.getItem("storeObj" + this.user_id + this.tId));
    this.AddJobsForm.controls['title'].setValue(setCookieJob.data.title);
    this.AddJobsForm.controls['descriptions'].setValue(setCookieJob.data.descriptions);
    this.AddJobsForm.controls['state_id'].setValue(setCookieJob.data.state_id);
    this.AddJobsForm.controls['min_salary'].setValue(setCookieJob.data.min_salary);
    this.AddJobsForm.controls['max_slaray'].setValue(setCookieJob.data.max_slaray);
    this.AddJobsForm.controls['no_of_vacancy'].setValue(setCookieJob.data.no_of_vacancy);
    this.AddJobsForm.controls['join_time'].setValue(setCookieJob.data.join_time);
    this.AddJobsForm.controls['job_type'].setValue(setCookieJob.data.job_type);
    this.AddJobsForm.controls['nationality_id'].setValue(setCookieJob.data.nationality_id);
    this.AddJobsForm.controls['questions1'].setValue(setCookieJob.data.questions1);
    this.AddJobsForm.controls['questions2'].setValue(setCookieJob.data.questions2);
    this.AddJobsForm.controls['questions3'].setValue(setCookieJob.data.questions3);
  }

  // Remove Storage Data
  removeCookieData() {
    localStorage.removeItem('storeObj' + this.user_id + this.tId);
    this.AddJobsForm.reset();
    this.submitted = false;
  }
  JobType:string;
  stateType:string;
  // Show Mobile mock Screen
  previewJobs() {
    this.submitted = true;
    console.log(this.AddJobsForm)
    if (this.AddJobsForm.invalid) {
      return;
    }
    if(this.itemChecked!=undefined){
      this.company_visible = this.itemChecked;
      }
    this.previewScreen = false;
    this.JobTypeList.forEach(jt => {
      if (this.AddJobsForm.value.job_type == jt.value) {
        this.JobType = jt.text;
      }
    });
    this.StateList.forEach(jt => {
      if (this.AddJobsForm.value.state_id == jt.id) {
        this.stateType = jt.state_name;
      }
    });
    var diff = Math.abs(this.AddJobsForm.value.expire_date.getTime() - this.today.getTime());
        this.expireDays = Math.ceil(diff / (1000*3600*24)); 

    
  }

  // Back From Preview Screen
  previewBack() {
    this.itemChecked = this.company_visible;
    this.previewScreen = true;
    
  }
  
  getAllReason(id:any){
    this.auth.getRejectedReason(this.api_key,id).subscribe(res => {
      if(res['code'] == 200){
        this.reasonArray = res['data'];
        this.jobName = res['job_name'];
      }

    });
  }
}

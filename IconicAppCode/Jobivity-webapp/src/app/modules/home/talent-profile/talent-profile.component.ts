import { Component, OnInit, ChangeDetectorRef, ViewChildren, ElementRef, Renderer, ViewChild } from '@angular/core';
import { AuthService, AssetPipe } from '../../provider/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { states, Department,PaymentDetails, groupQuestion, industries, TalentProfile, answerdetail, QuestionAnswer } from '../../../../Provider/Comman/Comman';
import { NgxSpinnerService } from 'ngx-spinner';
import { SafeResourceUrl, DomSanitizer, Title } from '@angular/platform-browser';
element: HTMLElement;
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable  } from 'rxjs';
import 'rxjs/add/observable/interval';
import { MixpanelService } from '../../mixpanel/mixpanel.service';

@Component({
  selector: 'app-talent-profile',
  templateUrl: './talent-profile.component.html',
  styleUrls: ['./talent-profile.component.css'],
  providers: [Title]
})

export class TalentProfileComponent implements OnInit {

  IsProfile: boolean = true;
  IsDetailContaner: boolean = false;
  Isdetail: boolean = false;
  IsAcedmic: boolean = false;
  IsCreatProfileBut: boolean = false;

  descripetion: string;
  department: string;
  name: string;
  api_key: string;
  description: string;
  Message: string;
  showchart: boolean = false;
  firstTalentStatus: boolean = true;
  Success: boolean = false;
  CheckCharList: boolean = false;
  chartlegend: boolean = false;
  ShowAddtelant: boolean = true;
  IsFirstQuesitionShow: boolean = true;
  DataResponse: any[] = [];
  datavalue: number[] = [];
  Detail: any[] = [];
  Details: string;
  ProfileId: number[] = [];
  groups: any[] = [];
  Department: any[] = [];
  urlUser: string;
  EditId: number;
  classremove: string = "collapse";

  DepartmentList: Department[] = [];
  academic: groupQuestion[] = [];
  hardSkill: groupQuestion[] = [];
  WorkExp: groupQuestion[] = [];
  IndustryList: industries[];

  StateList: states[];
  TalentProfileList: TalentProfile[];
  position_level: any[] = [];
  itemList: PaymentDetails[] = [];
  DropDownText: SafeResourceUrl;
  talnt_id: number;
  baseUrlFolN: string;

  labelVaue: string;
  id: number;
  QueationOptionId: number;
  languges: any[] = [];

  nameofPosition: any[] = [];
  flag: boolean = false;
  list: any[] = [];
  dataList: any[] = [];

  display: any;

  item: any[] = [];
  // Set api Text 
  relivList: any[] = [];
  otherDegree: any[] = [];
  university: any[] = [];
  industry: any[] = [];
  hardSkillList: any[] = [];

  @ViewChild('myDiv') myDiv: ElementRef;
  tellusmore: string;
  customUniversity: any = [];
  customDegree: any = [];
  CustomLanguageR: any = [];
  CustomLanguageW: any = [];

  inputNameSearch: string;

  // variable for Next tab
  Discription: string[] = [];
  nameRequired: boolean = false;
  DispRequired: boolean = false;
  DepRequired: boolean = false;
  positionRequired: boolean = false;
  details: any[] = [];
  positionLevel: any;
  postionId: string;
  showmessage:boolean=false;
   // For Edit function
   talent_profile_Id: number;
   DespDetail: any[] = [];
   result: any;
   public flagcall: boolean;
   user_id:any;
   message:string;
  constructor(public auth: AuthService,
    public route: Router,
    private spinner: NgxSpinnerService,
    public sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    public Piper: AssetPipe,
    private aroute: ActivatedRoute,
    private renderer: Renderer,
    private title: Title,
    private mixpanelService: MixpanelService,
    @Inject(DOCUMENT) document) {
    this.baseUrlFolN = this.auth.mapPathUrl;
    this.api_key = this.auth.getToken();
    this.user_id =this.auth.getId();
    this.title.setTitle(' Jobtiviti - Talent Profile');
    Observable.interval(2000 * 60).subscribe((val) => { 
      if(this.flagcall){
        this.saveData(); 
      }
      });
   }

  ngOnInit() {
    this.aroute.queryParams
      .subscribe(params => {
        this.EditId = params["Id"];
        this.getDepartment();
        this.GetpostionList();
        this.GettaTentprofileQuestion();
        this.callhardSkill();
        this.getindustrydata();
        this.getuniverstiyperfice();
        this.getnameOfJon();
        this.getreliventList();
        
        this.GetStateList();
      });

      if(this.EditId == 0){
        this.flagcall = true;
        const storeTalent = JSON.parse(localStorage.getItem("storeTObj"+ this.user_id));
         if(storeTalent){
             if(storeTalent.user_id == this.user_id ){
              document.getElementById("openCookieModal").click();
             }
         }
       } 
       else{
         this.flagcall = false;
       }
  }
  ngOnDestroy() {
    this.flagcall = false;
}

  gettalentprofileUser() {
    this.auth.gettalentprofile(this.api_key).subscribe(res => {
      this.TalentProfileList = res["data"];
      this.IsProfile = true;
      this.Isdetail = false;
      this.IsDetailContaner = false;
      this.IsCreatProfileBut = true;
    });
  }

 // Check View position_level
  CheckView() {
    this.Isdetail = true;
    this.IsDetailContaner = true;
  }

 // Get State List
  GetStateList() {
    this.auth.getState().subscribe(x => {
      this.StateList = x;
    });
  }

 // Get Position List
  GetpostionList() {
    this.position_level = [];
    this.position_level.push({ value: "1", label: "Trainee" });
    this.position_level.push({ value: "2", label: "Junior Executive" });
    this.position_level.push({ value: "3", label: "Senior Executive" });
    this.position_level.push({ value: "4", label: "Manager" });
  }

  CreateProfile() {
    this.IsProfile = false;
    this.Isdetail = true;
    this.IsDetailContaner = true;
    this.IsCreatProfileBut = false;
  }

  // Get Talent Profile Question List
  GettaTentprofileQuestion() {
    this.auth.getTalentprofile(this.api_key).subscribe(res => {
      console.log(res);
      this.groups = res;
      this.academic = res["Academic"];
      this.hardSkill = res["Hard_Skills"];
      console.log(this.academic);
      this.WorkExp = res["Work_Experience"];
      this.hardSkill.forEach(x => {
        if (x.slug == "q19") {
          this.gethardskill(x.question_options[0]);
        }
        if (x.slug == "q23") {
          this.getlanguage(x.question_options[0]);
        }
        if (x.slug == "q24") {
          this.getlanguage(x.question_options[0]);
        }
      });
      if (this.EditId != 0 && this.EditId != undefined) {
        this.editprofile(this.EditId);
      }
      else {
        this.CheckView();
      }
    });
  }

 // Get Department list
  getDepartment() {
    this.auth.getDepartment().subscribe(x => {
      this.DepartmentList = x;
      this.Department = [];
      x.forEach(y => {
        this.Department.push({ value: y.id.toString(), label: y.department_name });
      });

    });
  }
 
  GetbinddataEvent(Data: any, type: string) {
    if (Data.type == 1) {
      if (Data.slug == "op73") {
        if (Data.isSen != undefined) {
          Data.isSen = !Data.isSen;
        }
        else {
          Data.isSen = true;
        }
        var element = document.getElementById("homeop72");
        element.classList.remove("in");
        element.style.height = "auto";
        var element1 = document.getElementById("headop72");
        element1.setAttribute("aria-expanded", "false");
        //  this.NotSelectWorkExpValue(Data);
        this.getDepartmentList(Data);
        this.NotSelectWorkExpValue(Data);
      }
      else if (Data.slug == "op74") {
        if (Data.isSen != undefined) {
          Data.isSen = !Data.isSen;
        }
        else {
          Data.isSen = true;
        }
        var element = document.getElementById("homeop72");
        element.classList.remove("in");
        element.style.height = "auto";
        var element1 = document.getElementById("headop72");
        element1.setAttribute("aria-expanded", "false");
        this.NotSelectWorkExpValue(Data);
        this.Getindustryrelated(Data);

      }
    }
    else {
      if (type == 'Work_Experience') {
        if (Data.isSen != undefined) {
          Data.isSen = !Data.isSen;
        }
        else {
          Data.isSen = true;
        }
        var element = document.getElementById("homeop73");
        element.classList.remove("in");
        element.style.height = "auto";
        var element1 = document.getElementById("headop73");
        element1.setAttribute("aria-expanded", "false");

        var element = document.getElementById("homeop74");
        element.classList.remove("in");
        element.style.height = "auto";
        var element1 = document.getElementById("headop74");
        element1.setAttribute("aria-expanded", "false");
        this.NotSelectWorkValue(Data);
      }
    }
  }

  Getbinddata(Data: any, type: string) {

    if (Data.type == 1) {
      if (Data.slug == "op57") {
        Data.isSen = true;
        this.getotherdegree(Data);
        this.NotSelectAcademicValue(Data);
      }
      else
        if (Data.slug == "op58") {
          Data.isSen = true;
          this.getotherdegree(Data);
          this.NotSelectAcademicValue(Data);
        }
        else
          if (Data.slug == "op78") {
            Data.isSen = true;
            this.getotherdegree(Data);
            this.NotSelectAcademicValue(Data);
          }
            else if (Data.slug == "op60") {
              Data.isSen = true;
              this.getuniversity(Data);
              this.NotSelectAcademicValue(Data);
            }
            else if (Data.slug == "op71") {
              Data.isSen = true;
              this.gethardskill(Data);
            }
            else if (Data.slug == "op73") {
              Data.isSen = true;
              this.getDepartmentList(Data);
              this.NotSelectWorkValue(Data);

            }
            else if (Data.slug == "op74") {
              Data.isSen = true;
              this.Getindustryrelated(Data);
              this.NotSelectWorkValue(Data);
          }
          else if (Data.slug == "op82") {
            Data.isSen = true;
            this.getotherdegree(Data);
            this.NotSelectAcademicValue(Data);
          }
    }
    else {
      if (type == 'Academic') {
        Data.isSen = true;
        this.NotSelectAcademicValue(Data);
      }
      else if (type == 'Work_Experience') {
        Data.isSen = true;
        this.NotSelectWorkValue(Data);
      }
      else if (type == 'hard_skill') {
        Data.isSen = true;
        this.NotSelecthardValue(Data);
      }
    }
  }

 // Get Department List
  getDepartmentList(data: any) {
    this.auth.getDepartment().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.department_name });
      });
      data.DropDownText = this.itemList;
      data.DepId = this.id;
      data.DepQuestID = this.QueationOptionId;
    });
  }

 // Get Relevent Degree List
  getreliventdegree(data: any) {
    this.auth.getReliventDegree().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.degree_name });
      });
      data.DropDownText = this.itemList;
    });
  }
// Get Other Degree List
  getotherdegree(data: any) {
    this.auth.getOtherDegree().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.degree_name });
      });
      data.DropDownText = this.itemList;
    });
  }

// Get University List
  getuniversity(data: any) {
    this.auth.getUniversity().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.university_name });
      });
      data.DropDownText = this.itemList;
    });
  }

// Get Industries List
  Getindustryrelated(data: any) {
    this.auth.getIndustries().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.industry_name });
      });
      data.DropDownText = this.itemList;

    });

  }

// Get Hard Skills List
  gethardskill(data: any) {
    this.auth.getHandSkill().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.skill_name });
      });
      
      data.DropDownText = this.itemList;
      data.isSen = true;
    });
  }

  // Get Language List
  getlanguage(data: any) {
    this.auth.getLanguageSkill().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.languages_name });
      });
      this.languges = this.itemList;
      data.DropDownText = this.itemList;
      data.isSen = true;
    });
  }

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
  // Search position
  searchClient(search: string) {
    this.list = [];
    this.flag = false;
    if (search != "" && search != null && search.length > 2) {
      let list = this.nameofPosition.filter(x => x.label.toLowerCase().indexOf(search.toLocaleLowerCase()) > -1);

      if (list.length > 0) {
        this.flag = true;
        this.dataList = [];
        list.forEach(x => {
          this.dataList.push(x.label);
        });
      }
      else {
        this.flag = false;
      }
    }
  }
  
  onselectClient(selected: string) {
    this.inputNameSearch = selected;
    this.flag = false;
  }

  // Find which is selected
  NotSelectAcademicValue(data: any) {
    this.academic.forEach(e => {
      if (e.id == data.question_id) {
        e.isSen = true;
        e.question_options.forEach(x => {
          if (x.slug != data.slug) {
            x.isSen = false;
          }
        });
      }
    });
  }

  // Find which is selected
  NotSelectWorkValue(data: any) {
    this.WorkExp.forEach(e => {
      if (e.id == data.question_id) {
        e.isSen = true;
        e.question_options.forEach(x => {
          if (x.slug != data.slug) {
            x.isSen = false;
          }
        });
      }
    });
  }

  NotSelecthardValue(data: any) {
    this.hardSkill.forEach(e => {
      if (e.id == data.question_id) {
        e.isSen = true;
        e.question_options.forEach(x => {
          if (x.slug != data.slug) {
            x.isSen = false;
          }
        });
      }
    });
  }

  NotSelectWorkExpValue(data: any) {
    if (data.slug == "op72") {
      this.WorkExp.forEach(e => {
        if (e.id == data.question_id) {
          e.isSen = true;
          e.question_options.forEach(x => {
            if (x.slug != data.slug) {
              x.isSen = false;
            }
          });
        }
      });
    }
    else {
      this.WorkExp.forEach(e => {
        if (e.id == data.question_id) {
          e.isSen = true;
          e.question_options.forEach(x => {
            if (x.slug == "op72") {
              x.isSen = false;
            }
          });
        }
      });
    }
  }

  
  ChangeNext() {
    if (this.inputNameSearch == undefined && this.inputNameSearch == null) {
      this.nameRequired = true;
    }
    else {
      if (this.inputNameSearch == "") {
        this.nameRequired = true;
      }
      else {
        this.nameRequired = false;
      }
    }
    if (this.positionLevel != null) {
      this.postionId = this.positionLevel["value"];
      if (this.positionLevel == undefined && this.positionLevel == null) {
        this.positionRequired = true;
      }
      else {
        this.positionRequired = false;
      }
    }
    else {
      this.positionRequired = true;
    }

    if (this.Detail != null) {
      this.department = this.Detail["value"];
      if (this.department == undefined && this.department == null) {
        this.DepRequired = true;
      }
      else {
        this.DepRequired = false;
      }
    }
    else {
      this.DepRequired = true;
    }
    this.Discription = [];
    if (this.words2 != undefined) {
      this.words2.forEach(x => {
        this.Discription.push(x.value);
      });
    }

    if (this.Discription[0] == "") {

      this.DispRequired = true;
    }
    else {
      this.DispRequired = false;
    }

    if (this.Discription != null && this.Discription[0] != ""
      && this.inputNameSearch != undefined && this.inputNameSearch != null &&
      this.inputNameSearch != "" && this.department != null &&
      this.department != "" && this.postionId != null
    ) {
      this.Isdetail = false;
      this.IsAcedmic = true;

    }
  }
  changeBack() {
    this.Isdetail = true;
    this.IsAcedmic = false;
  }
 
  // Save button Click
  onsaveClick() {

    this.spinner.show();
    let answerList: answerdetail[] = [];
    let academic: Boolean[] = [];
    let workexp: Boolean[] = [];
    let handskill = false;
    this.showmessage=false;
    if (this.academic) {
     
      this.academic.forEach(x => {
        if (x.isSen == true) {
          x.question_options.forEach(y => {
            if (y.isSen != undefined) {
              if (y.isSen == true) {
                if (y.type == "1") {
                  if (y.Detail != null && y.Detail != undefined) {
                    y.Detail.forEach(adam => {
                      
                      if (adam.value != undefined && adam.value != 0) {
                        let answer: answerdetail = {
                          ans_id: adam.value,
                          question_id: y.question_id,
                          option_id: y.id,
                          tell_us: "0"
                        };
                        answerList.push(answer);
                      }
                      else {
						 
                        if(adam.label!=undefined){
							 
                        if (y.slug == "op57") {
                          this.customDegree.push({ name: adam.label, slug: "op57" });
                        } else if(y.slug == "op58") {
                          this.customDegree.push({ name: adam.label, slug: "op58" });
                        } else if(y.slug == "op78") {
                          this.customDegree.push({ name: adam.label, slug: "op78" });
                        } else if (y.slug == "op60") {
                          this.customUniversity.push(adam.label);
                        }
                      }
                      else{
						  
                        if (y.slug == "op57") {
                          this.customDegree.push({ name: adam, slug: "op57" });
                        } else if(y.slug == "op58") {
                          this.customDegree.push({ name: adam, slug: "op58" });
                        } else if(y.slug == "op78") {
                          this.customDegree.push({ name: adam, slug: "op78" });
                        } else if (y.slug == "op60") {
                          this.customUniversity.push(adam);
                        }
                      }
                      }

                    });
                  }
                  else {
                    document.getElementById(x.slug).style.color = "red";
                    academic.push(true);
                  }
                }
                else if (y.type == "0") {
                  let answer: answerdetail = {
                    ans_id: "0",
                    question_id: y.question_id,
                    option_id: y.id,
                    tell_us: "0"
                  };
                  answerList.push(answer);
                }
              }
            }
          });
        }
        else {
          document.getElementById(x.slug).style.color = "red";
          var element = document.getElementById("collapseOne");
          element.classList.add("in");
          element.style.height = "auto";
          var element1 = document.getElementById("aria1");
          element1.setAttribute("aria-expanded", "true");
          academic.push(true);
        }
      });
    }

    if (this.WorkExp) {
      this.WorkExp.forEach(x => {
        if (x.isSen == true && x.type == "3") {
          x.question_options.forEach(y => {
            if (y.isSen != undefined) {
              if (y.isSen == true) {
                if (y.type == "1") {
                  if (y.Detail != null && y.Detail != undefined && y.Detail.length>0) {
                    y.Detail.forEach(adam => {
                      let answer: answerdetail = {
                        ans_id: adam.value,
                        question_id: y.question_id,
                        option_id: y.id,
                        tell_us: "0"
                      };
                      answerList.push(answer);
                    });
                  }
                  else {
                    document.getElementById(x.slug).style.color = "red";
                    workexp.push(true);
                  }
                }
                else if (y.type == "0") {
                  let answer: answerdetail = {
                    ans_id: "0",
                    question_id: y.question_id,
                    option_id: y.id,
                    tell_us: "0"
                  };
                  answerList.push(answer);
                }
                else if (y.type == "2") {
                  let answer: answerdetail = {
                    ans_id: "0",
                    question_id: y.question_id,
                    option_id: y.id,
                    tell_us: "0"
                  };
                  answerList.push(answer);
                  this.WorkExp.forEach(x => {
                    if (x.isSen == true && x.type == "4") {
                      x.question_options.forEach(y => {
                        if (y.isSen != undefined) {
                          if (y.isSen == true) {
                            if (y.type == "1") {
                              if (y.Detail != null && y.Detail != undefined && y.Detail.length>0) {
                                y.Detail.forEach(adam => {
                                  let answer: answerdetail = {
                                    ans_id: adam.value,
                                    question_id: y.question_id,
                                    option_id: y.id,
                                    tell_us: "0"
                                  };
                                  answerList.push(answer);
                                });
                              }
                              else {
                                document.getElementById(x.slug).style.color = "red";
                                var element = document.getElementById("collapseTwo");
                                element.classList.add("in");
                                element.style.height = "auto";
                                var element1 = document.getElementById("aria2");
                                element1.setAttribute("aria-expanded", "true");
                                workexp.push(true);
                              }
                            }
                            else if (y.type == "0") {
                              let answer: answerdetail = {
                                ans_id: "0",
                                question_id: y.question_id,
                                option_id: y.id,
                                tell_us: "0"
                              };
                              answerList.push(answer);
                            }
                          }
                        }
                      });
                    }
                    else if (x.type == "4") {
                      document.getElementById(x.slug).style.color = "red";
                      var element = document.getElementById("collapseTwo");
                      element.classList.add("in");
                      element.style.height = "auto";
                      var element1 = document.getElementById("aria2");
                      element1.setAttribute("aria-expanded", "true");
                      workexp.push(true);
                    }
                  });
                }
              }
            }
          });
        }
        else if (x.type == "3") {
          document.getElementById(x.slug).style.color = "red";
          var element = document.getElementById("collapseTwo");
          element.classList.add("in");
          element.style.height = "auto";
          var element1 = document.getElementById("aria2");
          element1.setAttribute("aria-expanded", "true");
          workexp.push(true);
        }
      });
    }
   
    if (this.hardSkill) {
      this.hardSkill.forEach(x => {
        x.question_options.forEach(y => {
          if (y.isSen != undefined) {
            if (x.slug == "q19") {
              if (y.type == "1" && y.isSen == true) {
                if (y.Detail != null && y.Detail != undefined && y.Detail.length>0) {
                  y.Detail.forEach(adam => {
                    let answer: answerdetail = {
                      ans_id: adam.value,
                      question_id: y.question_id,
                      option_id: y.id,
                      tell_us: "0"
                    };
                    answerList.push(answer);
                  });
                }
                else {
                  document.getElementById(x.slug).style.color = "red";
                  var element = document.getElementById("collapseThree");
                  element.classList.add("in");
                  element.style.height = "auto";
                  var element1 = document.getElementById("aria3");
                  element1.setAttribute("aria-expanded", "true");
                  handskill = true;
                }
              }
            }
            else if (x.slug == "q21") {
              if (y.type == "0" && y.isSen == true) {
                let answer: answerdetail = {
                  ans_id: "0",
                  question_id: y.question_id,
                  option_id: y.id,
                  tell_us: "0"
                };
                answerList.push(answer);

              }
            } else if (x.slug == "q23") {
              
              
              if (y.Detail != null && y.Detail != undefined && y.Detail.length>0) {
                y.Detail.forEach(adam => {
                  console.log(adam);
                  if (adam.value != undefined && adam.value != 0) {
                    let answer: answerdetail = {
                      ans_id: adam.value,
                      question_id: y.question_id,
                      option_id: y.id,
                      tell_us: "0"
                    };
                    answerList.push(answer);
                  }
                  else {
                    this.CustomLanguageR.push(adam.label);
                  }
                });
              }
              else {
                document.getElementById(x.slug).style.color = "red";
                var element = document.getElementById("collapseThree");
                element.classList.add("in");
                element.style.height = "auto";
                var element1 = document.getElementById("aria3");
                element1.setAttribute("aria-expanded", "true");
                handskill = true;
              }

            }
            else if (x.slug == "q24" ) {
              if (y.Detail != null && y.Detail != undefined && y.Detail.length>0) {
                y.Detail.forEach(adam => {
                  console.log(adam);
                  if (adam.value != undefined && adam.value != 0) {
                    let answer: answerdetail = {
                      ans_id: adam.value,
                      question_id: y.question_id,
                      option_id: y.id,
                      tell_us: "0"
                    };
                    answerList.push(answer);
                  }
                  else {
                    this.CustomLanguageW.push(adam.label);
                  }
                });
              }
              else {
                document.getElementById(x.slug).style.color = "red";
                var element = document.getElementById("collapseThree");
                element.classList.add("in");
                element.style.height = "auto";
                var element1 = document.getElementById("aria3");
                element1.setAttribute("aria-expanded", "true");
                handskill = true;
              }

            } 
            else if (x.slug == "q22") {
              if (y.type == "5") {
                if (this.tellusmore != undefined && this.tellusmore != "") {
                  let answer: answerdetail = {
                    ans_id: (0).toString(),
                    question_id: y.question_id,
                    option_id: y.id,
                    tell_us: this.tellusmore
                  };
                  answerList.push(answer);
                }
                else {
                  document.getElementById(x.slug).style.color = "red";
                  var element = document.getElementById("collapseThree");
                  element.classList.add("in");
                  element.style.height = "auto";
                  var element1 = document.getElementById("aria3");
                  element1.setAttribute("aria-expanded", "true");
                  handskill = true;
                }
              }
            }
          }
          else if (x.slug == "q22") {
            if (y.type == "5") {
              if (this.tellusmore != undefined && this.tellusmore != "") {
                let answer: answerdetail = {
                  ans_id: (0).toString(),
                  question_id: y.question_id,
                  option_id: y.id,
                  tell_us: this.tellusmore
                };
                answerList.push(answer);
              }
              else {
                document.getElementById(x.slug).style.color = "red";
                var element = document.getElementById("collapseThree");
                element.classList.add("in");
                element.style.height = "auto";
                var element1 = document.getElementById("aria3");
                element1.setAttribute("aria-expanded", "true");
                handskill = true;
              }
            }
          }
           else {
            if (x.isSen == true) {

            }
            else {
              document.getElementById(x.slug).style.color = "red";
              var element = document.getElementById("collapseThree");
              element.classList.add("in");
              element.style.height = "auto";
              var element1 = document.getElementById("aria3");
              element1.setAttribute("aria-expanded", "true");
              handskill = true;
            }


          }
        });
      });
    }
   
    if (!(academic.length > 0) && !(workexp.length > 0) && handskill == false) 
    {
      let QuestionViewer: QuestionAnswer = {
        api_token: this.api_key,
        name: this.inputNameSearch,
        department_id: this.department,
        job_description: this.Discription,
        position_level: this.postionId,
        anslist: answerList,
        talent_profile_id: this.talent_profile_Id == undefined ? null : this.talent_profile_Id,
        customDegree: this.customDegree,
        customUniversity: this.customUniversity,
        CustomLanguageR: this.CustomLanguageR,
        CustomLanguageW: this.CustomLanguageW
      };
      if (this.talent_profile_Id != null && this.talent_profile_Id != undefined) {
       
        this.auth.editTalentProfile(QuestionViewer).subscribe(res => {
          this.spinner.hide();
          if (res["success"] == "success") {
            this.mixpanelService.track("Button Click",{"name": "Save Talent Profile"});
            this.IsProfile = true;
            this.Isdetail = false;
            this.IsDetailContaner = false;
            this.IsCreatProfileBut = true;
            this.IsAcedmic = false;
            this.route.navigate(["/home/dashboard"]);
          }
        });
      }
      else {
        this.auth.settalentProfile(QuestionViewer).subscribe(res => {
          this.spinner.hide();
          if (res["success"] == "success") {
            this.talnt_id = res['talent_id'];
            this.IsProfile = true;
            this.Isdetail = false;
            this.IsDetailContaner = false;
            this.IsCreatProfileBut = true;
            this.IsAcedmic = false;
            this.openModal();
          }
        });
      }
    }
    else{
      this.spinner.hide();
      this.showmessage=true;
      this.message="You have one or more error above.";
    }
  }

  @ViewChildren('formRow') rows: ElementRef;
  // Add new Tex Box
  words2 = [{ value: '' }];
  updateList(evn: any) {
    if (evn.keyCode == 13) {
      this.add()
    }
  }
  add() {
    this.words2.push({ value: '' });
    setTimeout(() => {
      document.getElementById('name' + (this.words2.length - 1) + '').focus();
    }, 5);
  }

 

  editprofile(Id: any) {
    this.talent_profile_Id = Id;
    this.auth.getTalentProfileUser(this.api_key, Id).subscribe(Result => {
      console.log(Result);
      this.inputNameSearch = Result["name"];
      this.position_level.forEach(x => {
        if (x.value == Result["position_level"]) {
          this.positionLevel = x;
        }
      });
      this.Department.forEach(x => {
        if (x.value == Result["department_id"]) {
          this.Detail = x;
        }
      });
      this.words2 = [];

      Result.talent_profile_questions.forEach(job => {
        this.words2.push({ value: job.text })
      });
      this.result = Result;
      this.academic.forEach(text => {
        text.isSen = true;
        text.question_options.forEach(m => {
          m.Detail = [];
          Result.talent_profile_answere.forEach(y => {
            if (m.question_id == y.question_id && m.id == y.question_option_id) {
              if (m.type == "1") {
                if (m.slug == "op57") {
                  m.isSen = true;
                  this.otherDegree.forEach(re => {
                    if (re.value == y.question_answer_id) {
                      m.Detail.push(re);
                    }
                  });
                } else if (m.slug == "op58") {
                  m.isSen = true;
                  this.otherDegree.forEach(re => {
                    if (re.value == y.question_answer_id) {
                      m.Detail.push(re);
                    }
                  });
                } else if (m.slug == "op78") {
                  m.isSen = true;
                  this.otherDegree.forEach(re => {
                    if (re.value == y.question_answer_id) {
                      m.Detail.push(re);
                    }
                  });
                }
                else if (m.slug == "op60") {
                  m.isSen = true;
                  this.university.forEach(re => {
                    if (re.value == y.question_answer_id) {
                      m.Detail.push(re);
                    }
                  });
                }
                else if (m.slug == "op82") {
                  m.isSen = true;
                  this.otherDegree.forEach(re => {
                    if (re.value == y.question_answer_id) {
                      m.Detail.push(re);
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
            if (Result.custom_degree != undefined && Result.custom_degree != null) {
              
              Result.custom_degree.forEach(cust => {
                if (cust.question_slug == "op57") {
                  m.isSen = true;
                  m.Detail.push({ value: "0", label: cust.degree_name });
                }
              });

            }
          }
          if (m.slug == "op58") {
            if (Result.custom_degree != undefined && Result.custom_degree != null) {
              Result.custom_degree.forEach(cust => {
                if (cust.question_slug == "op58") {
                  m.isSen = true;
                  m.Detail.push({ value: "0", label: cust.degree_name });
                }
              });

            }
          }
          if (m.slug == "op78") {
            if (Result.custom_degree != undefined && Result.custom_degree != null) {
              Result.custom_degree.forEach(cust => {
                if (cust.question_slug == "op78") {
                  m.isSen = true;
                  m.Detail.push({ value: "0", label: cust.degree_name });
                }
              });

            }
          }
          else if (m.slug == "op60") {
            if (Result.custom_university != undefined && Result.custom_university != null) {
              Result.custom_university.forEach(cust => {
                  m.isSen = true;
                  m.Detail.push({ value: "0", label: cust.university_name });
              });
            }
          }

        });

      });

      this.WorkExp.forEach(text => {
        text.isSen = true;
        text.question_options.forEach(m => {
          m.Detail = [];
          Result.talent_profile_answere.forEach(y => {
            if (m.question_id == y.question_id && m.id == y.question_option_id) {
              if (m.type == "1") {
                if (m.slug == "op73") {
                  m.isSen = true;
                  this.Department.forEach(re => {
                    if (re.value == y.question_answer_id) {
                      m.Detail.push(re);
                    }
                  });
                }
                if (m.slug == "op74") {
                  m.isSen = true;
                  this.industry.forEach(re => {
                    if (re.value == y.question_answer_id) {
                      m.Detail.push(re);
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
      console.log(this.hardSkill);
      this.hardSkill.forEach(text => {
        text.isSen = true;
        text.question_options.forEach(m => {
          m.Detail = [];
          Result.talent_profile_answere.forEach(y => {
            if (m.question_id == y.question_id && m.id == y.question_option_id) {
              if (text.slug == "q19") {
                if (m.type == "1") {
                  m.isSen = true;
                  this.hardSkillList.forEach(re => {
                    if (re.value == y.question_answer_id) {
                      m.Detail.push(re);
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
                 m.isSen = true;
                if (m.type == "5") {
                  m.isSen = true;
                  this.tellusmore = y.tell_us;
                }
              }
              else if (text.slug == "q23") {
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
            m.isSen = true;
            if (Result.custom_language_r != undefined && Result.custom_language_r != null) {
              m.isSen = true;
              Result.custom_language_r.forEach(cust => {
                m.Detail.push({ value: "0", label: cust.custom_language });
              });
            }
          }
          if (m.slug == "op81") {
            m.isSen = true;
            if (Result.custom_language_w != undefined && Result.custom_language_w != null) {
              m.isSen = true;
              Result.custom_language_w.forEach(cust => {
                m.Detail.push({ value: "0", label: cust.custom_language });
              });
            }
          }
        });

      });
    });

    this.IsProfile = false;
    this.Isdetail = true;
    this.IsDetailContaner = true;
    this.IsCreatProfileBut = false;
    this.IsAcedmic = false;

  }

  AssingDetail(data: any) {
    data.Detail = this.DespDetail;
  }

  // colling all Function
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

  getindustrydata() {
    this.auth.getIndustries().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.industry_name });
      });
      this.industry = this.itemList;
    });

  }
 
  getuniverstiyperfice() {
    this.auth.getUniversity().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.university_name });
      });
      this.university = this.itemList;
    });
  }

  callhardSkill() {
    this.auth.getHandSkill().subscribe(x => {
      this.itemList = [];
      x.forEach(y => {
        this.itemList.push({ value: y.id.toString(), label: y.skill_name });
      });
      this.hardSkillList = this.itemList;
    });
  }

  Clickcancel() {
    this.route.navigate(["/home/dashboard"]);
  }
  
  openModal() {
    this.display = 'block';
  }
  // Redierect to summary page
  redirectJob() {
    this.route.navigate(["/home/summary"], { queryParams: { id: + this.talnt_id ,job: + 1 } });
    this.onCloseHandled();
  }
  onCloseHandled() {
    this.display = 'none';
  }
 // Redierect to Dashboard page
  redirectDashboard() {
    this.route.navigate(["/home/dashboard"]);
  }
  // Save Data To cookie
  saveData(){
    console.log(this.user_id);
    console.log(this.positionLevel);
     var myObj = { 
          data:{
            position_title: this.inputNameSearch,
            department_id: this.Detail,
            position_level: this.positionLevel,
            job_description: this.words2,
            acadmic: this.academic,
            WorkExp:this.WorkExp,
            hardSkill: this.hardSkill,
            tellusmore: this.tellusmore,
          },
          user_id: this.user_id 
      };
    localStorage.setItem("storeTObj"+ this.user_id,JSON.stringify(myObj));   
  }
  // Set cookie Data To form
  setCookieData(){
    const setCookieJob = JSON.parse(localStorage.getItem("storeTObj"+ this.user_id ));
    this.inputNameSearch = setCookieJob.data.position_title;
    this.Detail =  setCookieJob.data.department_id;
    this.positionLevel = setCookieJob.data.position_level;
    console.log(setCookieJob.data.job_description);
    this.words2 = [];
    setCookieJob.data.job_description.forEach(job => {
      this.words2.push({ value: job.value })
    });
    this.academic = setCookieJob.data.acadmic;
    this.WorkExp = setCookieJob.data.WorkExp;
    this.hardSkill = setCookieJob.data.hardSkill;
    this.tellusmore = setCookieJob.data.tellusmore;
  }  
  // Remove Cookie data
  removeCookieData(){
    localStorage.removeItem('storeTObj'+ this.user_id);
  }
}



import { Component, OnInit } from '@angular/core';
import { AuthService, AssetPipe } from '../../provider/auth.service';
import { Router } from '@angular/router';
import { Question, questionoption, RQQuestOption, QOptionAns, CompanyCulturePoint, CategorialPoints } from '../../../../Provider/Comman/Comman';
import { transformAll } from '@angular/compiler/src/render3/r3_ast';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-company-culture',
  templateUrl: './company-culture.component.html',
  styleUrls: ['./company-culture.component.css'],
  providers: [Title]
})
export class CompanyCultureComponent implements OnInit {

  showchart: boolean= false;
  // For New Update
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

  public canvasWidth = 200;
  public WorkingStyleoptions = {
    hasNeedle: true,
    needleColor: 'gray',
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    needleStartValue: 0,
    rangeLabelFontSize:10
  }
  public Formalityoptions = {
    hasNeedle: true,
    needleColor: 'gray',
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    needleStartValue: 0,
    rangeLabelFontSize: 10
  }
  public InternalStructureoptions = {
    hasNeedle: true,
    needleColor: 'gray',
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    needleStartValue: 0,
    rangeLabelFontSize: 10
  }
  public TalentManagementoptions = {
    hasNeedle: true,
    needleColor: 'gray',
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    needleStartValue: 0,
    rangeLabelFontSize: 10
  }
  public PersonalGrowthoptions = {
    hasNeedle: true,
    needleColor: 'gray',
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    needleStartValue: 0,
    rangeLabelFontSize: 10
  }

  api_key: string;
  questionlist: Question[];
  culturePoint: CompanyCulturePoint[];
  point: CategorialPoints = {
    WorkingStyle: 0,
    Formality: 0,
    InternalStructure: 0,
    TalentManagement: 0,
    PersonalGrowth: 0
  };
  loadProgress:boolean=false;

  public pieChartOptions: any = {
    'backgroundColor': [
      "#FF6384",
      "#CCCCCC"
    ]
  }

  firstQuestStatus: boolean = true;
  QuestStatusAvail: boolean = false;
  UpdateStatus: boolean = false;
  IsFirstQuesitionShow: boolean = true;

  constructor(public auth: AuthService, public route: Router, private spinner: NgxSpinnerService, private title: Title,
    public Piper: AssetPipe) {
    this.api_key = this.auth.getToken();
    this.title.setTitle(' Jobtiviti - Company Culture');
  }

  

  ngOnInit() {
    this.getcompanyculture();
    this.IsFirstQuesitionShow = false;
    this.firstQuestStatus = false;
    this.UpdateStatus = false;
  }

  updateClick() {
    this.IsFirstQuesitionShow = false;
  }

  // Get Company Culture
  getcompanyculture() {
    this.auth.getCompanyCulture(this.api_key).subscribe(res => {
      this.questionlist = res;
      this.loadProgress=true;
      let first: number = 0;
      this.questionlist.forEach(each => {
        each.question_options.forEach(x => {
          if (x.isSelected == true) {
            this.firstQuestStatus = false;
            this.IsFirstQuesitionShow = false;
          }


        });
        if (first == 0) {
          each.isVisible = false;
          first = 1;
        } else {
          each.isVisible = true;
        }
      });
    });
  }

  getstart() {
    this.IsFirstQuesitionShow = false;
    this.firstQuestStatus = false;
    this.UpdateStatus = false;
  }
  // Click on  Next Question Button
  nextclick(i: number) {
    if (this.questionlist[i].question_options.filter(x => x.isSelected == true).length > 0) {
      if (this.questionlist.length != i + 1) {
        this.questionlist.forEach(each => {
          each.isVisible = true;
        });
        this.questionlist[i + 1].isVisible = false;
      }
    }
  }

  // Save all Question Answer
  SaveData() {
    let list: QOptionAns[] = [];
    this.questionlist.forEach(each => {
      let getList = each.question_options.filter(x => x.isSelected == true);
      if (getList.length > 0)
        getList.forEach(x => {
          list.push({ option_id: x.id, question_id: x.question_id });
        })
    });
    let RQ: RQQuestOption = {
      anslist: list,
      api_token: this.api_key
    };
    this.spinner.show();
    this.auth.setCompany(RQ).subscribe(res => {
      this.UpdateStatus = true;
      this.spinner.hide();
      this.OnStatusClick()
      this.route.navigate(["/home/dashboard"]);
    })
  }
 // Single Select Option
  singleSelect(questOPT: questionoption, ques: Question) {
    ques.question_options.forEach(each => {
      each.isSelected = false;
    })
    questOPT.isSelected = true;
  }
 // Multiple Select Option
  multiSelect(questOPT: questionoption) {
    if (questOPT.isSelected)
      questOPT.isSelected = false;
    else {
      questOPT.isSelected = true;
    }
  }
  
  // events on slice click
  public chartClicked(e: any): void {
    console.log(e);
  }

  // event on pie chart slice hover
  public chartHovered(e: any): void {
    console.log(e);
  }

  OnStatusClick() {
    //location.reload();
  }

  Clickcancel() {
    this.route.navigate(["/home/dashboard"]);
  }
}

import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NavController, NavParams, ModalController, App } from "ionic-angular";
import { CreateJobtivityPage } from "../create-jobtivity/create-jobtivity";
import { FeedsPage } from "../feeds/feeds";
import { AuthProvider } from "../../providers/auth/auth";
import { LoginPage } from "../login/login";
import { JobtivityList, UserDetails, UserPointGuide, NotificationDetails, Milestone, RQAPIJobtivityIDToken } from "../../providers/CustomClasses/Users";
import { JobtivityCommentDetailsPage } from "../jobtivity-comment-details/jobtivity-comment-details";
import { EditProfilePage } from "../edit-profile/edit-profile";
import { UserProfilePage } from "../user-profile/user-profile";
import { ChangePasswordPage } from "../change-password/change-password";
import { JobtivityWowDetailsPage } from "../jobtivity-wow-details/jobtivity-wow-details";
import { Mixpanel } from "@ionic-native/mixpanel";
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage implements OnInit {
  public loadProgress: number = 0;
  userJobtivitiesData: JobtivityList[];
  jobtivityList: JobtivityList[];
  pageData: object = {};
  api_token: string = "";
  user_Id: number = 0;
  maxValue: number = 200;
  PointsMore: number = 0;
  UnlockText: string = "";
  totalJobTivity: number = 0;
  userdetails: UserDetails;
  userpointlist: UserPointGuide[];
  milestone: Milestone[] = [];
  courcesname: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    private modal: ModalController,
    private cdRef: ChangeDetectorRef,
    private iab: InAppBrowser,
    private mixPanel: Mixpanel,
    public app: App
  ) {
    this.pageData = this.auth.authUser;
    this.api_token = this.auth.authUser["api_token"];
    this.user_Id = this.auth.authUser["id"];
    this.mixPanel.init(this.auth.mixPanelToken);
    this.mixPanel.track("Page View", { "name": "My Profile" });
  }

  createJobtivity() {
    this.navCtrl.push(CreateJobtivityPage, { data: this.pageData });
  }
  //ngOnInit() {
  //  this.getAllJobitivitiesList(this.api_token, this.user_Id);
  //  setInterval(() => {
  //    if (this.loadProgress < 100) this.loadProgress += 1;
  //    else clearInterval(this.loadProgress);
  //  }, 50);
  //}
  ionViewWillEnter() {
    this.getAllJobitivitiesList(this.api_token, this.user_Id);
    this.GetUserGuidePointList();
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    //this.getAllJobitivitiesList(this.api_token, this.user_Id);
    //this.GetUserGuidePointList();
    //this.cdRef.detectChanges();
  }
  viewComment(jobtivity: JobtivityList) {
    const allComments = this.modal.create(JobtivityCommentDetailsPage, {
      api_token: this.api_token,
      id: jobtivity.id
    });
    allComments.present();
  }

  GetUserGuidePointList() {
    this.auth.GetUserGuidePoint().subscribe(
      res => {
        console.log(res);
        this.userpointlist = res;
      }
    )
  }
  getAllJobitivitiesList(apikey: string, userid: number) {
    this.auth.getUserDetails(apikey, userid).subscribe(
      res => {        
        this.loadProgress = 0;
        this.PointsMore = 0;
        this.totalJobTivity = 0;
        this.userdetails = res;
        let TotalPoint: number = 0;
        let ProgressCount: number = 0;
        let i = 0;
        res.user_course_list.forEach(x => {
          if (i == 0) {
            this.courcesname = x.course_name
          } else if(i<3)
           {
            this.courcesname = this.courcesname + ", " + x.course_name
          }
          i++;
        });
        if (this.userdetails.milestone != undefined) {
          this.totalJobTivity = this.userdetails.milestone.points;
          TotalPoint = this.userdetails.milestone.milestone_points;
        }
        if (this.userdetails.achievedMilestones != undefined) {
          this.milestone = this.userdetails.achievedMilestones;
        }
        this.totalJobTivity > TotalPoint ? 0 : TotalPoint;
        if (this.totalJobTivity > 0) {
          //let Points: number = this.totalJobTivity > TotalPoint ? 0 : TotalPoint;
          ProgressCount = (this.totalJobTivity / TotalPoint) * 100;
        }
        else
          ProgressCount = 0;
        this.PointsMore = this.totalJobTivity > TotalPoint ? 0 : TotalPoint - this.totalJobTivity;
        //this.PointsMore = TotalPoint - this.totalJobTivity;
        var interval = setInterval(() => {
          if (this.loadProgress < ProgressCount) this.loadProgress += 1;
          else {
            clearInterval(interval);
          }
        }, 30);
      },
      error => {
        console.log(error);
        //this.auth.clear();
        //this.navCtrl.setRoot(LoginPage);
      });
  }
  checkFeeds() {
    this.navCtrl.push(FeedsPage);
  }
  doRefresh(refresher) {
    this.getAllJobitivitiesList(this.api_token, this.user_Id);
    this.userJobtivities(this.auth.authUser['api_token'], this.auth.authUser['id']);
    setTimeout(() => {
      refresher.complete();
      this.cdRef.detectChanges();
    }, 2000);
  }

  // new ts

  editProfile() {
    this.navCtrl.push(EditProfilePage)
  }

  profileClick(id: number) {
    this.navCtrl.push(UserProfilePage, {
      UserId: id
    });
  }
  descriptionClick(notify: NotificationDetails) {
    if (notify.item_type != "follow") {
      const allComments = this.modal.create(JobtivityCommentDetailsPage, {
        api_token: this.api_token,
        id: notify.item_id
      });
      allComments.present();
    }
  }

  public changePassword() {
    var Settings = this.modal.create(ChangePasswordPage);
    Settings.present();
  }
  TryOut(miles: Milestone) {
    //window.open(miles.actionURL, '_system', 'location=yes');
    const option: InAppBrowserOptions = {
      location: 'no',
      zoom: 'no'
    }
    this.iab.create(miles.actionURL, '_self', option);
  }

  ionViewDidLoad() {
    this.userJobtivities(this.auth.authUser['api_token'], this.auth.authUser['id']);
  }

  private userJobtivities(apikey: string, userid: number) {
    let env = this;
    env.auth.getAllJobitivitiesByUser(apikey, userid).subscribe(
      res => {
        env.userJobtivitiesData = res
      },
      error => {
        this.auth.clear();
        this.navCtrl.setRoot(LoginPage);
      }
    );
  }
  UserProfileClick(jobtivity: JobtivityList) {
    this.navCtrl.push(UserProfilePage, {
      UserId: jobtivity.user_id
    });
  }
  whatIhavelearnt(jobtivity: JobtivityList) {
    this.mixPanel.track("Button Click", { "name": "Details", "feed": jobtivity.id });
    jobtivity.WhatIHave = true;
  }

  Wow(jobtivity: JobtivityList) {
    let RQ: RQAPIJobtivityIDToken = {
      jobtivity_id: <number>jobtivity["id"], api_token: this.api_token
    };
    this.auth.AddWow(RQ).subscribe(res => {
      if (res["status"] == "success") {
        jobtivity.wowInterest = 1;
        jobtivity.num_of_Wow = jobtivity.num_of_Wow != undefined ? jobtivity.num_of_Wow + 1 : 1;
      }
    });
  }

  RemoveWow(jobtivity: JobtivityList) {
    let RQ: RQAPIJobtivityIDToken = {
      jobtivity_id: <number>jobtivity.id,
      api_token: this.api_token
    };
    this.auth.RemoveWow(RQ).subscribe(res => {
      if (res == "success") {
        jobtivity.wowInterest = 0;
        jobtivity.num_of_Wow =
          jobtivity.num_of_Wow != undefined ? jobtivity.num_of_Wow - 1 : 0;
      }
    });
  }

  WowList(jobtivity: JobtivityList) {
    const allComments = this.modal.create(JobtivityWowDetailsPage, {
      api_token: this.api_token,
      id: jobtivity.id
    });
    allComments.present();
  }

  checkForData() {
    return typeof (this.userpointlist) != undefined && this.userpointlist.length > 0
  }
}

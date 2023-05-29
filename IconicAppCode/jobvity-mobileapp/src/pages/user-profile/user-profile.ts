import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, ModalController, App, AlertController } from "ionic-angular";
import { AuthProvider } from "../../providers/auth/auth";
import {
  UserDetails,
  RQAPIUserIDToken,
  JobtivityList,
  RQAPIJobtivityIDToken
} from "../../providers/CustomClasses/Users";
import { LoginPage } from "../login/login";
import { JobtivityWowDetailsPage } from "../jobtivity-wow-details/jobtivity-wow-details";
import { JobtivityCommentDetailsPage } from "../jobtivity-comment-details/jobtivity-comment-details";
import { Mixpanel, MixpanelPeople } from "@ionic-native/mixpanel";

@Component({
  selector: "page-user-profile",
  templateUrl: "user-profile.html"
})
export class UserProfilePage implements OnInit {
  UserId: number = 0;
  userdetails: UserDetails;
  api_token: string;
  IscurrenctUser: boolean = false;
  courcesname: string;
  userJobtivitiesData: Array<JobtivityList> = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    public modal: ModalController,
    private mixPanel: Mixpanel,
    private mixpanelPeople: MixpanelPeople,
    private alert: AlertController,
    public app: App
  ) {
    this.UserId = this.navParams.get("UserId");
    this.api_token = this.auth.authUser["api_token"];
    setTimeout(() => {
      this.IscurrenctUser =
        this.UserId == this.auth.authUser["id"] ? true : false;
    }, 5);
    this.mixPanel.init(this.auth.mixPanelToken);
    this.mixPanel.track("Page View", { "name": "User Details", "user": this.UserId });
  }
  ngOnInit() {
    this.getUserDetail(this.api_token, this.UserId);
  }

  getUserDetail(apikey: string, userid: number) {
    let env = this;
    env.auth.getUserDetails(apikey, userid).subscribe(
      res => {
        env.userdetails = res;
        let i = 0;
        res.user_course_list.forEach(x => {
          if (i == 0) {
            this.courcesname = x.course_name
          } else if(i<3) {
            this.courcesname = this.courcesname + ", " + x.course_name
          }
          i++;
        });
      },
      error => {
        this.auth.clear();
        this.navCtrl.setRoot(LoginPage);
      }
    );
  }

  Follow() {
    let env = this;
    this.mixPanel.track("Button Click", { "name": "Follow", "user": env.userdetails.id });
    let RQ: RQAPIUserIDToken = {
      api_token: env.api_token,
      user_id: env.userdetails.id
    };
    env.auth.FollowUser(RQ).subscribe(
      res => {
        if (res == "success") {
          this.userdetails.isFollowing = 1;
          this.userdetails.no_of_followers =
            this.userdetails.no_of_followers + 1;
        }
      },
      error => {
        this.auth.clear();
        this.navCtrl.setRoot(LoginPage);
      }
    );
  }
  doRefresh(refresher) {
    this.getUserDetail(this.api_token, this.UserId);
    setTimeout(() => {
      refresher.complete();
    }, 2000);
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
  UnFollow() {
    let env = this;
    this.mixPanel.track("Button Click", { "name": "Unfollow", "user": env.userdetails.id });
    let RQ: RQAPIUserIDToken = {
      api_token: env.api_token,
      user_id: env.userdetails.id
    };
    env.auth.UnFollowUser(RQ).subscribe(
      res => {
        if (res == "success") {
          this.userdetails.isFollowing = 0;
          if (this.userdetails.no_of_followers > 0)
            this.userdetails.no_of_followers =
              this.userdetails.no_of_followers - 1;
        }
      },
      error => {
        this.auth.clear();
        this.navCtrl.setRoot(LoginPage);
      }
    );
  }

  ionViewDidLoad() {
    this.userJobtivities(this.auth.authUser['api_token'], this.UserId);
  }

  private userJobtivities(apikey: string, userid: number) {
    let env = this;
    env.auth.getAllJobitivitiesByUser(apikey, userid, 5).subscribe(
      res => {
        env.userJobtivitiesData = res
      },
      error => {
        this.auth.clear();
        this.navCtrl.setRoot(LoginPage);
      }
    );
  }

  Wow(jobtivity: JobtivityList) {
    this.mixPanel.track("Button Click", { "name": "Wow", "feed": jobtivity["id"] });
    let RQ: RQAPIJobtivityIDToken = {
      jobtivity_id: <number>jobtivity["id"],
      api_token: this.api_token
    };
    this.auth.AddWow(RQ).subscribe(res => {
      if (res["status"] == "success") {
        jobtivity.wowInterest = 1;
        jobtivity.num_of_Wow = jobtivity.num_of_Wow != undefined ? jobtivity.num_of_Wow + 1 : 1;
      }
      if (res["data"].points != null) {
        let point: number = res["data"].points.earned_points;
        let totalPoint: number = res["data"].points.total_points;
        //let message: string = `<p>You have received ` + point + ` points, and accumulated ` + totalPoint + ` points in total.</p>`;
        let message: string = `<p>Nice, you just got ` + point + ` points! </p> <p>For now, you will get points for clicking WOW on other Jobtiviti. Check out your current points.</p>`;
        this.presentAlert(message);

        // For MixPanel people Date Set
        this.mixpanelPeople.identify(res['data'].id);
        this.mixpanelPeople.set({
          "$userId": res['data'].id,
          "$Points": point,
          "$TotalPoint": totalPoint,
        });
      }
    });
  }

  RemoveWow(jobtivity: JobtivityList) {
    this.mixPanel.track("Button Click", { "name": "Wow", "feed": jobtivity["id"] });
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

  viewComment(jobtivity: JobtivityList) {
    const allComments = this.modal.create(JobtivityCommentDetailsPage, {
      api_token: this.api_token,
      id: jobtivity.id
    });
    allComments.present();
  }

  presentAlert(error) {
    let alert = this.alert.create({
      subTitle: error,
      buttons: [
        {
          text: 'Close',
        },
        {
          text: 'current points',
          handler: () => {
            this.navCtrl.parent.select(3);
          }
        },
      ]
    });
    alert.present();
  }
}

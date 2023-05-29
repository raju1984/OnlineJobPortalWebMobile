import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  ModalController,
  LoadingController,
  Loading,
  App
} from "ionic-angular";
import { JobtivityCommentDetailsPage } from "../jobtivity-comment-details/jobtivity-comment-details";
import { AuthProvider } from "../../providers/auth/auth";
import {
  JobtivityList,
  RQAPIJobtivityIDToken
} from "../../providers/CustomClasses/Users";
//import { LoginPage } from "../login/login";
import { UserProfilePage } from "../user-profile/user-profile";
import { JobtivityWowDetailsPage } from "../jobtivity-wow-details/jobtivity-wow-details";
import { Storage } from "@ionic/storage";
import { Mixpanel, MixpanelPeople } from "@ionic-native/mixpanel";

//import { TabsPage } from "../tabs/tabs";

@Component({
  selector: "page-feeds",
  templateUrl: "feeds.html"
})
export class FeedsPage {
  jobtivityList: JobtivityList[];
  api_token: string = "";
  pageData: object = {};
  token: string;
  refresher: boolean = false;
  loading: Loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    private alert: AlertController,
    private modal: ModalController,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private mixPanel: Mixpanel,
    private mixpanelPeople: MixpanelPeople,
    public app: App
  ) {
    this.mixPanel.init(this.auth.mixPanelToken);
    this.mixPanel.track("Page View", { "name": "Feeds" });

    this.presentLoadingCustom();
    this.storage
      .get("guser")
      .then(rt => {
        this.api_token = this.auth.authUser["api_token"];
        this.getAllJobitivitiesList(this.api_token);
      })
      .catch(e => {
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let req = { 'err_text': JSON.stringify(e) + "Line No 50", 'file_path': 'feeds.ts', 'method': 'constructor', 'parent_method': null, 'error_time': date }
        this.auth.errorLog(req).subscribe();
      });
    this.api_token = this.auth.authUser["api_token"];


    // Find DistinctId 
    //this.mixPanel.distinctId().then(
    //  (val) => {
    //    return this.token = val;
    //  }).catch((err) => {
    //    console.log(err);
    //  });

  }
  presentLoadingCustom() {
    this.loading = this.loadingCtrl.create({
      spinner: null,
      duration: 1000,
      cssClass: 'custom-class custom-loading'
    });
    this.loading.present();
  }

  ionViewWillEnter() {
    this.getAllJobitivitiesList(this.api_token);
  }

  viewComment(jobtivity: JobtivityList) {
    const allComments = this.modal.create(JobtivityCommentDetailsPage, {
      api_token: this.api_token,
      id: jobtivity.id
    });
    allComments.present();
  }

  getAllJobitivitiesList(apikey: string) {
    if (apikey != undefined)
      this.auth.getAllJobitivities(apikey).subscribe(
        res => {
          console.log(res);
          this.jobtivityList = res;
        },
        error => {
          //this.presentAlert(error);
          //this.auth.clear();
          //this.navCtrl.setRoot(LoginPage);
        }
      );
  }

  whatIhavelearnt(jobtivity: JobtivityList) {
    this.mixPanel.track("Button Click", { "name": "Details", "feed": jobtivity.id });
    jobtivity.WhatIHave = true;
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

  doRefresh(refresher) {
    this.getAllJobitivitiesList(this.api_token);
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  UserProfileClick(jobtivity: JobtivityList) {
    this.navCtrl.push(UserProfilePage, {
      UserId: jobtivity.user_id
    });
  }

  Wow(jobtivity: JobtivityList) {
    this.mixPanel.track("Button Click", { "name": "Wow", "feed": jobtivity.id });
    let RQ: RQAPIJobtivityIDToken = {
      jobtivity_id: jobtivity.id,
      api_token: this.api_token
    };
    this.auth.AddWow(RQ).subscribe(res => {
      console.log(res);
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
    let RQ: RQAPIJobtivityIDToken = {
      jobtivity_id: jobtivity.id,
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
    this.mixPanel.track("Button Click", { "name": "Wow", "feed": jobtivity.id });
    const allComments = this.modal.create(JobtivityWowDetailsPage, {
      api_token: this.api_token,
      id: jobtivity.id
    });
    allComments.present();
  }
}

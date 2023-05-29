import { Component } from "@angular/core";
import { NavController, NavParams, Platform, App } from "ionic-angular";
import { FeedsPage } from "../feeds/feeds";
import { CreateJobtivityPage } from "../create-jobtivity/create-jobtivity";
import { ProfilePage } from "../profile/profile";
import { NotificationPage } from "../notification/notification";
import { SettingsPage } from "../settings/settings";
import { AuthProvider } from "../../providers/auth/auth";
import { SetNotification, ValidateTokenReq } from "../../providers/CustomClasses/Users";
import { LoginPage } from "../login/login";

@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root = FeedsPage;
  tab2Root = NotificationPage;
  tab3Root = CreateJobtivityPage;
  tab4Root = ProfilePage;
  tab5Root = SettingsPage;
  notificationCount: string;
  notificationRun: any;
  api_token: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    platform: Platform,
    public auth: AuthProvider,
    public app: App) {
   
    platform.pause.subscribe(e => {
      clearInterval(this.notificationRun);
    });
  }
  ngOnInit() {
    this.notificationRun = setInterval(() =>
    {
      this.checktoken();
      if (this.auth != null && this.auth.authUser != null
        && this.auth.authUser["api_token"] != undefined
        && this.auth.authUser["api_token"] != null
        && this.auth.authUser["api_token"] != "") {
        this.api_token = this.auth.authUser["api_token"];
        this.GetUserNotification();
      }
    }, 5000);
  }
 
  GetUserNotification() {
    this.auth.GetUserNotificationCount(this.api_token).subscribe(
      res => {
        if (Number(res) > 9) {
          res = "9+";
        }
        this.notificationCount = res;
      },
      error => {
      }
    );
  }
  notificationClick() {
    let Rq: SetNotification = {
      api_token: this.api_token,
      id: 0
    }
    this.auth.SetUserNotificationSeen(Rq).subscribe(
      res => {
        this.GetUserNotification();
      },
      error => {
      }
    );
  }
  ngOnDestroy() {
    clearInterval(this.notificationRun);
  }
  checktoken() {
    console.log(this.auth);
    if (this.auth != null && this.auth.authUser != null
      && this.auth.authUser["api_token"] != undefined
      && this.auth.authUser["api_token"] != null
      && this.auth.authUser["api_token"] != "") {
      let valdatereq: ValidateTokenReq = {
        email: this.auth.authUser["email"],
        api_token: this.auth.authUser["api_token"]
      };
      this.auth.ValidateToken(valdatereq).subscribe(res => {
      },
        error => {
          debugger;
          this.auth.clear();
          //this.rootPage = LoginPage;
          this.app.getRootNav().setRoot(LoginPage);
        });
    }
    else {
      console.log(this.auth);
      //this.auth.clear();
      //this.rootPage = LoginPage;
      this.app.getRootNav().setRoot(LoginPage);
    }

  }
}

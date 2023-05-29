import { Component, ViewChild, OnInit } from "@angular/core";
import { Platform, Nav, MenuController, Events, ModalController, AlertController, App } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Mixpanel, MixpanelPeople } from "@ionic-native/mixpanel";

import { LoginPage } from "../pages/login/login";
import { AuthProvider } from "../providers/auth/auth";
import { Storage } from "@ionic/storage";
import { AchivementPage } from "../pages/achivement/achivement";
import { Milestone, ValidateTokenReq } from "../providers/CustomClasses/Users";
import { TabsPage } from "../pages/tabs/tabs";
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import 'rxjs/add/operator/toPromise';
@Component({
  templateUrl: "app.html"
})
export class MyApp implements OnInit {
  @ViewChild(Nav) navCtrl: Nav;
  rootPage: any;
  senderID: string = "479164483194";
  ParentuserName: string = "";
  backGroundProcess: any;
  AchivedMileStone: number = 0;
  AchivedUserId: number = 0;
  api_token: string;
  token: string;
  backGroundOnlyonceProcess: any;
  userStillActive: boolean = true;
  currentDate: any;
  registrationId: string;
  backGroundProcess2: any;
  constructor(
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public auth: AuthProvider,
    private storage: Storage,
    public menuCtrl: MenuController,
    public events: Events,
    private modal: ModalController,
    private mixpanel: Mixpanel,
    private mixpanelPeople: MixpanelPeople,
    public push: Push,
    private alert: AlertController,
    private app: App
  ) {
    platform.ready().then(() => {
      statusBar.styleDefault();

     
      console.log("1 " +this.auth);
      //statusBar.overlaysWebView(true);
      statusBar.backgroundColorByHexString("#fe7f9c");

      this.mixpanel.init(this.auth.mixPanelToken);
      //this.mixpanel.init("f2dd95a579450364b9fd88e50d2101a3");
      //this.mixpanel.track("App Loaded1");
      splashScreen.hide();
      this.storage
        .get("guser")
        .then(rt => {
          this.ParentuserName = rt["name"];
          this.rootPage = TabsPage;
          this.userStillActive = true;
        })
        .catch(e => {
          //debugger;
          this.rootPage = LoginPage;
        });
    });

    platform.pause.subscribe(e => {
      clearInterval(this.backGroundProcess);
      this.userStillActive = false;
      clearInterval(this.backGroundOnlyonceProcess);
    });
    window.addEventListener('beforeunload', () => {
      clearInterval(this.backGroundProcess);
      this.userStillActive = false;
      clearInterval(this.backGroundOnlyonceProcess);
    });
    //this.userName = this.auth.authUser["name"];

    // Find DistinctId 
    //this.mixpanel.distinctId().then((val) => {
    //  return this.token = val;
    //}).catch(
    //  (err) => {
    //    console.log(err);
    //  }
    //)
    
  }

  ngOnInit() {
    this.initPushNotification();
    console.log("2 "+this.auth);
    
    //debugger;
    this.backGroundProcess = setInterval(() => {
      //debugger;
    // this.checktoken();   
      if (this.auth != null && this.auth.authUser != null
        && this.auth.authUser["api_token"] != undefined
        && this.auth.authUser["api_token"] != null  
        && this.auth.authUser["api_token"] != "") {
    // debugger;
    this.auth.GetMileStoneAcivement(this.auth.authUser["api_token"]).subscribe(res => {
      if (res != undefined) {
        if (this.AchivedMileStone != res.id || this.AchivedUserId != this.auth.authUser["id"]) {
          this.AchivedUserId = this.auth.authUser["id"];
          this.AchivedMileStone = res.id;
          this.achivement(res);
        }
      }
      //console.log(res);
    }, error => {
      console.log(error);
    });
  }
}, 5000);

this.backGroundOnlyonceProcess = setInterval(() => {
  if (this.auth != null && this.auth.authUser != null
    && this.auth.authUser["api_token"] != undefined
    && this.auth.authUser["api_token"] != null
    && this.auth.authUser["api_token"] != "") {
    if (this.currentDate == undefined || this.currentDate == null) {
      this.currentDate = new Date();
      if (this.userStillActive) {
        this.auth.GetDailysigninPoint(this.auth.authUser["api_token"]).subscribe(res => {
          if (res != undefined) {
            // For MixPanel people Date Set
            if (res['data'].points != null && res['status'] == "success") {
              if (this.auth != null && this.auth.authUser != null
                && this.auth.authUser["api_token"] != undefined
                && this.auth.authUser["api_token"] != null
                && this.auth.authUser["api_token"] != "") {
                this.mixpanelPeople.identify(this.auth.authUser["id"]);
                // this.mixpanelPeople.identify(this.token);
                this.mixpanelPeople.set({
                  "$userId": res['data'].points.log_obj.user_id,
                  "$Points": res['data'].points.earned_points,
                  "$TotalPoint": res['data'].points.total_points,
                });
                this.mixpanelPeople.setPushId(this.registrationId)
                  .then(e => {
                    console.log("success to set push id in mixpanel user specific console");
                  })
                  .catch(e => {
                    console.log("error to set in mixpanel user specific console");
                  });
              }
            }
          }
        });
      }
    } else {
      if (this.userStillActive) {
        let d = (new Date()).valueOf() - this.currentDate.valueOf()
        let hours = (d / 60000) / 1440;
        if (hours > 24) {
          this.currentDate = new Date();
          this.auth.GetDailysigninPoint(this.auth.authUser["api_token"]).subscribe(res => {
            if (res != undefined && res['status'] == "success") {
              if (res['data'].points != null) {
                if (this.auth != null && this.auth.authUser != null
                  && this.auth.authUser["api_token"] != undefined
                  && this.auth.authUser["api_token"] != null
                  && this.auth.authUser["api_token"] != "") {
                  this.mixpanelPeople.identify(this.auth.authUser["id"]);
                  // this.mixpanelPeople.identify(this.token);
                  this.mixpanelPeople.set({
                    "$userId": res['data'].points.log_obj.user_id,
                    "$Points": res['data'].points.earned_points,
                    "$TotalPoint": res['data'].points.total_points,
                  });
                  this.mixpanelPeople.setPushId(this.registrationId)
                    .then(e => {
                      console.log("success to set push id in mixpanel user specific console");
                    })
                    .catch(e => {
                      console.log("error to set in mixpanel user specific console");
                    });
                }
              }

            }
          });
        }
      }
    }
  }
}, 10000);

    
  }
achivement(mileStone: Milestone) {
  const allComments = this.modal.create(AchivementPage, { mileStone: mileStone }, {
    enableBackdropDismiss: false
  });
  allComments.present();
}
  
createUser(user) {
  console.log("User created!");
  this.events.publish("user:created", user, Date.now());
}
initPushNotification() {
  console.log("push called")
  if (!this.platform.is('cordova')) {
    console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
    return;
  }
  //this.senderID
  const options: PushOptions = {
    android: {
      senderID: "848771491661",
      sound: "true",
      vibrate: "true",
    },
    ios: {
      alert: 'true',
      badge: false,
      sound: 'true'
    }
  };
  const pushObject: PushObject = this.push.init(options);
  pushObject.on('registration').subscribe((data: any) => {
    this.registrationId = data.registrationId;
    //this.mixpanel.identify(this.token).catch(e => {
    //  console.log(e);
    //});
    //this.mixpanelPeople.identify(this.token);
    //this.mixpanelPeople.set({
    //  "$userId": this.token,
    //  "$distinct_id": this.token
    //});
    this.mixpanelPeople.setPushId(this.registrationId)
      .then(e => {
        console.log("success to set push id in mixpanel user specific console");
        //this.mixpanel.track('current id -> ' + data.registrationId);
      })
      .catch(e => {
        console.log("error to set in mixpanel user specific console");
      });

  });
  pushObject.on('error').subscribe(error => {
  });
  //pushObject.on('notification').subscribe((data: any) => {
  //  console.log('Received Notification!!! message = ' + data.message);
  //});
  pushObject.on('notification').subscribe((data: any) => {
    if (data.additionalData.foreground) {
      let confirmAlert = this.alert.create({
        title: 'New Notification',
        message: data.message,
        buttons: [{
          text: 'Ignore',
          role: 'cancel'
        }, {
          text: 'View',
          handler: () => {
            //TODO: Your logic here
            this.rootPage = TabsPage;
          }
        }]
      });
      confirmAlert.present();
    } else {
      this.rootPage = TabsPage;
      console.log('Push notification clicked');
    }
  }, error => {
    console.log("error");
  });
}
presentAlert(error) {
  let alert = this.alert.create({
    subTitle: error,
    buttons: ["Ok"]
  });
  alert.present();
}
  checktoken() {
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
         
          this.auth.clear();
        
          this.app.getRootNav().setRoot(LoginPage);
        });
    }
  }
}

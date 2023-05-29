import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import {
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl
} from "@angular/forms";

import { UserInfoPage } from "../user-Info/user-Info";
import { AuthProvider } from "../../providers/auth/auth";
import { Registration, loginRq, SocailloginRq } from "../../providers/CustomClasses/Users";
import { LoginPage } from "../login/login";
import { FacebookLoginResponse, Facebook } from "@ionic-native/facebook";
import { TabsPage } from "../tabs/tabs";
import { GooglePlus } from "@ionic-native/google-plus";
import { Mixpanel, MixpanelPeople } from "@ionic-native/mixpanel";
import { PushOptions, PushObject, Push } from "@ionic-native/push";
//import 'rxjs/add/operator/catch';

@Component({
  selector: "page-registration",
  templateUrl: "registration.html"
})
export class RegistrationPage {
  myForm: any;
  userData: any;
  registration: Registration;
  token: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public auth: AuthProvider,
    private alert: AlertController,
    private facebook: Facebook,
    private gplus: GooglePlus,
    private mixPanel: Mixpanel,
    private mixpanelPeople: MixpanelPeople,
    public push: Push
  ) {
    this.mixPanel.init(this.auth.mixPanelToken);
    this.mixPanel.track("Page View", { "name": "Register" });
    this.myForm = this.formBuilder.group(
      {
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(30)
          ])
        ),
        email: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(
              "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
            )
          ])
        ),
        //username: new FormControl(
        //  "",
        //  Validators.compose([Validators.required])
        //),
        cnfpassword: new FormControl(
          "",
          Validators.compose([Validators.required])
        )
      },
      { validator: this.passwordConfirming }
    );
  }

  passwordConfirming(c: AbstractControl): { Passinvalid: boolean } {
    if (c.get("password").value !== c.get("cnfpassword").value) {
      return { Passinvalid: true };
    }
  }
  loginWithFB() {
    let loading = this.auth.loadginFactory();
    let acces_token = "";
    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      loading.dismiss();
      acces_token = response.authResponse.accessToken;
      if (response.status == "connected") {
        this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', [])
          .then(profile => {
            this.userData = {
              email: profile['email'],
              first_name: profile['first_name'],
              picture: profile['picture_large']['data']['url'],
              username: profile['name']
            }
            let logins: SocailloginRq = {
              email: this.userData.email,
              type: "facebook",
              access_token: acces_token,

            };
            this.SocialLogin(logins);
          }).catch(e => {
            loading.dismiss();
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let req = { 'err_text': JSON.stringify(e) + "Line No 97", 'file_path': 'registration.ts', 'method': 'loginWithFB', 'parent_method': null, 'error_time': date }
            this.auth.errorLog(req).subscribe();
          });
      } else {
      }
    }).catch(e => {
      let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      let req = { 'err_text': JSON.stringify(e) + "Line No 104", 'file_path': 'registration.ts', 'method': 'loginWithFB', 'parent_method': null, 'error_time': date }
      this.auth.errorLog(req).subscribe();
    });
  }

  userDetail() {
    //this.mixPanel.init(this.auth.mixPanelToken);
    //this.mixPanel.track("Register");
    if (this.myForm.valid) {
      this.registration = {
        email: this.myForm.get("email").value,
        //name: this.myForm.get("username").value,
        name: "",
        password: this.myForm.get("password").value,
        university: "0",
        course: "0",
        aspiration_message: "",
        graduation_year: "0"
      };
      this.DoRegistration("login");
    }
  }
  DoRegistration(via: string) {
    this.auth.doRegistration(this.registration).subscribe(
      res => {
        console.log(res);
        if (res["status"] == "error") {
          //if (via == "fB") {
          //  this.presentAlert("The email of this Facebook account is already registered.");
          //} else if (via == "google") {
          //  this.presentAlert("The email of this Google account is already registered.");
          //  //this.login(this.registration.email, this.registration.password);
          //} else
          this.presentAlert("The email has been already taken.");
        } else {
          // For MixPanel Set Identify Data
          if (res['data'].id != null && res["data"].email != null) {
            this.mixpanelPeople.identify(res['data'].id);
            this.mixpanelPeople.set({
              "$userId": res['data'].id,
              "$email": res["data"].email,
            });
          }
          this.initPushNotification();
          this.navCtrl.setRoot(UserInfoPage, {
            username: this.registration.name,
            UserEmailId: this.registration.email,
            UserPassWord: this.registration.password
          });
        }
      },
      error => {
        console.log(error);
        this.presentAlert("Unable to connect to the server. Please check your network connection.");
        //this.presentAlert(error["message"]);
      }
    );
  }
  login(username: string, password: string) {
    let logins: loginRq = {
      email: username,
      password: password
    };
    let env = this;
    this.auth
      .doLogin(logins)
      .then(
        res => {
          env.navCtrl.setRoot(TabsPage, { data: res["data"] });
          env.navCtrl.parent.select(3);
        },
        error => {
          env.navCtrl.setRoot(LoginPage);
        }
      )
      .catch(e => {
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let req = { 'err_text': JSON.stringify(e) + "Line No 168", 'file_path': 'registration.ts', 'method': 'login', 'parent_method': null, 'error_time': date }
        this.auth.errorLog(req).subscribe();
      });
  }


  SocialLogin(logins: SocailloginRq) {
    let env = this;
    this.auth
      .doSocialLogin(logins)
      .then(
        res => {
          if (res['data'].id != null && res["data"].email != null) {
            this.mixpanelPeople.identify(res['data'].id);
            this.mixpanelPeople.set({
              "$userId": res['data'].id,
              "$name": res["data"].name,
              "$email": res["data"].email,
            });
          }
          if (!res["data"].graduation_year || !res["data"].university || res["data"].graduation_year == 0 || res["data"].university == 0) {
            this.navCtrl.setRoot(UserInfoPage, {
              username: res["data"].name,
              UserEmailId: res["data"].email,
              UserPassWord: logins.access_token,
              Stype: "1",
              type: logins.type
            });
          }
          else {
            env.navCtrl.setRoot(TabsPage, { data: res["data"] });
            this.initPushNotification();
          }
        },
        error => {
          env.navCtrl.setRoot(LoginPage);
        }
      )
      .catch(e => {
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let req = { 'err_text': JSON.stringify(e) + "Line No 168", 'file_path': 'registration.ts', 'method': 'login', 'parent_method': null, 'error_time': date }
        this.auth.errorLog(req).subscribe();
      });
  }

  presentAlert(error) {
    let alert = this.alert.create({
      //title: "Message",
      subTitle: error,
      buttons: ["Ok"]
    });
    alert.present();
  }
  googleLogin() {
    let gaccess_token: "";

    this.gplus.login({})
      .then(profile => {
        gaccess_token = profile['accessToken'];
        this.userData = {
          email: profile['email'],
          username: profile['displayName']
        }
        let logins: SocailloginRq = {
          email: this.userData.email,
          type: "google",
          access_token: gaccess_token,
        };
        this.SocialLogin(logins);
      })
      .catch(e => {
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let req = { 'err_text': JSON.stringify(e) + "Line No 168", 'file_path': 'registration.ts', 'method': 'googleLogin', 'parent_method': null, 'error_time': date }
        this.auth.errorLog(req).subscribe();
      });
  }

  Login() {
    this.navCtrl.setRoot(LoginPage);
  }
  initPushNotification() {
    const options: PushOptions = {
      android: {
        senderID: this.auth.senderID,
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
      this.mixpanelPeople.setPushId(data.registrationId)
        .then(e => {
          console.log("success to set push id in mixpanel user specific console");
        })
        .catch(e => {
          console.log("error to set in mixpanel user specific console");
        });
    });
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
              this.navCtrl.setRoot(TabsPage);
            }
          }]
        });
        confirmAlert.present();
      } else {
        this.navCtrl.setRoot(TabsPage);
      }
    }, error => {
      console.log("error");
    });
  }
  randomString(length): string {
    var result = '';
    var chars = "@#$^&*0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }
}

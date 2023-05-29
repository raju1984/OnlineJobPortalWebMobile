import { Component } from '@angular/core';
import {
  NavController, NavParams, AlertController,
  App, ViewController
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { GetToken, PasswordReset } from '../../providers/CustomClasses/Users';
import { LoginPage } from '../login/login';



@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  myForm: any;
  user_Id: string;
  api_token: string;
  email: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public auth: AuthProvider,
    public app: App,
    public viewCtrl: ViewController,
    private alert: AlertController) {
    this.api_token = this.auth.authUser["api_token"];
    this.user_Id = this.auth.authUser["id"];
    this.email = this.auth.authUser["email"];
    this.myForm = this.formBuilder.group(
      {
        currentPassword: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(30)
          ])
        ),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(30)
          ])
        ),
        cnfpassword: new FormControl(
          "",
          Validators.compose([Validators.required])
        )
      },
      { validator: this.passwordConfirming }
    );

  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }
  passwordConfirming(c: AbstractControl): { Passinvalid: boolean } {
    if (c.get("password").value !== c.get("cnfpassword").value) {
      return { Passinvalid: true };
    }
  }

  changePassword() {
    if (this.myForm.valid) {
      if (this.myForm.value.currentPassword == this.myForm.value.password) {
        this.presentAlert("Old Password and new password could not be same.");
        return;
      }
      let RQ: GetToken = {
        email: this.email
      };
      this.auth.GetResetToken(RQ).subscribe(res => {
        if (res["token"] != undefined) {
          let ResetRQ: PasswordReset = {
            currentpassword: this.myForm.value.currentPassword,
            password: this.myForm.value.password,
            password_confirmation: this.myForm.value.cnfpassword,
            id: this.user_Id,
            token: res["token"],
            email: this.email
          }
          this.auth.ResetPassword(ResetRQ).subscribe(resP => {
            this.presentAlert(resP["message"]);
          });
        }
      })
    }
  }
  presentAlert(error) {
    let alert = this.alert.create({
      //title: "Message",
      subTitle: error,
      buttons: ["Ok"]
    });
    alert.present();
  }

  logOut() {
    let alert = this.alert.create({
      subTitle: 'Are you sure you want to logout?',
      buttons: [
        {
          text: "No",
        },
        {
          text: "Yes",
          handler: () => {
            this.auth.clear();
            this.navCtrl.setRoot(LoginPage)
          }
        }
      ]
    });
    alert.present();
  }

}

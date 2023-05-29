import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GetToken, PasswordReset } from '../../providers/CustomClasses/Users';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  UserEmailId: string;
  UserPassWord: string;
  ResetToken: string;
  user_Id: string;
  myForm: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthProvider,
    public formBuilder: FormBuilder,
    private alert: AlertController) {
    this.UserEmailId = navParams.get("UserEmailId");
    this.UserPassWord = navParams.get("UserPassWord");
    this.user_Id = navParams.get("user_Id");

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
  ngOnInit() {
    this.getResetToken();
  }
  getResetToken() {
    let RQ: GetToken = {
      email: this.UserEmailId
    };
    this.auth.GetResetToken(RQ).subscribe(res => {
      if (res["token"] != undefined) {
        this.ResetToken = res["token"];
      }
    });
  }

  resetPassword() {
    if (this.myForm.valid) {
      let ResetRQ: PasswordReset = {
        currentpassword: this.UserPassWord,
        password: this.myForm.value.password,
        password_confirmation: this.myForm.value.cnfpassword,
        id: this.user_Id,
        token: this.ResetToken,
        email: this.UserEmailId
      }
      this.auth.ResetPassword(ResetRQ).subscribe(resP => {
        this.presentAlert(resP["message"]);
      });
    }
  }
  presentAlert(msg) {    
    let env = this;
    let alert = this.alert.create({     
      enableBackdropDismiss: false,
      subTitle: msg,
      buttons: [
        {
          text: "Ok",
          handler: () => {            
            env.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

}

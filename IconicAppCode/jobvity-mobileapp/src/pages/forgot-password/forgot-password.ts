import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { GetToken } from '../../providers/CustomClasses/Users';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  myForm: any;
  passwordsent: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public auth: AuthProvider,
    private alert: AlertController) {
    this.initializeForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }
  forgotpassword() {
    let RQ: GetToken = {
      email: this.myForm.value.email
    }
    let loading = this.auth.loadginFactory();
    this.auth.forgotPassword(RQ).subscribe(res => {
      loading.dismiss();
      this.passwordsent = true;
      this.successAlert("An email with password reset instructions has been sent to your email address, if it exists on our system.");
    },
      error => {
        loading.dismiss();
        this.passwordsent = true;
        this.successAlert("An email with password reset instructions has been sent to your email address, if it exists on our system.");
      });

  }
  private initializeForm() {
    this.myForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      )
    });
  }
  presentAlert(error) {
    let alert = this.alert.create({
      subTitle: error,
      buttons: ["Ok"]
    });
    alert.present();
  }
  private successAlert(msg) {
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
  Login() {
    this.navCtrl.setRoot(LoginPage);
  }
}

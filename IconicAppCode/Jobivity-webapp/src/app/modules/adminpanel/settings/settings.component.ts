import { Component, OnInit } from '@angular/core';
import { PasswordChange} from '../../../../Provider/Comman/Comman';
import { FormBuilder, FormControl, Validators, FormGroup ,AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AssetPipe } from '../../provider/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css', '../../../../assets/css/FormStyleCss.css'],
  providers: [Title]
})

export class SettingsComponent implements OnInit {
  currentPassword: string;
  message: string;
  urlImage1: string;
  api_key: string;
  ChangePasswordForm: FormGroup;
  submitted = false;
  password: string;
  cnfpassword: string;

  constructor(public formBuilder: FormBuilder, public auth: AuthService, public route: Router, private spinner: NgxSpinnerService,
    private title: Title, public Piper: AssetPipe) {
    this.title.setTitle(' Jobtiviti - Reset Password');
    this.api_key = this.auth.getToken();
    this.ChangePasswordForm = this.formBuilder.group(
      {   
        currentPassword: new FormControl("",Validators.compose([Validators.required])),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            //Validators.maxLength(10)
            Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
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
    this.urlImage1 = this.Piper.transform("/images/bg5.png");  
  }

  get f() { return this.ChangePasswordForm.controls; }
  // Change Password
  changePassword() {
    this.submitted = true;
    if (this.ChangePasswordForm.invalid) {
      return;
    }
       let ChangeRQ: PasswordChange = {
            currentpassword: this.ChangePasswordForm.value.currentPassword,
            password: this.ChangePasswordForm.value.password,
            password_confirmation: this.ChangePasswordForm.value.cnfpassword,
            token: this.api_key,
          }
          this.auth.ChangePassword(ChangeRQ).subscribe(res => {
            if(res['code'] === 200 ){
             this.message = res['message'];
            }
            else{
              this.message = res['message'];
            }
          });   
  }
  
  getUrl() {
    return `url('${this.Piper.transform("/images/bg5.png")}')`;
  }
}



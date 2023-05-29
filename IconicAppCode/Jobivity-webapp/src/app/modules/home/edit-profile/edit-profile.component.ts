import { Component, OnInit } from '@angular/core';
import { AuthService, AssetPipe } from '../../provider/auth.service';
import { Title } from "@angular/platform-browser";
import { updateProfile, editProfile } from '../../../../Provider/Comman/Comman';
import { FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms'
import { MixpanelService } from '../../mixpanel/mixpanel.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css','../../../../assets/css/FormStyleCss.css'],
  providers: [Title]
})

export class EditProfileComponent implements OnInit {

  api_key: string;
  urlImage1: string;
  editProfileForm: any;
  user_id: any;
  message: any;
  submitted = false;

  constructor(public auth: AuthService, public Piper: AssetPipe,private mixpanelService: MixpanelService, private title: Title, public formBuilder: FormBuilder) {
    this.title.setTitle(' Jobtiviti - Edit Profile');
    this.api_key = this.auth.getToken();
    this.editProfileForm = this.formBuilder.group({
      username: new FormControl("", Validators.compose([Validators.required])),
      email: new FormControl("", Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),
      contact: new FormControl("", Validators.compose([Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(8), Validators.maxLength(13)])),
      id: new FormControl(),
    });
  }

  get f() { return this.editProfileForm.controls; }

  ngOnInit() {
    this.urlImage1 = this.Piper.transform("/images/bg5.png");
    this.getProfile();
  }

  // Get User Profile
  getProfile() {
    let editPO: editProfile = {
      token: this.api_key,
    }
    this.auth.getProfileData(editPO).subscribe(res => {
      this.editProfileForm.controls['username'].setValue(res['name']);
      this.editProfileForm.controls['email'].setValue(res['email']);
      this.editProfileForm.controls['contact'].setValue(res['contact']);
      this.user_id = res['id'];
    });
  }
  
  // Update User Profile
  updateProfile() {
    this.submitted = true;
    if (this.editProfileForm.valid) {
      let updatePO: updateProfile = {
        name: this.editProfileForm.value.username,
        contact: this.editProfileForm.value.contact,
        email: this.editProfileForm.value.email,
        id: this.user_id,
      }
      this.auth.updateProfileData(updatePO).subscribe(res => {
        this.mixpanelService.setPeople({
          "$name": this.editProfileForm.value.username,
          "$email":  this.editProfileForm.value.email,
          "$phone": this.editProfileForm.value.contact,
        });
        this.message = res['message'];
        this.getProfile();
      });
    }
  }
}



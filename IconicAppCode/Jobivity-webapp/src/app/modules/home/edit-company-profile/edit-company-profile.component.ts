import { Component, OnInit } from '@angular/core';
import { AuthService, AssetPipe } from '../../provider/auth.service';
import { Title } from "@angular/platform-browser";
import { updateCompanyProfile, editCompanyProfile } from '../../../../Provider/Comman/Comman';
import { FormBuilder, Validators,FormGroup, FormControl } from '@angular/forms'
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MixpanelService } from '../../mixpanel/mixpanel.service';

@Component({
  selector: 'app-edit-company-profile',
  templateUrl: './edit-company-profile.component.html',
  styleUrls: ['./edit-company-profile.component.css','../../../../assets/css/FormStyleCss.css'],
  providers: [Title]
})

export class EditCompanyProfileComponent implements OnInit {
 
  // Variable declaration
  api_key: string;
  urlImage1: string;
  editCompanyProfileForm: FormGroup;
  user_id: any;
  company_id: any;
  message: string;
  emailid:any;
  submitted: boolean= false;
  logoValidate:boolean = false;
  messageSeen: boolean= false; 
  imageShow:boolean =false;
  selectedLogo:File=null;;
  logo:any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  
  constructor(public auth: AuthService,  private mixpanelService: MixpanelService,private spinner: NgxSpinnerService,public route: Router,public Piper: AssetPipe, private title: Title, public formBuilder: FormBuilder) {
    this.title.setTitle(' Jobtiviti - Edit Company Profile');
    this.api_key = this.auth.getToken();
    // Form Validation
    this.editCompanyProfileForm = this.formBuilder.group({
      about_company: new FormControl("", Validators.compose([Validators.required, Validators.minLength(20)])),
      business_profile: new FormControl("", Validators.compose([Validators.required, Validators.minLength(20)])),
      talent_pitch: new FormControl("", Validators.compose([Validators.required, Validators.minLength(20)])),
      website:new FormControl(""),
      id: new FormControl(),
    });
    this.imageShow = false;
  }
   fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageShow = true;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  backbutton(){
    this.imageShow = false;
  }
  get f() { return this.editCompanyProfileForm.controls; }
  
  ngOnInit() {
    this.urlImage1 = this.Piper.transform("/images/bg8.png");
    this.getCompanyProfile();
    this.getUploadImage();
    this.getUploadedMedia();
    this.messageSeen = false;
    this.logoValidate = false;
  }
  companydetail:any;
  // Get Company Profile
  getCompanyProfile() {
    let editCPO: editCompanyProfile = {
      token: this.api_key,
    }
    this.auth.getCompanyProfileData(editCPO).subscribe(res => {
      if (res['code'] === 200) {
        this.editCompanyProfileForm.controls['about_company'].setValue(res['about_company']==0?"":res['about_company']);
        this.editCompanyProfileForm.controls['business_profile'].setValue(res['business_profile']==0?"":res['business_profile']);
        this.editCompanyProfileForm.controls['talent_pitch'].setValue(res['talent_pitch']==0?"":res['talent_pitch']);
        this.editCompanyProfileForm.controls['website'].setValue(res['website']);
        this.company_id = res['id'];
        this.companydetail = res['company'][0];
        console.log(this.companydetail['address1']);
      }
      else if(res['code'] === 202){
        this.company_id = res['id'];
        this.editCompanyProfileForm.controls['website'].setValue(res['website']);
        this.companydetail =  res['company'][0];
      }
      else {
        this.user_id = res['id'];
        this.editCompanyProfileForm.controls['website'].setValue(res['website']);
        this.companydetail =  res['company'][0];
      }
      this.address1 = this.companydetail['address1'];
      this.address2 = this.companydetail['address2'];
      this.area = this.companydetail['area'];
      this.category_name = this.companydetail['category_name'];
      this.country_name = this.companydetail['country_name'];
      this.postal_code = this.companydetail['postal_code'];
      this.state_name = this.companydetail['state_name'];
      this.company_name = this.companydetail['company_name'];
      this.registration_no = this.companydetail['registration_no'];
      this.size_of_company = this.companydetail['size_of_company'];
      this.industry_name = this.companydetail['industry_name'];
      this.emailid="mailto:employer@jobtiviti.com";
    });
  }
  address1:string;
  address2:string;
  area:string;
  category_name:string;
  country_name:string;
  postal_code:string;
  state_name:string;
  registration_no:string;
  company_name:string;
  size_of_company:string;
  industry_name:string;

 // Select Image
 cardImage(event) {
    this.selectedLogo = <File>event.target.files[0];
    this.uploadImage();
 }
 
 // Upload Image
 uploadImage(){
  this.imageShow = false;
  this.spinner.show();
   const fd = new FormData();
   fd.append('image',this.croppedImage);
   fd.append('company_id',  this.company_id == undefined ? (0).toString() : this.company_id); 
   fd.append('user_id', this.user_id);
   this.auth.uploadCompanyImage(fd).subscribe(res => {  
    this.mixpanelService.track("Button Click",{"name": "Upload Logo"});
     this.getUploadImage(); 
     this.logoValidate = false;
     this.spinner.hide();
  });
 }

 // Get Company Logo
 getUploadImage(){
  let editCPO: editCompanyProfile = {
    token: this.api_key,
  }
  this.auth.getCompanyProfileImage(editCPO).subscribe(res => {
    if (res['code'] === 200) {
      this.logo = res['company_logo'];
      console.log(this.logo);
      this.getCompanyProfile();
    }
    else{
      this.logo = null;
      console.log(this.logo);
    }
  });
 }

  // Update Comapny Prtofie
  updateCompanyProfile() {
    if(this.logo == null){
     
      this.logoValidate = true;
      this.submitted = true;
    }
    else 
    {
      console.log("else");
      this.logoValidate = false;
      this.submitted = true;
      
      if (this.editCompanyProfileForm.valid) {
        let updateCPO: updateCompanyProfile = {
          about_company: this.editCompanyProfileForm.value.about_company,
          business_profile: this.editCompanyProfileForm.value.business_profile,
          talent_pitch: this.editCompanyProfileForm.value.talent_pitch,
          website:this.editCompanyProfileForm.value.website,
          company_id: this.company_id,
          user_id: this.user_id
        }
        this.auth.updateCompanyProfileData(updateCPO).subscribe(res => {
          this.mixpanelService.track("Button Click",{"name": "Save Company"});
          this.message = res['message'];
          this.getCompanyProfile();
          this.messageSeen = true;     
        });
      }
    }
    
  }
  
  // Rediect to dashboard
  moveDashboard(){
    this.route.navigate(["/home/dashboard"]);

  }
  media:any;
  mediaArray:any=[];
  // Uploading SSM Certificate
  uploadMedia(event) {
    this.media = <File>event.target.files[0];
    console.log(this.media);
    this.uploadComMedia();
 }
 
  uploadComMedia(){
   this.spinner.show();
   const fd = new FormData();
   fd.append('image', this.media);
   fd.append('api_token', this.api_key); 
      this.auth.uploadCompanyMedia(fd).subscribe(res => {  
        this.getUploadedMedia();
        this.spinner.hide();   
      });
  
  }
 // Get Company Media
 getUploadedMedia(){
  let editCPO: editCompanyProfile = {
    token: this.api_key,
  }
  this.auth.getCompanyMediaImage(editCPO).subscribe(res => {
    if (res['code'] === 200) {
      this.mediaArray = res['data'];
      console.log(this.mediaArray);
    }
    else{
      this.mediaArray = [];
      console.log(this.mediaArray);
    }
    
  });
 }
 deleteMedia(id){
  this.auth.deleteCompanyMedia(id).subscribe(res => {
    if (res['code'] === 200) {
      this.getUploadedMedia();
    }
    
    
  });
 }
}



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl,  } from '@angular/forms';
import { Companys, UpdateCompany, states, industries, UpdateJob, category, LoginRQ, countryClas } from '../../../../Provider/Comman/Comman';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, AssetPipe } from '../../provider/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.css'],
  providers: [Title]
})

export class AddAnnouncementComponent implements OnInit {
  announcementimage:any;
  announce_img:any;
  AnnouncementForm: FormGroup;
  api_key:any;
  minDate = new Date();
  imageFlag:boolean = false;
  submitted = false;
  constructor(public formBuilder: FormBuilder, public auth: AuthService, public route: Router,
    private aroute: ActivatedRoute, private spinner: NgxSpinnerService, public Piper: AssetPipe,
    private title: Title,private datePipe: DatePipe) { 
      this.title.setTitle(' Jobtiviti - Announcement');
      this.api_key = this.auth.getToken();  
      this.AnnouncementForm = this.formBuilder.group(
        {
          start_date: new FormControl("", Validators.compose([Validators.required])),
          end_date: new FormControl("", Validators.compose([Validators.required])),
          url: new FormControl(),
        }
        ,
        { validator: this.maxDateValidation }
      );
    }
    maxDateValidation(c: AbstractControl): { dateInvalid: boolean } {
      if (c.get("start_date").value > c.get("end_date").value) {
        return { dateInvalid: true };
      }
    }
    get f() { return this.AnnouncementForm.controls; }

  ngOnInit() {
    this.imageFlag = false;
  }

  uploadImage(event) {
    this.announcementimage = <File>event.target.files[0];
    console.log(this.announcementimage);
    this.uploadAnnImage();
 }

 uploadAnnImage(){
  const fd = new FormData();
  fd.append('image', this.announcementimage);
  this.auth.uploadAnnouncementImage(fd).subscribe(res => {   
    this.announce_img = res['name'];
    this.imageFlag = false;
 });
 
 }

  // Create Company button
  addAnnouncement() {
    if(this.announce_img != null && this.announce_img != undefined && this.announce_img != '')
    {
        this.submitted = true;
        if (this.AnnouncementForm.invalid) {
          return;
        }
        let data = {
            api_token:this.api_key,
            announcement_poster: this.announce_img,
            start_date: this.datePipe.transform(this.AnnouncementForm.value.start_date, "yyyy-MM-dd"),
            end_date: this.datePipe.transform(this.AnnouncementForm.value.end_date, "yyyy-MM-dd"),
            url: this.AnnouncementForm.value.url,
          }
        this.auth.addAnnouncement(data).subscribe(res => {
          if (res["status"] == "success") {
          this.route.navigate(["/admin/announcements"]);
          }
        })
    }
    else{
     this.imageFlag = true;
     this.submitted = true;
    }
    
  }
  backbutton(){
    this.route.navigate(["/admin/announcements"]);
  }

}

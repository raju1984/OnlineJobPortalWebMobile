import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService, AssetPipe } from '../../provider/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  providers: [Title]
})
export class ReviewComponent implements OnInit {
  
userID:any;
jobID:any;
interviewData:any;
api_key:string;

  constructor(public auth: AuthService, public route: Router,
    public Piper: AssetPipe, private title: Title, private aroute: ActivatedRoute) {
    this.title.setTitle(' Jobtiviti - Review Talent');
    this.api_key = this.auth.getToken();
  }

  ngOnInit() {
    this.aroute.queryParams.subscribe(params => {
        if (params["user_id"] != ' ' && params["job_id"] != ' ') {
           this.userID = params["user_id"];
           this.jobID = params["job_id"];
           this.getAllIntVideo();
        }
      });
  }
  videoo:any;
 getAllIntVideo(){
  this.auth.getInterviewData(this.api_key, this.userID, this.jobID,'View').subscribe(res => {
    if(res['code'] === 200){
    this.interviewData = res['data'];
    console.log(this.interviewData)
    this.interviewData.forEach(x => {
      this.videoo = x.video;
      console.log(this.videoo);
    });
     
    }
  });
 }
  

}

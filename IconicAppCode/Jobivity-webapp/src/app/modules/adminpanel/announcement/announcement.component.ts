import { Component, OnInit,ElementRef ,ViewChild} from '@angular/core';
import { CreditLedger,CreditLedgerList } from 'src/Provider/Comman/Comman';
import { FormBuilder, FormControl, Validators, FormGroup ,AbstractControl} from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';
import { AuthService } from '../../provider/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css'],
  providers: [Title]
})


export class AnnouncementComponent implements OnInit {
  api_key:string;
  announcementList=[];
  message:string;
  poster:any;
  p:any;
  announId:any;
  constructor(public formBuilder: FormBuilder,public auth: AuthService,public route: Router,private spinner: NgxSpinnerService,
    private title: Title, private aroute: ActivatedRoute,) { 
      this.title.setTitle(' Jobtiviti - Announcement');
      this.api_key = this.auth.getToken();       
    }

  ngOnInit() {
    this.getAnnouncement('Active');
    //this.showPoster();
  }


  // List Credit Ledger
  getAnnouncement(status:any){
   // this.spinner.show();
    this.auth.getAnnouncementList(this.api_key,status).subscribe(res => {
     // this.spinner.hide();   
      this.announcementList = res;
    })
   
  }
  createAnnouncement() {
    this.route.navigate(["/admin/addannouncements"]);
  }
 
  onclickdata(id){
    this.announId = id;
    console.log(this.announId);
  }
  onStatusChange(id,status){
    this.auth.changeAnnounceStatus(this.api_key,id,status).subscribe(res => {
      if (res['code'] == 200) {
        if(status == 'Archive'){
        this.getAnnouncement('Active');
        }else{
        this.getAnnouncement('Archive');
        }
      
          
         
      }
  });
  }

  deletePoster(){
      this.auth.deleteAnnouncement(this.api_key,this.announId).subscribe(res => {
          if (res['code'] == 200) {
            this.getAnnouncement('Active');
          }
      });
    
  }

  showPoster(id){
    
    this.announId = id;
    this.auth.getAnnouncementposter(this.api_key,this.announId).subscribe(res => {
      this.poster=res[0]['poster'];
      console.log(this.poster);
       
    });
  
}
removeImage(){
  this.poster = null;
}
 
}

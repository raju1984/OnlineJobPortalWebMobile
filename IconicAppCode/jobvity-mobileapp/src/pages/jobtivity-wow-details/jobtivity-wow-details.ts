import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { RQAPIJobtivityIDToken, WowList } from '../../providers/CustomClasses/Users';

@Component({
  selector: 'page-jobtivity-wow-details',
  templateUrl: 'jobtivity-wow-details.html',
})
export class JobtivityWowDetailsPage implements OnInit {
  api_token: string = "";
  jobtivityId: number = 0;
  wowList: WowList[];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    public viewCtrl: ViewController
  ) {
    this.jobtivityId = this.navParams.get("id");
    this.api_token = this.auth.authUser["api_token"];
  }

  ngOnInit() {
    let RQ: RQAPIJobtivityIDToken = {
      api_token: this.api_token,
      jobtivity_id: this.jobtivityId
    }
    this.getAllWowList(RQ);
  }
  getAllWowList(RQ: RQAPIJobtivityIDToken) {
    this.auth.GetwowUsersList(RQ).subscribe(res => {
      this.wowList = res;
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad JobtivityWowDetailsPage');
  }
  dismiss() {
    let data = { foo: "bar" };
    this.viewCtrl.dismiss(data);
  }

}

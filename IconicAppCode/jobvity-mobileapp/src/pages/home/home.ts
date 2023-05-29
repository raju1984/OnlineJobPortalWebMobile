import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { DefaultLandingPage } from '../default-landing/default-landing';
import { Mixpanel } from '@ionic-native/mixpanel';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  skipMsg: string = "START NOW";

  constructor(public navCtrl: NavController, private mixPanel: Mixpanel, private auth: AuthProvider) {
    mixPanel.init(this.auth.mixPanelToken);
    mixPanel.track("Page View", { "name": "Onboarding Slides", "page": 1 });
  }

  startNow() {
    if (this.skipMsg == "Skip") {
      this.mixPanel.track("Button Click", { "name": "Skip" });
    } else {
      this.mixPanel.track("Button Click", { "name": "START NOW" });
    }
    this.navCtrl.setRoot(DefaultLandingPage);
  }

  slideChanged() {
    let pagenum = this.slides.getActiveIndex() + 1;
    this.mixPanel.track("Page View", { "name": "Onboarding Slides", "page": pagenum });
    if (this.slides.isEnd())
      this.skipMsg = "START NOW";
  }

}

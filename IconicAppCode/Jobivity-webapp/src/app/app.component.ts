import { Component } from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
declare let ga: Function;
import { MixpanelService } from '../app/modules/mixpanel/mixpanel.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 // title = 'jobivity-webapp';
 constructor(public router: Router,private mixpanelService: MixpanelService) {

  // subscribe to router events and send page views to Google Analytics
  this.router.events.subscribe(event => {

    if (event instanceof NavigationEnd) {
      this.mixpanelService.track('Page View', {
        url: event.urlAfterRedirects
      });
      ga('set', 'page', event.urlAfterRedirects);
      ga('send', 'pageview');
      console.log('%%% Google Analytics page view event %%%');
    }

  });
}
}

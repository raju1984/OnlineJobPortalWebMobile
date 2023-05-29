import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService, AssetPipe } from './modules/provider/auth.service';

import { AuthGuard } from './auth.guard';
import { NgxPaginationModule } from 'ngx-pagination';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider, } from "angular-6-social-login";
import { UserpanelModule } from './modules/userpanel/userpanel.module';
import { SafePipe } from './safe.pipe';

//import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// Configs 
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("329430881319468")
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("306494035495-5e7uqvguc3qr38g8aoc8v94aghc7421n.apps.googleusercontent.com")
      },
    ]
  );
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    SocialLoginModule,
    UserpanelModule,
  
    //BsDatepickerModule.forRoot()

  ],
  providers: [AuthService, AuthGuard, AssetPipe, {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

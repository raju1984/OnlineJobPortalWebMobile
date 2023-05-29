import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { HttpClientModule } from "@angular/common/http";
import { IonicStorageModule } from "@ionic/storage";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Camera } from "@ionic-native/camera";
import { FileTransfer } from "@ionic-native/file-transfer";
import { FilePath } from "@ionic-native/file-path";
import { Crop } from "@ionic-native/crop";
import { Base64 } from "@ionic-native/base64";
import { Facebook } from "@ionic-native/facebook";
import { MyApp } from "./app.component";
import { ComponentsModule } from "../components/components.module";
import { TimeAgoPipe } from 'time-ago-pipe';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GooglePlus } from '@ionic-native/google-plus';
import { Push } from '@ionic-native/push';

import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { RegistrationPage } from "../pages/registration/registration";
import { UserInfoPage } from "../pages/user-Info/user-Info";
import { ProfilePage } from "../pages/profile/profile";
import { CreateJobtivityPage } from "../pages/create-jobtivity/create-jobtivity";

import { AuthProvider } from "../providers/auth/auth";
//import { AutoCompleteModule } from "ionic2-auto-complete";
import { AutocompleteProvider } from "../providers/autocomplete/autocomplete";

import { SelectSearchableModule } from "ionic-select-searchable";
import { SubCategoryPage } from "../pages/sub-category/sub-category";
import { JobtivityDetailPage } from "../pages/jobtivity-detail/jobtivity-detail";
import { FeedsPage } from "../pages/feeds/feeds";
import { JobtivityCommentDetailsPage } from "../pages/jobtivity-comment-details/jobtivity-comment-details";
import { TabsPage } from "../pages/tabs/tabs";
import { NotificationPage } from "../pages/notification/notification";
import { SettingsPage } from "../pages/settings/settings";
import { PicturePage } from "../pages/picture/picture";
import { EditProfilePage } from "../pages/edit-profile/edit-profile";
import { ChangePasswordPage } from "../pages/change-password/change-password";
import { UserProfilePage } from "../pages/user-profile/user-profile";
import { DefaultLandingPage } from "../pages/default-landing/default-landing";
import { JobtivityWowDetailsPage } from "../pages/jobtivity-wow-details/jobtivity-wow-details";
import { AchivementPage } from "../pages/achivement/achivement";
import { Mixpanel, MixpanelPeople } from "@ionic-native/mixpanel";
import { IonicSelectableModule } from "ionic-selectable";
import { ForgotPasswordPage } from "../pages/forgot-password/forgot-password";
import { ResetPasswordPage } from "../pages/reset-password/reset-password";
//import { RlTagInputModule } from 'angular2-tag-input';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegistrationPage,
    UserInfoPage,
    ProfilePage,
    CreateJobtivityPage,
    SubCategoryPage,
    JobtivityDetailPage,
    FeedsPage,
    JobtivityCommentDetailsPage,
    TabsPage,
    NotificationPage,
    SettingsPage,
    PicturePage,
    EditProfilePage,
    ChangePasswordPage,
    UserProfilePage,
    DefaultLandingPage,
    AchivementPage,
    JobtivityWowDetailsPage,
    TimeAgoPipe,
    ChangePasswordPage,
    ForgotPasswordPage,
    ResetPasswordPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    //AutoCompleteModule,
    SelectSearchableModule,
    ComponentsModule,
    IonicSelectableModule
    //RlTagInputModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegistrationPage,
    UserInfoPage,
    ProfilePage,
    CreateJobtivityPage,
    SubCategoryPage,
    JobtivityDetailPage,
    FeedsPage,
    JobtivityCommentDetailsPage,
    TabsPage,
    NotificationPage,
    SettingsPage,
    PicturePage,
    EditProfilePage,
    ChangePasswordPage,
    UserProfilePage,
    DefaultLandingPage,
    AchivementPage,
    JobtivityWowDetailsPage,
    ChangePasswordPage,
    ForgotPasswordPage,
    ResetPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    AutocompleteProvider,
    Camera,
    FileTransfer,
    FilePath,
    Crop,
    Base64,
    Facebook,
    InAppBrowser,
    Mixpanel,
    MixpanelPeople,
    GooglePlus,
    Push
  ]
})
export class AppModule { }

import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import "rxjs/add/operator/map";
import {
  Registration,
  Courses,
  University,
  updateUserInfo,
  Category,
  Jobtivity,
  JobtivityList,
  AddJobtivity,
  JobtivityComments,
  UserDetails,
  RQAPIUserIDToken,
  RQAPIJobtivityIDToken,
  WowList,
  Milestone,
  RQMilestoneId_APIToken,

  NotificationDetails,
  GetToken,
  PasswordReset,
  UserPointGuide,

  SetNotification,

  ArticalData,

  ValidateTokenReq
} from "../CustomClasses/Users";
@Injectable()
export class AuthProvider {
  ApiUrl: string = "http://localhost:8080/adequate/blog/LaravelApi/public/api/";
  authUser: object = {};
  //mixPanelToken: string = "52755392d9e24a70b32c301ccce425e3"; //Debug
  mixPanelToken: string = "f70825d88afad7d816f1c36c1d1dba7a"; //Release
  //LinkedIn URL
  linkedINclientid = "810s77atdms1u1";
  senderID: string = "848771491661";
  linkedINclientsecret = "jHFfRY0jJfm5aLky";
  linkedINAUthURL = "https://www.linkedin.com/oauth/v2";
  returnURL = "http://app.jobtiviti.com/api/";
  linkedINauthorizationURL: string = "";
  ACCtokenURL = "linkedinaccessToken";
  linkedinpeople = "linkedinpeople";

  constructor(public http: HttpClient, private storage: Storage, private loadingCtrl: LoadingController) {
    let env = this;
    //local envrironment for outside the network.
     //this.ApiUrl = "http://122.176.47.222:83/LaravvelSvnCode/public/api/";
    //for development 
    //this.ApiUrl = "http://192.168.1.101:83/LaravvelSvnCode/public/api/";
    //for test 
    //this.ApiUrl = "http://192.168.1.101:83/LaravelApiGithub/public/api/";
    //Live url
    this.ApiUrl = "https://app.jobtiviti.com/api/";
    this.storage
      .get("guser")
      .then(rt => {
        env.authUser = rt;
      })
      .catch(e => {
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let req = { 'err_text': JSON.stringify(e) + "Line No 58", 'file_path': 'auth.ts', 'method': 'constructor', 'parent_method': null, 'error_time': date }
        this.errorLog(req).subscribe();
      });
    this.linkedINauthorizationURL = this.linkedINAUthURL + "/authorization?response_type=code&client_id=" + this.linkedINclientid
      + "&redirect_uri=" + this.returnURL + "";
  }
  doLogin(postData: object) {
    let env = this;
    return new Promise((resolve, reject) => {
      this.http.post(this.ApiUrl + "login", postData, {}).subscribe(
        data => {
          if (data["status"] == "error") {
            reject(data["data"]);
          } else {
            //We are checking wheather user has submitted the all details or not
            if (data["data"].graduation_year == 0 || data["data"].university == 0 || data["data"].is_temp_pass == 1) {
              resolve(data);
            } else {
              env.storage.set("guser", data["data"]);
              env.authUser = data["data"];
              resolve(data);
            }
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  public clear() {
    this.storage.clear().then(() => {
      this.authUser = null;
    });
  }

  loadginFactory() {
    let loading = this.loadingCtrl.create({
      //content: 'Please wait...'
    });
    loading.present();
    return loading;
  }

  CheckUser(res: any): Observable<string> {
    return this.http
      .post(this.ApiUrl + "checkemail", res)
      .map((response: any) => {
        return <string>response;
      });
  }
  doSocialLogin(res: any) {
    let env = this;
    return new Promise((resolve, reject) => {
      env.http.post(this.ApiUrl + "sociallogin", res).subscribe(
        data => {
          if (data["status"] == "error") {
            reject(data["data"]);
          } else {
            //We are checking wheather user has submitted the all details or not
            if (data["data"].graduation_year == null || data["data"].university == null || data["data"].graduation_year == 0 || data["data"].university == 0) {
              resolve(data);
            } else {
              env.storage.set("guser", data["data"]);
              env.authUser = data["data"];
              resolve(data);
            }
          }
        },
        error => {
          reject(error);
        }
      );
    });

  }

  doRegistration(res: Registration): Observable<string> {
    return this.http
      .post(this.ApiUrl + "registration", res)
      .map((response: any) => {
        return <string>response;
      });
  }

  updateUserInfo(res: updateUserInfo): Observable<string> {
    return this.http
      .post(this.ApiUrl + "updateUserInfo", res)
      .map((res: any) => {
        return <string>res;
      });
  }
  updateUserDetails(res: updateUserInfo): Observable<string> {
    return this.http.post(this.ApiUrl + "user/update", res).map((res: any) => {
      return <string>res;
    });
  }

  //Get University list
  getUniversities(): Observable<University[]> {
    return this.http.get(this.ApiUrl + "universities").map((res: any) => {
      return <University[]>res.data;
    });
  }
  //Get Cources List
  getCourses(): Observable<Courses[]> {
    return this.http.get(this.ApiUrl + "courses").map((res: any) => {
      return <Courses[]>res.data;
    });
  }
  getCoursesType(type: string): Observable<Courses[]> {
    return this.http.get(this.ApiUrl + "courses?type=" + type).map((res: any) => {
      return <Courses[]>res.data;
    });
  }
  //Get categories and Subcategories
  getCategorise(): Observable<Category[]> {
    return this.http.get(this.ApiUrl + "categorise").map((res: any) => {
      return <Category[]>res.data;
    });
  }
  getSubCategorise(Id: number): Observable<Category[]> {
    return this.http
      .get(this.ApiUrl + "subcategorise?category_id=" + Id.toString())
      .map((res: any) => {
        return <Category[]>res.data;
      });
  }

  addJobtivity(res: Jobtivity): Observable<string> {
    return this.http.post(this.ApiUrl + "jobtivity", res).map((res: any) => {
      return <string>res;
    });
  }

  getAllJobitivities(apikey: string): Observable<JobtivityList[]> {
    return this.http
      .get(this.ApiUrl + "jobtivities?api_token=" + apikey)
      .map((res: any) => {
        return <JobtivityList[]>res.data;
      });
  }
  getAllJobitivitiesByUser(
    apikey: string,
    id: number,
    limit: number = 0
  ): Observable<JobtivityList[]> {
    return this.http
      .get(
        this.ApiUrl +
        "jobtivities?api_token=" +
        apikey +
        "&user_id=" +
        id.toString() + "&limit=" + limit
      )
      .map((res: any) => {
        return <JobtivityList[]>res.data;
      });
  }

  addJobtivityComment(
    apikey: string,
    message: string,
    jobitivityid: number
  ): Observable<JobtivityList[]> {
    let addJobtivity: AddJobtivity = {
      api_token: apikey,
      jobtivity_id: jobitivityid,
      message: message
    };
    return this.http
      .post(this.ApiUrl + "comment", addJobtivity)
      .map((res: any) => {
        return <JobtivityList[]>res.data;
      });
  }
  getJobtivityComments(Id: number): Observable<JobtivityComments[]> {
    return this.http
      .get(this.ApiUrl + "comments?jobtivity_id=" + Id.toString())
      .map((res: any) => {
        return <JobtivityComments[]>res.data;
      });
  }

  getUserDetails(apikey: string, id: number): Observable<UserDetails> {
    return this.http
      .get(
        this.ApiUrl +
        "user/details?api_token=" +
        apikey +
        "&user_id=" +
        id.toString()
      )
      .map((res: any) => {
        if (res["status"] == "error") {
          let Udetails: UserDetails = new UserDetails();
          Udetails.Message = "error";
          return Udetails;
        }
        return <UserDetails>res.data;
      });
  }

  FollowUser(follow: RQAPIUserIDToken): Observable<string> {
    return this.http
      .post(this.ApiUrl + "user/follow", follow)
      .map((res: any) => {
        return <string>res["status"];
      });
  }
  UnFollowUser(follow: RQAPIUserIDToken): Observable<string> {
    return this.http
      .post(this.ApiUrl + "user/unfollow", follow)
      .map((res: any) => {
        return <string>res["status"];
      });
  }

  getJobtivity(id: number, apitoken: string) {
    return this.http
      .get(
        this.ApiUrl +
        "jobtivitybyid?jobtivity_id=" +
        id +
        "&api_token=" +
        apitoken
      )
      .map((res: any) => {
        return res;
      });
  }
  AddWow(wow: RQAPIJobtivityIDToken): Observable<string> {
    return this.http.post(this.ApiUrl + "user/addWow", wow).map((res: any) => {
      return <string>res;
    });
  }
  ValidateToken(Vtoken: ValidateTokenReq): Observable<any> {
    //debugger;
    console.log(1);
    return this.http.post(this.ApiUrl + "validatetoken", Vtoken).map((res: any) => {
      console.log(res);
      return <any>res;
    })
  }
  RemoveWow(wow: RQAPIJobtivityIDToken): Observable<string> {
    return this.http
      .post(this.ApiUrl + "user/removeWow", wow)
      .map((res: any) => {
        return <string>res["status"];
      });
  }
  GetwowUsersList(wow: RQAPIJobtivityIDToken): Observable<WowList[]> {
    return this.http
      .get(
        this.ApiUrl +
        "user/wowUsers?jobtivity_id=" +
        wow.jobtivity_id +
        "&api_token=" +
        wow.api_token
      )
      .map((res: any) => {
        return <WowList[]>res["data"];
      });
  }

  GetMileStoneAcivement(api_token: string): Observable<Milestone> {
    return this.http
      .get(this.ApiUrl + "user/milestoneAchievement?api_token=" + api_token)
      .map((res: any) => {
        return <Milestone>res["milestone"];
      });
  }
  SetmilestoneAchieved(RQ: RQMilestoneId_APIToken): Observable<string> {
    return this.http
      .post(this.ApiUrl + "user/milestoneAchieved", RQ)
      .map((res: any) => {
        return <string>res["status"];
      });
  }
  //loadXMLFromWorkitdaily(): Observable<string> {
  //  return this.http.get(this.UrlWorkitdaily, { responseType: 'text' })
  //    .map((data) => {
  //      return <string>data;
  //    });
  //}

  getArticalData(URL: string): Observable<ArticalData[]> {
    return this.http.get(this.ApiUrl + "article-data?url=" + URL)
      .map((data) => {
        return <ArticalData[]>data;
      });
  }

  GetUserNotification(api_token: string): Observable<NotificationDetails[]> {
    return this.http
      .get(this.ApiUrl + "user/notification?api_token=" + api_token)
      .map((res: any) => {
        return <NotificationDetails[]>res["data"];
      });
  }

  SetUserNotification(RQ: SetNotification): Observable<string> {
    return this.http
      .post(this.ApiUrl + "user/notification", RQ)
      .map((res: any) => {
        return <string>res["success"];
      });
  }
  GetUserNotificationCount(api_token: string): Observable<string> {
    return this.http
      .get(this.ApiUrl + "user/notificationcount?api_token=" + api_token)
      .map((res: any) => {
        return <string>res["NewNotification"];
      });
  }
  SetUserNotificationSeen(RQ: SetNotification): Observable<string> {
    return this.http
      .post(this.ApiUrl + "user/setseennotification", RQ)
      .map((res: any) => {
        return <string>res;
      });
  }

  forgotPassword(RQ: GetToken): Observable<string> {
    return this.http
      .post(this.ApiUrl + "password/forget", RQ)
      .map((res: any) => {
        return <string>res["data"];
      });
  }
  GetResetToken(RQ: GetToken): Observable<string> {
    return this.http
      .post(this.ApiUrl + "password/email", RQ)
      .map((res: any) => {
        return <string>res["data"];
      });
  }
  ResetPassword(RQ: PasswordReset): Observable<string> {
    return this.http
      .post(this.ApiUrl + "password/reset", RQ)
      .map((res: any) => {
        return <string>res;
      });
  }

  LinkedInaccessToken(code: string): Observable<string> {
    return this.http
      .get(this.ACCtokenURL + "?grant_type=authorization_code&client_id="
        + this.linkedINclientid + "&client_secret=" + this.linkedINclientsecret
        + "&code=" + code + "&redirect_uri=" + this.returnURL)
      .map((res: any) => {
        return <string>res;
      });
  }
  LinkedGetMemberProfile(code: string): Observable<string> {
    return this.http
      .get(this.linkedinpeople + "/people/~?format=json&type=email&oauth2_access_token=AQW77zqrfzKPCMExksXnvsFE0gjF-ekBfnTMU-gnJufLDAvsqxsG8dKJcSxzuXQjIqRyAUFk9Nr5V0O12KodwX8-0nxf9WRB7ibI-E3XQCZwnBstKlU2OKt57XuXCFW20w-HiibxVs_rWbZ5Cri18k-L2tVjcITCzx7Kw--s8szouWwRmx3lc7324pvagEM2Z1zlDMk6yMCmgnLcGCVH_VDHDq2VKfPIb-cR-eXU_Rrj4LsZDbJIeaFRLOT0MiqQXlgt2yRgNDxQCimRFl5GaVsds-PZEP0jprg9KQcvaF4dlX5F3svsHiNWl2-e3RyPRoLVko8hFCqXOT-NYJ_W1J-mLfmGZQ")
      //.get(this.ACCtokenURL + "?grant_type=authorization_code&client_id="
      //  + this.linkedINclientid + "&client_secret=" + this.linkedINclientsecret
      //  + "&code=" + code + "&redirect_uri=" + this.returnURL)
      .map((res: any) => {
        return <string>res;
      });
  }

  errorLog(values) {
    return this.http
      .post(this.ApiUrl + "error_log", values)
      .map((response: any) => {
      });
  }

  GetUserGuidePoint(): Observable<UserPointGuide[]> {
    return this.http.get(this.ApiUrl + "rewardpoints").map((res: any) => {
      return <UserPointGuide[]>res["data"];
    });
  }

  GetReadArticalPoint(api_token: string): Observable<string> {
    return this.http.get(this.ApiUrl + "points/read-article?api_token=" + api_token).map((res: any) => {
      return <string>res;
    });
  }

  GetDailysigninPoint(api_token: string): Observable<string> {
    return this.http.get(this.ApiUrl + "points/daily-signin?api_token=" + api_token).map((res: any) => {
      return <string>res;
    });
  }
}

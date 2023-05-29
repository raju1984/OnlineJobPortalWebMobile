import { Component, OnInit, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  ActionSheetController,
  ToastController,
  LoadingController,
  Platform
} from "ionic-angular";
import { ChangePasswordPage } from "../change-password/change-password";
import { AuthProvider } from "../../providers/auth/auth";
import {
  UserDetails,
  University,
  Courses,
  updateUserInfoValidate,
  updateUserDetails
} from "../../providers/CustomClasses/Users";
import { LoginPage } from "../login/login";
import { SelectSearchableComponent } from "ionic-select-searchable";
import { Camera } from "@ionic-native/camera";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { FilePath } from "@ionic-native/file-path";
import { Crop } from "@ionic-native/crop";
import { Base64 } from "@ionic-native/base64";
import { DomSanitizer } from "@angular/platform-browser";
import { ProfilePage } from "../profile/profile";
import { Mixpanel } from "@ionic-native/mixpanel";
import { IonicSelectableComponent } from "ionic-selectable";

declare var cordova: any;
@Component({
  selector: "page-edit-profile",
  templateUrl: "edit-profile.html"
})
export class EditProfilePage implements OnInit {

  userdetails: UserDetails;
  api_token: string = "";
  user_Id: number = 0;
  graduationYear: string = "";

  minGradutionYear: string = "";
  maxGradutionYear: string = "";

  UniversityNameList: University[];
  UniversityName: University;

  CourseNameList: Courses[];
  CourseName: Courses[];
  CourseSelected: Courses[] = [];

  loading: any;
  lastImage: any;
  UpdateImagePath: any;
  photos: any;


  itemsCourse: string[] = [];
  itemsListCourse: string[] = [];
  SelectedValue: string;
  listSelected: string[] = [];
  showListCourse: boolean = false;
  @ViewChild('search') search: any;


  itemsUniversity: string[] = [];
  itemsListUniversity: string[] = [];
  showList: boolean = false;
  university_name: string;


  Uinfo: updateUserDetails = {
    aspiration_message: "",
    courses: [],
    email: "",
    graduation_year: "",
    university: 0,
    name: "",
    api_token: this.api_token
  };

  Uvalidate: updateUserInfoValidate = {
    course: false,
    university: false,
    year: false,
    name: false
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public camera: Camera,
    public platform: Platform,
    public transfer: FileTransfer,
    public filePath: FilePath,
    public cropService: Crop,
    private base64: Base64,
    private sanitizer: DomSanitizer,
    private alert: AlertController,
    private mixPanel: Mixpanel
  ) {
    this.api_token = this.auth.authUser["api_token"];
    this.user_Id = this.auth.authUser["id"];
    this.mixPanel.init(this.auth.mixPanelToken);
    this.mixPanel.track("Page View", { "name": "Edit Profile" });
  }
  ngOnInit() {
    var d = new Date();
    var n = d.getFullYear();
    this.minGradutionYear = (n - 15).toString();
    this.maxGradutionYear = (n + 4).toString();

    this.getCourcesList();
    this.getUniversitiesList();
    setTimeout(() => {
      this.getUserDetail(this.api_token, this.user_Id);
    }, 200);
    this.graduationYear = "2019";
  }
  getCourcesList() {
    this.auth.getCourses().subscribe(
      res => {
        this.CourseNameList = res;
        if (this.CourseNameList.length > 0) {
          this.CourseNameList.forEach(each => {
            this.itemsListCourse.push(each.course_name);
          })
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  onIonicselect(event: { component: IonicSelectableComponent, value: any }) {
    event.component.searchText = "";
    let selectedItem = event.component._selectedItems;
    let item: any[] = [];
    if (selectedItem.length > 0) {
      selectedItem.forEach(each => {
        item.push(each);
      })
    }
    if (this.CourseNameList.length > 0) {
      this.CourseNameList.forEach(each => {
        if (!selectedItem.find(a => a.id == each.id)) {
          item.push(each);
        }
      });
    }
    event.component.items = item;
    event.component.endSearch();
    //setTimeout(() => {
    //  event.component.focusSearchbar = true;
    //}, 200);
    //event.component.initFocus();
  }

  getUniversitiesList() {
    this.auth.getUniversities().subscribe(
      res => {
        this.UniversityNameList = res;
        if (this.UniversityNameList.length > 0) {
          this.UniversityNameList.forEach(each => {
            this.itemsListUniversity.push(each.university_name);
          })
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  getUserDetail(apikey: string, userid: number) {
    let env = this;
    env.auth.getUserDetails(apikey, userid).subscribe(
      res => {
        console.log(res);
        if (res.Message == "error") {
          env.auth.clear();
          env.navCtrl.setRoot(LoginPage);
        }
        env.userdetails = res;
        if (this.UniversityNameList != undefined) {
          env.UniversityName = this.UniversityNameList.find(
            x => x.id == env.userdetails.university
          );
          env.university_name = env.UniversityName.university_name;
        }
        if (this.CourseNameList != undefined) {
          env.CourseName = [];
          env.userdetails.user_course_list.forEach(each => {
            env.CourseName.push(this.CourseNameList.find(x => x.id == each.course_id));
          });
          //env.CourseSelected = env.CourseName;
          env.CourseSelected = env.CourseName;
          if (env.CourseName.length > 0) {
            env.CourseName.forEach(ea => {
              env.listSelected.push(ea.course_name);
            })
          }

        }
        this.graduationYear = env.userdetails.graduation_year.toString();
        this.lastImage = env.userdetails.photo;
      },
      error => {
        //this.auth.clear();
        //this.navCtrl.setRoot(LoginPage);
      }
    );
  }
  CNameChange(event: { component: SelectSearchableComponent; value: any }) {
    this.CourseSelected = [];
    event.value.forEach(element => {
      this.CourseSelected.push({
        id: element.id,
        course_name: element.course_name
      });
    });
  }

  RemoveCourse(cources: Courses) {
    let Id = this.CourseSelected.findIndex(x => x.id == cources.id);
    this.CourseSelected.splice(Id, 1);
    this.CourseName = null;
    setTimeout(() => {
      if (this.CourseSelected.length == 0)
        this.CourseName = null;
      else
        this.CourseName = this.CourseSelected;
    }, 5);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad EditProfilePage");
  }
  changePassword() {
    this.navCtrl.push(ChangePasswordPage);
  }

  UserUpdate() {
    this.mixPanel.track("Button Click", { "name": "Save Profile" });
    if (this.validateUserUpdate()) {
      if (this.UpdateImagePath != undefined)
        this.uploadImage(this.UpdateImagePath, this.createFileName());

      this.Uinfo.graduation_year = this.graduationYear;
      this.Uinfo.university = this.UniversityName.id;
      let Courseslist: number[] = [];
      this.CourseName.forEach(each => {
        Courseslist.push(each.id);
      });
      this.Uinfo.courses = Courseslist;
      this.Uinfo.email = this.userdetails.email;
      this.Uinfo.aspiration_message = this.userdetails.aspiration_message;
      this.Uinfo.name = this.userdetails.name;
      this.Uinfo.api_token = this.api_token;
      let env = this;
      this.auth.updateUserDetails(this.Uinfo).subscribe(
        res => {
          if (res["status"] == "error") {
            env.presentAlert("some problem while adding the data");
          } else {
            env.successAlert("Updated successfully");
          }
        },
        error => {
          env.presentAlert(error["message"]);
        }
      );
    }
  }
  validateUserUpdate(): boolean {
    this.bindData();
    let checkBool: boolean = true;
    if (this.UniversityName == undefined) {
      this.Uvalidate.university = true;
      checkBool = false;
    } else {
      this.Uvalidate.university = false;
    }
    if (this.CourseName != null && this.CourseName != undefined && this.CourseName.length > 0) {
      this.Uvalidate.course = false;
    } else {
      this.Uvalidate.course = true;
      checkBool = false;
    }



    if (this.graduationYear == "") {
      this.Uvalidate.year = true;
      checkBool = false;
    } else {
      this.Uvalidate.year = false;
    }
    if (this.userdetails.name == "") {
      this.Uvalidate.name = true;
      checkBool = false;
    } else {
      this.Uvalidate.name = false;
    }
    return checkBool;
  }

  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
  presentAlert(error) {
    let alert = this.alert.create({
      subTitle: error,
      buttons: ["Ok"]
    });
    alert.present();
  }
  private successAlert(msg) {
    let env = this;
    let alert = this.alert.create({
      title: "Congratulations",
      subTitle: msg,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            env.navCtrl.setRoot(ProfilePage);
          }
        }
      ]
    });
    alert.present();
  }
  //Profile Pic upload changes
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Select Image Source",
      cssClass: "redred",
      buttons: [
        {
          text: "Load from Library",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Use Camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    // Get the data of an image
    let env = this;
    env
      .GetImagePath(options, sourceType)
      .then(imagePath => {
        this.UpdateImagePath = imagePath;
        env.base64
          .encodeFile(imagePath)
          .then(
            (base64File: string) => {
              env.lastImage = env.sanitizer.bypassSecurityTrustUrl(base64File);
            },
            err => {
              console.log(err);
            }
          )
          .catch(e => {
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let req = { 'err_text': JSON.stringify(e) + "Line No 334", 'file_path': 'login.ts', 'method': 'login', 'parent_method': null, 'error_time': date }
            this.auth.errorLog(req).subscribe();
          });
        //env.uploadImage(imagePath, env.createFileName());
      })
      .catch(e => {
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let req = { 'err_text': JSON.stringify(e) + "Line No 337", 'file_path': 'edit-profile.ts', 'method': 'takePicture', 'parent_method': 'presentActionSheet', 'error_time': date }
        this.auth.errorLog(req).subscribe();
      });
  }
  public GetImagePath(options: any, sourceType: any): Promise<any> {
    return this.camera
      .getPicture(options)
      .then(fileUri => {
        if (this.platform.is("ios")) {
          return fileUri;
        } else if (this.platform.is("android")) {
          fileUri = "file://" + fileUri;
          return this.cropService.crop(fileUri, {
            quality: 100,
            targetWidth: -1,
            targetHeight: -1
          });
        }
      })
      .then(path => {
        console.log("Cropped Image Path!: " + path);
        return path;
      })
      .catch(e => {
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let req = { 'err_text': JSON.stringify(e) + "Line No 363", 'file_path': 'edit-profile.ts', 'method': 'GetImagePath', 'parent_method': 'takePicture', 'error_time': date }
        this.auth.errorLog(req).subscribe();
      });
  }
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  private presentCourceToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
    });
    toast.present();
  }
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  public uploadImage(targetPath, filename) {
    let env = this;
    var url = this.auth.ApiUrl + "add_user_photo";
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: filename,
      httpMethod: "POST",
      mimeType: "image/jpg",
      params: { api_token: this.api_token },
      chunkedMode: false,
      headers: { Accept: "image/jpg" }
    };

    const fileTransfer: FileTransferObject = this.transfer.create();
    env.loading = this.loadingCtrl.create({
      content: "Uploading..."
    });
    env.loading.present();
    console.log(targetPath);
    // Use the FileTransfer to upload the image
    fileTransfer
      .upload(targetPath, encodeURI(url), options)
      .then(
        data => {
          let resp = JSON.parse(data.response);
          console.log(resp);
          if (resp["status"] == "success") {
            env.lastImage = resp["imageUrl"];
            env.presentToast("profile Image succesfully uploaded.");
          } else {
            env.presentToast("There is some problem in uploading.");
          }
          env.loading.dismissAll();
        },
        err => {
          env.loading.dismissAll();
          console.log(err);
          env.presentToast("Error while uploading file.");
        }
      )
      .catch(e => {
        env.loading.dismissAll();
        // console.log(e);
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let req = { 'err_text': JSON.stringify(e) + "Line No 429", 'file_path': 'edit-profile.ts', 'method': 'uploadImage', 'parent_method': 'UserUpdate', 'error_time': date }
        this.auth.errorLog(req).subscribe();
      });
  }


  //New implementation
  initializeItems() {
    this.itemsCourse = this.itemsListCourse;
    this.itemsUniversity = this.itemsListUniversity;
  }
  getItems(ev: any) {
    this.initializeItems();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      if (this.listSelected.length > 0) {
        let tempArr: string[] = [];
        this.itemsCourse.forEach(each => {
          if (this.listSelected.indexOf(each) == -1) {
            tempArr.push(each)
          }
        });
        this.itemsCourse = tempArr;
      }
      this.itemsCourse = this.itemsCourse.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.showListCourse = true;
    } else {
      this.showListCourse = false;
    }
  }

  getItemsUniversity(ev: any) {
    this.initializeItems();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      if (this.listSelected.length > 0) {
        let tempArr: string[] = [];
        this.itemsUniversity.forEach(each => {
          if (this.listSelected.indexOf(each) == -1) {
            tempArr.push(each)
          }
        });
        this.itemsUniversity = tempArr;
      }
      this.itemsUniversity = this.itemsUniversity.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.showList = true;
    } else {
      this.showList = false;
    }
  }

  itemSelectedUniversity(item: string) {
    this.showList = false;
    this.university_name = item;
  }
  itemSelected(item: string) {
    this.showListCourse = false;
    let Id = this.listSelected.indexOf(item);
    if (Id == -1)
      this.listSelected.push(item);
    setTimeout(() => {
      this.search.setFocus();
      this.search.placeholder = "";
      this.SelectedValue = "";
    }, 5);
    this.displayToast();
    
  }

  displayToast() {

    if (this.listSelected != undefined && this.listSelected!=null &&  this.listSelected.length == 1) {
      this.presentCourceToast("You can choose more than one courses based on your degree!");
    }
  }

  RemoveCourses(val: string) {
    let Id = this.listSelected.indexOf(val);
    this.listSelected.splice(Id, 1);
    setTimeout(() => {
      this.search.setFocus();
    }, 5);
    this.displayToast();
  }
  bindData() {
    this.CourseName = [];
    this.listSelected.forEach(each => {
      let id = this.CourseNameList.find(x => x.course_name == each).id;
      this.CourseName.push({
        id: id,
        course_name: each
      });
    });

    this.UniversityName = this.UniversityNameList.find(x => x.university_name == this.university_name);
    console.log(this.UniversityName);
  }


}

import { Component } from "@angular/core";
import {
  NavController,
  ActionSheetController,
  Platform,
  ToastController,
  LoadingController
} from "ionic-angular";
import { Camera } from "@ionic-native/camera";
import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions
} from "@ionic-native/file-transfer";
import { FilePath } from "@ionic-native/file-path";
import { AuthProvider } from "../../providers/auth/auth";
import { Crop } from "@ionic-native/crop";
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer } from "@angular/platform-browser";

declare var cordova: any;

@Component({
  selector: "page-picture",
  templateUrl: "picture.html"
})
export class PicturePage {
  loading: any;
  lastImage: any;
  photos: any;
  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public camera: Camera,
    public platform: Platform,
    public transfer: FileTransfer,
    public filePath: FilePath,
    public auth: AuthProvider,
    public cropService: Crop,
    private base64: Base64,
    private sanitizer: DomSanitizer
  ) { }

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
    env.GetImagePath(options, sourceType).then(imagePath => {
      console.log("called");
      env.base64.encodeFile(imagePath).then((base64File: string) => {
        env.lastImage = env.sanitizer.bypassSecurityTrustUrl(base64File);
      }, (err) => {
        console.log(err);
      });
      //env.uploadImage(imagePath, env.createFileName());
    });
    //
  }

  public GetImagePath(options: any, sourceType: any): Promise<any> {   
    return this.camera.getPicture(options)
      .then((fileUri) => {        
        if (this.platform.is('ios')) {
          return fileUri
        } else if (this.platform.is('android')) {
          fileUri = 'file://' + fileUri;
          return this.cropService.crop(fileUri, { quality: 100, targetWidth: -1, targetHeight: -1 });
        }
      })
      .then((path) => {        
        console.log('Cropped Image Path!: ' + path);
        return path;
      })
      //.then(imagePath => {
      //  // Special handling for Android library
      //  if (env.platform.is("android") && sourceType === env.camera.PictureSourceType.PHOTOLIBRARY) {
      //    env.filePath.resolveNativePath(imagePath)
      //      .then(filePath => {
      //        return this.cropService.crop(imagePath, { quality: 100, targetWidth: -1, targetHeight: -1 });
      //        //env.uploadImage(imagePath, env.createFileName());
      //      });
      //  } else {
      //    return this.cropService.crop(imagePath, { quality: 100, targetWidth: -1, targetHeight: -1 })
      //  }
      //},
      //  err => {
      //    env.presentToast("Error while selecting image.");
      //  }
      //).then((path) => {
      //  console.log('Cropped Image Path!: ' + path);
      //  return path;
      //});
  }

  //reduceImages(selected_pictures: any): any {
  //  return selected_pictures.reduce((promise: any, item: any) => {
  //    return promise.then((result) => {
  //      return this.cropService.crop(item, { quality: 75 })
  //        .then(cropped_image => this.photos = cropped_image)
  //    });
  //  }, Promise.resolve());
  //}

  // Create a new name for the image
  //private createFileName() {
  //  var d = new Date(),
  //    n = d.getTime(),
  //    newFileName = n + ".jpg";
  //  return newFileName;
  //}

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "top"
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
      params: { api_token: "m83NVg14eCsfd13guUbvts7fPDaLRTIA7Mv1Ajtxyf73r8hBmzXP6izEv9mY" },
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
            env.presentToast("Image succesfully uploaded.");
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
        let req = { 'err_text': JSON.stringify(e) + "Line No 208", 'file_path': 'picture.ts', 'method': 'uploadImage', 'parent_method': null, 'error_time': date }
        this.auth.errorLog(req).subscribe();
      });
  }
}

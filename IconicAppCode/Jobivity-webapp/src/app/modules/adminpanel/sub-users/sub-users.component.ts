import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl,FormGroup } from '@angular/forms';
import { CreateSubAd ,UpdateSubAd} from '../../../../Provider/Comman/Comman';
import { AuthService } from '../../provider/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sub-users',
  templateUrl: './sub-users.component.html',
  styleUrls: ['./sub-users.component.css']
})

export class SubUsersComponent implements OnInit {

  message:string;
  CreateUserForm: FormGroup;
  submitted = false;
  usersArray:any;
  currentUserArr:any;
  username:string;
  password:any;
  user_role:number;
  modalProgress: boolean = false;
  editmodalProgress: boolean = false;
  userData:any;
  UserEditId:any;
  role:string;

  constructor(public formBuilder: FormBuilder,public auth: AuthService, private title: Title,) {
    this.title.setTitle(' Jobtiviti - Users'); 
    this.role = localStorage.getItem('role');
    // Form Validation
    this.CreateUserForm = this.formBuilder.group(
      {
        name: new FormControl("",Validators.compose([Validators.required])),
        email: new FormControl("",Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),  
        user_role:new FormControl("",Validators.compose([Validators.required])),
      });
   }

   get f() { return this.CreateUserForm.controls; }

  ngOnInit() {
    this.getAllSubAdmin();
  }

  //  Sub Admin List
  getAllSubAdmin(){
    this.auth.getSubAdmins().subscribe(res => {
      if (res['code'] === 200) {
        this.usersArray = res['user'];
      }
    });
  }

  // Copy Password to Clipboard
  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

 // Create Sub Admin Users
  createUser(){
    this.submitted = true;
    if (this.CreateUserForm.invalid) {
      return;
    }
    let Rq: CreateSubAd = {
      name: this.CreateUserForm.value.name,
      email: this.CreateUserForm.value.email,
      user_role:this.CreateUserForm.value.user_role,
    }
    this.auth.createSubAdmins(Rq).subscribe(res => {
      if (res['code'] === 200) {
        this.message = res['message'];
        this.username =  res['user'].name;
        this.password = res['password'];
        this.getAllSubAdmin();
        this.modalProgress = true;
        this.CreateUserForm.reset()
        this.submitted = false;
      }
      else {
        this.message =  res['message'];
        this.modalProgress = false;
      }

    });

  }

  remUserCre(){
    this.CreateUserForm.reset();
    this.modalProgress = false;
    this.message =  " ";
  }

  // Get Sub Admin By Detail
  getUserById(id:number){
    this.message =  " ";
    this.editmodalProgress =false;
    this.auth.getSubAdminsById(id).subscribe(res => {
      if (res['code'] === 200) {
        this.userData = res['user'];
         this.CreateUserForm.controls['name'].setValue(this.userData['name']);
         this.CreateUserForm.controls['email'].setValue(this.userData['email']);
         this.CreateUserForm.controls['user_role'].setValue(this.userData['user_role']);
         this.UserEditId = this.userData['id'];
         console.log(this.UserEditId);
      }
    });   
  }
  // Reset Password for Sub Admin
  ResetPassword(){
    this.updateUser();
    this.auth.ResetSubAdminPass(this.UserEditId).subscribe(res => {
      if (res['code'] === 200) {
        this.message = res['message'];
        this.username =  res['user'].name;
        this.password = res['password'];
        this.getAllSubAdmin();
        this.editmodalProgress = true;
        this.CreateUserForm.reset()
        this.submitted = false;
      }
      else{
        this.message =  res['message'];
        this.editmodalProgress = false;
      }
    });
  }

  // Update Sub Admin Detail
  updateUser(){
    this.submitted = true;
    if (this.CreateUserForm.invalid) {
      return;
    }
    let Rq: UpdateSubAd = {
      name: this.CreateUserForm.value.name,
      email: this.CreateUserForm.value.email,
      user_role:this.CreateUserForm.value.user_role,
      id:this.UserEditId,
    }
    this.auth.updateSubAdmins(Rq).subscribe(res => {
      if (res['code'] === 200) {
        this.message = res['message'];
        this.getAllSubAdmin();
        this.CreateUserForm.reset()
        this.submitted = false;
        this.UserEditId = " "; 
      }
      else {
        console.log("error");
        this.message =  res['message'];
        this.editmodalProgress =false;
      }

    });

  }
  userID:any;
  onclickdata(id:number){
    this.userID = id;

  }
  removeAccess(){
    this.auth.deleteSubAdmins(this.userID).subscribe(res => {
      if (res['code'] == 200) { 
        this.getAllSubAdmin();
      }
  });
      
  }

 
 
}


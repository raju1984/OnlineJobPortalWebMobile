export class GetToken {
  email: string;
}
export class PasswordReset {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
  currentpassword: string;
  id: string;
}

export class Registration {
  email: string;
  password: string;
  name: string;
  graduation_year: string;
  course: string;
  university: string;
  aspiration_message: string;
}
export class User {
  id: number;
  name: string;
}

export class loginRq {
  email: string;
  password: string;
}
export class SocailloginRq {
  email: string;
  type: string;
  access_token: string;
}

export class updateUserInfo {
  email: string;
  graduation_year: string;
  courses: number[];
  university: number;
  aspiration_message: string;
  name: string;
}

export class updateUserDetails {
  email: string;
  graduation_year: string;
  courses: number[];
  university: number;
  aspiration_message: string;
  name: string;
  api_token: string;
}

export class updateUserInfoValidate {
  year: boolean;
  course: boolean;
  university: boolean;
  name: boolean;
}

export class University {
  public id: number;
  public university_name: string;
}
export class UniversityRS {
  data: University[];
  status: string;
}

export class Courses {
  id: number;
  course_name: string;
  created_at?: any;
  updated_at?: any;
}

export class CourseRS {
  data: Courses[];
  status: string;
}

//Category list
export class Category {
  id: number;
  category_name: string;
  checked: boolean;
  imgURL: string;
  tag: string;
}

export class CategoryRS {
  data: Category[];
  status: string;
}

//Jobtivity
export class Jobtivity {
  api_token: string;
  jobtivity_category: number;
  jobtivity_sub_category: number;
  description: string;
  learning_experience: string;
  photo: string;
  category_description: string;
  categoryList: categoryList[];
}
export class categoryList {
  description: string;
}
export class AddJobtivity {
  api_token: string;
  jobtivity_id: number;
  message: string;
}

export class JobtivityList {
  id: number;
  jobtivity_category: number;
  jobtivity_sub_category: number;
  description: string;
  learning_experience: string;
  photo: string;
  photo_url: string;
  created_at: Date;
  updated_at: string;
  Comments: string;
  CommentCheck: boolean;
  WhatIHave: boolean;
  num_of_comments: number;
  user_id: number;
  user: User;
  wowInterest: number;
  num_of_Wow: number;
  categoryTag: Category
}

export class JobtivityComments {
  id: number;
  user_id: number;
  jobtivity_id: number;
  message: string;
  is_show: string;
  is_delete: string;
  created_at: Date;
  updated_at: string;
  user: User;
  jobtivity: JobtivityDescription;
}
export class JobtivityDescription {
  description: string;
}


export class UserDetails {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  api_token: string;
  university: number;
  graduation_year: string;
  aspiration_message?: any;
  photo: string;
  no_of_jobtivity_posted: number;
  no_of_followers: number;
  no_of_followings: number;
  Message: string;
  isFollowing: number;
  IsFollower: boolean;
  user_course_list: UserCourses[];
  milestone: Milestone;
  achievedMilestones: Milestone[];
}
export class SetNotification {
  api_token: string;
  id: number;
}
export class NotificationDetails {    
  id: number;
  item_id: string;
  created_at: string;
  item_type: string; 
  name: string;
  description: string;
  notification_id: number;
}

export class UserCourses {
  course_id: number;
  id: number;
  user_id: number;
  course_name: string;
}
export class Milestone {
  MileStoneID: number;
  description: string;
  id: number;
  milestone_points: number;
  points: number;
  actionURL: string;
  imageURL: string;
  title: string;
}

export class RQAPIUserIDToken {
  user_id: number;
  api_token: string;
}

export class RQMilestoneId_APIToken {  
  api_token: string;
  milestone_id: number;
}
export class RQAPIJobtivityIDToken {
  api_token: string;
  jobtivity_id: number;
}
export class ValidateTokenReq {
  api_token: string;
  email: string;
}
export class WowList {
  id: number;
  jobtivity_id: number;
  name: string;
  photo: string;
  status: number;
  user_id: number;
}
export class UserPointGuide {
  id: number;
  title: string;
  description: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export class ArticalData {
  Category: string[];
  CommentRss: string;
  Comments: string;
  Description: string;
  Guid: string;
  Link: string;
  PubDate: string;
  Title: string;
}




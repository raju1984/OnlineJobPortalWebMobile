import { expand } from 'rxjs/operators';

export class Registration {
  email: string;
  password: string;
  name: string;
  contact: string;
  curjobposition:string;
  is_agree_terms:any;
  is_optin_marketing:any;
  //job_position: string;
}
export class SalesAgentInvitation {
  name: string;
  email: string;
  company: string;
  phone_number: string;
  event:string;
  referrer:string;
}

export class LoginRQ {
  email: string;
  password: string;
  user_role: number;
}
export class GetToken {
  email: string;
}
export class CreateSubAd {
  email: string;
  name:string;
  user_role:number;
}
export class UpdateSubAd {
  email: string;
  name:string;
  user_role:number;
  id:number;
}

export class Companys {
  id: number;  
  company_name: string;  
}
export class Verify {
  id: number;
  status: string;
}
export class PasswordReset {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
  currentpassword: string;
  id: string;
}
export class PasswordChange {
  password: string;
  password_confirmation: string;
  token: string;
  currentpassword: string;
  
}
export class editProfile{
  token: any;
}
export class editCompanyProfile{
  token: any;
}
export class updateProfile{
 email:any;
 name:any;
 contact:any;
 id:any;
}
export class updateCompanyProfile{
  about_company:any;
  business_profile:any;
  talent_pitch:any;
  user_id:any;
  company_id:any;
  website:any;
 }
 export class createCompanyProfile{
  about_company:any;
  business_profile:any;
  talent_pitch:any;
  token:any;
 }
export class UpdateCompany {
  email: string;
  company_name: string;
  state: number;
  industry: number;
  size_of_company: string;
  website: string;
  address1: string;
  address2: string;
  area: string;
  postal_code: string;
  country_id: number;
  category_type: number;
  registration_no: string;
  ssm_certificate:any;
  invite_id:any;
}


export class Question {
  id: number;
  questions: string;
  type: number;
  isVisible: boolean;
  question_options: questionoption[];
  criteria_list: Criteria[]
}
export class Criteria {
  id: number;
  question_id: number;
  name: string;
  criteriaPoint: CriteriaPoint[];
  //IsSelected:boolean;
}
export class CriteriaPoint {
  id: number; 
  name: string;
  description: string;
  user_id: number;
  point: number;
  IsSelected:boolean;
}

export class RQCriteria {
  description: string;
  name: string;
  api_token: string;
  anslist: RQCriteriaList[];
}
export class RQCriteriaList {
  question_id: number;
  criteria_id: number;
  criterial_point_id: number;
}

export class questionoption {
  id: number;
  question_id: number;
  question_options: string;
  isSelected: boolean;
}

export class RQQuestOption {
  api_token: string;
  anslist: QOptionAns[];
}
export class QOptionAns {  
  option_id: number;
  question_id: number;
}

export class CompanyCulturePoint {
  id: number;
  questions: string;
  type: number;
  isVisible: boolean;
  company_culture_answers: CompanyCultureAnswers;  
}
export class CompanyCultureAnswers {
  id: number;
  option_id: number;
  question_id: number;
  totalEarnPoints: number;
  categorialPoints: CategorialPoints;
}
export class CategorialPoints {
  WorkingStyle: number;
  Formality: number;
  InternalStructure: number;
  TalentManagement: number;
  PersonalGrowth: number;
}

export class states {
  id: number;
  state_name: string;
}

export class industries {
  id: number;
  industry_name: string;
}

export class Department {
  id: number;
  department_name: string;
}

export class ReliventDegree {
  id: number;
  degree_name: string;
}

export class OtherDegree {
  id: number;
  degree_name: string;
}

export class University {
  id: number;
  university_name: string;
}

export class HandSkill {
  id: number;
  skill_name: string;
}

export class groupQuestion {
  id: number;
  group: string;
  questions: string;
  slug: string;
  type: string;
  question_options: QuestionOption[];
  isSen: boolean = false;
}

export class QuestionOption {
  id: number;
  isSen: boolean;
  question_options: string;
  question_id: number;
  slug: string;
  type: string;
  DropDownText: any[] = [];
  Detail: any[] = [];
}


export class QuestionAnswer {
  api_token: string;
  name: string;
  department_id: string;
  talent_profile_id: number;
  job_description: string[];
  anslist: answerdetail[];
  position_level: any;
  customUniversity: any = [];
  customDegree: any = [];
  CustomLanguageR: any = [];
  CustomLanguageW: any = [];
}

export class answerdetail {
  question_id: number;
  option_id: number;
  ans_id: string;
  tell_us: string;
}


export class TalentProfile {
  id: number;
  name: string;
  type: number;
  isVisible: boolean;
  department_id: number;
  talent_profile_questions: JobDiscription[]=[];
  talent_profile_answere: talentProfileAns[] = [];
  dispLength: number;
  isShowLessdata: boolean;
  isShowMoredata: boolean;
  WordCount: number;
  WordLength: number;
  jobdisp: string;
  custom_degree: any[] = [];
  custom_university: any[] = [];
  custom_language_r: any[] = [];
  custom_language_w: any[] = [];
}
export class TalentProfilList {
  department_id: number;
  name: string;
  created_att: string;
}

export class JobAddsList{
  title:string;
  talent_name:string;
  department_name:string;
  created_at:string;
  department_id:number;
}
export class PaymentDetails {
  value: string;
  label: string;
}

export class JobDiscription {
  id: number;
  talent_profile_id: string;
  text: string;
}

export class talentProfileAns {
  id: number;
  talent_profile_id: number;
  question_id: number;
  question_option_id: number;
  question_answer_id: number;
  tell_us: string;
}

export class positions {
  id: number;
  position_name: string;
}

export class UpdateJob {
  email: string;
  job_position: string;
}

export class companyList {
  id: number;
  company_name: string;
  is_verify: number;
  created_at: Date;
  email: string;
  name: string;
  contact: string;
}

export class poststringcompany {
  company_id: string;
  type: string;
  api_token: string;
}

export class employeeList {
  id: number;
  name: string;
  email: string;
  is_verified: number;
  company_id: number;
}

export class agentList {
  id: number;
  email: string;
}

export class newagent {
  api_token: string;
  email: string;
}

export class removeagent {
  api_token: string;
  id: number;
}

export class verifycode {
  referal_code: string;
  type: string;
  company_id: number;
}

export class category {
  value: number;
  text: string;   
}

export class UpdateCompanyData {
  api_token: string;
  id: number;
  company_name: string;
  state: number;
  industry: number;
  size_of_company: string;
  website: string;
  job_position:string;
  address1: string;
  address2: string;
  area:any;
  Postcode:any;
  country:any;
  name:any;
  email:any;
  contact:any;
  category_type: number;
  registration_no: string;
}

export class TalentClass {
  id: number;
  name: string;
  photo: string;
  graduation_year: string;
  aspiration_message: string;
  university_name: string;
  customeuniversity: string;
  email: string;
}
export class TalentListClass {
  id: number;
  name: string;
  photo: string;
  graduation_year: string;
  aspiration_message: string;
  university_name: string;
  customeuniversity: string;
  user_course_list: courcesData[];
  coursescustom: courcesData[];
  email: string;
  referrer_type:any;
  cv_updated_at:any
}
export class TalentDelClass{
  id: number;
 
}

export class TalentDetail {
  id: number;
  user_id: number;
  jobtivity_category: string;
  jobtivity_sub_category: string;
  description: string;
  learning_experience: string;
  photo: string;
  created_at: string;
  updated_at: string;
  sub_category_description: string;
  universityData: universityName;
  user: userData;
}

export class universityName {
  university_name: string;
}
export class userData {
  id: number;
  name: string;
  university: number;
  graduation_year: string;
  aspiration_message: string;
  photo: string;
  email: string;
}

export class SearchCompany {
  id: number;
  company_name: string;
  is_verify: number;
}

export class RecomedComp {
  user_id: number;
  company_id: number;
  api_token: string;
}

export class jobseakerdata {
  id: number;
  name: number;
  created_at: Date;
  updated_at: string;
  graduation_year: string;
  aspiration_message: string;
  universityData: universityName[];
  user_course_list: courcesData[];
  coursescustom: courcesData[];
  email: string;
  
}
export class jobdata {
  job_id: number;
  job_title: string;
  job_type:string;
  department:string;
  job_level:string;
  descriptions:any;
  skills:any=[];
  Eduction_option:string;
  eduction:any;
  company_name: string;
  state_name: string;
  expireDays: number;
  recommended_by: number;
  no_of_vacancy: number;
  applicant: number;
  expire_date:any;
}
export class jobseakerList{
  id: number;
  name: number;
  created_at: Date;
  updated_at: string;
  graduation_year: string;
  universityData: universityName[];
  user_course_list: courcesData[];
  coursescustom: courcesData[];
  email: string; 
  score:any;
}



export class courcesData
 {
  id: number;
  user_id: number;
  course_id: number;
  course_name: string;
}
export class content {
  id: string;
  form_id: string;
  created_at: string;
  answers: any[];
}

export class countryClas {
  id: number;
  country_name: string;
}
export class verifyTQ {
  expiretoken:any;
  email:any;
}
export class AddComment{
  company_id: any;
  api_token:any;
  comment:any;
}
export class GetComment{
  company_id: any;
 
}
export class employeeData {
  id: number;
  name: string;
  email: string;
  is_verified: number;
  contact: string;
  company_id: number;
  email_verified: number;
}

export class profiledata {
  id: string;
  fullName: string;
  created_at: string;
  email: string;
  mobile: string;
  summary: string;
  university: string;
  graduateOn: string;
  course: string;
  latestCgpa: string;
  expectedCgpa: string;
  experience: any;
  bestSubjects: any;
  extraCurricular: any;
  skills: any;
  languages: any;
  awards: any;
  certifications: any;
  photoUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
}

export class quizedata {
  id: string;
  created_at: string;
  email: string;
  whichIs: string;
  whichIs16: string;
  WorkingStyle: number;
  whichIs17: string;
  whichIs18: string;
  Formality: number;
  whichIs19: string;
  whichIs20: string;
  InternalStructure: number;
  whichIs21: string;
  whichIs22: string;
  whichIs23: string;
  TalentManagement: number;
  whichIs24: string;
  PersonalGrowth: number;
}

export class userdata {
  aspiration: string;;
  course: number;
  organisational_skill: number;
  volunteering: number;
  knowledge: number;
  entrepreneuri: number;
  personal_interest: number;
  sports: number;
  others: number;
}
export class addJobData {
  title: string;
  descriptions: string;
  min_salary: any;
  max_slaray: any;
  join_time: any;
  job_type: any;
  nationality_id:any;
  token: any;
  talent_id:any;
  state_id:any;
  questions1:any;
  questions2:any;
  questions3:any;
  edit_id:any;
  company_visible:boolean;
  no_of_vacancy:number;
  expire_date:any;
}

export class questions {
  id: string;
  question: string;
  slug: any;
  type: any;
  group: any;
  updated_at:any;
  created_at:any;
  
  
}
export class CreditLedger {
  api_token: string;
  company_id: number;
  descriptions: string;
  balance: number;
  balancetype: number;
}
export class CreditLedgerList {
company_id: number;
created_at: string;
created_att: string;
credit: number;
debit: number;
descriptions:string;
id: number;
updated_at: string;
balance: number;
}
export class language {
  id: number;
  languages_name: string;
}

export enum jobseekListType {
  Connect = "Connect",
  Reject = "Reject",
  KeepforReference = "Keep for Reference",
  Prescreen = "Prescreen",
}
export class uploadCertificate{
  token: any;
  com_id:number;
}

export class UserRegistration {
  email: string;
  password: string;
  name: string;
  graduation_year: string;
  course: string;
  university: string;
  aspiration_message: string;
}

export class SocailloginRq {
  email: string;
  type: string;
  access_token: string;
}
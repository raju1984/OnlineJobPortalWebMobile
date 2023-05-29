<?php

use Illuminate\Http\Request;

/*
  |--------------------------------------------------------------------------
  | API Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register API routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | is assigned the "api" middleware group. Enjoy building your API!
  |
 */

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/registration', 'Auth\RegisterController@registration');
Route::post('/login', 'Auth\LoginController@login');
Route::post('/sociallogin', 'Auth\LoginController@sociallogin');
Route::post('/checkemail', 'Auth\LoginController@isuserexit');



Route::post('/admin/registration', 'Auth\RegisterController@AdminRegister');
Route::post('/admin/login', 'Auth\LoginController@AdminLogin');
Route::post('/admin/updatejobposition', 'Auth\RegisterController@updatejobposition');
Route::post('/admin/salesagentregister', 'Auth\RegisterController@SalesAgentRegister');
Route::post('/admin/removeagent', 'CompanyController@SalesAgentRemove');


Route::post('password/email', 'Auth\ForgotPasswordController@getResetToken');
Route::post('password/forget', 'Auth\ForgotPasswordController@generateNewPassword');
Route::post('password/reset', 'Auth\ResetPasswordController@reset');


/* * *********Category Routes */
Route::get('/categorise', 'DataController@getCategorise');
Route::get('/subcategorise', 'DataController@getSubCategorise');


/* * *****Universites and courses details***** */
Route::get('/universities', 'DataController@getUniversities');
Route::get('/courses', 'DataController@getCourses');

/*************Get States ***/
Route::get('/states','DataController@getStates');

/*************Get Industries */
Route::get('/industries','DataController@getIndustries');

/*************Get Positions */
Route::get('/positions','DataController@getpositions');

/***********************getdepartment ***/
Route::get('/department','DataController@getdepartment');
/***********************getreliventdegree ***/
Route::get('/reliventdegree','DataController@getReliventDegree');

/***********************getreliventdegree ***/
Route::get('/otherdegree','DataController@getOtherDegree');

/***********************getskills ***/
Route::get('/skills','DataController@getskills');

/* * ******Jobtivity Routes********* */
Route::middleware('auth:api')->get('/jobtivitybyid', 'JobtivityController@getJobtivityById');
Route::get('/comments', 'JobtivityController@getComments');
Route::any('/addPhoto', 'JobtivityController@addPhoto');

/* * ****Middle Ware Routes**** */

Route::middleware('auth:api')->any('/add_user_photo', 'JobtivityController@addUserPhoto');
Route::middleware('auth:api')->post('/jobtivity', 'JobtivityController@addJobtivity');
Route::middleware('auth:api')->get('/jobtivities', 'JobtivityController@getAllJobitivities');
Route::middleware('auth:api')->post('/comment', 'JobtivityController@addComment');
Route::middleware('auth:api')->post('/comment/update/{id}', 'JobtivityController@updateComment');
Route::middleware('auth:api')->get('/commentsbyme', 'JobtivityController@getCommentsByMe');

/* * ***Following functionality */
Route::middleware('auth:api')->get('user/details', 'UserController@details');
Route::middleware('auth:api')->post('user/update', 'UserController@updateUserInfo');
Route::middleware('auth:api')->post('user/follow', 'UserController@follow');
Route::middleware('auth:api')->post('user/unfollow', 'UserController@removeFollow');

Route::middleware('auth:api')->post('user/addWow', 'UserController@addWow');
Route::middleware('auth:api')->post('user/removeWow', 'UserController@removeWow');

Route::middleware('auth:api')->get('user/wowUsers', 'UserController@wowUserList');
Route::middleware('auth:api')->get('user/milestoneAchievement', 'UserController@milestoneAchievement');
Route::middleware('auth:api')->post('user/milestoneAchieved', 'UserController@milestoneAchieved');

/* * ***Notification functionality */
Route::middleware('auth:api')->get('user/notification', 'NotificationController@getnotification');
Route::middleware('auth:api')->post('user/notification', 'NotificationController@updatNotification');
Route::middleware('auth:api')->get('user/notificationcount', 'NotificationController@getSeenNotificationCount');
Route::middleware('auth:api')->post('user/setseennotification', 'NotificationController@SetSeenNotification');

/*****API for read Article and session add point */
Route:: middleware('auth:api')->get('points/daily-signin','UserController@addPointsForSession');
Route:: middleware('auth:api')->get('points/read-article','UserController@addPointForReadArticle');


/* * ********** */
Route::post('/updateUserInfo', 'Auth\RegisterController@updateUserInfo');
Route::post('/admin/updateUserCompany', 'Auth\RegisterController@updateUserCompany');
Route::get('/admin/companyList', 'UserController@companyList');
/* ****************** */
Route:: middleware('auth:api')->get('/admin/companylistbysearch', 'CompanyController@companylistbysearch');

Route:: middleware('auth:api')->post('/updatecompany', 'CompanyController@updatecompanystatus');
Route:: middleware('auth:api')->get('/employeelist', 'CompanyController@getEmployeeList');
Route:: middleware('auth:api')->get('/agentlist', 'CompanyController@getSalesAgent');
Route:: middleware('auth:api')->post('/validatetoken', 'CompanyController@ValidateToken');
Route::post('/generatereferalcode', 'CompanyController@GenerateReferalCode');
Route::post('/verifycompanycode', 'CompanyController@verifycompanybycode');




Route::middleware('auth:api')->post('/admin/CompanyVerified', 'Auth\RegisterController@updateUserCompanyVerified');

Route::post('/admin/UserVerified', 'Auth\RegisterController@updateUserVerified');
//Route::get('/test', 'JobtivityController@test');
//Route::middleware('auth:api')->get('/admin/talentprofile','TalentProfileController@getCriteriaList');
Route::middleware('auth:api')->get('/admin/talentprofile','TalentProfileController@getQuestions');
Route::middleware('auth:api')->post('/admin/settalentprofile','TalentProfileController@setTalentProfile');
Route::middleware('auth:api')->post('/admin/edittalentprofile','TalentProfileController@editTalentProfile');
//Route::middleware('auth:api')->get("/admin/gettalentprofile", "TalentProfileController@getTalentProfilePoints");
Route::middleware('auth:api')->get("/admin/gettalentprofile", "TalentProfileController@getTalentProfile");
Route::middleware('auth:api')->get("/admin/gettalentprofilebyid","TalentProfileController@getTalentProfileById");
Route::middleware('auth:api')->get('/admin/companyculture','CompanyCulture@getQuestionList');
Route::middleware("auth:api")->get("/admin/companyculturepoints", 'CompanyCulture@getQuestionListPoint');
//Route::get('/companyculture','CompanyCulture@getQuestionList');
Route::middleware('auth:api')->post('/admin/postcompany','CompanyCulture@storeanswer');


Route::get("/linkedInData", 'UserController@linkedInData');
Route::get("/getLinkedInData", 'UserController@getLinkedInData');
Route::get("/article-data/",'DataController@getArticleData');

Route::post("/error_log", "DataController@ErrorLog");

/*************Get RewardPoints */
Route::get("/rewardpoints", "DataController@getRewardPoints");

Route::post("/counttime", "CompanyController@CountTime");



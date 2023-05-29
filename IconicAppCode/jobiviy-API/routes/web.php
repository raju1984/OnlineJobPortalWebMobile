<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::any('web/{myslug}', array('uses'=>'Admin\AdminController@index'))
 ->where('myslug','[A-Za-z/0-9]+');

// Route::get('/', 'Admin/AdminControllers@index');

// Auth::routes();

// Route::get('/home', 'HomeController@index')->name('home');

// Route::get('/admin', 'Auth\LoginController@showLoginForm');
// Route::post('/admin', 'Auth\LoginController@loginCustom')->name('admin');

// Route::get('/register', 'Auth\RegisterController@showRegistrationForm');
// Route::post('/adminregister', 'Auth\RegisterController@registerCustom')->name('adminregister');
// // Route::get('/adminregister', 'Auth\RegisterController@registerdetail');
// // Route::get('/adminregister', function () {
// //     return view('admin.registerdetail');
// // });

// Route::resource('registerdetail', 'Admin\CompanyController');




// Route::get('sendbasicemail','MailController@basic_email');
// Route::get('sendhtmlemail','MailController@html_email');
// Route::get('sendattachmentemail','MailController@attachment_email');

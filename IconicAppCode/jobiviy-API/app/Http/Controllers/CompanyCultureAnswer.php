<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompanyCulture;
use DB;
class CompanyCultureAnswer extends Controller
{
    
     public function __construct() {
//$this->middleware('auth');
    }


    function getQuestionList(Request $request) {
    $questions = Question::with("questionoptions")->get()->toArray();
   $user_id = isset($data['user_id']) ? $data['user_id'] : false;
   
    return response()->json($questions);
 }
}

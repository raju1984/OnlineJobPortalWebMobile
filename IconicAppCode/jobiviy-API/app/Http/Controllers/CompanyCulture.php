<?php

namespace App\Http\Controllers;
use App\Model\QuestionCulture;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use DB;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\CompanyCultureAnswer;
use App\Models\CompanyCulturePoint;
use App\Models\User;

class CompanyCulture extends Controller
{

  public function __construct() {
    //$this->middleware('auth');
  }
    
public function getQuestionList(Request $request) {
  $user = $request->user();
  $questions = Question::whereIn('type',[1,2])->with("questionOptions")->get()->toArray();
  $temp = array();
  if (!empty($questions)) {
    foreach ($questions as $k) {
      $list = $k['question_options'];
      $ans = CompanyCultureAnswer::where(['question_id'=>$k['id'], 'user_id'=>$user->id])->get()->toArray();
      $ag = array();
      foreach ($list as $kl) {
        foreach ($ans as $nk) {
          if ($nk['option_id'] == $kl['id'] && $nk['question_id'] == $k['id']) {
            $kl['isSelected'] = true;
            break;
          } else {
            $kl['isSelected'] = false;
          }
        }
        
        $ag[] = $kl;
      }
      $k['question_options'] = $ag;
      $temp[] = $k;
    }
  }
  return response()->json($temp);
 }

 public function getQuestionListPoint(Request $request) {
  $user = $request->user(); 
  $questions = Question::whereIn('type',[1,2])->with(array("CompanyCultureAnswers"=>function($query)use($user){
    $query->where("user_id",$user->id);
  }))->get()->toArray();
  $temp = array();
  if (!empty($questions)) {
    foreach ($questions as $k) {
      $t = array();
      $options = $k['company_culture_answers'];
      foreach ($options as $kl) {
        $point = CompanyCulturePoint::where('option_id', $kl['option_id'])->get()->toArray();
        $sum = 0;
        if (!empty($point)){
          foreach ($point as $p) {
            $sum = $sum + $p['earn_point'];
            $t[$p['visualize_type']] = @$t[$p['visualize_type']] + $p['earn_point'];
          }
        }
        $kl['totalEarnPoints'] = $sum;
        $kl['categorialPoints'] = $t;
        $k['company_culture_answers'] = $kl;
      }
      $temp[] = $k;
    }
  }
  return response()->json($temp);

 }


  public function storeanswer(Request $request){    
       $data = $request->all();
       $user = $request->user();
       CompanyCultureAnswer::where('user_id', $user->id)->delete();
       foreach($request->anslist as $key => $opt)
       { 
          $CompanyCultureAnswer['user_id'] = $user->id;
          $CompanyCultureAnswer['option_id'] = $opt['option_id'];
          $CompanyCultureAnswer['question_id'] = $opt['question_id'];           
          $temp1 =CompanyCultureAnswer::create($CompanyCultureAnswer);
          $temp1->save();
          $rt['status'] = 'success';
          $rt['data'] = $CompanyCultureAnswer;
       } 
       return response()->json($rt);

    }
   
}
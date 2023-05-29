<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Criteria;
use App\Models\CriteriaPoint;
use App\Models\Question;
use App\Models\TalentProfile;
use App\Models\TalentProfileAnswer;
use App\Models\TalentJobDescription;
use Illuminate\Support\Facades\Validator;
use DB;

class TalentProfileController extends Controller
{

     public function __construct() {
		$this->middleware('auth');
    }
    

   //  function getCriteriaList(Request $request) {
   //    $criteria= null;
   //      $criteria = Question::where('type', 3)->with("CriteriaList")->get()->toArray();
   //      $criteriapoint = CriteriaPoint::get()->toArray();

   //      $temp = array();
   //      if (!empty($criteria)) {
   //         $i = 0;
   //         foreach ($criteria as $k) {
   //            $temp[$i] = $k;
   //            $list = $k['criteria_list'];
   //            unset($temp[$i]['criteria_list']);
   //            $ag = array();
   //            foreach ($list as $kk) {
   //               $kk['criteriaPoint'] = $criteriapoint;
   //               $ag[] = $kk;
   //            }
   //         $temp[$i]['criteria_list'] = $ag;
   //      $i++;
   //         }
   //      }
   //     $rt['data'] = $temp;
   //     $rt['status'] = 'success';
   //     return response()->json($rt);
   // }

    function getQuestions(Request $request) {
       
        $Academic  = Question::where('type', 3)->where('group','Academic')->with("questionOptions")->get()->toArray();
        $Work_Experience   = Question::whereRaw('(type=3 OR type=4)')->with("questionOptions")->where('group','WorkExperience')->get()->toArray();
        $Hard_Skills= Question::where('type', 3)->where('group','Hard Skills')->with("questionOptions")->get()->toArray();
        $rt['data']=compact('Academic','Work_Experience','Hard_Skills');
        $rt['status'] = 'success';
        return response()->json($rt);
   }

   // function setTalentProfile(Request $request){
   // 	$user = $request->user();
 	// 	$talentprofile = new TalentProfile;
	// 	$talentprofile ->name = request('name');
	// 	$talentprofile ->description = request('description');
	// 	$talentprofile ->user_id = $user->id;
	// 	$talentprofile ->point = 0;
	// 	$talentprofile->save();

	// 	foreach ($request->anslist as $key => $value) {
	// 		$criteriapoint = CriteriaPoint::where('id',$value['criterial_point_id'])->first()->id;			
	// 		$talentprofile->point=$talentprofile->point+$criteriapoint;
	// 		$ans = new TalentProfileAnswer;
   //                  $ans['talent_profile_id'] = $talentprofile->id;
   //                  $ans['question_id'] = $value['question_id'];
   //                  $ans['criteria_id'] = $value['criteria_id'];
   //                  $ans['criteria_point_id'] =$value['criterial_point_id'];
   //                 $ans->save();
   //    }
   //    $talentprofile->save();
   //    $rt['success'] = 'success';
   //    return response()->json($rt);
   // }

   function setTalentProfile(Request $request){
      $user = $request->user();
 		$talentprofile = new TalentProfile;
		$talentprofile ->name = request('name');
		$talentprofile ->department_id = request('department_id');
		$talentprofile ->user_id = $user->id;
		$talentprofile ->point = 0;
      $talentprofile->save();
      
      /*****Saving Talent Profile Description**** */
      foreach ($request->job_description as $key => $value) {
            $talentProfileDes=new TalentJobDescription();
            $talentProfileDes->talent_profile_id=$talentprofile->id;
            $talentProfileDes->text=$value;
            $talentProfileDes->save();
      }

      foreach ($request->anslist as $key => $value) {
               	$ans = new TalentProfileAnswer;
                  $ans['talent_profile_id'] = $talentprofile->id;
                  $ans['question_id'] = $value['question_id'];
                  $ans['question_option_id'] = $value['option_id'];
                  $ans['question_answer_id']=$value['ans_id'];
                  $ans->save();
      }
      $rt['success'] = 'success';
      return response()->json($rt);
   }

   function editTalentProfile(Request $request){
      $user = $request->user();
 		$talentprofileObj = TalentProfile::where('id',$request->talent_profile_id)->first();
      $talentprofileObj ->name = request('name');
      $talentprofileObj ->department_id = request('department_id');
      $talentprofileObj ->point = 0;
      $talentprofileObj->save();


      TalentJobDescription::where('talent_profile_id',$request->talent_profile_id)->delete();
      TalentProfileAnswer::where('talent_profile_id',$request->talent_profile_id)->delete();

       /*****Saving Talent Profile Description**** */
      foreach ($request->job_description as $key => $value) {
         $talentProfileDes=new TalentJobDescription();
         $talentProfileDes->talent_profile_id=$talentprofileObj->id;
         $talentProfileDes->text=$value;
         $talentProfileDes->save();
      }

      foreach ($request->anslist as $key => $value) {
               	$ans = new TalentProfileAnswer;
                  $ans['talent_profile_id'] = $talentprofileObj->id;
                  $ans['question_id'] = $value['question_id'];
                  $ans['question_option_id'] = $value['option_id'];
                  $ans['question_answer_id']=$value['ans_id'];
                  $ans->save();
      }
      $rt['success'] = 'success';
      return response()->json($rt);
   }

   function getTalentProfile(Request $request){
      $user = $request->user();
      $talentprofile=TalentProfile::where('user_id',$user->id)->with(['TalentProfileQuestions','TalentProfileAnswere'])->get();
      $rt['data']=$talentprofile;
      $rt['success'] = 'success';
      return response()->json($rt);
   }

   function getTalentProfileById(Request $request){
      $talentprofile=TalentProfile::where('id',$request->talent_profile_id)->with(['TalentProfileQuestions','TalentProfileAnswere'])->first();
      $rt['data']=$talentprofile;
      $rt['success'] = 'success';
      return response()->json($rt);
   }


   // function getTalentProfilePoints(Request $request) {
   // 	$user = $request->user();
   // 	$res = DB::table("talent_profiles as tp")
   // 				->leftJoin("talent_profile_answers as tpa", "tpa.talent_profile_id", "=", "tp.id")
   // 				->leftJoin('criteria_points as p', "p.id", "=", "tpa.criteria_point_id")
   // 				->leftJoin("questions as q", "q.id", "=", "tpa.question_id")
   // 				->select(DB::raw("q.questions, sum(p.point) as sum, tp.id, tp.name, tp.user_id,q.id as QuestionId"))
   // 				->where('tp.user_id', $user->id)
   // 				->groupBy("tpa.talent_profile_id", "tpa.question_id", "q.questions","tp.id", "tp.name", 'tp.user_id',"q.id")
   //   				->get()->toArray();
   //   $tp = DB::table("talent_profiles as tp")
   //          ->select(DB::raw("tp.*"))
   //           ->where('tp.user_id', $user->id)
   //           ->get()->toArray();

   //   // $temp;
   //   // if (!empty($tp)) {
   //   //   foreach ($tp as $k) {
   //   //     $test=array();
   //   //     $i = 0; 
   //   //          foreach($res as $kf){
   //   //            $Detail;
   //   //                    if($k->id==$kf->id)
   //   //                    {
   //   //                      $i=$i+1;  
   //   //                      $Detail[$kf->id]= $kf->id; 
   //   //                      $Detail['questions']= $kf->questions;
   //   //                      $Detail[ 'sum']= $kf->sum;
   //   //                      $Detail[ 'name']= $kf->name;
   //   //                      $Detail[ 'user_id']= $kf->user_id;
   //   //                      $Detail[ 'QuestionId']= $kf->QuestionId;
   //   //                      $test[$i]= array($Detail);
   //   //                     //print_r($test);
   //   //                    }
   //   //          }
   //   //     // $temp[$k->id] = array($test);
   //   //     $temp[$k->id] = array($res);         
   //   //   }

   //   // }
     
  	//    return response()->json(array($res));
   //}

}

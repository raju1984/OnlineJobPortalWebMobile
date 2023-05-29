<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Jobtivity;
use App\Category;
use App\Models\University;
use App\Models\User;
use App\Models\Course;
use App\Models\Comment;
use App\Models\UserCourse;
use App\Models\ErrorLog;
use Image;
use App\Models\RewardPoints;
use App\Models\State;
use App\Models\Industry;
use App\Models\Department;
use DB;
use App\Models\Degree;
use App\Models\Skills;
use App\Models\Positions;

class DataController extends Controller {


    /**
     *  Get All Categories
     * 
     */

    public function getCategorise() {
        $photoURL=url("category/");
        $cats = Category::where('parent_id', 0)->get(['*', \DB::raw("CONCAT('".$photoURL."/', image) as photo")]);
        $rt['data'] = $cats;
        $rt['status'] = 'success';
        return response()->json($rt);
    }

    public function getSubCategorise(Request $request) {
        $rt['status'] = 'error';
        $data = $request->all();
        $photoURL=url("category/");
        $v = Validator::make($data, [
                    'category_id' => 'required'
        ]);

        if ($v->fails()) {
            $rt['status'] = 'error';
            $rt['message'] = $v->errors()->toJson();
        } else {
            $cats = Category::where('parent_id', $data['category_id'])->get(['*', \DB::raw("CONCAT('".$photoURL."/', image) as photo")]);
            $rt['data'] = $cats;
            $rt['status'] = 'success';
        }
        return response()->json($rt);
    }

    public function getUniversities() {
        $unis = University::all();
        $rt['data'] = $unis;
        $rt['status'] = 'success';
        return response()->json($rt);
    }

    public function getCourses(Request $request) {
       
        $rt['status'] = 'error';
        $data = $request->all();     
        if(count($data)>0){
          $coutype = Course::where(['type'=> $data["type"]])->get();    
          $rt['data'] = $coutype;
        }
        else
        {
          $coutype = Course::where(['type'=> 'course'])->get();    
          $rt['data'] = $coutype;
        }          
        $rt['status'] = 'success';
        return response()->json($rt);
    }

    

    public function getdepartment(){
        $dept=DB::table('department')->get();
        $rt['data']=$dept;
        $rt['status']='success';
        return response()->json($rt);
    }
    public function getReliventDegree(){
        $relivent=DB::table('degree')->where('type','1')->get();
        $rt['data']=$relivent;
        $rt['status']='success';
        return response()->json($rt);

    }
    public function getOtherDegree(){
        $relivent=DB::table('degree')->where('type','2')->get();
        $rt['data']=$relivent;
        $rt['status']='success';
        return response()->json($rt);

    }
    public function getskills(){
        $skill=Skills::all();
        $rt['data']=$skill;
        $rt['status']='success';
         return response()->json($rt);
    }
     
     public function getpositions(){
        $skill=Positions::all();
        $rt['data']=$skill;
        $rt['status']='success';
         return response()->json($rt);
    }

    public function ErrorLog(Request $request) {
        $data = $request->all();
        if (!empty($data)) {
            ErrorLog::create([
                'err_text' => $data["err_text"], 
                'file_path'  => $data["file_path"],
                'method'  => $data["method"],
                'parent_method'  => $data["parent_method"], 
                'error_time' => $data["error_time"], 
                'created_at' => date("Y-m-d H:i:s"), 
                'updated_at' => date("Y-m-d H:i:s")
            ]);
            $rt['status'] = 'success';
            return response()->json($rt);
        }
    }    

    public function getRewardPoints(){
        $rewardpoints=RewardPoints::all();
         $rt['data'] = $rewardpoints;
        $rt['status'] = 'success';
        return response()->json($rt);
    }


     public function getStates(){
       $states=State::all();
       $rt['data'] = $states;
       $rt['status'] = 'success';
       return response()->json($rt);  
    }

    public function getIndustries(){
        $industries=Industry::all();
        $rt['data'] = $industries;
        $rt['status'] = 'success';
        return response()->json($rt);  
    }


    public function getArticleData(Request $request){
        
        if(isset($request->url)){
            $url=$request->url;
        }else{  
            return response()->json(['error'=>'please provide xml url']);
        }
        $data=file_get_contents($url);
        $xml = simplexml_load_string($data,'SimpleXMLElement', LIBXML_NOCDATA);
        foreach($xml->channel->item as $value){
            $obj=$value->children("wfw",TRUE);
            if(isset($obj) && isset($obj->commentRss)){
                $value->commentRss=$obj->commentRss;
            }
        }
        $xml = json_decode(json_encode($xml));
        foreach($xml->channel->item as  $key=>$value){
            $temp = (array)$value;    
            $value = (object)array_combine(array_map('ucfirst', array_keys($temp)), $temp);
            $xml->channel->item[$key]=$value;
        }
        return response()->json($xml->channel->item);
    }
    

}
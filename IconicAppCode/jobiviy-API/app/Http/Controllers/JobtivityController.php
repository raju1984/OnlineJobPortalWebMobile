<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Jobtivity;
use App\Models\Category;
use App\Models\University;
use App\Models\User;
use App\Models\UserPoints;
use App\Models\Course;
use App\Models\Comment;
use App\Models\UserCourse;
use App\Models\UserPointLogs;
use App\Models\Milestone;
use App\Models\NotificationJobtivity;
use App\Models\UserFollower;
use Image;
use App\Models\JobtivityCategoryMap;

class JobtivityController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
//$this->middleware('auth');
    }

    public function addJobtivity(Request $request) {
        $rt['status'] = 'error';
        $data = $request->all();
        $v = Validator::make($data, [
                    'jobtivity_category' => 'required',
                    'jobtivity_sub_category' => 'required',
                    'description' => 'required',
                    'learning_experience' => 'required',
                    'photo' => 'nullable'
        ]);

        if ($v->fails()) {
            $rt['status'] = 'error';
            $rt['message'] = $v->errors()->toJson();
        } else {
            $user = $request->user();
            $jobtivity['user_id'] = $user->id;
            $jobtivity['jobtivity_category'] = $data['jobtivity_category'];
            $jobtivity['jobtivity_sub_category'] = $data['jobtivity_sub_category'];
            $jobtivity['description'] = $data['description'];
            $jobtivity['learning_experience'] = $data['learning_experience'];
            $jobtivity['sub_category_description'] = $data['category_description'];
            $obj = Jobtivity::create($jobtivity);
            if ($request->photo) {
                $obj->photo = $request->photo;
                $obj->save();
            }
			
			
			foreach($request->categoryList as $key => $opt)
			   { 
				  $jobtivity_category_map['jobtivity_id'] = $obj->id;;
				  $jobtivity_category_map['description'] = $opt['description'];				        
				  $temp1 =JobtivityCategoryMap::create($jobtivity_category_map);
				  $temp1->save();
			   } 
			
            $pointsObj=UserPointLogs::addUserPoints(UserPointLogs::$JOBTIVITY_POSTED,$user->id,$obj->id);
            $rt['data']=array('points'=>$pointsObj);
			$userPointObj = UserPoints::where("user_id", $user->id)->first();
            $jobtivitynotification = UserFollower::where('following_id', $user->id)->get();           
            if(isset($jobtivitynotification))
            {               
                foreach ($jobtivitynotification as $key => $value) {
                    $notification['fromuser_id'] = $user->id;
                    $notification['touser_id'] = $value->user_id;
                    $notification['item_type'] = '1';
                    $notification['item_id'] = $obj->id;
                    $notification['description'] = 'Posted a Jobtiviti <a>'.$data['description'].' </a>';                   
                    NotificationJobtivity::create($notification);
                }
            }
			$userData = User::where("id", $user->id)->first();
			$rt['milestone'] = $userData->milestone();
            $rt['status'] = 'success';
        }
        return response()->json($rt);
    }

    public function addPhoto(Request $request) {
        $rt['status'] = 'error';
        $filename = rand(111111, 99999999) . '-' . substr(md5(rand(111111, 99999999) . '-' . time()), 0, 15) . basename($_FILES['file']['name']);
        $path = public_path('alumni-photos/' . $filename);
        ini_set('post_max_size', '200M');
        ini_set('upload_max_filesize', '200M');
        if (move_uploaded_file($_FILES['file']['tmp_name'], $path)) {
            $rt['status'] = 'success';
            $rt['filename'] = $filename;
            $rt['imageUrl'] = url('alumni-photos/' . $filename);
        }
        return response()->json($rt);
    }

    public function addUserPhoto(Request $request) {
        $rt['status'] = 'error';
        $user = $request->user();
        if (isset($user->id)) {
            $filename = $user->id . "_pic_" . str_replace(" ", "_", $user->name) . basename($_FILES['file']['name']);
            $path = public_path('user_photos/' . $filename);
            ini_set('post_max_size', '200M');
            ini_set('upload_max_filesize', '200M');
            if (move_uploaded_file($_FILES['file']['tmp_name'], $path)) {
                //$user->photo = url('user_photos/' . $filename);
                $user->photo = $filename;
                $user->save();
                $rt['status'] = 'success';
                $rt['filename'] = $filename;
                $rt['imageUrl'] = url('user_photos/' . $filename);
            }
        } else {
            $rt['status'] = 'error';
            $rt['message'] = 'Access forbiden';
        }
        return response()->json($rt);
    }

    public function addComment(Request $request) {
        $rt['status'] = 'error';
        $data = $request->all();
        $v = Validator::make($data, [
                    'message' => 'required',
                    'jobtivity_id' => 'required',
        ]);
        if ($v->fails()) {
            $rt['status'] = 'error';
            $rt['message'] = $v->errors()->toJson();
        } else {
            $user = $request->user();
            $comment['user_id'] = $user->id;
            $comment['jobtivity_id'] = $data['jobtivity_id'];
            $comment['message'] = $data['message'];
            $comment['created_at'] = date("Y-m-d H:i:s");
            $obj = Comment::create($comment);
            $obj->save();
            $pointsObj=UserPointLogs::addUserPoints(UserPointLogs::$COMMENT_ADDED,$user->id,$data['jobtivity_id'],$obj->id);
            $comment['points']=$pointsObj;
            $jobtivity = Jobtivity::where('id', $data['jobtivity_id'])->first();
            $rt['status'] = 'success';
            $rt['data'] = $comment;
            $notification['touser_id'] = $jobtivity->user_id;
            $notification['fromuser_id'] = $user->id;           
            $notification['item_type'] = '4';
            $notification['item_id'] = $jobtivity->id;
            $notification['description'] = 
            'Commented on jobtiviti <a>'.$jobtivity->description.'</a>';                   
            NotificationJobtivity::create($notification);
        }

        return response()->json($rt);
    }

    public function updateComment($id, Request $request) {
        $commentObj = Comment::find($id);
        $data = $request->all();
        $v = Validator::make($data, [
                    'message' => 'required',
                    'jobtivity_id' => 'required',
        ]);

        if ($v->fails() && isset($commentObj->id)) {
            $rt['status'] = 'error';
            $rt['message'] = $v->errors()->toJson();
        } else {
            $commentObj->jobtivity_id = $data['jobtivity_id'];
            $commentObj->message = $data['message'];
            $commentObj->updated_at = date('Y-m-d H:i:s');
            $commentObj->save();
            $rt['data'] = $commentObj;
            $rt['status'] = 'success';
        }

        return response()->json($rt);
    }

    /*     * *
     *  
     * Get total comment if jobtivity_id passed
     * sort by using it
     * 
     */

    public function getComments(Request $request) {
        $data = $request->all();
        $jobtivity_id = isset($data['jobtivity_id']) ? $data['jobtivity_id'] : false;
        $comments = !$jobtivity_id ? Comment::all() : Comment::where("jobtivity_id", $jobtivity_id)->get();
        foreach ($comments as $key => $comment) {
            $comment->user->get();
            $comment->jobtivity->get();
        }
        $rt['data'] = $comments;
        $rt['status'] = 'success';
        return response()->json($rt);
    }

    public function getCommentsByMe(Request $request) {
        $rt = array();
        $user = $request->user();
        if (isset($user->id)) {
            $comments = Comment::where('user_id', $user->id)->get();
            foreach ($comments as $key => $comment) {
                $comment->user->get();
                //$comment->jobtivity->get();
            }
            $rt['data'] = $comments;
            $rt['status'] = 'success';
        } else {
            $rt['message'] = "Invalid Access";
            $rt['status'] = "error";
        }
        return response()->json($rt);
    }

    public function getAllJobitivities(Request $request) {
        $data = $request->all();
        $user = $request->user();
        $jobs = null;
        $photoURL = url("user_photos/");
        if (!empty($data['user_id']) && is_numeric($data['user_id'])) {
            $userId = $data['user_id'];
            $obj = Jobtivity::where('user_id', $userId)->with(['user' => function($query) use($photoURL) {
                            return $query->selectRaw("id,name,CONCAT('" . $photoURL . "/',photo) as photo");
                        }])->orderBy("id", "DESC");
            if (isset($data['limit']) && $data['limit'] > 0) {
                $obj->latest()->take($data['limit']);
            }
            $jobs = $obj->get();
        } else {
            $jobs = Jobtivity::with(['user' => function($query) use($photoURL) {
                            return $query->selectRaw("id,name,CONCAT('" . $photoURL . "/',photo) as photo");
                        }])->orderBy("id", "DESC")->get();
        }

        foreach ($jobs as $key => $job) {
            if ($job->photo) {
                $temp = url('alumni-photos/' . $job->photo);
                $job->photo_url = $temp;
            }
            $job->num_of_comments = $job->numOfComments();
            $job->num_of_Wow = $job->numOfWowInterests();
            $job->wowInterest = $job->userHaveWowInterest($user);
            $job->categoryTag = $job->jobtivityCategory($job->jobtivity_category);
        }

        $rt['data'] = $jobs;
        $rt['status'] = 'success';
        return response()->json($rt);
    }

    public function getJobtivityById(Request $request) {
        $data = $request->all();
        $user = $request->user();
        $v = Validator::make($data, [
                    'jobtivity_id' => 'required'
        ]);
        if ($v->fails()) {
            $rt['status'] = 'error';
            $rt['message'] = $v->errors()->toJson();
        } else {
            $photoURL = url("user_photos/");
            $jobtivity = Jobtivity::where('id', $data['jobtivity_id'])->with(['user' => function($query) use($photoURL) {
                            return $query->selectRaw("*,CONCAT('" . $photoURL . "/',photo) as photo");
                        }])->first();
            $jobtivity->num_of_Wow = $jobtivity->numOfWowInterests();
            $jobtivity->wowInterest = $jobtivity->userHaveWowInterest($user);
			$jobtivity->categoryTag = $jobtivity->jobtivityCategory($jobtivity->jobtivity_category);
			$temp = url('alumni-photos/' . $jobtivity->photo);
            $jobtivity->photo_url = $temp;
            $rt['data']['jobtivity'] = $jobtivity->toArray();
            $rt['status'] = 'success';
        }
        return response()->json($rt);
    }

}

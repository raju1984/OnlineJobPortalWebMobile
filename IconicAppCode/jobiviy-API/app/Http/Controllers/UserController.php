<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserFollower;
use App\Models\UserCourse;
use App\Models\WowInterest;
use App\Models\NotificationJobtivity;
use App\Models\Jobtivity;
use App\Admins\Company;
use App\Models\Linkedin;
use App\Models\UserPointLogs;
use App\Models\AgentReferalCodes;
use Image;
use DB;
use App\Enums\VerifiedType;
class UserController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        //$this->middleware('auth');
    }

    public function follow(Request $request) {
        $rt['status'] = 'error';
        $user = $request->user();
        $data = $request->all();
        if (isset($data['user_id']) && isset($user->id)) {
            //$userFollower = UserFollower::where("following_id", $data['user_id'])->first();
            $userFollower = UserFollower::where(["user_id" => $user->id, 'following_id' => $data['user_id']])->first();
            $userFollower = !isset($userFollower->id) ? new UserFollower() : $userFollower;
            $userFollower->following_id = $data['user_id'];
            $userFollower->user_id = $user->id;
            $userFollower->created_at = date("Y-m-d H:i:s");
            $userFollower->updated_at = date("Y-m-d H:i:s");
            $userFollower->status = 1;
            $userFollower->save();
            $rt['status'] = "success";
            $rt['data'] = $userFollower;

           
            $notification['touser_id'] = $data['user_id'];
            $notification['fromuser_id'] = $user->id;           
            $notification['item_type'] = '3';
            $notification['item_id'] = $data['user_id'];
            $notification['description'] = 'Followed you';                   
            NotificationJobtivity::create($notification);

        } else {
            $rt['message'] = "Invalid Access";
        }
        return response()->json($rt);
    }

    public function removeFollow(Request $request) {
        $rt['status'] = 'error';
        $user = $request->user();
        $data = $request->all();
        if (isset($data['user_id']) && isset($user->id)) {
            //$userFollower = UserFollower::where("following_id", $data['user_id'])->first();
            $userFollower = UserFollower::where(["user_id" => $user->id, 'following_id' => $data['user_id']])->first();
            if (isset($userFollower->id)) {
                $userFollower->status = 0;
                $userFollower->save();
                $rt['status'] = "success";
                $rt['data'] = $userFollower;
            } else {
                $rt['message'] = "You have not followed this specific user";
            }
        } else {
            $rt['message'] = "Invalid Access";
        }
        return response()->json($rt);
    }

    public function details(Request $request) {
        $rt['status'] = 'error';
        $user = $request->user();
        $data = $request->all();
        if (isset($data['user_id'])) {
            $rt['status'] = 'success';
            $userData = User::find($data['user_id']);
            $userData->no_of_jobtivity_posted = $userData->numOfjobtivity();
            $userData->no_of_followers = $userData->numOfFollower();
            $userData->no_of_followings = $userData->numOfFollowings();
            $userData->user_course_list = $userData->userCoursesNameList($data['user_id']);
            $userData->isFollowing = $userData->checkForFollowing($user->id, $data['user_id']);
            $userData->jobtivities = $userData->userJobtivities();
            $userData->universityData=$userData->useruniversity($userData['university']);
            //$userData->milestone =  DB::select("select u.points, m.* from user_points u left join milestones m on (m.MileStoneID = u.milestone_id) where u.user_id=:userId", ['userId'=>$user->id]);
            $userData->milestone = $userData->milestone();
            // $userData->achievedMilestones = $userData->achievedMilestones();
            // $userData->milestoneLists=$userData->milestoneList();
             $userData->achievedMilestones = $userData->milestoneList();
            if ($userData->photo) {
                $filename = $userData->photo;
                $userData->photo = url('user_photos/' . $filename);
            }
            $rt['data'] = $userData;
        } else {
            $rt['message'] = "Please provide a user id";
        }
        return response()->json($rt);
    }

    public function updateUserInfo(Request $request) {
        $rt['status'] = 'error';
        $data = $request->all();
        $v = Validator::make($data, [
		            'name' => 'required',
                    'email' => 'required',
                    'graduation_year' => 'required',
                    'university' => 'required',
                    'courses' => 'required',
                    'aspiration_message' => 'nullable'
        ]);

        if ($v->fails()) {
            $rt['status'] = 'error';
            $rt['message'] = $v->errors()->toJson();
        } else {
            $user = User::where("email", $data['email'])->first();
            $user->graduation_year = $data['graduation_year'];
            $user->university = $data['university'];
			$user->name = $data['name'];
			
            $user->aspiration_message = @$data['aspiration_message'];
            if ($user->save()) {
                $userId = $user->id;
                if (!empty($data['courses'])) {
                    $user->userCourses()->delete();
                    foreach ($data['courses'] as $k) {
                        $inst['user_id'] = $userId;
                        $inst['course_id'] = $k;
                        UserCourse::create($inst);
                    }
                }
                $rt['status'] = 'success';
            }
        }
        return response()->json($rt);
    }

    public function addWow(Request $request) {
        $rt['status'] = 'error';
        $user = $request->user();
        $data = $request->all();
        if (isset($data['jobtivity_id']) && isset($user->id)) {
            $wowInterest = WowInterest::where(["user_id" => $user->id, 'jobtivity_id' => $data['jobtivity_id']])->first();
            $wowInterest = !isset($wowInterest->id) ? new WowInterest() : $wowInterest;
            $wowInterest->jobtivity_id = $data['jobtivity_id'];
            $wowInterest->user_id = $user->id;
            //$wowInterest->created_at = Date('y-m-d H:i:s');
            //$wowInterest->updated_at = Date('y-m-d H:i:s');
            $wowInterest->status = 1;
            $wowInterest->save();
            $pointsObj=UserPointLogs::addUserPoints(UserPointLogs::$LIKE_ADDED,$user->id,$wowInterest->jobtivity_id,0,$wowInterest->id);
            $jobtivity = Jobtivity::where('id', $data['jobtivity_id'])->first();
            $wowInterest->points=$pointsObj;
            $rt['status'] = "success";
            $rt['data'] = $wowInterest;
            $notification['touser_id'] = $jobtivity->user_id;
            $notification['fromuser_id'] = $user->id;           
            $notification['item_type'] = '2';
            $notification['item_id'] = $jobtivity->id;
            $notification['description'] = 
            'Wow your jobtiviti <a>'.$jobtivity->description.'</a>';                   
            NotificationJobtivity::create($notification);

        } else {
            $rt['message'] = "Invalid Access";
        }
        return response()->json($rt);
    }

    public function removeWow(Request $request) {
        $rt['status'] = 'error';
        $user = $request->user();
        $data = $request->all();
        if (isset($data['jobtivity_id']) && isset($user->id)) {
            $wowInterest = WowInterest::where(["jobtivity_id" => $data['jobtivity_id'], 'user_id' => $user->id])->first();
            if (isset($wowInterest->id)) {
                $wowInterest->status = 0;
                $wowInterest->save();
                $rt['status'] = "success";
                $rt['data'] = $wowInterest;
            } else {
                $rt['message'] = "No interest found for jobtiviti";
            }
        } else {
            $rt['message'] = "Invalid Access";
        }
        return response()->json($rt);
    }

    public function wowUserList(Request $request){
        $rt['status'] = 'error';
        $photoURL = url("user_photos/");
        $user = $request->user();
        $data = $request->all();
        if (isset($data['jobtivity_id']) && isset($user->id)) {
            $res = DB::select("select w.*, u.name, IF(u.photo != '', CONCAT('".$photoURL."/', u.photo), null) as photo from wow_interests w left join users u on (u.id = w.user_id) where w.jobtivity_id = :id and w.status = 1", ['id'=>$data['jobtivity_id']]);
            $rt['status'] = 'success';
            $rt['data'] = $res;
        } else {
            $rt['message'] = "Invalid Access";
        }
        return response()->json($rt);
    }
    
    public function milestoneAchievement(Request $request) {
        $rt['status'] = 'error';
        $user = $request->user();
        $userData = User::find($user->id);
        if ($userData) {
            $ach = $userData->milestoneAchieve();
            if ($ach) {
                $rt['status'] = 'success';
                $rt['milestone'] = $ach;
            }
        }
        return response()->json($rt);
    }
    
    public function milestoneAchieved(Request $request) {
        $rt['status'] = 'error';
        $user = $request->user();
        $data = $request->all();
        $userData = User::find($user->id);
        if ($userData) {
            $ach = $userData->milestoneAchieve();
            if ($ach && ($ach['id'] == $data['milestone_id'])) {
                $rt['status'] = 'success';
                $point = $userData->userPoint;
                $point->milestone_id = $data['milestone_id'];
                $point->save();
            } else {
                $rt['status'] = 'error';
            }
        }
        return response()->json($rt);
    }

    public function companyList(Request $request) {
        // $list = User::where('user_role', 2)->get()->toArray();
        // $rt['status'] = 'success';
        // $rt['companyList'] = $list;
        // return response()->json($rt);


        $list = Company::where("is_verify",VerifiedType::Active)->get()->toArray();
        $rt['status'] = 'success';
        $rt['companyList'] = $list;
        return response()->json($rt);    

    }

     

    public function linkedInData(Request $request) {
        $data = $request->all();
        if (!empty($data['code']) && !empty($data['state'])) {
            Linkedin::create(['code' => $data['code'], 'state' => $data['state']]);
        }
    }

    public function getLinkedInData(Request $request) {
        $data = $request->all();
        $linkedin = Linkedin::where('state', $data['state'])->get()->toArray();
        if (!empty($linkedin)){
            Linkedin::where('state', $data['state'])->delete();
            $rt['code'] = $linkedin[0]['code'];
            $rt['status'] = 'success';
        } else {
            $rt['status'] = 'error';
        }
        return response()->json($rt);
    }

    public function addPointsForSession(Request $request){
        $user = $request->user();
        $pointsObj=UserPointLogs::addUserPoints(UserPointLogs::$DAILY_SIGN_IN,$user->id);
        $rt['status'] = 'success';
        $rt['data']=array('points'=>$pointsObj);
        return response()->json($rt);
    }

    public function addPointForReadArticle(Request $request){
        $user = $request->user();
        $pointsObj=UserPointLogs::addUserPoints(UserPointLogs::$ARTICLE_READ,$user->id,0,0,0,100);
        $rt['status'] = 'success';
        $rt['data']=array('points'=>$pointsObj);
        return response()->json($rt);
    }
    
      

}

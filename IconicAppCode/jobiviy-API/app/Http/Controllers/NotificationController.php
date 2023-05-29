<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserFollower;
use App\Models\Jobtivity;
use App\Models\WowInterest;
use App\Models\NotificationJobtivity;
use DB;

class NotificationController extends Controller
{
   /**
     *  Get All Notifications
     * 
     */
    public function getnotification(Request $request)
    {
        $rt['status'] = 'error';
        $user = $request->user();
        $data = $request->all();
        
        if (isset($user)) {
            $user_id=$user->id;
            
            $Notifications = NotificationJobtivity::Join('users AS u', 'u.id', '=', 'notification_jobtivities.fromuser_id')
            ->where([['touser_id','=',$user_id],['fromuser_id','<>',$user_id]])->select('u.id', 'u.name','notification_jobtivities.description',
			'notification_jobtivities.item_id','notification_jobtivities.item_type',
			'notification_jobtivities.created_at','notification_jobtivities.isseen','notification_jobtivities.isread',
			'notification_jobtivities.id as notification_id')
            ->orderBy('notification_jobtivities.created_at', 'DESC')->get();

            // $userData->userFollower = UserFollower::Join('users AS U1', 'user_followers.user_id', '=', 'U1.id')
            // ->Join('users AS U2', 'user_followers.following_id', '=', 'U2.id')
            // ->where('user_id', $user_id)->select('U1.name as follwingname', 'U2.name as followername',
            //  'user_followers.updated_at as time')
            // ->orderBy('user_followers.updated_at', 'DESC')->get();
            
            // $userData->userjobtivity = Jobtivity::Join('users AS U1', 'jobtivities.user_id', '=', 'U1.id')
            // ->Join('users AS U2', 'jobtivities.user_id', '=', 'U2.id')
            // ->whereIn
            // ('user_id', UserFollower::Join('users AS U', 'user_followers.following_id', '=', 'U.id')
            // ->where('user_id', $user_id)->select('U1.name as follwingname', 'U2.name as followername',
            //  'user_followers.updated_at as time')->select('U.id'))->select('U1.name', 'jobtivities.updated_at as time',
            //  'description')->orderBy('jobtivities.updated_at', 'DESC')->get();

            // $userData->userwow = Jobtivity::Join('wow_interests AS w', 'w.jobtivity_id', '=', 'jobtivities.id')
            // ->Join('users AS u', 'w.user_id', '=', 'u.id')
            // ->where('jobtivities.user_id', $user_id)->select(
            //     'jobtivities.id','u.name','jobtivities.description','w.updated_at')
            // ->orderBy('w.updated_at', 'DESC')
            // ->orderBy('jobtivities.id', 'DESC')->get();

            // $userData->usercomment = Jobtivity::Join('comments AS w', 'w.jobtivity_id', '=', 'jobtivities.id')
            // ->Join('users AS u', 'w.user_id', '=', 'u.id')
            // ->where('jobtivities.user_id', $user_id)->select(
            //     'jobtivities.id','u.name','jobtivities.description','w.updated_at')
            // ->orderBy('w.updated_at', 'DESC')
            // ->orderBy('jobtivities.id', 'DESC')->get();

            $rt['status'] = "Success";
            $rt['data'] = $Notifications;
        } else {
            $rt['message'] = "Invalid";
        }
        return response()->json($rt);
    }
	
	
	
	public function getSeenNotificationCount(Request $request)
    {
        $rt['status'] = 'error';
        $user = $request->user();
        $data = $request->all();        
        if (isset($user)) {
            $user_id=$user->id;
            $count = NotificationJobtivity::Join('users AS u', 'u.id', '=', 'notification_jobtivities.fromuser_id')
            ->where([['touser_id','=',$user_id],['fromuser_id','<>',$user_id],['isseen','=', 0]])->select('isseen')->count();
            $rt['status'] = "Success";           
            $rt['NewNotification'] = $count;
        } else {
            $rt['message'] = "Invalid";
        }
        return response()->json($rt);
    }
	public function SetSeenNotification(Request $request)
    {
        $user = $request->user();
		$user_id=$user->id;
        $data = $request->all();
        $returnValue = NotificationJobtivity::where(['touser_id'=> $user_id,'isseen'=> 0])
          ->update(['isseen' => 1 ]);
         //$returnValue->save();
        $rt['status'] = "success";
        return response()->json($rt);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updatNotification(Request $request)
    { 
     	$user = $request->user();
        $data = $request->all();
        $returnValue = NotificationJobtivity::where('id', '=', $data['id'])
          ->update(['isread' => 1 ]);
         
         $rt['status'] = "success";
         return response()->json($rt);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}

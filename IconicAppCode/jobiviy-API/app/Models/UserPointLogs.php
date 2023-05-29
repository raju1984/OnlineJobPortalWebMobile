<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\UserPoints;
use App\Models\Jobtivity;

class UserPointLogs extends Model
{
    protected $table="user_point_logs";

    public static $JOBTIVITY_POSTED="0";
    public static $COMMENT_ADDED="1";
    public static $LIKE_ADDED="2";
    public static $DAILY_SIGN_IN="3";
    public static $ARTICLE_READ="4";
    
    public static $POINTS_AR= array(100,20,10,10,20);
    

    protected $fillable = [
        'user_id', 'points','created_at','updated_at'
    ];

    public function user(){
        return $this->belongsTo('App\Models\User');
    }


    public static function addUserPoints($type,$userId,$jobtivityId=0,$commentId=0,$likeId=0,$article_id=0){
        switch($type){
            case self::$JOBTIVITY_POSTED:  return self::addPoints(self::$JOBTIVITY_POSTED,$userId,$jobtivityId); break;
            case self::$COMMENT_ADDED:     return self::addPointsbyLimitOnDailyBases($userId,self::$COMMENT_ADDED,$jobtivityId,3,$commentId,$likeId);break;
            case self::$LIKE_ADDED:        return self::addPointsbyLimitOnDailyBases($userId,self::$LIKE_ADDED,$jobtivityId,5,$commentId,$likeId);break;
            case self::$DAILY_SIGN_IN:     return self::addPoints(self::$DAILY_SIGN_IN,$userId);break;
            case self::$ARTICLE_READ:      return self::addPoints(self::$ARTICLE_READ,$userId,0,0,0,$article_id);break;
        }
    }

    public static function actionPoints($type){
        return self::$POINTS_AR[$type];
    }

    public static function addPoints($type,$userId,$jobtivityId=0,$commentId=0,$likeId=0,$article_id=0) {
        
        $userPointLogObj=new self();
        $userPointLogObj->points=self::actionPoints($type);
        $userPointLogObj->user_id=$userId;
        $userPointLogObj->action_type=$type;
        $userPointLogObj->created_at=date('Y-m-d H:i:s');
        $userPointLogObj->milestone_id =0;
        $userPointLogObj->jobtivity_id =$jobtivityId;
        $userPointLogObj->comment_id =$commentId;
        $userPointLogObj->like_id =$likeId;
        $userPointLogObj->article_id =$article_id;
        $userPointLogObj->save();
        $pointsObj=UserPoints::addPoints($userId,$userPointLogObj->points);
        return array('earned_points'=>$userPointLogObj->points,'total_points'=>$pointsObj->points,'log_obj'=>$userPointLogObj);
    }

    public static function addPointsbyLimitOnDailyBases($userId,$type,$jobtivityId,$limit,$commentId=0,$likeId=0){
        $jobtivityObj =Jobtivity::where('id',$jobtivityId)->first();
        if($jobtivityObj->user_id!=$userId){
            $commentPointCounts=self::selectRaw('count(id) as count,jobtivity_id')->
                                     where(array('action_type'=>$type,'user_id'=>$userId))
                                    ->whereRaw('date(`created_at`)="'.date('Y-m-d').'"')->groupBy('jobtivity_id')->get()->pluck('jobtivity_id')->toArray();                        
            if(count($commentPointCounts)<$limit && !in_array($jobtivityId,$commentPointCounts)){
                return self::addPoints($type,$userId,$jobtivityId,$commentId,$likeId);
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPoints extends Model {

    protected $table="user_points";

    public function user(){
        return $this->belongsTo('App\Models\User');
    }

    public static function addPoints($userId,$points) {
        $userPointObj = self::where("user_id", $userId)->first();
        if (isset($userPointObj->id)) {
            $userPointObj->points+=$points;
            $userPointObj->updated_at = Date("Y-m-d H:i:s");
        } else {
            $userPointObj = new UserPoints();
            $userPointObj->points = $points;
            $userPointObj->user_id = $userId;
            $userPointObj->milestone_id = 0;
            $userPointObj->created_at = Date("Y-m-d H:i:s");
        }
        $userPointObj->save();
        return $userPointObj;
    }





}

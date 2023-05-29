<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFollower extends Model {

    protected $table="user_followers";
    
    protected $fillable = [
        'user_id', 'following_id', 'created_at', 'updated_at', 'status'
    ];

    public function user(){
        return $this->belongsTo('App\Models\User');
    }

    public function following(){
        return $this->belongsTo('App\Models\User','following_id','user_id');
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model {

    protected $fillable = [
        'user_id', 
        'jobtivity_id', 
        'message', 
        'is_show', 
        'is_delete', 
        'created_at',
        'updated_at'
    ];

    public function user(){
        $photoURL=url("user_photos/");
        return $this->belongsTo('App\Models\User')->selectRaw("name, IF(photo != '', CONCAT('".$photoURL."/', photo), null) as photo");
    }
    public function jobtivity(){
        return $this->belongsTo('App\Models\Jobtivity','jobtivity_id','id')->select('description');
    }

}

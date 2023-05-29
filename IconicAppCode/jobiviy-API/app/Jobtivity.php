<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Jobtivity extends Model {

    protected $fillable = [
        'user_id', 'jobtivity_category', 'jobtivity_sub_category', 'description', 'learning_experience'
    ];

    public function user(){
        return $this->belongsTo('App\User')->select('name');
    }

    public function numofComments(){
        return $this->hasMany('App\Comment')->count();
    }

}

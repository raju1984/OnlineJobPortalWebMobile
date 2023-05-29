<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jobtivity extends Model {

    protected $fillable = [
        'user_id', 'jobtivity_category', 'jobtivity_sub_category','description', 'learning_experience','sub_category_description'
    ];

    public function user() {
        return $this->belongsTo('App\Models\User');
    }

    public function category() {
        return $this->hasOne('App\Models\Category', 'id', 'jobtivity_category');
    }

    public function jobtivityCategory($id) {
        return Category::where('id', $id)->first();
    }

    public function numOfComments() {
        return $this->hasMany('App\Models\Comment')->count();
    }

    public function numOfWowInterests() {
        return $this->hasMany('App\Models\WowInterest')->where('status', 1)->count();
    }

    public function userHaveWowInterest($user) {
        return WowInterest::where(['user_id' => $user->id, 'jobtivity_id' => $this->id, 'status' => 1])->count();
    }

}

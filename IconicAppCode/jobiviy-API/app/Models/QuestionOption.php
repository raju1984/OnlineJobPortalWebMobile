<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionOption extends Model {

    protected $fillable = [
        
    ];

    public function questionOptions() {
        return $this->hasMany('App\Models\QuestionOption');
    }

    public function answercount($user) {
        return CompanyCultureAnswer::where(['user_id' => $user->id, 'option_id' => $this->id, 'status' => 1])->count();
    }

}

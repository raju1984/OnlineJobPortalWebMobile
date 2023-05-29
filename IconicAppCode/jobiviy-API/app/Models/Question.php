<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model {

    protected $fillable = [
        
    ];

    public function questionOptions() {
        return $this->hasMany('App\Models\QuestionOption');
    }


   public function CompanyCultureAnswers()
   {
   	return $this->hasMany('App\Models\CompanyCultureAnswer');
   }

    public function TalentProfileAnswere() {
        return $this->hasMany('App\Models\TalentProfileAnswer','question_id','id');
    }

}

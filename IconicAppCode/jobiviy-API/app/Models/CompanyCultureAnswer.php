<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyCultureAnswer extends Model
{

protected $fillable = [
        'user_id','question_id','option_id'
    ];

         
     public function CompanyCultureAnswers() {
        return $this->hasMany('App\Models\CompanyCultureAnswer');
    }
   
      public function question() {
        return $this->belongsTo('App\Models\question');
    }
   
}

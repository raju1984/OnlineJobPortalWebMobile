<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TalentProfile extends Model
{
    //

    function TalentProfileQuestions(){
        return $this->hasMany('App\Models\TalentJobDescription','talent_profile_id','id');
    }

    function TalentProfileAnswere(){
        return $this->hasMany('App\Models\TalentProfileAnswer','talent_profile_id','id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WowInterest extends Model {

    protected $table = "wow_interests";
    protected $fillable = [
        'user_id', 'jobtivity_id', 'created_at', 'updated_at', 'status'
    ];

    public function user() {
        return $this->belongsTo('App\Models\User');
    }
    
    public function jobtivity(){
        return $this->belongsTo('App\Models\Jobtivity');
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CriteriaPoint extends Model
{
    protected $fillable = [
        
    ];

    public function CriteriaList() {
        return $this->hasMany('App\Models\CriteriaPoint');
    }
}

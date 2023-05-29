<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public function jobtivity() {
        return $this->belongsTo('App\Models\Jobtivity');
    }
}

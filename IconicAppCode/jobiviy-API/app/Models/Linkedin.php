<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Linkedin extends Model {
	protected $table = 'linkedin_data';
    protected $fillable = [
        'code', 
        'state'
    ];

}

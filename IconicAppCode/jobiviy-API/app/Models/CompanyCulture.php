<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyCulture extends Model
{
    protected $fillable = [
        'user_id', 'option_id', 'question_id'
        
    ];

    public function CompanyCultures() {
        return $this->hasmany('App\Models\Question');
    }
   
}

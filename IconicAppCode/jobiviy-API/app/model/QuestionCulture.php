<?php

namespace App\model;

use Illuminate\Database\Eloquent\Model;

class QuestionCulture extends Model
{
    protected $fillable = [
        
        'questions',
        'type',
        'created_at',
        'updated_at'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model {

    protected $fillable = [
        'company_name', 
        'state', 
        'industry', 
        'size_of_company', 
        'created_at',
        'updated_at'
    ];

}

<?php

namespace App\Admins;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table="companies";
    protected $fillable = [
        'company_name', 
        'state', 
        'industry', 
        'size_of_company', 
        'created_at',
        'updated_at'
    ];
	protected $guarded = [];
}

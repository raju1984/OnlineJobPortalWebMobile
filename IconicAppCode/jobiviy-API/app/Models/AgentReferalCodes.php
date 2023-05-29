<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgentReferalCodes extends Model
{
    protected $fillable = [
        'agent_id', 
        'company_id', 
        'referal_id', 
        'created_at',
        'updated_at'
    ];
}

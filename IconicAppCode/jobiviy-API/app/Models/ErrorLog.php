<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ErrorLog extends Model {

    protected $table="error_logs";

    protected $fillable = [
        'err_text', 'file_path','method','parent_method', 'error_time', 'created_at', 'updated_at'
    ];

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    protected $fillable = [
        'municipality_id',
        'name',
        'psgc_code',
        'population',
    ];

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function province()
    {
        return $this->municipality->province();
    }

    public function region()
    {
        return $this->municipality->province->region();
    }
}

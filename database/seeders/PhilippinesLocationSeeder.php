<?php

namespace Database\Seeders;

use App\Models\Region;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PhilippinesLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting Philippines location data import...');
        
        $this->command->info('Clearing existing data...');
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Barangay::truncate();
        Municipality::truncate();
        Province::truncate();
        Region::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $jsonPath = storage_path('app/public/brgy/Philippines_Barangays.json');
        
        if (!file_exists($jsonPath)) {
            $this->command->error('JSON file not found at: ' . $jsonPath);
            return;
        }
        
        $this->command->info('Loading JSON data...');
        $data = json_decode(file_get_contents($jsonPath), true);
        
        if (!$data) {
            $this->command->error('Failed to parse JSON data');
            return;
        }
        
        $this->command->info('Processing ' . count($data) . ' records...');
        
        $regions = [];
        $provinces = [];
        $municipalities = [];
        
        foreach ($data as $item) {
            $regionName = $item['Region'];
            $provinceName = $item['Province'];
            $municipalityName = $item['Municipality'];
            
            $psgcCode = (string)$item['10-digit PSGC'];
            $regionCode = substr($psgcCode, 0, 2);
            $provinceCode = substr($psgcCode, 0, 4);
            $municipalityCode = substr($psgcCode, 0, 6);
            
            if (!isset($regions[$regionCode])) {
                $regions[$regionCode] = [
                    'name' => $regionName,
                    'code' => $regionCode
                ];
            }
            
            if (!isset($provinces[$provinceCode])) {
                $provinces[$provinceCode] = [
                    'name' => $provinceName,
                    'code' => $provinceCode,
                    'region_code' => $regionCode
                ];
            }
            
            if (!isset($municipalities[$municipalityCode])) {
                $municipalities[$municipalityCode] = [
                    'name' => $municipalityName,
                    'code' => $municipalityCode,
                    'province_code' => $provinceCode
                ];
            }
        }
        
        $this->command->info('Inserting ' . count($regions) . ' regions...');
        $regionMap = [];
        foreach ($regions as $code => $regionData) {
            $region = Region::create($regionData);
            $regionMap[$code] = $region->id;
        }
        
        $this->command->info('Inserting ' . count($provinces) . ' provinces...');
        $provinceMap = [];
        foreach ($provinces as $code => $provinceData) {
            $province = Province::create([
                'name' => $provinceData['name'],
                'code' => $provinceData['code'],
                'region_id' => $regionMap[$provinceData['region_code']]
            ]);
            $provinceMap[$code] = $province->id;
        }
        
        $this->command->info('Inserting ' . count($municipalities) . ' municipalities...');
        $municipalityMap = [];
        foreach ($municipalities as $code => $municipalityData) {
            $municipality = Municipality::create([
                'name' => $municipalityData['name'],
                'code' => $municipalityData['code'],
                'province_id' => $provinceMap[$municipalityData['province_code']]
            ]);
            $municipalityMap[$code] = $municipality->id;
        }
        
        $this->command->info('Inserting barangays...');
        $barangayCount = 0;
        $batchSize = 1000;
        $barangayBatch = [];
        
        foreach ($data as $item) {
            $psgcCode = (string)$item['10-digit PSGC'];
            $municipalityCode = substr($psgcCode, 0, 6);
            
            $population = $item['Population'];
            if ($population === '-' || $population === '' || !is_numeric($population)) {
                $population = null;
            } else {
                $population = (int)$population;
            }
            
            $barangayBatch[] = [
                'municipality_id' => $municipalityMap[$municipalityCode],
                'name' => $item['Barangay'],
                'psgc_code' => $psgcCode,
                'population' => $population,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            if (count($barangayBatch) >= $batchSize) {
                Barangay::insert($barangayBatch);
                $barangayCount += count($barangayBatch);
                $this->command->info("Inserted {$barangayCount} barangays...");
                $barangayBatch = [];
            }
        }
        
        if (!empty($barangayBatch)) {
            Barangay::insert($barangayBatch);
            $barangayCount += count($barangayBatch);
        }
        
        $this->command->info("Import completed successfully!");
        $this->command->info("- Regions: " . count($regions));
        $this->command->info("- Provinces: " . count($provinces));
        $this->command->info("- Municipalities: " . count($municipalities));
        $this->command->info("- Barangays: " . $barangayCount);
    }
}

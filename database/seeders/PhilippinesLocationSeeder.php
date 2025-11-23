<?php

namespace Database\Seeders;

use App\Models\Region;
use App\Models\Province;
use App\Models\Municipality;
use App\Models\Barangay;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhilippinesLocationSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Starting Philippines location data import...');

        // Reset tables
        $this->command->info('Clearing existing data...');
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Barangay::truncate();
        Municipality::truncate();
        Province::truncate();
        Region::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Load JSON
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

        // Region code normalization mapping
        $regionFix = [
            '13' => '13', // NCR
            '14' => '14', // CAR
            '10' => '10', // Region I
            '20' => '20', // Region II
            '30' => '30', // Region III
            '33' => '30', // Old PSGC for Region III
            '40' => '40', // Region IV-A
            '43' => '40', // Old PSGC for Region IV-A
            '17' => '17', // MIMAROPA
            '50' => '50', // Region V
            '60' => '60', // Region VI
            '63' => '60', // Old PSGC for Region VI
            '70' => '70', // Region VII
            '73' => '70', // Old PSGC for Region VII
            '80' => '80', // Region VIII
            '83' => '80', // Old PSGC for Region VIII
            '90' => '90', // Region IX
            '93' => '90', // Old PSGC variant
            '99' => '90', // Old PSGC variant
            '11' => '11', // Region XI
            '12' => '12', // Region XII
            '16' => '16', // Region XIII
            '19' => '19', // BARMM
        ];

        $regions = [];
        $provinces = [];
        $municipalities = [];

        foreach ($data as $item) {
            $regionName = $item['Region'];
            $provinceName = $item['Province'];
            $municipalityName = $item['Municipality'];

            $psgcCode = (string)$item['10-digit PSGC'];
            $rawRegionCode = substr($psgcCode, 0, 2);

            // Normalize region code
            $regionCode = $regionFix[$rawRegionCode] ?? $rawRegionCode;
            $provinceCode = substr($psgcCode, 0, 4);
            $municipalityCode = substr($psgcCode, 0, 6);

            // Region
            if (!isset($regions[$regionCode])) {
                $regions[$regionCode] = [
                    'name' => $regionName,
                    'code' => $regionCode
                ];
            }

            // Province
            if (!isset($provinces[$provinceCode])) {
                $provinces[$provinceCode] = [
                    'name' => $provinceName,
                    'code' => $provinceCode,
                    'region_code' => $regionCode
                ];
            }

            // Municipality
            if (!isset($municipalities[$municipalityCode])) {
                $municipalities[$municipalityCode] = [
                    'name' => $municipalityName,
                    'code' => $municipalityCode,
                    'province_code' => $provinceCode
                ];
            }
        }

        // Insert Regions
        $this->command->info('Inserting ' . count($regions) . ' regions...');
        $regionMap = [];
        foreach ($regions as $code => $regionData) {
            $region = Region::create($regionData);
            $regionMap[$code] = $region->id;
        }

        // Insert Provinces
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

        // Insert Municipalities
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

        // Insert Barangays
        $this->command->info('Inserting barangays...');
        $barangayCount = 0;
        $batchSize = 1000;
        $barangayBatch = [];

        foreach ($data as $item) {
            $psgcCode = (string)$item['10-digit PSGC'];
            $municipalityCode = substr($psgcCode, 0, 6);

            $population = $item['Population'] ?? null;
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
<?php

namespace Database\Seeders;

use App\Models\Barangay;
use App\Models\Municipality;
use App\Models\Province;
use App\Models\Region;
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

        // Paths
        $regionsJson = storage_path('app/location_data/regions.json');
        $provincesJson = storage_path('app/location_data/provinces.json');
        $municipalitiesJson = storage_path('app/location_data/municipalities.json');
        $barangaysJson = storage_path('app/location_data/barangays.json');

        if (! file_exists($regionsJson) || ! file_exists($provincesJson) || ! file_exists($municipalitiesJson) || ! file_exists($barangaysJson)) {
            $this->command->error('One of the required JSON files is missing.');

            return;
        }

        // 1. Regions
        $this->command->info('Loading regions...');
        $regionsData = json_decode(file_get_contents($regionsJson), true);
        $regionMap = []; // code => id
        foreach ($regionsData as $item) {
            $code = $item['region_code'];
            if (isset($regionMap[$code])) {
                continue;
            }
            $region = Region::create([
                'name' => $item['region_name'],
                'code' => $code,
            ]);
            $regionMap[$code] = $region->id;
        }

        // 2. Provinces
        $this->command->info('Loading provinces...');
        $provincesData = json_decode(file_get_contents($provincesJson), true);
        $provinceMap = []; // code => id
        foreach ($provincesData as $item) {
            $code = $item['province_code'];
            if (isset($provinceMap[$code])) {
                continue;
            }
            $regionId = $regionMap[$item['region_code']] ?? null;
            if (! $regionId) {
                continue;
            }
            $province = Province::create([
                'region_id' => $regionId,
                'name' => $item['province_name'],
                'code' => $code,
            ]);
            $provinceMap[$code] = $province->id;
        }

        // 3. Municipalities (Cities)
        $this->command->info('Loading municipalities...');
        $municipalitiesData = json_decode(file_get_contents($municipalitiesJson), true);
        $municipalityMap = []; // code => id
        foreach ($municipalitiesData as $item) {
            $code = $item['city_code'];
            if (isset($municipalityMap[$code])) {
                continue;
            }
            $provinceId = $provinceMap[$item['province_code']] ?? null;
            if (! $provinceId) {
                continue;
            }
            $municipality = Municipality::create([
                'province_id' => $provinceId,
                'name' => $item['city_name'],
                'code' => $code,
            ]);
            $municipalityMap[$code] = $municipality->id;
        }

        // 4. Barangays
        $this->command->info('Loading barangays...');
        $barangaysData = json_decode(file_get_contents($barangaysJson), true);
        $barangayBatch = [];
        $insertedBarangayCodes = [];
        $batchSize = 1000;
        $barangayCount = 0;

        foreach ($barangaysData as $item) {
            $code = $item['brgy_code'];
            if (isset($insertedBarangayCodes[$code])) {
                continue;
            }
            $municipalityId = $municipalityMap[$item['city_code']] ?? null;
            if (! $municipalityId) {
                continue;
            }

            $barangayBatch[] = [
                'municipality_id' => $municipalityId,
                'name' => $item['brgy_name'],
                'psgc_code' => $code,
                'population' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $insertedBarangayCodes[$code] = true;

            if (count($barangayBatch) >= $batchSize) {
                Barangay::insert($barangayBatch);
                $barangayCount += count($barangayBatch);
                $barangayBatch = [];
            }
        }

        if (! empty($barangayBatch)) {
            Barangay::insert($barangayBatch);
            $barangayCount += count($barangayBatch);
        }

        $this->command->info('Import completed successfully!');
        $this->command->info('- Regions: '.count($regionMap));
        $this->command->info('- Provinces: '.count($provinceMap));
        $this->command->info('- Municipalities: '.count($municipalityMap));
        $this->command->info('- Barangays: '.$barangayCount);
    }
}

import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface LocationOption {
    id: number;
    name: string;
    code: string;
    population?: number;
}

export default function RegisterBarangay() {
    const [formData, setFormData] = useState({
        regionId: '',
        regionName: '',
        provinceId: '',
        provinceName: '',
        municipalityId: '',
        municipalityName: '',
        barangayId: '',
        barangayName: '',
        zipCode: '',
        population: '',
        secondPartyName: '',
        position: '',
        dateSigned: '',
        stage: 'NEW',
        moaFile: null as File | null
    });

    // Dropdown data states
    const [regions, setRegions] = useState<LocationOption[]>([]);
    const [provinces, setProvinces] = useState<LocationOption[]>([]);
    const [municipalities, setMunicipalities] = useState<LocationOption[]>([]);
    const [barangays, setBarangays] = useState<LocationOption[]>([]);
    
    // Dropdown visibility states
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
    const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false);
    const [showBarangayDropdown, setShowBarangayDropdown] = useState(false);
    
    // Search states
    const [regionSearch, setRegionSearch] = useState('');
    const [provinceSearch, setProvinceSearch] = useState('');
    const [municipalitySearch, setMunicipalitySearch] = useState('');
    const [barangaySearch, setBarangaySearch] = useState('');
    
    // Loading states
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
    const [loadingBarangays, setLoadingBarangays] = useState(false);

    // Load regions on component mount
    useEffect(() => {
        loadRegions();
    }, []);

    // Load regions
    const loadRegions = async () => {
        setLoadingRegions(true);
        try {
            const response = await axios.get('/api/regions');
            setRegions(response.data);
        } catch (error) {
            console.error('Error loading regions:', error);
        } finally {
            setLoadingRegions(false);
        }
    };

    // Load provinces when region is selected
    const loadProvinces = async (regionId: string) => {
        if (!regionId) return;
        setLoadingProvinces(true);
        try {
            const response = await axios.get(`/api/provinces/${regionId}`);
            setProvinces(response.data);
        } catch (error) {
            console.error('Error loading provinces:', error);
        } finally {
            setLoadingProvinces(false);
        }
    };

    // Load municipalities when province is selected
    const loadMunicipalities = async (provinceId: string) => {
        if (!provinceId) return;
        setLoadingMunicipalities(true);
        try {
            const response = await axios.get(`/api/municipalities/${provinceId}`);
            setMunicipalities(response.data);
        } catch (error) {
            console.error('Error loading municipalities:', error);
        } finally {
            setLoadingMunicipalities(false);
        }
    };

    // Load barangays when municipality is selected
    const loadBarangays = async (municipalityId: string) => {
        if (!municipalityId) return;
        setLoadingBarangays(true);
        try {
            const response = await axios.get(`/api/barangays/${municipalityId}`);
            setBarangays(response.data);
        } catch (error) {
            console.error('Error loading barangays:', error);
        } finally {
            setLoadingBarangays(false);
        }
    };

    // Debounced search functions
    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
    };

    const searchRegions = debounce(async (query: string) => {
        if (query.length < 2) {
            loadRegions();
            return;
        }
        try {
            const response = await axios.get(`/api/regions/search?q=${encodeURIComponent(query)}`);
            setRegions(response.data);
        } catch (error) {
            console.error('Error searching regions:', error);
        }
    }, 300);

    const searchProvinces = debounce(async (query: string, regionId: string) => {
        if (!regionId) return;
        if (query.length < 2) {
            loadProvinces(regionId);
            return;
        }
        try {
            const response = await axios.get(`/api/provinces/search/${regionId}?q=${encodeURIComponent(query)}`);
            setProvinces(response.data);
        } catch (error) {
            console.error('Error searching provinces:', error);
        }
    }, 300);

    const searchMunicipalities = debounce(async (query: string, provinceId: string) => {
        if (!provinceId) return;
        if (query.length < 2) {
            loadMunicipalities(provinceId);
            return;
        }
        try {
            const response = await axios.get(`/api/municipalities/search/${provinceId}?q=${encodeURIComponent(query)}`);
            setMunicipalities(response.data);
        } catch (error) {
            console.error('Error searching municipalities:', error);
        }
    }, 300);

    const searchBarangays = debounce(async (query: string, municipalityId: string) => {
        if (!municipalityId) return;
        if (query.length < 2) {
            loadBarangays(municipalityId);
            return;
        }
        try {
            const response = await axios.get(`/api/barangays/search/${municipalityId}?q=${encodeURIComponent(query)}`);
            setBarangays(response.data);
        } catch (error) {
            console.error('Error searching barangays:', error);
        }
    }, 300);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        
        if (file) {
            // Validate file type
            if (file.type !== 'application/pdf') {
                alert('Please select a PDF file only.');
                event.target.value = ''; // Clear the input
                return;
            }
            
            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                alert('File size must be less than 10MB.');
                event.target.value = ''; // Clear the input
                return;
            }
            
            setFormData(prev => ({
                ...prev,
                moaFile: file
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                moaFile: null
            }));
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('moa_file', file);
            formData.append('_token', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '');
            
            const response = await axios.post('/api/upload-moa', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const removeFile = () => {
        setFormData(prev => ({
            ...prev,
            moaFile: null
        }));
        // Clear the file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    // Selection handlers
    const handleRegionSelect = (region: LocationOption) => {
        setFormData(prev => ({
            ...prev,
            regionId: region.id.toString(),
            regionName: region.name,
            provinceId: '',
            provinceName: '',
            municipalityId: '',
            municipalityName: '',
            barangayId: '',
            barangayName: '',
            population: ''
        }));
        setRegionSearch(region.name);
        setProvinceSearch('');
        setMunicipalitySearch('');
        setBarangaySearch('');
        setShowRegionDropdown(false);
        setProvinces([]);
        setMunicipalities([]);
        setBarangays([]);
        loadProvinces(region.id.toString());
    };

    const handleProvinceSelect = (province: LocationOption) => {
        setFormData(prev => ({
            ...prev,
            provinceId: province.id.toString(),
            provinceName: province.name,
            municipalityId: '',
            municipalityName: '',
            barangayId: '',
            barangayName: '',
            population: ''
        }));
        setProvinceSearch(province.name);
        setMunicipalitySearch('');
        setBarangaySearch('');
        setShowProvinceDropdown(false);
        setMunicipalities([]);
        setBarangays([]);
        loadMunicipalities(province.id.toString());
    };

    const handleMunicipalitySelect = (municipality: LocationOption) => {
        setFormData(prev => ({
            ...prev,
            municipalityId: municipality.id.toString(),
            municipalityName: municipality.name,
            barangayId: '',
            barangayName: '',
            population: ''
        }));
        setMunicipalitySearch(municipality.name);
        setBarangaySearch('');
        setShowMunicipalityDropdown(false);
        setBarangays([]);
        loadBarangays(municipality.id.toString());
    };

    const handleBarangaySelect = (barangay: LocationOption) => {
        setFormData(prev => ({
            ...prev,
            barangayId: barangay.id.toString(),
            barangayName: barangay.name,
            population: barangay.population?.toString() || ''
        }));
        setBarangaySearch(barangay.name);
        setShowBarangayDropdown(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        // Validate required fields
        if (!formData.regionId || !formData.provinceId || !formData.municipalityId || !formData.barangayId) {
            alert('Please select a complete location (Region, Province, Municipality, and Barangay).');
            return;
        }
        
        if (!formData.secondPartyName || !formData.position || !formData.dateSigned) {
            alert('Please fill in all MOA details.');
            return;
        }
        
        if (!formData.moaFile) {
            alert('Please upload a copy of the signed MOA.');
            return;
        }
        
        try {
            // Upload file first
            const uploadResult = await handleFileUpload(formData.moaFile);
            
            // Prepare form data for submission
            const submissionData = {
                region_id: formData.regionId,
                region_name: formData.regionName,
                province_id: formData.provinceId,
                province_name: formData.provinceName,
                municipality_id: formData.municipalityId,
                municipality_name: formData.municipalityName,
                barangay_id: formData.barangayId,
                barangay_name: formData.barangayName,
                zip_code: formData.zipCode,
                population: formData.population,
                second_party_name: formData.secondPartyName,
                position: formData.position,
                date_signed: formData.dateSigned,
                stage: formData.stage,
                moa_file_path: uploadResult.file_path,
                moa_file_name: uploadResult.file_name
            };
            
            // Submit form data
            const response = await axios.post('/api/register-barangay', submissionData);
            
            if (response.data.success) {
                // Show success message with submission ID
                const submissionId = response.data.submission_id;
                alert(`Barangay registration submitted successfully!\n\nSubmission ID: ${submissionId}\nStatus: PENDING APPROVAL\n\nYou will be notified once your submission is reviewed.`);
                
                // Reset form
                setFormData({
                    regionId: '',
                    regionName: '',
                    provinceId: '',
                    provinceName: '',
                    municipalityId: '',
                    municipalityName: '',
                    barangayId: '',
                    barangayName: '',
                    zipCode: '',
                    population: '',
                    secondPartyName: '',
                    position: '',
                    dateSigned: '',
                    stage: 'NEW',
                    moaFile: null
                });
                setRegionSearch('');
                setProvinceSearch('');
                setMunicipalitySearch('');
                setBarangaySearch('');
            } else {
                alert('Error submitting registration. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting registration. Please try again.');
        }
    };

    // Dropdown component
    const DropdownField = ({ 
        label, 
        value, 
        searchValue, 
        setSearchValue, 
        options, 
        showDropdown, 
        setShowDropdown, 
        onSelect, 
        onSearch, 
        placeholder,
        disabled = false,
        loading = false
    }: {
        label: string;
        value: string;
        searchValue: string;
        setSearchValue: (value: string) => void;
        options: LocationOption[];
        showDropdown: boolean;
        setShowDropdown: (show: boolean) => void;
        onSelect: (option: LocationOption) => void;
        onSearch: (query: string) => void;
        placeholder: string;
        disabled?: boolean;
        loading?: boolean;
    }) => {
        const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value;
            setSearchValue(query);
            onSearch(query);
            setShowDropdown(true);
        };

        const handleFocus = () => {
            setShowDropdown(true);
        };

        const handleBlur = () => {
            // Delay hiding to allow click on options
            setTimeout(() => setShowDropdown(false), 200);
        };

        return (
            <div className="relative">
                <label className="block text-white font-semibold mb-2">{label}</label>
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={placeholder}
                />
                {showDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-gray-700 border-2 border-yellow-400 rounded-4xl max-h-60 overflow-y-auto">
                        {loading ? (
                            <div className="px-3 py-2 text-white text-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mx-auto"></div>
                                <span className="ml-2">Loading...</span>
                            </div>
                        ) : options.length > 0 ? (
                            options.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => onSelect(option)}
                                    className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer first:rounded-t-4xl last:rounded-b-4xl"
                                >
                                    {option.name}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-400 text-center">
                                No results found
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <Head title="Register Barangay">
                {/* Global Poppins font is already set in CSS */}
            </Head>
            
            {/* Black Header with Navigation */}
            <header className="bg-black text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-1xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-17">
                        {/* Left Side - Logo and Brand */}
                        <div className="flex items-center space-x-4">
                            {/* Logo Container */}
                            <div className="relative">
                                {/* Logo Image */}
                                <img 
                                    src="/images/homepage/communityheroes-logo.png" 
                                    alt="Community Heroes Logo" 
                                    className="w-15 h-15 object-contain"
                                />
                            </div>
                            
                            {/* Brand Text */}
                            <div className="text-3xl font-black tracking-wider">
                                COMMUNITY HEROES PH
                            </div>
                        </div>
                        
                        {/* Right Side - MLBB Logo */}
                        <div className="flex items-center">
                            <img 
                                src="/images/homepage/mlbb-logo.png" 
                                alt="Mobile Legends Bang Bang Logo" 
                                className="w-30 h-30 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content with Background Image */}
            <div className="min-h-screen welcome-background flex items-center justify-center py-0">
                <div className="w-500 max-w-8xl mx-auto px-4">
                    {/* Form Title */}
                    <div className="text-center mb-6">
                        <h1 className="text-5xl font-bold text-white mb-2">REGISTER BARANGAY</h1>
                    </div>

                    {/* Form Container */}
                    <div className="bg-gray-200/0 backdrop-blur-sm rounded-4xl p-6 shadow-2xl border-4 border-gray-500">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* INFORMATION Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4 text-left">INFORMATION</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                                    <DropdownField
                                        label="Region"
                                        value={formData.regionName}
                                        searchValue={regionSearch}
                                        setSearchValue={setRegionSearch}
                                        options={regions}
                                        showDropdown={showRegionDropdown}
                                        setShowDropdown={setShowRegionDropdown}
                                        onSelect={handleRegionSelect}
                                        onSearch={searchRegions}
                                        placeholder="Search region..."
                                        loading={loadingRegions}
                                    />
                                    <DropdownField
                                        label="Province"
                                        value={formData.provinceName}
                                        searchValue={provinceSearch}
                                        setSearchValue={setProvinceSearch}
                                        options={provinces}
                                        showDropdown={showProvinceDropdown}
                                        setShowDropdown={setShowProvinceDropdown}
                                        onSelect={handleProvinceSelect}
                                        onSearch={(query) => searchProvinces(query, formData.regionId)}
                                        placeholder="Search province..."
                                        disabled={!formData.regionId}
                                        loading={loadingProvinces}
                                    />
                                    <DropdownField
                                        label="Municipality"
                                        value={formData.municipalityName}
                                        searchValue={municipalitySearch}
                                        setSearchValue={setMunicipalitySearch}
                                        options={municipalities}
                                        showDropdown={showMunicipalityDropdown}
                                        setShowDropdown={setShowMunicipalityDropdown}
                                        onSelect={handleMunicipalitySelect}
                                        onSearch={(query) => searchMunicipalities(query, formData.provinceId)}
                                        placeholder="Search municipality..."
                                        disabled={!formData.provinceId}
                                        loading={loadingMunicipalities}
                                    />
                                    <DropdownField
                                        label="Barangay"
                                        value={formData.barangayName}
                                        searchValue={barangaySearch}
                                        setSearchValue={setBarangaySearch}
                                        options={barangays}
                                        showDropdown={showBarangayDropdown}
                                        setShowDropdown={setShowBarangayDropdown}
                                        onSelect={handleBarangaySelect}
                                        onSearch={(query) => searchBarangays(query, formData.municipalityId)}
                                        placeholder="Search barangay..."
                                        disabled={!formData.municipalityId}
                                        loading={loadingBarangays}
                                    />
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Zip Code</label>
                                        <input
                                            type="text"
                                            value={formData.zipCode}
                                            onChange={(e) => {
                                                // Only allow numbers
                                                const value = e.target.value.replace(/\D/g, '');
                                                handleInputChange('zipCode', value);
                                            }}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Enter zip code (numbers only)"
                                            maxLength={4}
                                        />
                                        <p className="text-yellow-400 text-sm mt-1">Enter 4-digit zip code</p>
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Population</label>
                                        <input
                                            type="text"
                                            value={formData.population}
                                            readOnly
                                            className="w-full px-3 py-2 bg-gray-600 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300 cursor-not-allowed"
                                            placeholder="Auto-filled from barangay selection"
                                        />
                                        <p className="text-yellow-400 text-sm mt-1">Auto-filled from barangay data</p>
                                    </div>
                                </div>
                            </div>

                            {/* MOA DETAILS Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4 text-left">MOA DETAILS</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Second Party Name</label>
                                        <input
                                            type="text"
                                            value={formData.secondPartyName}
                                            onChange={(e) => handleInputChange('secondPartyName', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Enter second party name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Position</label>
                                        <input
                                            type="text"
                                            value={formData.position}
                                            onChange={(e) => handleInputChange('position', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Enter position"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Date Signed</label>
                                        <input
                                            type="date"
                                            value={formData.dateSigned}
                                            onChange={(e) => handleInputChange('dateSigned', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Stage</label>
                                        <select
                                            value={formData.stage}
                                            onChange={(e) => handleInputChange('stage', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white focus:outline-none focus:border-yellow-300"
                                        >
                                            <option value="NEW">NEW</option>
                                            <option value="RENEWAL">RENEWAL</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-white font-semibold mb-2">Copy of Signed MOA</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 focus:outline-none focus:border-yellow-300"
                                        />
                                        <p className="text-yellow-400 text-sm mt-1">UPLOAD PDF FILE (Max 10MB)</p>
                                        
                                        {/* File preview */}
                                        {formData.moaFile && (
                                            <div className="mt-3 p-3 bg-gray-800 border border-yellow-400 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                        </svg>
                                                        <div>
                                                            <p className="text-white text-sm font-medium">{formData.moaFile.name}</p>
                                                            <p className="text-gray-400 text-xs">{(formData.moaFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeFile}
                                                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="text-center pt-4">
                                <button
                                    type="submit"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-10 rounded-xl border-2 border-yellow-400 text-lg transition-colors duration-200"
                                >
                                    SUBMIT FOR APPROVAL
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

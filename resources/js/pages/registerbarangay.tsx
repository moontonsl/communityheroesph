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

    // Modern Dropdown component
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
            <div className="space-y-3">
                <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                    {label}
                </label>
                <div className="relative group">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={handleSearchChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            disabled={disabled}
                            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 
                                focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                transition-all duration-300 hover:bg-white/15 
                                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
                                ${showDropdown ? 'ring-2 ring-yellow-400/50 border-yellow-400' : ''}`}
                            placeholder={placeholder}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                appearance: 'none'
                            }}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    
                    {showDropdown && (
                        <div className="absolute z-50 w-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="px-4 py-6 text-white text-center">
                                    <div className="flex items-center justify-center space-x-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-400 border-t-transparent"></div>
                                        <span className="text-sm text-white">Loading...</span>
                                    </div>
                                </div>
                            ) : options.length > 0 ? (
                                <div className="py-2">
                                    {options.map((option, index) => (
                                        <div
                                            key={option.id}
                                            onClick={() => onSelect(option)}
                                            className="px-4 py-3 text-white hover:bg-white/20 hover:text-yellow-400 cursor-pointer transition-colors duration-200 
                                                first:rounded-t-xl last:rounded-b-xl group/item"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium group-hover/item:text-yellow-400 transition-colors">
                                                    {option.name}
                                                </span>
                                                {option.population && (
                                                    <span className="text-xs text-gray-300 bg-white/20 px-2 py-1 rounded-full">
                                                        {option.population.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-6 text-gray-300 text-center">
                                    <svg className="w-8 h-8 mx-auto mb-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                                    </svg>
                                    <p className="text-sm text-gray-300">No results found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title="Register Barangay">
                {/* Global Poppins font is already set in CSS */}
            </Head>
            
            {/* Modern Header */}
            <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Left Side - Logo and Brand */}
                        <div className="flex items-center space-x-6">
                            <div className="relative group">
                                <img 
                                    src="/images/homepage/communityheroes-logo.png" 
                                    alt="Community Heroes Logo" 
                                    className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <div className="text-2xl font-black tracking-wider bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                                COMMUNITY HEROES PH
                            </div>
                        </div>
                        
                        {/* Right Side - MLBB Logo */}
                        <div className="flex items-center group">
                            <img 
                                src="/images/homepage/mlbb-logo.png" 
                                alt="Mobile Legends Bang Bang Logo" 
                                className="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center py-12 px-4 relative overflow-hidden welcome-background">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                                        radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)`,
                    }}></div>
                </div>
                
                <div className="w-full max-w-6xl mx-auto relative z-10">
                    {/* Modern Form Title */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-block">
                            <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-gradient">
                                REGISTER BARANGAY
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-gray-300 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                            Join the Community Heroes initiative and register your barangay for the Mobile Legends: Bang Bang tournament
                        </p>
                    </div>

                    {/* Modern Form Container */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-up">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            {/* INFORMATION Section */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-white">Location Information</h2>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Zip Code
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.zipCode}
                                                onChange={(e) => {
                                                    // Only allow numbers
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    handleInputChange('zipCode', value);
                                                }}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15"
                                                placeholder="Enter zip code (numbers only)"
                                                maxLength={4}
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none'
                                                }}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-yellow-400/80 text-xs flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Enter 4-digit zip code
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Population
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.population}
                                                readOnly
                                                className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 
                                                    cursor-not-allowed opacity-75"
                                                placeholder="Auto-filled from barangay selection"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none'
                                                }}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-yellow-400/80 text-xs flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Auto-filled from barangay data
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* MOA DETAILS Section */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-white">MOA Details</h2>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Second Party Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.secondPartyName}
                                                onChange={(e) => handleInputChange('secondPartyName', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15"
                                                placeholder="Enter second party name"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none'
                                                }}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Position
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.position}
                                                onChange={(e) => handleInputChange('position', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15"
                                                placeholder="Enter position"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none'
                                                }}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Date Signed
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={formData.dateSigned}
                                                onChange={(e) => handleInputChange('dateSigned', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none',
                                                    colorScheme: 'dark'
                                                }}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Stage
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.stage}
                                                onChange={(e) => handleInputChange('stage', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15 appearance-none cursor-pointer"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none'
                                                }}
                                            >
                                                <option value="NEW" style={{ backgroundColor: 'rgb(17, 24, 39)', color: 'white' }}>NEW</option>
                                                <option value="RENEWAL" style={{ backgroundColor: 'rgb(17, 24, 39)', color: 'white' }}>RENEWAL</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-2 xl:col-span-3 space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Copy of Signed MOA
                                        </label>
                                        
                                        {/* Modern File Upload Area */}
                                        <div className="relative">
                                            <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center transition-all duration-300 hover:border-yellow-400/50 hover:bg-white/5 group">
                                                <div className="space-y-4">
                                                    <div className="mx-auto w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors duration-300">
                                                        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-lg">Upload MOA Document</p>
                                                        <p className="text-gray-400 text-sm mt-1">Drag and drop your PDF file here, or click to browse</p>
                                                        <p className="text-yellow-400/80 text-xs mt-2 flex items-center justify-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            PDF files only • Maximum 10MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* File preview */}
                                        {formData.moaFile && (
                                            <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="text-white text-sm font-medium">{formData.moaFile.name}</p>
                                                            <p className="text-gray-400 text-xs">{(formData.moaFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeFile}
                                                        className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-400/10 transition-colors duration-200"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modern Submit Button */}
                            <div className="text-center pt-8">
                                <button
                                    type="submit"
                                    className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-500 
                                        rounded-md shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 
                                        hover:from-yellow-300 hover:to-yellow-400 hover:scale-105 
                                        focus:outline-none focus:ring-4 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-gray-900
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    <span className="relative z-10 flex items-center space-x-3">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>SUBMIT FOR APPROVAL</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                                <p className="text-gray-400 text-sm mt-4 max-w-md mx-auto">
                                    By submitting this form, you agree to the terms and conditions of the Community Heroes program.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

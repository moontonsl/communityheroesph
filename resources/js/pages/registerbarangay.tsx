import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function RegisterBarangay() {
    const [formData, setFormData] = useState({
        region: '',
        province: '',
        municipality: '',
        barangay: '',
        zipCode: '',
        population: '',
        secondPartyName: '',
        position: '',
        dateSigned: '',
        stage: 'NEW/RENEWAL',
        moaFile: null as File | null
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            moaFile: file
        }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
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
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Region</label>
                                        <input
                                            type="text"
                                            value={formData.region}
                                            onChange={(e) => handleInputChange('region', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Enter region"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Province</label>
                                        <input
                                            type="text"
                                            value={formData.province}
                                            onChange={(e) => handleInputChange('province', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Enter province"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Municipality</label>
                                        <input
                                            type="text"
                                            value={formData.municipality}
                                            onChange={(e) => handleInputChange('municipality', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Enter municipality"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Barangay</label>
                                        <input
                                            type="text"
                                            value={formData.barangay}
                                            onChange={(e) => handleInputChange('barangay', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Enter barangay"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Zip Code</label>
                                        <input
                                            type="text"
                                            value={formData.zipCode}
                                            onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder=""
                                        />
                                        <p className="text-red-500 text-sm mt-1"></p>
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Population</label>
                                        <input
                                            type="text"
                                            value={formData.population}
                                            onChange={(e) => handleInputChange('population', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder=""
                                        />
                                        <p className="text-red-500 text-sm mt-1"></p>
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
                                        <p className="text-yellow-400 text-sm mt-1">UPLOAD PDF FILE</p>
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

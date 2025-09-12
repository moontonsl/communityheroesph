import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function ApplyEvent() {
    const [formData, setFormData] = useState({
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventLocation: '',
        expectedParticipants: '',
        contactPerson: '',
        contactNumber: '',
        contactEmail: '',
        eventType: 'tournament',
        requirements: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Event application submitted:', formData);
        alert('Event application submitted successfully!');
    };

    return (
        <>
            <Head title="Apply Event">
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
                        <h1 className="text-5xl font-bold text-white mb-2">APPLY FOR EVENT</h1>
                        <p className="text-yellow-400 text-lg">Submit your event application for Community Heroes PH</p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-gray-200/0 backdrop-blur-sm rounded-4xl p-6 shadow-2xl border-4 border-gray-500">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* EVENT DETAILS Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4 text-left">EVENT DETAILS</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Event Name</label>
                                        <input
                                            type="text"
                                            value={formData.eventName}
                                            onChange={(e) => handleInputChange('eventName', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Enter event name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Event Type</label>
                                        <select
                                            value={formData.eventType}
                                            onChange={(e) => handleInputChange('eventType', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white focus:outline-none focus:border-yellow-300"
                                        >
                                            <option value="tournament">Tournament</option>
                                            <option value="workshop">Workshop</option>
                                            <option value="seminar">Seminar</option>
                                            <option value="community">Community Event</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Event Date</label>
                                        <input
                                            type="date"
                                            value={formData.eventDate}
                                            onChange={(e) => handleInputChange('eventDate', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Event Location</label>
                                        <input
                                            type="text"
                                            value={formData.eventLocation}
                                            onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Enter event location"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Expected Participants</label>
                                        <input
                                            type="number"
                                            value={formData.expectedParticipants}
                                            onChange={(e) => handleInputChange('expectedParticipants', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Number of participants"
                                            min="1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* CONTACT INFORMATION Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4 text-left">CONTACT INFORMATION</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Contact Person</label>
                                        <input
                                            type="text"
                                            value={formData.contactPerson}
                                            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Contact Number</label>
                                        <input
                                            type="tel"
                                            value={formData.contactNumber}
                                            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="+63 917 123 4567"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-white font-semibold mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.contactEmail}
                                            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="contact@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* EVENT DESCRIPTION Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4 text-left">EVENT DESCRIPTION</h2>
                                <div className="ml-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Event Description</label>
                                        <textarea
                                            value={formData.eventDescription}
                                            onChange={(e) => handleInputChange('eventDescription', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Describe your event in detail..."
                                            rows={4}
                                            required
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-white font-semibold mb-2">Special Requirements</label>
                                        <textarea
                                            value={formData.requirements}
                                            onChange={(e) => handleInputChange('requirements', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-300"
                                            placeholder="Any special requirements or notes..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center space-x-4 pt-4">
                                <Link
                                    href="/Transaction"
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl border-2 border-gray-400 text-lg transition-colors duration-200"
                                >
                                    CANCEL
                                </Link>
                                <button
                                    type="submit"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-xl border-2 border-yellow-400 text-lg transition-colors duration-200"
                                >
                                    SUBMIT APPLICATION
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

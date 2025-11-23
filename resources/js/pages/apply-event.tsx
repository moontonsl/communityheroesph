import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import Header from '@/pages/partials/header';
import { SharedData } from '@/types';

interface BarangaySubmission {
    id: number;
    barangay_name: string;
    municipality_name: string;
    province_name: string;
    region_name: string;
    tier: string;
    successful_events_count: number;
}

interface ApplyEventProps {
    approvedBarangays: BarangaySubmission[];
}

export default function ApplyEvent({ approvedBarangays }: ApplyEventProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    
    // Debug logging
    console.log('=== APPLY EVENT DEBUG ===');
    console.log('approvedBarangays:', approvedBarangays);
    console.log('approvedBarangays type:', typeof approvedBarangays);
    console.log('approvedBarangays length:', approvedBarangays?.length);
    console.log('user:', user);
    console.log('=== END DEBUG ===');
    
    const [formData, setFormData] = useState({
        barangaySubmissionId: '',
        eventName: '',
        eventDescription: '',
        eventDate: '',
        campaign: '',
        eventLocation: '',
        expectedParticipants: '',
        eventType: '',
        contactPerson: user.name,
        contactNumber: user.phone || '',
        contactEmail: user.email,
        requirements: '',
        proposalFile: null as File | null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            proposalFile: file
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log('Starting form submission...', formData);
            
            // First upload the proposal file if it exists
            let proposalFilePath = '';
            let proposalFileName = '';
            
            if (formData.proposalFile) {
                console.log('Uploading proposal file:', formData.proposalFile.name);
                const formDataFile = new FormData();
                formDataFile.append('proposal_file', formData.proposalFile);
                // CSRF token is automatically added by configured axios instance
                
                const uploadResponse = await axios.post('/api/upload-proposal', formDataFile, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                
                console.log('Upload response status:', uploadResponse.status);
                const uploadResult = uploadResponse.data;
                console.log('Upload result:', uploadResult);
                
                if (!uploadResult.success) {
                    throw new Error(uploadResult.message || 'Failed to upload proposal file');
                }
                
                proposalFilePath = uploadResult.file_path;
                proposalFileName = uploadResult.file_name;
                console.log('File uploaded successfully:', proposalFilePath);
            } else {
                throw new Error('Please upload a proposal PDF file');
            }

            const eventData = {
                barangay_submission_id: formData.barangaySubmissionId,
                event_name: formData.eventName,
                event_description: formData.eventDescription,
                event_date: formData.eventDate,
                campaign: formData.campaign,
                event_location: formData.eventLocation,
                expected_participants: parseInt(formData.expectedParticipants),
                event_type: formData.eventType,
                contact_person: formData.contactPerson,
                contact_number: formData.contactNumber,
                contact_email: formData.contactEmail,
                requirements: formData.requirements,
                proposal_file_path: proposalFilePath,
                proposal_file_name: proposalFileName
            };
            
            console.log('Submitting event data:', eventData);
            // CSRF token is automatically added by configured axios instance
            
            const response = await axios.post('/api/apply-event', eventData);
            
            console.log('Event submission response status:', response.status);
            const result = response.data;
            console.log('Event submission result:', result);

            if (result.success) {
                alert('Event application submitted successfully!');
                // Reset form
                setFormData({
                    barangaySubmissionId: '',
                    eventName: '',
                    eventDescription: '',
                    eventDate: '',
                    campaign: '',
                    eventLocation: '',
                    expectedParticipants: '',
                    eventType: '',
                    contactPerson: user.name,
                    contactNumber: user.phone || '',
                    contactEmail: user.email,
                    requirements: '',
                    proposalFile: null
                });
            } else {
                // Handle validation errors
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat();
                    alert('Validation Error:\n' + errorMessages.join('\n'));
                } else {
                    alert('Error: ' + result.message);
                }
            }
        } catch (error) {
            console.error('Event submission error:', error);
            alert('Error submitting event application: ' + (error instanceof Error ? error.message : 'Please try again.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Apply Event">
                 
            </Head>
            
            <Header />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center py-12 px-4 relative overflow-hidden welcome-background">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                                        radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)`,
                    }}></div>
                </div>
                
                <div className="w-full max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-block">
                            <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-gradient">
                                APPLY FOR EVENT
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-gray-300 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                            Submit your event application for Community Heroes PH and bring gaming excitement to your barangay
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-up">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-white">Barangay Selection</h2>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                        Barangay Location
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.barangaySubmissionId}
                                            onChange={(e) => handleInputChange('barangaySubmissionId', e.target.value)}
                                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white 
                                                focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                transition-all duration-300 hover:bg-white/15"
                                            required
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                color: 'white',
                                                WebkitAppearance: 'none',
                                                MozAppearance: 'none',
                                                appearance: 'none'
                                            }}
                                        >
                                            <option value="">Select a barangay...</option>
                                            {approvedBarangays.map((barangay) => (
                                                <option key={barangay.id} value={barangay.id} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                                                    {barangay.barangay_name}, {barangay.municipality_name}, {barangay.province_name} ({barangay.tier})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {approvedBarangays.length === 0 && (
                                        <p className="text-red-400 text-sm flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            No approved barangays available. Please ensure your barangay registration is approved first.
                                        </p>
                                    )}
                                    {approvedBarangays.length > 0 && (
                                        <p className="text-yellow-400/80 text-sm flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            You can only apply for events in your approved barangays.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-white">Event Details</h2>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Event Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.eventName}
                                                onChange={(e) => handleInputChange('eventName', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15"
                                                placeholder="Enter event name"
                                                required
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Event Type
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.eventType}
                                                onChange={(e) => handleInputChange('eventType', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none'
                                                }}
                                            >
                                                <option value="tournament" style={{ backgroundColor: '#1f2937', color: 'white' }}>Tournament</option>
                                                <option value="workshop" style={{ backgroundColor: '#1f2937', color: 'white' }}>Workshop</option>
                                                <option value="seminar" style={{ backgroundColor: '#1f2937', color: 'white' }}>Seminar</option>
                                                <option value="community" style={{ backgroundColor: '#1f2937', color: 'white' }}>Community Event</option>
                                                <option value="other" style={{ backgroundColor: '#1f2937', color: 'white' }}>Other</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Event Date
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={formData.eventDate}
                                                onChange={(e) => handleInputChange('eventDate', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15"
                                                required
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Campaign
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.campaign}
                                                onChange={(e) => handleInputChange('campaign', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15"
                                                required
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none'
                                                }}
                                            >
                                                <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select Campaign</option>
                                                <option value="Next 2025" style={{ backgroundColor: '#1f2937', color: 'white' }}>Next 2025</option>
                                                <option value="9th Anniversary" style={{ backgroundColor: '#1f2937', color: 'white' }}>9th Anniversary</option>
                                                <option value="Carnival 2025" style={{ backgroundColor: '#1f2937', color: 'white' }}>Carnival 2025</option>
                                                <option value="Golden Month 2026" style={{ backgroundColor: '#1f2937', color: 'white' }}>Golden Month 2026</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Event Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.eventLocation}
                                            onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                                            placeholder="Enter event location..."
                                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white 
                                                placeholder-gray-400
                                                focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                transition-all duration-300 hover:bg-white/15"
                                            required
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                color: 'white'
                                            }}
                                        />
                                        <p className="text-yellow-400/80 text-xs flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Enter the specific location where the event will take place
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Expected Participants
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={formData.expectedParticipants}
                                                onChange={(e) => handleInputChange('expectedParticipants', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15"
                                                placeholder="Number of participants"
                                                min="1"
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-white">Event Description</h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Event Description
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                value={formData.eventDescription}
                                                onChange={(e) => handleInputChange('eventDescription', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15 resize-none"
                                                placeholder="Describe your event in detail..."
                                                rows={4}
                                                required
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none'
                                                }}
                                            />
                                        </div>
                                        <p className="text-yellow-400/80 text-xs flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Provide a detailed description of your event
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Special Requirements
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                value={formData.requirements}
                                                onChange={(e) => handleInputChange('requirements', e.target.value)}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                    transition-all duration-300 hover:bg-white/15 resize-none"
                                                placeholder="Any special requirements or notes..."
                                                rows={3}
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none'
                                                }}
                                            />
                                        </div>
                                        <p className="text-yellow-400/80 text-xs flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Optional: List any special requirements or additional notes
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                    <h2 className="text-3xl font-bold text-white">Proposal Document</h2>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                        Upload Proposal PDF
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white 
                                                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold 
                                                file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 
                                                focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                transition-all duration-300 hover:bg-white/15"
                                            required
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
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-yellow-400/80 text-xs flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Please upload a PDF file containing your event proposal (max 10MB)
                                    </p>
                                    {formData.proposalFile && (
                                        <p className="text-green-400 text-sm flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Selected: {formData.proposalFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-center space-x-6 pt-8">
                                <Link
                                    href="/Transaction"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-bold text-lg 
                                        hover:bg-white/20 hover:border-white/30 transition-all duration-300 
                                        focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                                >
                                    CANCEL
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 
                                        disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed 
                                        text-white font-bold text-lg rounded-xl border border-yellow-400/50 
                                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 
                                        shadow-lg hover:shadow-xl disabled:shadow-none"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            SUBMITTING...
                                        </span>
                                    ) : (
                                        'SUBMIT APPLICATION'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

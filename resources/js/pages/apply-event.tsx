import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

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
    const [formData, setFormData] = useState({
        barangaySubmissionId: '',
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventLocation: '',
        expectedParticipants: '',
        eventType: '',
        contactPerson: '',
        contactNumber: '',
        contactEmail: '',
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
                
                const uploadResponse = await fetch('/api/upload-proposal', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: formDataFile
                });
                
                console.log('Upload response status:', uploadResponse.status);
                const uploadResult = await uploadResponse.json();
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
            
            const response = await fetch('/api/apply-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(eventData)
            });

            console.log('Event submission response status:', response.status);
            const result = await response.json();
            console.log('Event submission result:', result);

            if (result.success) {
                alert('Event application submitted successfully!');
                // Reset form
                setFormData({
                    barangaySubmissionId: '',
                    eventName: '',
                    eventDescription: '',
                    eventDate: '',
                    eventLocation: '',
                    expectedParticipants: '',
                    eventType: '',
                    contactPerson: '',
                    contactNumber: '',
                    contactEmail: '',
                    requirements: '',
                    proposalFile: null
                });
            } else {
                alert('Error: ' + result.message);
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
                            {/* BARANGAY SELECTION Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4 text-left">SELECT BARANGAY</h2>
                                <div className="ml-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Barangay Location</label>
                                        <select
                                            value={formData.barangaySubmissionId}
                                            onChange={(e) => handleInputChange('barangaySubmissionId', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white focus:outline-none focus:border-yellow-300"
                                            required
                                        >
                                            <option value="">Select a barangay...</option>
                                            {approvedBarangays.map((barangay) => (
                                                <option key={barangay.id} value={barangay.id}>
                                                    {barangay.barangay_name}, {barangay.municipality_name}, {barangay.province_name} ({barangay.tier})
                                                </option>
                                            ))}
                                        </select>
                                        {approvedBarangays.length === 0 && (
                                            <p className="text-red-400 text-sm mt-2">
                                                No approved barangays available. Please ensure your barangay registration is approved first.
                                            </p>
                                        )}
                                        {approvedBarangays.length > 0 && (
                                            <p className="text-yellow-300 text-sm mt-2">
                                                You can only apply for events in your approved barangays.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

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
                                        <select
                                            value={formData.eventLocation}
                                            onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white focus:outline-none focus:border-yellow-300"
                                            required
                                        >
                                            <option value="">Select event location...</option>
                                            {approvedBarangays.map((barangay) => (
                                                <option key={barangay.id} value={`${barangay.barangay_name}, ${barangay.municipality_name}, ${barangay.province_name}`}>
                                                    {barangay.barangay_name}, {barangay.municipality_name}, {barangay.province_name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-yellow-300 text-sm mt-2">
                                            Select from your approved barangays only.
                                        </p>
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

                            {/* PROPOSAL FILE UPLOAD Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4 text-left">PROPOSAL DOCUMENT</h2>
                                <div className="ml-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-2">Upload Proposal PDF</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="w-full px-3 py-2 bg-gray-700 border-2 border-yellow-400 rounded-4xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 focus:outline-none focus:border-yellow-300"
                                            required
                                        />
                                        <p className="text-yellow-300 text-sm mt-2">
                                            Please upload a PDF file containing your event proposal (max 10MB).
                                        </p>
                                        {formData.proposalFile && (
                                            <p className="text-green-400 text-sm mt-1">
                                                Selected: {formData.proposalFile.name}
                                            </p>
                                        )}
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
                                    disabled={isSubmitting}
                                    className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl border-2 border-yellow-400 text-lg transition-colors duration-200"
                                >
                                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

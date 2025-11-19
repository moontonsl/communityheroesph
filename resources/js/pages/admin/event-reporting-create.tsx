import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import axios from '@/lib/axios';
import Header from '@/pages/partials/header';

interface EventData {
    id: number;
    event_id: string;
    event_name: string;
    event_description: string;
    event_date: string;
    event_location: string;
    campaign: string;
    expected_participants: number;
    status: string;
    barangay_submission?: {
        barangay_name: string;
        municipality_name: string;
        province_name: string;
        region_name: string;
    };
    appliedBy?: {
        name: string;
    };
    assignedUser?: {
        name: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    role: {
        id: number;
        name: string;
        slug: string;
        description: string;
    };
}

interface EventReportingCreateProps {
    events: EventData[];
    user: User;
}

export default function EventReportingCreate({ events, user }: EventReportingCreateProps) {
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<{path: string, name: string} | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        event_id: '',
        post_event_file_path: '',
        post_event_file_name: ''
    });

    const handleEventSelect = (event: EventData) => {
        setSelectedEvent(event);
        setData('event_id', event.id.toString());
    };

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('post_event_file', file);
            // CSRF token is automatically added by configured axios instance

            const response = await axios.post('/api/upload-post-event-file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data;

            if (result.success) {
                setUploadedFile({
                    path: result.file_path,
                    name: result.file_name
                });
                setData('post_event_file_path', result.file_path);
                setData('post_event_file_name', result.file_name);
            } else {
                alert('File upload failed: ' + result.message);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('File upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setData('post_event_file_path', '');
        setData('post_event_file_name', '');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/event-reporting', {
            onSuccess: () => {
                // Redirect to reports list or show success message
                window.location.href = '/event-reporting';
            }
        });
    };

    return (
        <>
            <Head title="Create Event Report" />
            <Header />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden welcome-background">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                                        radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)`,
                    }}></div>
                </div>
                
                <div className="container mx-auto px-4 py-8 relative z-10">
                    
                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-block">
                            <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-gradient">
                                CREATE EVENT REPORT
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-gray-300 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                            Submit a comprehensive post-event report with achievements and lessons learned
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-up">
                            
                            {/* Event Selection */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white mb-6">Select Event</h3>
                                
                                {!selectedEvent ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {events.map((event) => (
                                            <div 
                                                key={event.id} 
                                                onClick={() => handleEventSelect(event)}
                                                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-bold text-lg mb-2">{event.event_name}</h4>
                                                        <p className="text-gray-300 text-sm mb-2">{event.event_location}</p>
                                                        <p className="text-gray-400 text-xs">{new Date(event.event_date).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                        event.status === 'APPROVED' ? 'text-green-400 bg-green-400/20' :
                                                        event.status === 'COMPLETED' ? 'text-green-400 bg-green-400/20' :
                                                        event.status === 'CLEARED' ? 'text-blue-400 bg-blue-400/20' : 'text-gray-400 bg-gray-400/20'
                                                    }`}>
                                                        {event.status}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-gray-300 text-sm">
                                                    <div className="mb-1">
                                                        <span className="text-gray-400">Campaign:</span> {event.campaign}
                                                    </div>
                                                    <div className="mb-1">
                                                        <span className="text-gray-400">Barangay:</span> {event.barangay_submission?.barangay_name || 'N/A'}
                                                    </div>
                                                    <div className="mb-1">
                                                        <span className="text-gray-400">Expected Participants:</span> {event.expected_participants}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="text-white font-bold text-lg mb-2">{selectedEvent.event_name}</h4>
                                                <p className="text-gray-300 text-sm mb-2">{selectedEvent.event_location}</p>
                                                <p className="text-gray-400 text-xs">{new Date(selectedEvent.event_date).toLocaleDateString()}</p>
                                            </div>
                                            <button 
                                                onClick={() => setSelectedEvent(null)}
                                                className="text-gray-400 hover:text-white transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Report Form */}
                            {selectedEvent && (
                                <form onSubmit={submit} className="space-y-8">
                                    
                                    {/* Event Information Display */}
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                        <h4 className="text-white font-bold text-lg mb-4">Event Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
                                            <div>
                                                <span className="text-gray-400">Event Name:</span> {selectedEvent.event_name}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Date:</span> {new Date(selectedEvent.event_date).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Location:</span> {selectedEvent.event_location}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Campaign:</span> {selectedEvent.campaign}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Expected Participants:</span> {selectedEvent.expected_participants}
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Barangay:</span> {selectedEvent.barangay_submission?.barangay_name || 'N/A'}
                                            </div>
                                        </div>
                                    </div>


                                    {/* Post Event File Upload */}
                                    <div>
                                        <label className="block text-white font-semibold mb-2">
                                            Post Event Report File (PDF)
                                        </label>
                                        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/30 transition-colors">
                                            {uploadedFile ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-center space-x-2 text-green-400">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="font-semibold">File uploaded successfully</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{uploadedFile.name}</p>
                                                    <button
                                                        type="button"
                                                        onClick={removeFile}
                                                        className="text-red-400 hover:text-red-300 text-sm"
                                                    >
                                                        Remove file
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-white font-semibold">Upload Post Event Report</p>
                                                        <p className="text-gray-400 text-sm">PDF files only, max 10MB</p>
                                                    </div>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept=".pdf"
                                                        onChange={handleFileChange}
                                                        disabled={isUploading}
                                                        className="hidden"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={isUploading}
                                                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        {isUploading ? 'Uploading...' : 'Choose File'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {errors.post_event_file_path && (
                                            <p className="text-red-400 text-sm mt-1">{errors.post_event_file_path}</p>
                                        )}
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex justify-between items-center pt-6">
                                        <Link 
                                            href="/event-reporting"
                                            className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                                        >
                                            ← Back to Reports
                                        </Link>
                                        
                                        <div className="flex space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Save as draft - just submit normally, status will be set to DRAFT by default
                                                    post('/event-reporting');
                                                }}
                                                disabled={processing}
                                                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                Save as Draft
                                            </button>
                                            
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                                            >
                                                {processing ? 'Creating...' : 'Create Report'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

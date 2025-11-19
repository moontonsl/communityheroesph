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

interface ReportData {
    id: number;
    report_id: string;
    event_id: number;
    event_name: string;
    event_description: string;
    event_date: string;
    event_location: string;
    campaign: string;
    actual_participants: number;
    event_summary: string;
    achievements: string;
    challenges_faced: string;
    lessons_learned: string;
    recommendations: string;
    post_event_file_path?: string;
    post_event_file_name?: string;
    status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED';
    admin_notes?: string;
    created_at: string;
    updated_at: string;
    event?: EventData;
    reportedBy?: {
        name: string;
    };
    reviewedBy?: {
        name: string;
    };
    approvedBy?: {
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

interface EventReportingEditProps {
    report: ReportData;
    user: User;
}

export default function EventReportingEdit({ report, user }: EventReportingEditProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<{path: string, name: string} | null>(
        report.post_event_file_path ? {
            path: report.post_event_file_path,
            name: report.post_event_file_name || 'Post Event Report.pdf'
        } : null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, put, processing, errors } = useForm({
        post_event_file_path: report.post_event_file_path || '',
        post_event_file_name: report.post_event_file_name || ''
    });

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
        put(`/event-reporting/${report.id}`, {
            onSuccess: () => {
                window.location.href = `/event-reporting/${report.id}`;
            }
        });
    };

    return (
        <>
            <Head title={`Edit Event Report - ${report.report_id}`} />
            <Header />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
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
                                EDIT EVENT REPORT
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-gray-300 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                            Report ID: {report.report_id}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-up">
                            
                            {/* Event Information Display */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
                                <h4 className="text-white font-bold text-lg mb-4">Event Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
                                    <div>
                                        <span className="text-gray-400">Event Name:</span> {report.event_name}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Date:</span> {new Date(report.event_date).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Location:</span> {report.event_location}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Campaign:</span> {report.campaign}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Expected Participants:</span> {report.event?.expected_participants || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Barangay:</span> {report.event?.barangay_submission?.barangay_name || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-8">
                                
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
                                                <div className="flex justify-center space-x-4">
                                                    <a
                                                        href={`/storage/${uploadedFile.path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                                                    >
                                                        View Current File
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={removeFile}
                                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                                                    >
                                                        Remove File
                                                    </button>
                                                </div>
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
                                    {errors.post_event_file && (
                                        <p className="text-red-400 text-sm mt-1">{errors.post_event_file}</p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-between items-center pt-6">
                                    <Link 
                                        href={`/event-reporting/${report.id}`}
                                        className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                                    >
                                        ← Back to Report
                                    </Link>
                                    
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                                        >
                                            {processing ? 'Updating...' : 'Update Report'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

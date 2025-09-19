import React, { useState } from 'react';
import ApprovalModal from './approvalModal';
import ReturnModal from './returnModal';
import DeleteModal from './deleteModal';
import styles from '@/components/CSS/CHTransaction.module.css';

interface EventData {
    id: number;
    event_id: string;
    barangay_submission_id: number;
    applied_by: number;
    event_name: string;
    event_description: string;
    event_date: string;
    event_start_time: string;
    event_end_time: string;
    event_location: string;
    expected_participants: number;
    event_type: string;
    contact_person: string;
    contact_number: string;
    contact_email: string;
    requirements: string;
    proposal_file_path: string;
    proposal_file_name: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
    rejection_reason?: string;
    admin_notes?: string;
    approved_by?: number;
    approved_at?: string;
    reviewed_by?: number;
    reviewed_at?: string;
    is_successful?: boolean;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    barangaySubmission?: {
        id: number;
        barangay_name: string;
        municipality_name: string;
        province_name: string;
        region_name: string;
        moa_file_path: string;
        moa_file_name: string;
        region?: {
            id: number;
            name: string;
            code: string;
        };
        province?: {
            id: number;
            name: string;
            code: string;
        };
        municipality?: {
            id: number;
            name: string;
            code: string;
        };
        barangay?: {
            id: number;
            name: string;
            psgc_code: string;
            population?: number;
        };
    };
    appliedBy?: {
        id: number;
        name: string;
        email: string;
    };
    approvedBy?: {
        id: number;
        name: string;
        email: string;
    };
    reviewedBy?: {
        id: number;
        name: string;
        email: string;
    };
}

interface ViewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventData: EventData | null;
    onSuccess?: () => void;
}

export default function ViewEventModal({ isOpen, onClose, eventData, onSuccess }: ViewEventModalProps) {
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openApprovalModal = () => setIsApprovalModalOpen(true);
    const closeApprovalModal = () => setIsApprovalModalOpen(false);

    const openReturnModal = () => setIsReturnModalOpen(true);
    const closeReturnModal = () => setIsReturnModalOpen(false);

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!eventData) return null;

    console.log('Event Data:', eventData);
    console.log('Barangay Submission (camelCase):', eventData.barangaySubmission);
    console.log('Barangay Submission (snake_case):', (eventData as any).barangay_submission);
    console.log('Barangay Name:', eventData.barangaySubmission?.barangay_name);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'text-green-400 bg-green-400/20';
            case 'PENDING':
                return 'text-yellow-400 bg-yellow-400/20';
            case 'REJECTED':
                return 'text-red-400 bg-red-400/20';
            case 'COMPLETED':
                return 'text-blue-400 bg-blue-400/20';
            case 'CANCELLED':
                return 'text-gray-400 bg-gray-400/20';
            default:
                return 'text-gray-400 bg-gray-400/20';
        }
    };

    return (
        <>
            {/* Modern Modal Overlay */}
            <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
                onClick={handleOverlayClick}
            >
                {/* Modern Modal Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 max-w-4xl w-full max-h-[85vh] overflow-hidden animate-slide-up relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-pink-500/10 to-blue-500/10 rounded-full blur-xl"></div>
                    
                    {/* Modern Modal Header */}
                    <div className="flex justify-between items-center p-6 border-b border-white/20 relative z-10">
                        <div className="flex items-center space-x-3">
                            <div className="relative group">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md group-hover:scale-105 transition-transform duration-300">
                                    EVENT
                                </div>
                                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-0.5 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                                <div>
                                    <h2 className="text-white text-xl font-bold">Event Information</h2>
                                    <p className="text-gray-400 text-xs mt-0.5">Event ID: {eventData.event_id}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Modern Modal Content */}
                    <div className="p-6 overflow-y-auto max-h-[65vh] relative z-10">
                        {/* Modern Event Status */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-0.5 h-5 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
                                    <h3 className="text-white text-lg font-bold">Event Status</h3>
                                </div>
                                <div className="relative group">
                                    <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md group-hover:scale-105 transition-transform duration-300 ${getStatusColor(eventData.status)}`}>
                                        {eventData.status}
                                    </span>
                                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Modern Event Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Event Name</label>
                                    <p className="text-white px-2 text-lg font-bold mt-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{eventData.event_name}</p>
                                </div>
                                
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Event Type</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">{eventData.event_type}</p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Event Date</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">{formatDate(eventData.event_date)}</p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Time</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">
                                        {formatTime(eventData.event_start_time)} - {formatTime(eventData.event_end_time)}
                                    </p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Location</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">{eventData.event_location}</p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Expected Participants</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">{eventData.expected_participants}</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Barangay</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">
                                        {eventData.barangaySubmission?.barangay_name || 
                                         (eventData as any).barangay_submission?.barangay_name ||
                                         eventData.barangaySubmission?.barangay?.name || 
                                         (eventData as any).barangay_submission?.barangay?.name ||
                                         'N/A'}
                                    </p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Municipality</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">
                                        {eventData.barangaySubmission?.municipality_name || 
                                         (eventData as any).barangay_submission?.municipality_name ||
                                         eventData.barangaySubmission?.municipality?.name || 
                                         (eventData as any).barangay_submission?.municipality?.name ||
                                         'N/A'}
                                    </p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Province</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">
                                        {eventData.barangaySubmission?.province_name || 
                                         (eventData as any).barangay_submission?.province_name ||
                                         eventData.barangaySubmission?.province?.name || 
                                         (eventData as any).barangay_submission?.province?.name ||
                                         'N/A'}
                                    </p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Contact Person</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">{eventData.contact_person}</p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Contact Number</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">{eventData.contact_number}</p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Contact Email</label>
                                    <p className="text-white px-2 text-base font-semibold mt-1">{eventData.contact_email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modern Event Description */}
                        <div className="mb-6">
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-0.5 h-5 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
                                    <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Event Description</label>
                                </div>
                                <p className="text-white px-2 leading-relaxed text-sm">{eventData.event_description}</p>
                            </div>
                        </div>

                        {/* Modern Requirements */}
                        {eventData.requirements && (
                            <div className="mb-6">
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="w-0.5 h-5 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full"></div>
                                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Requirements</label>
                                    </div>
                                    <p className="text-white leading-relaxed text-sm">{eventData.requirements}</p>
                                </div>
                            </div>
                        )}

                        {/* Modern Admin Notes */}
                        {eventData.admin_notes && (
                            <div className="mb-6">
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="w-0.5 h-5 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full"></div>
                                        <label className="text-gray-400 text-xs uppercase tracking-wider font-medium">Admin Notes</label>
                                    </div>
                                    <p className="text-white leading-relaxed text-sm">{eventData.admin_notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Modern Rejection Reason */}
                        {eventData.rejection_reason && (
                            <div className="mb-6">
                                <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <div className="w-0.5 h-5 bg-gradient-to-b from-red-400 to-pink-400 rounded-full"></div>
                                        <label className="text-red-400 text-xs uppercase tracking-wider font-medium">Rejection Reason</label>
                                    </div>
                                    <p className="text-red-300 leading-relaxed text-sm">{eventData.rejection_reason}</p>
                                </div>
                            </div>
                        )}

                        {/* Modern Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            {/* View Proposal Button */}
                            {eventData.proposal_file_path && (
                                <button
                                    onClick={() => window.open(`/storage/${eventData.proposal_file_path}`, '_blank')}
                                    className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-white/20 
                                        rounded-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 
                                        hover:bg-gradient-to-r hover:from-green-500/30 hover:to-emerald-500/30 hover:scale-105 
                                        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                                >
                                    <span className="relative z-10 flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                                        </svg>
                                        <span>View Proposal</span>
                                    </span>
                                </button>
                            )}

                            {/* Modern Action buttons based on status */}
                            {eventData.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={openApprovalModal}
                                        className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 
                                            rounded-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 
                                            hover:scale-105
                                            focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                                    >
                                        <span className="relative z-10 flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Approve</span>
                                        </span>
                                    </button>
                                    <button
                                        onClick={openReturnModal}
                                        className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 
                                            rounded-lg shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 
                                            hover:scale-105
                                            focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                                    >
                                        <span className="relative z-10 flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                            </svg>
                                            <span>Return</span>
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Modern Close Button */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={onClose}
                                className="group relative inline-flex items-center justify-center px-6 py-2 text-xs font-bold text-white bg-gradient-to-r from-gray-500/20 to-slate-500/20 backdrop-blur-sm border border-white/20 
                                    rounded-lg shadow-lg hover:shadow-gray-500/25 transition-all duration-300 
                                    hover:bg-gradient-to-r hover:from-gray-500/30 hover:to-slate-500/30 hover:scale-105 
                                    focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Close</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval Modal */}
            <ApprovalModal 
                isOpen={isApprovalModalOpen}
                onClose={closeApprovalModal}
                barangayName={eventData.barangaySubmission?.barangay_name || (eventData as any).barangay_submission?.barangay_name || 'Unknown'}
                submissionId={eventData.id}
                type="event"
                onSuccess={onSuccess}
            />

            {/* Return Modal */}
            <ReturnModal 
                isOpen={isReturnModalOpen}
                onClose={closeReturnModal}
                barangayName={eventData.barangaySubmission?.barangay_name || (eventData as any).barangay_submission?.barangay_name || 'Unknown'}
                submissionId={eventData.id}
                type="event"
                onSuccess={onSuccess}
            />

            {/* Delete Modal */}
            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                barangayName={eventData.barangaySubmission?.barangay_name || (eventData as any).barangay_submission?.barangay_name || 'Unknown'}
                submissionId={eventData.id}
            />
        </>
    );
}

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
    campaign: string;
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
    status: 'PENDING' | 'PRE_APPROVED' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED' | 'CLEARED';
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

interface ViewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventData: EventData | null;
    onSuccess?: () => void;
    user?: User;
}

export default function ViewEventModal({ isOpen, onClose, eventData, onSuccess, user }: ViewEventModalProps) {
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openApprovalModal = () => setIsApprovalModalOpen(true);
    const closeApprovalModal = () => setIsApprovalModalOpen(false);

    const openReturnModal = () => setIsReturnModalOpen(true);
    const closeReturnModal = () => setIsReturnModalOpen(false);

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const handleReject = async () => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const response = await fetch(`/api/admin/events/${eventData?.id}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    rejection_reason: reason,
                    admin_notes: 'Event rejected by Super Admin A'
                })
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Event rejected successfully!');
                onSuccess?.();
                onClose();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Rejection error:', error);
            alert('Error rejecting event. Please try again.');
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!eventData) return null;

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
            case 'PRE_APPROVED':
                return 'text-blue-400 bg-blue-400/20';
            case 'PENDING':
                return 'text-yellow-400 bg-yellow-400/20';
            case 'REJECTED':
                return 'text-red-400 bg-red-400/20';
            case 'COMPLETED':
                return 'text-blue-400 bg-blue-400/20';
            case 'CANCELLED':
                return 'text-gray-400 bg-gray-400/20';
            case 'CLEARED':
                return 'text-gray-400 bg-gray-400/20';
            default:
                return 'text-gray-400 bg-gray-400/20';
        }
    };

    return (
        <>
            {/* Modal Overlay */}
            <div 
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={handleOverlayClick}
            >
                {/* Modal Card */}
                <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <button className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                                    {eventData.status}
                                </button>
                                <div>
                                    <h2 className="text-white text-xl font-bold">Event Information</h2>
                                    <p className="text-gray-300 text-sm">Event ID: {eventData.event_id}</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[75vh]">
                        {/* General Information */}
                        <div className="mb-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <h3 className="text-white text-lg font-bold">INFORMATION</h3>
                                <div className="flex-1 h-px bg-purple-500"></div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <p className="text-gray-300 text-sm">10-digit PSGC</p>
                                    <p className="text-white font-bold">{eventData.barangaySubmission?.barangay?.psgc_code || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-300 text-sm">Date Filed</p>
                                    <p className="text-white font-bold">{formatDate(eventData.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Applicant Details */}
                            <div className="bg-gray-700 rounded-xl p-6">
                                <h4 className="text-white text-lg font-bold mb-4">Applicant</h4>
                                
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-300 text-sm">Applicant</p>
                                        <p className="text-white font-bold">{eventData.appliedBy?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-300 text-sm">Role</p>
                                        <p className="text-white font-bold">{eventData.appliedBy?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-300 text-sm">Area</p>
                                        <p className="text-white font-bold">{eventData.barangaySubmission?.region_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-300 text-sm">Contact No</p>
                                        <p className="text-white font-bold">{eventData.contact_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-300 text-sm">Contact Email</p>
                                        <p className="text-white font-bold">{eventData.contact_email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Location and Event Details */}
                            <div className="space-y-6">
                                {/* Location Information */}
                                <div>
                                    <h4 className="text-white text-lg font-bold mb-4">INFORMATION</h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-300 text-sm">Barangay</p>
                                            <p className="text-white font-bold">
                                                {eventData.barangaySubmission?.barangay_name || 
                                                 (eventData as any).barangay_submission?.barangay_name || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-sm">Municipality/City</p>
                                            <p className="text-white font-bold">
                                                {eventData.barangaySubmission?.municipality_name || 
                                                 (eventData as any).barangay_submission?.municipality_name || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-sm">Province</p>
                                            <p className="text-white font-bold">
                                                {eventData.barangaySubmission?.province_name || 
                                                 (eventData as any).barangay_submission?.province_name || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-sm">Region</p>
                                            <p className="text-white font-bold">
                                                {eventData.barangaySubmission?.region_name || 
                                                 (eventData as any).barangay_submission?.region_name || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-sm">Population</p>
                                            <p className="text-white font-bold">
                                                {eventData.barangaySubmission?.barangay?.population?.toLocaleString() || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Information */}
                                <div>
                                    <h4 className="text-white text-lg font-bold mb-4">EVENT INFORMATION</h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-300 text-sm">Name of Event</p>
                                            <p className="text-white font-bold">{eventData.event_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-sm">Execution Date</p>
                                            <p className="text-white font-bold">{formatDate(eventData.event_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-sm">Campaign</p>
                                            <p className="text-white font-bold">{eventData.campaign || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-sm">Prop. # of Teams</p>
                                            <p className="text-white font-bold">{eventData.expected_participants}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-sm">Event Type</p>
                                            <p className="text-white font-bold">{eventData.event_type}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-300 text-sm">Location</p>
                                            <p className="text-white font-bold">{eventData.event_location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Event Description */}
                        {eventData.event_description && (
                            <div className="mt-6">
                                <h4 className="text-white text-lg font-bold mb-4">Event Description</h4>
                                <div className="bg-gray-700 rounded-xl p-4">
                                    <p className="text-white leading-relaxed">{eventData.event_description}</p>
                                </div>
                            </div>
                        )}

                        {/* Requirements */}
                        {eventData.requirements && (
                            <div className="mt-6">
                                <h4 className="text-white text-lg font-bold mb-4">Requirements</h4>
                                <div className="bg-gray-700 rounded-xl p-4">
                                    <p className="text-white leading-relaxed">{eventData.requirements}</p>
                                </div>
                            </div>
                        )}

                        {/* Admin Notes */}
                        {eventData.admin_notes && (
                            <div className="mt-6">
                                <h4 className="text-white text-lg font-bold mb-4">Admin Notes</h4>
                                <div className="bg-gray-700 rounded-xl p-4">
                                    <p className="text-white leading-relaxed">{eventData.admin_notes}</p>
                                </div>
                            </div>
                        )}

                        {/* Rejection Reason */}
                        {eventData.rejection_reason && (
                            <div className="mt-6">
                                <h4 className="text-white text-lg font-bold mb-4">Rejection Reason</h4>
                                <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4">
                                    <p className="text-red-300 leading-relaxed">{eventData.rejection_reason}</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons - Hide for Area Admin */}
                        {user?.role?.slug !== 'area-admin' && (
                            <div className="flex justify-end space-x-4 mt-8">
                                {/* View Proposal Button */}
                                {eventData.proposal_file_path && (
                                    <button
                                        onClick={() => window.open(`/storage/${eventData.proposal_file_path}`, '_blank')}
                                        className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                                    >
                                        VIEW PROPOSAL
                                    </button>
                                )}

                                {/* Community Lead Pre-Approval Button for PENDING events */}
                                {user?.role?.slug === 'community-lead' && eventData.status === 'PENDING' && (
                                    <button
                                        onClick={openApprovalModal}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                                    >
                                        PRE-APPROVE
                                    </button>
                                )}
                                
                                {/* Super Admin Final Approval Button for PRE_APPROVED events */}
                                {(user?.role?.slug === 'super-admin-a' || user?.role?.slug === 'super-admin') && eventData.status === 'PRE_APPROVED' && (
                                    <button
                                        onClick={openApprovalModal}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                                    >
                                        APPROVE MOA
                                    </button>
                                )}
                                
                                <button
                                    onClick={openReturnModal}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                                >
                                    REJECT
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={openDeleteModal}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                                >
                                    DELETE ENTRY
                                </button>
                            </div>
                        )}
                        
                        {/* Area Admin Message */}
                        {user?.role?.slug === 'area-admin' && (
                            <div className="mt-8">
                                <div className="text-center">
                                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
                                        <div className="flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-white text-lg font-semibold mb-2">View Only Mode</h3>
                                        <p className="text-blue-300 text-sm">
                                            As an Area Admin, you can only view your assigned event applications. 
                                            You cannot approve, reject, or delete your own event applications.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
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
                userRole={user?.role?.slug}
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
                type="event"
                onSuccess={() => {
                    closeDeleteModal();
                    onSuccess?.();
                    onClose();
                }}
            />
        </>
    );
}

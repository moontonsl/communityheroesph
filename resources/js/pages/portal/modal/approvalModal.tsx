import React, { useState } from 'react';
import axios from 'axios';

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayName?: string;
    submissionId?: number;
    onSuccess?: () => void;
    type?: 'submission' | 'event';
}

export default function ApprovalModal({ isOpen, onClose, barangayName = "Umali", submissionId, onSuccess, type = 'submission' }: ApprovalModalProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleApprove = async () => {
        if (!submissionId) return;
        
        setIsLoading(true);
        setError('');
        
        try {
            const endpoint = type === 'event' 
                ? `/api/admin/events/${submissionId}/approve`
                : `/api/admin/submissions/${submissionId}/approve`;
                
            await axios.post(endpoint, {
                admin_notes: `${type === 'event' ? 'Event' : 'Application'} approved by admin`,
                _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            });
            
            setShowSuccess(true);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to approve ${type}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToServices = () => {
        setShowSuccess(false);
        onClose();
    };

    const handleClose = () => {
        setShowSuccess(false);
        onClose();
    };

    return (
        <>
            {/* Modal Overlay */}
            <div 
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                onClick={handleOverlayClick}
            >
                {!showSuccess ? (
                    /* Confirmation Modal */
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <h2 className="text-white text-xl font-bold mb-4">APPROVAL</h2>
                            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                {type === 'event' 
                                    ? `ARE YOU SURE THE EVENT PROPOSAL SUBMITTED BY BARANGAY ${barangayName.toUpperCase()} MEETS ALL REQUIREMENTS AND CAN BE APPROVED?`
                                    : `ARE YOU SURE THE MOA AND SIGNED DOCUMENTS SUBMITTED BY BARANGAY ${barangayName.toUpperCase()} ARE COMPLETE AND MEET ALL REQUIREMENTS?`
                                }
                            </p>
                            
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button 
                                    onClick={handleClose}
                                    className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 order-2 sm:order-1"
                                >
                                    GO BACK
                                </button>
                                <button 
                                    onClick={handleApprove}
                                    disabled={isLoading}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg order-1 sm:order-2 ${
                                        isLoading 
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-green-500/25'
                                    }`}
                                >
                                    {isLoading ? 'APPROVING...' : 'APPROVE'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Success Modal */
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            
                            <h2 className="text-white text-lg font-bold mb-2">
                                {type === 'event' ? 'EVENT APPLICATION' : 'BARANGAY APPLICATION'} HAS BEEN
                            </h2>
                            <h3 className="text-white text-lg font-bold mb-6">
                                APPROVED
                            </h3>
                            
                            <button 
                                onClick={handleBackToServices}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                            >
                                BACK TO MY SERVICES
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
} 
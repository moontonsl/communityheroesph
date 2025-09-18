import React, { useState } from 'react';
import axios from 'axios';

interface ReturnModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayName?: string;
    submissionId?: number;
    onSuccess?: () => void;
    type?: 'submission' | 'event';
}

export default function ReturnModal({ isOpen, onClose, barangayName = "Umali", submissionId, onSuccess, type = 'submission' }: ReturnModalProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleReturn = async () => {
        if (!submissionId || !returnReason.trim()) return;
        
        setIsLoading(true);
        setError('');
        
        try {
            const endpoint = type === 'event' 
                ? `/api/admin/events/${submissionId}/reject`
                : `/api/admin/submissions/${submissionId}/reject`;
                
            await axios.post(endpoint, {
                rejection_reason: returnReason.trim(),
                admin_notes: `${type === 'event' ? 'Event' : 'Application'} rejected by admin`,
                _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            });
            
            setShowSuccess(true);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to reject ${type}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToServices = () => {
        setShowSuccess(false);
        setReturnReason('');
        onClose();
    };

    const handleClose = () => {
        setShowSuccess(false);
        setReturnReason('');
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
                            <h2 className="text-white text-xl font-bold mb-4">REJECT {type === 'event' ? 'EVENT' : 'APPLICATION'}</h2>
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                STATE YOUR REASON FOR REJECTION:
                            </p>
                            
                            {/* Reason Input */}
                            <div className="mb-6">
                                <textarea
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    placeholder={type === 'event' 
                                        ? "Event proposal does not meet requirements..." 
                                        : "Some parts of the MOA is not readable..."
                                    }
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg text-sm border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300 resize-none"
                                    rows={4}
                                />
                            </div>
                            
                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button 
                                    onClick={handleClose}
                                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg order-2 sm:order-1"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    onClick={handleReturn}
                                    disabled={!returnReason.trim() || isLoading}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg order-1 sm:order-2 ${
                                        returnReason.trim() && !isLoading
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-red-500/25' 
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isLoading ? 'REJECTING...' : `REJECT ${type === 'event' ? 'EVENT' : 'APPLICATION'}`}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Success Modal */
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            {/* Warning Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            
                            <h2 className="text-white text-lg font-bold mb-2">
                                {type === 'event' ? 'EVENT APPLICATION' : 'BARANGAY APPLICATION'} HAS BEEN
                            </h2>
                            <h3 className="text-white text-lg font-bold mb-6">
                                REJECTED!
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
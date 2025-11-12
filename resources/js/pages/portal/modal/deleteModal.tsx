import React, { useState } from 'react';
import axios from 'axios';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayName?: string;
    submissionId?: number;
    type?: 'submission' | 'event';
    onSuccess?: () => void;
}

export default function DeleteModal({ isOpen, onClose, barangayName = "Umali", submissionId, type = 'submission', onSuccess }: DeleteModalProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleDelete = async () => {
        if (!submissionId || !deleteReason.trim()) return;
        
        setIsLoading(true);
        setError('');
        
        try {
            const endpoint = type === 'event'
                ? `/api/admin/events/${submissionId}`
                : `/api/admin/submissions/${submissionId}`;

            await axios.delete(endpoint, {
                data: {
                    admin_notes: deleteReason.trim(),
                    _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            
            // Show success alert
            const itemType = type === 'event' ? 'Event' : 'Barangay Application';
            alert(`${itemType} has been successfully deleted from the database and Airtable!`);
            
            setShowSuccess(true);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete application');
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
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <h2 className="text-white text-xl font-bold mb-4">DELETE APPLICATION</h2>
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                ARE YOU SURE YOU WANT TO DELETE THIS ENTRY?
                            </p>
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                Once deleted, all the information in the database regarding 
                                this entry will be lost and cannot be recovered.
                            </p>
                            
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                Please provide a reason for deletion:
                            </p>
                            
                            {/* Reason Input */}
                            <div className="mb-6">
                                <textarea
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                    placeholder="Enter reason for deletion..."
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg text-sm border border-gray-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300 resize-none"
                                    rows={3}
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
                                    onClick={handleDelete}
                                    disabled={!deleteReason.trim() || isLoading}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg order-1 sm:order-2 ${
                                        deleteReason.trim() && !isLoading
                                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-red-500/25' 
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isLoading ? 'DELETING...' : 'DELETE'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            {/* Delete Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            
                            <h2 className="text-white text-lg font-bold mb-2">
                                {type === 'event' ? 'EVENT' : 'BARANGAY APPLICATION'} HAS BEEN
                            </h2>
                            <h3 className="text-white text-lg font-bold mb-6">
                                DELETED FROM THE DATABASE AND AIRTABLE!
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
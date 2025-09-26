import React, { useState } from 'react';
import axios from 'axios';

interface ApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayName?: string;
    submissionId?: number;
    onSuccess?: () => void;
    type?: 'submission' | 'event';
    userRole?: string; // Add user role to determine if MOA upload is required
    action?: 'approve' | 'renew'; // Add action type
}

export default function ApprovalModal({ isOpen, onClose, barangayName = "Umali", submissionId, onSuccess, type = 'submission', userRole, action = 'approve' }: ApprovalModalProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [moaFile, setMoaFile] = useState<File | null>(null);
    const [moaUploadError, setMoaUploadError] = useState('');

    // Check if MOA upload is required (Community Lead pre-approving)
    const isMoaUploadRequired = userRole === 'community-lead';

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setMoaFile(file);
        setMoaUploadError('');
        
        // Validate file type
        if (file && !file.type.includes('pdf')) {
            setMoaUploadError('Please upload a PDF file');
            setMoaFile(null);
        }
    };

    const handleApprove = async () => {
        if (!submissionId) return;
        
        // Validate MOA upload for Community Lead
        if (isMoaUploadRequired && !moaFile) {
            setMoaUploadError('Please upload the signed MOA PDF file');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setMoaUploadError('');
        
        try {
            let moaFilePath = '';
            let moaFileName = '';
            
            // Upload MOA file if required
            if (isMoaUploadRequired && moaFile) {
                const formData = new FormData();
                formData.append('moa_file', moaFile);
                formData.append('_token', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '');
                
                const uploadResponse = await axios.post('/api/upload-moa', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                
                if (!uploadResponse.data.success) {
                    throw new Error(uploadResponse.data.message || 'Failed to upload MOA file');
                }
                
                moaFilePath = uploadResponse.data.file_path;
                moaFileName = uploadResponse.data.file_name;
            }
            
            const endpoint = action === 'renew' 
                ? `/api/admin/submissions/${submissionId}/renew`
                : type === 'event' 
                    ? `/api/admin/events/${submissionId}/pre-approve`
                    : `/api/admin/submissions/${submissionId}/approve`;
                
            await axios.post(endpoint, {
                admin_notes: action === 'renew' 
                    ? 'MOA renewed for 1 year'
                    : `${type === 'event' ? 'Event' : 'Application'} pre-approved by Community Lead`,
                moa_file_path: moaFilePath,
                moa_file_name: moaFileName,
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
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <h2 className="text-white text-xl font-bold mb-4">
                                {action === 'renew' ? 'MOA RENEWAL' : 'APPROVAL'}
                            </h2>
                            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                {action === 'renew' 
                                    ? `ARE YOU SURE YOU WANT TO RENEW THE MOA FOR BARANGAY ${barangayName.toUpperCase()} FOR ANOTHER YEAR?`
                                    : type === 'event' 
                                        ? `ARE YOU SURE THE EVENT PROPOSAL SUBMITTED BY BARANGAY ${barangayName.toUpperCase()} MEETS ALL REQUIREMENTS AND CAN BE APPROVED?`
                                        : `ARE YOU SURE THE MOA AND SIGNED DOCUMENTS SUBMITTED BY BARANGAY ${barangayName.toUpperCase()} ARE COMPLETE AND MEET ALL REQUIREMENTS?`
                                }
                            </p>
                            
                            {/* MOA Upload Section for Community Lead */}
                            {isMoaUploadRequired && (
                                <div className="mb-6">
                                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                                        <div className="flex items-center mb-2">
                                            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="text-blue-400 font-semibold text-sm">MOA Upload Required</h3>
                                        </div>
                                        <p className="text-blue-300 text-xs">
                                            As a Community Lead, you must upload the signed MOA PDF file to complete the pre-approval process.
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className="block text-white font-semibold text-sm uppercase tracking-wider">
                                            Upload Signed MOA PDF
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white 
                                                    file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold 
                                                    file:bg-blue-500 file:text-white hover:file:bg-blue-400 
                                                    focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 
                                                    transition-all duration-300 hover:bg-white/15"
                                                required={isMoaUploadRequired}
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'none',
                                                    appearance: 'none'
                                                }}
                                            />
                                        </div>
                                        {moaFile && (
                                            <p className="text-green-400 text-sm flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Selected: {moaFile.name}
                                            </p>
                                        )}
                                        {moaUploadError && (
                                            <p className="text-red-400 text-sm flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {moaUploadError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            
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
                                    {isLoading 
                                        ? (action === 'renew' ? 'RENEWING...' : 'APPROVING...') 
                                        : (action === 'renew' ? 'RENEW' : 'APPROVE')
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            
                            <h2 className="text-white text-lg font-bold mb-2">
                                {action === 'renew' 
                                    ? 'MOA HAS BEEN' 
                                    : type === 'event' ? 'EVENT APPLICATION' : 'BARANGAY APPLICATION'} HAS BEEN
                            </h2>
                            <h3 className="text-white text-lg font-bold mb-6">
                                {action === 'renew' ? 'RENEWED' : 'APPROVED'}
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
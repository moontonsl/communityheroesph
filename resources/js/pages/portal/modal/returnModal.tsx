import React, { useState } from 'react';

interface ReturnModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayName?: string;
}

export default function ReturnModal({ isOpen, onClose, barangayName = "Umali" }: ReturnModalProps) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [returnReason, setReturnReason] = useState('');

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleReturn = () => {
        setShowSuccess(true);
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
                            <h2 className="text-white text-xl font-bold mb-4">RETURN APPLICATION</h2>
                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                STATE YOUR REASON:
                            </p>
                            
                            {/* Reason Input */}
                            <div className="mb-6">
                                <textarea
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    placeholder="Some parts of the MOA is not readable..."
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg text-sm border border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 resize-none"
                                    rows={4}
                                />
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button 
                                    onClick={handleClose}
                                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg order-2 sm:order-1"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    onClick={handleReturn}
                                    disabled={!returnReason.trim()}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg order-1 sm:order-2 ${
                                        returnReason.trim() 
                                            ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white hover:shadow-orange-500/25' 
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    RETURN APPLICATION
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Success Modal */
                    <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            {/* Warning Icon */}
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            
                            <h2 className="text-white text-lg font-bold mb-2">
                                BARANGAY APPLICATION HAS BEEN
                            </h2>
                            <h3 className="text-white text-lg font-bold mb-6">
                                RETURNED!
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
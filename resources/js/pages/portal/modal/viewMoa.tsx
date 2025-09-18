import React from 'react';

interface ViewMoaModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayName?: string;
    moaFile?: {
        path: string;
        name: string;
        url?: string;
    };
}

export default function ViewMoaModal({ isOpen, onClose, barangayName = "Umali", moaFile }: ViewMoaModalProps) {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            {/* Modal Overlay */}
            <div 
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                onClick={handleOverlayClick}
            >
                {/* Modal Card */}
                <div className="bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800">
                        <div>
                            <h2 className="text-white text-lg font-bold">MOA Document - {barangayName}</h2>
                            {moaFile && (
                                <p className="text-gray-400 text-sm mt-1">File: {moaFile.name}</p>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-white p-1"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Document Content */}
                    <div className="bg-white h-[70vh] overflow-y-auto p-8">
                        {moaFile ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                {/* PDF Viewer */}
                                <div className="w-full h-full border border-gray-300 rounded-lg overflow-hidden">
                                    <iframe
                                        src={`/storage/${moaFile.path}`}
                                        className="w-full h-full"
                                        title={`MOA Document - ${moaFile.name}`}
                                    />
                                </div>
                                
                                {/* Fallback for unsupported files */}
                                <div className="mt-4 text-center">
                                    <p className="text-gray-600 mb-4">
                                        If the document doesn't load properly, you can download it below.
                                    </p>
                                    <button 
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = `/storage/${moaFile.path}`;
                                            link.download = moaFile.name;
                                            link.click();
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Download MOA</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">No MOA Document Available</h3>
                                <p className="text-gray-600 mb-4">
                                    No MOA document has been uploaded for this barangay submission.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Please contact the applicant to request the MOA document.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 
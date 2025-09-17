import React, { useState } from 'react';
import ViewMoaModal from './viewMoa';
import styles from '@/components/CSS/CHTransaction.module.css';

interface BarangayData {
    id: string;
    barangay: string;
    city: string;
    province: string;
    region: string;
    applicant: string;
    status: string;
    role?: string;
    area?: string;
    contactNo?: string;
    facebookPage?: string;
    moaSignatory?: string;
    dateCreated?: string;
    type?: string;
    population?: string;
    zipCode?: string;
}

interface RejectedModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayData: BarangayData | null;
}

export default function RejectedModal({ isOpen, onClose, barangayData }: RejectedModalProps) {
    const [isMoaModalOpen, setIsMoaModalOpen] = useState(false);

    if (!isOpen || !barangayData) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleViewMoa = () => {
        setIsMoaModalOpen(true);
    };

    const closeMoaModal = () => {
        setIsMoaModalOpen(false);
    };

    return (
        <>
            {/* Modal Overlay */}
            <div 
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                onClick={handleOverlayClick}
            >
                {/* Modal Card */}
                <div className="bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="text-left">
                                <div className="text-gray-400 text-sm">Date Rejected</div>
                                <div className="text-white font-semibold">August 23, 2025</div>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex items-center justify-center">
                                <div className="relative bg-gradient-to-br from-red-600/20 via-red-700/20 to-red-900/20 border border-red-700 rounded-lg px-6 py-3 shadow-lg overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 via-transparent to-red-500/10"></div>
                                    <div className="relative flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-red-600 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                        <span className="bg-gradient-to-r from-red-600 via-red-600 to-red-800 bg-clip-text text-transparent font-bold text-lg">Rejected</span>
                                        <svg className="w-5 h-5 text-red-600 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 relative">
                        {/* Rejected Status Badge - Top Left Corner */}
                        <div className="absolute top-2 left-2 z-20">
                            <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white px-4 py-1 text-xs font-bold shadow-lg rounded">
                                <span className="flex items-center justify-center space-x-1 drop-shadow-sm">
                                    <svg className="w-3 h-3 drop-shadow-sm flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                    <span className="leading-none">Application Rejected</span>
                                    <svg className="w-3 h-3 drop-shadow-sm flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Left Column - Applicant Information */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <span className="text-white text-xl font-bold">
                                                {barangayData.applicant?.split(' ').map(n => n[0]).join('') || 'JD'}
                                            </span>
                                        </div>
                                        <h3 className="text-white font-bold text-lg">{barangayData.applicant}</h3>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-gray-400 text-sm">Role</div>
                                            <div className="text-white font-semibold">Community Admin</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-sm">Area</div>
                                            <div className="text-white font-semibold">{barangayData.region}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-sm">Contact No.</div>
                                            <div className="text-white font-semibold">09123456789</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-sm">Facebook Page</div>
                                            <div className="text-cyan-400 text-sm break-all">
                                                https://www.facebook.com/brgy{barangayData.barangay.toLowerCase()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button 
                                        onClick={handleViewMoa}
                                        className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                                    >
                                        VIEW MOA
                                    </button>
                                </div>
                            </div>

                            {/* Right Column - Location Information */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="text-center">
                                            <div className="text-gray-400 text-sm mb-1">ID</div>
                                            <div className="text-white text-2xl font-bold">1375010H</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-gray-400 text-sm mb-1">Population</div>
                                            <div className="text-white text-2xl font-bold">903845</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-gray-400 text-sm mb-1">Zip Code</div>
                                            <div className="text-white text-2xl font-bold">3123</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <div className="text-gray-400 text-sm">Barangay</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.barangay}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-sm">Municipality/City</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.city}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-sm">Province</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.province}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-sm">Region</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.region}</div>
                                        </div>
                                    </div>

                                    {/* Rejection Details Section */}
                                    <div className="border-t border-gray-600 pt-4">
                                        <h4 className="text-white font-bold mb-4">REJECTION DETAILS</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <div className="text-gray-400 text-sm">Reviewed By</div>
                                                <div className="text-white font-semibold">Admin Officer</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400 text-sm">Rejection Date</div>
                                                <div className="text-white font-semibold">August 23, 2025</div>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <div className="text-gray-400 text-sm mb-2">Reason for Rejection</div>
                                            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                                                <div className="text-red-400 text-sm">
                                                    Incomplete documentation. Missing required MOA signatory information and community verification documents. Please resubmit with complete requirements.
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 text-sm">Next Steps</div>
                                            <div className="text-white font-semibold">Resubmit application with complete requirements</div>
                                            <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 bg-clip-text text-transparent text-sm mt-1 font-semibold">Application can be resubmitted after corrections</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={onClose}
                                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOA Modal */}
            <ViewMoaModal 
                isOpen={isMoaModalOpen}
                onClose={closeMoaModal}
                barangayName={barangayData.barangay}
            />
        </>
    );
} 
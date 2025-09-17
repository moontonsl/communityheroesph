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

interface ApprovedModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayData: BarangayData | null;
}

export default function ApprovedModal({ isOpen, onClose, barangayData }: ApprovedModalProps) {
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
                            {/* <h2 className="text-white text-xl font-bold">BARANGAY APPLICATION</h2> */}
                            <div className="text-left">
                                <div className="text-gray-400 text-sm">Date Approved</div>
                                <div className="text-white font-semibold">August 23, 2025</div>
                            </div>
                        </div>
                        <div className="">
                            <div className="flex items-center justify-center">
                                <div className="relative bg-gradient-to-br from-yellow-600/20 via-amber-700/20 to-amber-900/20 border border-amber-700 rounded-lg px-6 py-3 shadow-lg overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-yellow-500/10"></div>
                                    <div className="relative flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-amber-600 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                                        </svg>
                                        <span className="bg-gradient-to-r from-yellow-600 via-amber-600 to-amber-800 bg-clip-text text-transparent font-bold text-lg">Bronze Tier</span>
                                        <svg className="w-5 h-5 text-amber-600 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Left Column - Applicant Information */}
                            <div className="lg:col-span-1">
                                
                                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
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

                                    {/* MOA Details Section */}
                                    <div className="border-t border-gray-600 pt-4">
                                        <h4 className="text-white font-bold mb-4">MOA DETAILS</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <div className="text-gray-400 text-sm">Signatory</div>
                                                <div className="text-white font-semibold">Angelica Cruz</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400 text-sm">Date</div>
                                                <div className="text-white font-semibold">August 23, 2025</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400 text-sm">Type</div>
                                                <div className="text-white font-semibold">Renewal</div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="text-gray-400 text-sm">Expiry Date</div>
                                            <div className="text-white font-semibold">August 23, 2026</div>
                                            <div className="bg-gradient-to-r from-yellow-600 via-amber-600 to-amber-700 bg-clip-text text-transparent text-sm mt-1 font-semibold">11 months and 29 days left</div>
                                        </div>
                                    </div>

                                    {/* Bronze Status */}
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
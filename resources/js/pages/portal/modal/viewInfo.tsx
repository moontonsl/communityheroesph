import React, { useState } from 'react';
import ViewMoaModal from './viewMoa';
import ApprovalModal from './approvalModal';
import ReturnModal from './returnModal';
import DeleteModal from './deleteModal';
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

interface ViewInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayData: BarangayData | null;
}

export default function ViewInfoModal({ isOpen, onClose, barangayData }: ViewInfoModalProps) {
    const [isMoaModalOpen, setIsMoaModalOpen] = useState(false);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    const handleApproveMoa = () => {
        setIsApprovalModalOpen(true);
    };

    const closeApprovalModal = () => {
        setIsApprovalModalOpen(false);
    };

    const handleReturnMoa = () => {
        setIsReturnModalOpen(true);
    };

    const closeReturnModal = () => {
        setIsReturnModalOpen(false);
    };

    const handleDeleteEntry = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
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
                            <div className="bg-cyan-500 text-white px-3 py-1 rounded text-sm font-semibold">
                                NEW
                            </div>
                            <h2 className="text-white text-xl font-bold">INFORMATION</h2>
                        </div>
                        <div className="text-right">
                            <div className="text-gray-400 text-sm">Date Filed</div>
                            <div className="text-white font-semibold">August 23, 2025</div>
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
                                                https://www.facebook.com/brgyexample
                                            </div>
                                        </div>
                                    </div>
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
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-3 mt-6 pt-6 border-t border-gray-700">
                            <button 
                                onClick={handleViewMoa}
                                className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                            >
                                VIEW MOA
                            </button>
                            <button 
                                onClick={handleApproveMoa}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                            >
                                APPROVE MOA
                            </button>
                            <button 
                                onClick={handleReturnMoa}
                                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/25"
                            >
                                RETURN MOA
                            </button>
                            <button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-yellow-500/25">
                                EDIT LISTING
                            </button>
                            <button 
                                onClick={handleDeleteEntry}
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                            >
                                DELETE ENTRY
                            </button>
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

            {/* Approval Modal */}
            <ApprovalModal 
                isOpen={isApprovalModalOpen}
                onClose={closeApprovalModal}
                barangayName={barangayData.barangay}
            />

            {/* Return Modal */}
            <ReturnModal 
                isOpen={isReturnModalOpen}
                onClose={closeReturnModal}
                barangayName={barangayData.barangay}
            />

            {/* Delete Modal */}
            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                barangayName={barangayData.barangay}
            />
        </>
    );
}

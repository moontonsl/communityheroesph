import React, { useState } from 'react';
import ViewMoaModal from './viewMoa';
import ApprovalModal from './approvalModal';
import ReturnModal from './returnModal';
import DeleteModal from './deleteModal';
import styles from '@/components/CSS/CHTransaction.module.css';
import { router } from '@inertiajs/react';

interface BarangayData {
    id: number;
    submission_id: string;
    barangay_name: string;
    municipality_name: string;
    province_name: string;
    region_name: string;
    second_party_name: string;
    status: 'PENDING' | 'PRE_APPROVED' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW' | 'RENEW';
    tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
    successful_events_count: number;
    tier_updated_at?: string;
    stage: 'NEW' | 'RENEWAL';
    date_signed: string;
    position: string;
    zip_code?: string;
    population?: number;
    moa_file_path: string;
    moa_file_name: string;
    rejection_reason?: string;
    admin_notes?: string;
    approved_by?: number;
    approved_at?: string;
    reviewed_by?: number;
    reviewed_at?: string;
    created_at: string;
    updated_at: string;
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

interface ViewInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayData: BarangayData | null;
    user?: User;
}

export default function ViewInfoModal({ isOpen, onClose, barangayData, user }: ViewInfoModalProps) {
    const [isMoaModalOpen, setIsMoaModalOpen] = useState(false);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [approvalAction, setApprovalAction] = useState<'approve' | 'renew'>('approve');
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const getTierDisplayName = (tier: string): string => {
        switch (tier) {
            case 'BRONZE':
                return 'BRONZE TIER';
            case 'SILVER':
                return 'SILVER TIER';
            case 'GOLD':
                return 'GOLD TIER';
            case 'PLATINUM':
                return 'PLATINUM TIER';
            default:
                return 'UNKNOWN TIER';
        }
    };

    const getTierBannerColors = (tier: string): { main: string; ends: string; svgColor: string } => {
        switch (tier) {
            case 'BRONZE':
                return {
                    main: 'from-amber-600 via-yellow-500 to-amber-600',
                    ends: 'bg-gray-700',
                    svgColor: '#CD7F32'
                };
            case 'SILVER':
                return {
                    main: 'from-gray-500 via-gray-300 to-gray-500',
                    ends: 'bg-gray-800',
                    svgColor: '#C0C0C0'
                };
            case 'GOLD':
                return {
                    main: 'from-yellow-600 via-yellow-300 to-yellow-600',
                    ends: 'bg-gray-700',
                    svgColor: '#FFD700'
                };
            case 'PLATINUM':
                return {
                    main: 'from-purple-600 via-purple-300 to-purple-600',
                    ends: 'bg-gray-800',
                    svgColor: '#E5E4E2'
                };
            default:
                return {
                    main: 'from-gray-500 via-gray-300 to-gray-500',
                    ends: 'bg-gray-800',
                    svgColor: '#CD7F32'
                };
        }
    };

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
        setApprovalAction('approve');
        setIsApprovalModalOpen(true);
    };

    const handleRenewMoa = () => {
        setApprovalAction('renew');
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

    const handleReApply = () => {
        // Format date for HTML date input (YYYY-MM-DD)
        const formatDateForInput = (dateString: string) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                return date.toISOString().split('T')[0]; // Get YYYY-MM-DD format
            } catch (error) {
                console.error('Error formatting date:', error);
                return '';
            }
        };

        // Prepare pre-fill data from existing barangay data
        const preFillData = {
            regionId: barangayData.region?.id?.toString() || '',
            regionName: barangayData.region_name || '',
            provinceId: barangayData.province?.id?.toString() || '',
            provinceName: barangayData.province_name || '',
            municipalityId: barangayData.municipality?.id?.toString() || '',
            municipalityName: barangayData.municipality_name || '',
            barangayId: barangayData.barangay?.id?.toString() || '',
            barangayName: barangayData.barangay_name || '',
            zipCode: barangayData.zip_code || '',
            population: barangayData.population?.toString() || '',
            secondPartyName: barangayData.second_party_name || '',
            position: barangayData.position || '',
            dateSigned: formatDateForInput(barangayData.date_signed),
            stage: 'RENEWAL' as const
        };

        // Navigate to register barangay page with pre-fill data
        router.visit('/registerbarangay', {
            method: 'get',
            data: {
                prefill: JSON.stringify(preFillData)
            }
        });
    };

    return (
        <>
            {/* Modern Modal Overlay */}
            <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
                onClick={handleOverlayClick}
            >
                {/* Modern Modal Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 max-w-7xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                    {/* Modern Modal Header */}
                    <div className="flex justify-between items-center p-8 border-b border-white/20">
                        <div className="flex items-center space-x-4">
                            <div className="relative group">
            <div className={`text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg group-hover:scale-105 transition-transform duration-300 ${
                barangayData.status === 'PENDING' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                barangayData.status === 'PRE_APPROVED' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                barangayData.status === 'APPROVED' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                barangayData.status === 'REJECTED' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                barangayData.status === 'RENEW' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                barangayData.status === 'UNDER_REVIEW' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                'bg-gradient-to-r from-gray-500 to-gray-600'
            }`}>
                                    {barangayData.status}
                                </div>
                                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${
                                    barangayData.status === 'PENDING' ? 'bg-yellow-400' :
                                    barangayData.status === 'PRE_APPROVED' ? 'bg-blue-400' :
                                    barangayData.status === 'APPROVED' ? 'bg-green-400' :
                                    barangayData.status === 'REJECTED' ? 'bg-red-400' :
                                    barangayData.status === 'RENEW' ? 'bg-orange-400' :
                                    barangayData.status === 'UNDER_REVIEW' ? 'bg-purple-400' :
                                    'bg-gray-400'
                                }`}></div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                <h2 className="text-white text-2xl font-bold">INFORMATION</h2>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-gray-400 text-sm uppercase tracking-wider">Date Filed</div>
                            <div className="text-white font-bold text-lg">
                                {new Date(barangayData.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Rejection Reason Section - Only show when status is REJECTED */}
                    {barangayData.status === 'REJECTED' && barangayData.rejection_reason && (
                        <div className="mt-6 mx-8 mb-4 bg-red-500/10 backdrop-blur-sm rounded-md p-6 border border-red-500/20 hover:bg-red-500/15 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-full"></div>
                                    <h4 className="text-white font-bold text-xl">Rejection Reason</h4>
                                </div>
                                <button 
                                    onClick={handleReApply}
                                    className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 
                                        rounded-md shadow-lg hover:shadow-blue-500/25 transition-all duration-300 
                                        hover:from-blue-400 hover:to-blue-500 hover:scale-105 
                                        focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    <span className="relative z-10 flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Re-apply</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                            <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                                <div className="text-red-100 leading-relaxed">
                                    {barangayData.rejection_reason}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modern Modal Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Modern Applicant Information */}
                            <div className="lg:col-span-1">
                                <div className="bg-white/5 backdrop-blur-sm rounded-md p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                                    <div className="text-center mb-6">
                                        <div className="relative group/avatar">
                                            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover/avatar:scale-110 transition-transform duration-300">
                                                <span className="text-white text-2xl font-bold">
                                                    {barangayData.second_party_name?.split(' ').map(n => n[0]).join('') || 'JD'}
                                                </span>
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
                                        </div>
                                        <h3 className="text-white font-bold text-xl mb-2">{barangayData.second_party_name}</h3>
                                        <div className="text-gray-300 text-sm">Community Administrator</div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Role</div>
                                            <div className="text-white font-semibold text-lg">Community Admin</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Area</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.region_name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Contact No.</div>
                                            <div className="text-white font-semibold text-lg">09123456789</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Facebook Page</div>
                                            <div className="text-cyan-400 text-sm break-all bg-white/5 p-3 rounded-xl border border-white/10">
                                                https://www.facebook.com/brgyexample
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modern Location Information */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Statistics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-white/5 backdrop-blur-sm rounded-md p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                            </svg>
                                        </div>
                                        <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">Submission ID</div>
                                        <div className="text-white text-2xl font-bold">{barangayData.submission_id}</div>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-sm rounded-md p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">Population</div>
                                        <div className="text-white text-2xl font-bold">{barangayData.population?.toLocaleString() || 'N/A'}</div>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-sm rounded-md p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">Zip Code</div>
                                        <div className="text-white text-2xl font-bold">{barangayData.zip_code || 'N/A'}</div>
                                    </div>
                                    {barangayData.status === 'APPROVED' && (
                                        <div className="bg-white/5 backdrop-blur-sm rounded-md p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                                            <div className="text-gray-300 text-sm mb-4 uppercase tracking-wider">Current Tier</div>
                                            <div className="relative">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 180" className="w-full h-16">
                                                    <path d="M60 10 10 60v60l50 50h630l50-50V60l-50-50H60z" fill={getTierBannerColors(barangayData.tier).svgColor}></path>
                                                    <text 
                                                        x="375" 
                                                        y="100" 
                                                        textAnchor="middle" 
                                                        dominantBaseline="middle" 
                                                        fill="black"
                                                        style={{
                                                            fontSize: '74px', 
                                                            fontWeight: 'bold',
                                                            fontFamily: 'Arial, sans-serif',
                                                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                                        }}
                                                    >
                                                        {getTierDisplayName(barangayData.tier)}
                                                    </text>
                                                </svg>
                                            </div>
                                            
                                            <div className="text-gray-400 text-sm">
                                                {barangayData.successful_events_count} successful events
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Location Details */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-md p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                        <h4 className="text-white font-bold text-xl">Location Details</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Barangay</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.barangay_name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Municipality/City</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.municipality_name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Province</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.province_name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Region</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.region_name}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modern MOA Details Section */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-md p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                        <h4 className="text-white font-bold text-xl">MOA Details</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Signatory</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.second_party_name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Date Signed</div>
                                            <div className="text-white font-semibold text-lg">
                                                {new Date(barangayData.date_signed).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Type</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.stage}</div>
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">Position</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.position}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-gray-400 text-sm uppercase tracking-wider">File Name</div>
                                            <div className="text-white font-semibold text-lg">{barangayData.moa_file_name}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Modern Action Buttons - Hide for Area Admin */}
                        {user?.role?.slug !== 'area-admin' && (
                            <div className="flex flex-wrap justify-center gap-4 mt-8 pt-8 border-t border-white/20">
                                <button 
                                    onClick={handleViewMoa}
                                    className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 
                                        rounded-md shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 
                                        hover:from-cyan-400 hover:to-cyan-500 hover:scale-105 
                                        focus:outline-none focus:ring-4 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    <span className="relative z-10 flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>VIEW MOA</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                                
                                {/* Community Lead Pre-Approval Button for PENDING submissions */}
                                {user?.role?.slug === 'community-lead' && barangayData.status === 'PENDING' && (
                                    <button 
                                        onClick={handleApproveMoa}
                                        className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 
                                            rounded-md shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 
                                            hover:from-blue-400 hover:to-blue-500 hover:scale-105 
                                            focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    >
                                        <span className="relative z-10 flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>PRE-APPROVE</span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                )}
                                
                                {/* Super Admin Final Approval Button for PRE_APPROVED submissions */}
                                {(user?.role?.slug === 'super-admin-a' || user?.role?.slug === 'super-admin') && barangayData.status === 'PRE_APPROVED' && (
                                    <button 
                                        onClick={handleApproveMoa}
                                        className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-green-600 
                                            rounded-md shadow-2xl hover:shadow-green-500/25 transition-all duration-300 
                                            hover:from-green-400 hover:to-green-500 hover:scale-105 
                                            focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    >
                                        <span className="relative z-10 flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>APPROVE MOA</span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                )}
                                
                                {/* Super Admin Renew MOA Button for RENEW submissions */}
                                {(user?.role?.slug === 'super-admin-a' || user?.role?.slug === 'super-admin') && barangayData.status === 'RENEW' && (
                                    <button 
                                        onClick={handleRenewMoa}
                                        className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 
                                            rounded-md shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 
                                            hover:from-orange-400 hover:to-orange-500 hover:scale-105 
                                            focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    >
                                        <span className="relative z-10 flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span>RENEW MOA</span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                )}
                                
                                <button 
                                    onClick={handleReturnMoa}
                                    className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 
                                        rounded-md shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 
                                        hover:from-orange-400 hover:to-orange-500 hover:scale-105 
                                        focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    <span className="relative z-10 flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>REJECT</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                                <button 
                                    onClick={handleDeleteEntry}
                                    className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 
                                        rounded-md shadow-2xl hover:shadow-red-500/25 transition-all duration-300 
                                        hover:from-red-400 hover:to-red-500 hover:scale-105 
                                        focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    <span className="relative z-10 flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>DELETE ENTRY</span>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        )}
                        
                        {/* Area Admin Message */}
                        {user?.role?.slug === 'area-admin' && (
                            <div className="mt-8 pt-8 border-t border-white/20">
                                <div className="text-center">
                                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
                                        <div className="flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-white text-lg font-semibold mb-2">View Only Mode</h3>
                                        <p className="text-blue-300 text-sm">
                                            As an Area Admin, you can only view your assigned barangay applications. 
                                            You cannot approve, reject, or delete your own applications.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modern Close Button */}
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={onClose}
                                className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white bg-white/10 backdrop-blur-sm border border-white/20 
                                    rounded-md shadow-xl hover:shadow-white/10 transition-all duration-300 
                                    hover:bg-white/20 hover:scale-105 
                                    focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Close</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOA Modal */}
            <ViewMoaModal 
                isOpen={isMoaModalOpen}
                onClose={closeMoaModal}
                barangayName={barangayData.barangay_name}
                moaFile={{
                    path: barangayData.moa_file_path,
                    name: barangayData.moa_file_name
                }}
            />

            {/* Approval Modal */}
            <ApprovalModal 
                isOpen={isApprovalModalOpen}
                onClose={closeApprovalModal}
                barangayName={barangayData.barangay_name}
                submissionId={barangayData.id}
                type="submission"
                userRole={user?.role?.slug}
                action={approvalAction}
                onSuccess={() => {
                    closeApprovalModal();
                    onClose(); // Close the main modal to refresh data
                }}
            />

            {/* Return Modal */}
            <ReturnModal 
                isOpen={isReturnModalOpen}
                onClose={closeReturnModal}
                barangayName={barangayData.barangay_name}
                submissionId={barangayData.id}
                onSuccess={() => {
                    closeReturnModal();
                    onClose(); // Close the main modal to refresh data
                }}
            />

            {/* Delete Modal */}
            <DeleteModal 
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                barangayName={barangayData.barangay_name}
                submissionId={barangayData.id}
                type="submission"
                onSuccess={() => {
                    closeDeleteModal();
                    onClose(); // Close the main modal to refresh data
                }}
            />
        </>
    );
}

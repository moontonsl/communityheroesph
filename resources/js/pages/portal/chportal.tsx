import { Head, Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Header from '@/pages/partials/header';
import ViewInfoModal from './modal/viewInfo';
import ViewEventModal from './modal/viewEvent';
import styles from '@/components/CSS/CHTransaction.module.css';

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
    moa_expiry_date?: string;
    is_moa_expired?: boolean;
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

interface EventData {
    id: number;
    event_id: string;
    barangay_submission_id: number;
    applied_by: number;
    event_name: string;
    event_description: string;
    event_date: string;
    campaign: string;
    event_start_time: string;
    event_end_time: string;
    event_location: string;
    expected_participants: number;
    event_type: string;
    contact_person: string;
    contact_number: string;
    contact_email: string;
    requirements: string;
    proposal_file_path: string;
    proposal_file_name: string;
    status: 'PENDING' | 'PRE_APPROVED' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED' | 'CLEARED';
    rejection_reason?: string;
    admin_notes?: string;
    approved_by?: number;
    approved_at?: string;
    reviewed_by?: number;
    reviewed_at?: string;
    is_successful?: boolean;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    barangay_submission?: {
        id: number;
        barangay_name: string;
        municipality_name: string;
        province_name: string;
        region_name: string;
        moa_file_path: string;
        moa_file_name: string;
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
    };
    appliedBy?: {
        id: number;
        name: string;
        email: string;
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

interface Stats {
    total: number;
    pending: number;
    pre_approved?: number;
    approved: number;
    rejected: number;
    under_review: number;
    renew?: number;
    completed?: number;
    cancelled?: number;
    cleared?: number;
    this_month: number;
    this_week: number;
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
    phone?: string;
    bio?: string;
    is_active: boolean;
    last_login_at?: string;
}

interface CHPortalProps {
    submissions: BarangayData[];
    events: EventData[];
    allSubmissions: BarangayData[];
    allEvents: EventData[];
    submissionStats: Stats;
    eventStats: Stats;
    allSubmissionStats: Stats;
    allEventStats: Stats;
    user: User;
}

export default function CHPortal({ submissions, events, allSubmissions, allEvents, submissionStats, eventStats, allSubmissionStats, allEventStats, user }: CHPortalProps) {
    // State for filter input
    const [filterText, setFilterText] = useState('');
    
    // Tab state for barangay submissions
    const [activeTab, setActiveTab] = useState<'pending' | 'pre-approved' | 'renewals' | 'approved' | 'masterlist'>('pending');
    
    // Tab state for events
    const [activeEventTab, setActiveEventTab] = useState<'new' | 'pre-approved' | 'approved' | 'cleared' | 'all'>('new');
    
    // View mode state (barangays or events)
    const [viewMode, setViewMode] = useState<'barangays' | 'events'>('barangays');

    // Helper function to get user initials
    const getUserInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Helper function to get role display name
    const getRoleDisplayName = (roleSlug: string): string => {
        switch (roleSlug) {
            case 'super-admin':
                return 'Super Admin';
            case 'super-admin-a':
                return 'Super Admin A';
            case 'super-admin-b':
                return 'Super Admin B';
            case 'community-admin':
                return 'Community Admin';
            default:
                return 'User';
        }
    };

    // Helper function to get tier display name
    const getTierDisplayName = (tier: string): string => {
        switch (tier) {
            case 'BRONZE':
                return 'Bronze Tier';
            case 'SILVER':
                return 'Silver Tier';
            case 'GOLD':
                return 'Gold Tier';
            case 'PLATINUM':
                return 'Platinum Tier';
            default:
                return 'Unknown Tier';
        }
    };

    // Helper function to get tier badge color
    const getTierBadgeColor = (tier: string): string => {
        switch (tier) {
            case 'BRONZE':
                return 'bg-yellow-100 text-yellow-800';
            case 'SILVER':
                return 'bg-gray-100 text-gray-800';
            case 'GOLD':
                return 'bg-yellow-100 text-yellow-800';
            case 'PLATINUM':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBarangay, setSelectedBarangay] = useState<BarangayData | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    // Use data from props
    const barangayData: BarangayData[] = submissions;
    const eventData: EventData[] = events;

    // Get current stats based on active tab and view mode
    const getCurrentStats = () => {
        if (viewMode === 'events') {
            // For events view, always use all event statistics for consistency
            return allEventStats;
        } else {
            // For barangays view, always use all barangay statistics for consistency
            return allSubmissionStats;
        }
    };

    const currentStats = getCurrentStats();

    // Filtered data based on tab and search input
    const filteredData = useMemo(() => {
        if (viewMode === 'events') {
            // Use allEvents for master list and approved tab, eventData for other role-specific tabs
            let data = (activeEventTab === 'all' || activeEventTab === 'approved') ? allEvents : eventData;
            
            // Filter events by tab
            if (activeEventTab === 'new') {
                data = data.filter(item => item.status === 'PENDING');
            } else if (activeEventTab === 'pre-approved') {
                data = data.filter(item => item.status === 'PRE_APPROVED');
            } else if (activeEventTab === 'approved') {
                data = data.filter(item => item.status === 'APPROVED');
            } else if (activeEventTab === 'cleared') {
                data = data.filter(item => item.status === 'CLEARED');
            }
            // 'all' shows all events (no filtering)
            
            // Filter by search text
            if (filterText) {
                const searchTerm = filterText.toLowerCase();
                data = data.filter(item => 
                    item.event_name.toLowerCase().includes(searchTerm) ||
                    item.event_description.toLowerCase().includes(searchTerm) ||
                    item.event_location.toLowerCase().includes(searchTerm) ||
                    item.event_type.toLowerCase().includes(searchTerm) ||
                    item.contact_person.toLowerCase().includes(searchTerm) ||
                    item.status.toLowerCase().includes(searchTerm) ||
                    item.barangay_submission?.barangay_name.toLowerCase().includes(searchTerm) ||
                    item.barangay_submission?.municipality_name.toLowerCase().includes(searchTerm) ||
                    item.barangay_submission?.province_name.toLowerCase().includes(searchTerm) ||
                    item.barangay_submission?.region_name.toLowerCase().includes(searchTerm)
                );
            }
            
            return data;
        } else {
            // Use allSubmissions for master list and approved tab, barangayData for other role-specific tabs
            let data = (activeTab === 'masterlist' || activeTab === 'approved') ? allSubmissions : barangayData;
            
            // Filter by tab
            if (activeTab === 'pending') {
                data = data.filter(item => item.status === 'PENDING');
            } else if (activeTab === 'pre-approved') {
                data = data.filter(item => item.status === 'PRE_APPROVED');
            } else if (activeTab === 'renewals') {
                data = data.filter(item => item.status === 'UNDER_REVIEW' || item.status === 'RENEW');
            } else if (activeTab === 'approved') {
                data = data.filter(item => item.status === 'APPROVED');
            }
            // 'masterlist' shows all data (no filtering)
            
            // Filter by search text
            if (filterText) {
                const searchTerm = filterText.toLowerCase();
                data = data.filter(item => 
                    item.barangay_name.toLowerCase().includes(searchTerm) ||
                    item.municipality_name.toLowerCase().includes(searchTerm) ||
                    item.province_name.toLowerCase().includes(searchTerm) ||
                    item.region_name.toLowerCase().includes(searchTerm) ||
                    item.second_party_name.toLowerCase().includes(searchTerm) ||
                    item.status.toLowerCase().includes(searchTerm)
                );
            }
            
            return data;
        }
    }, [barangayData, eventData, allSubmissions, allEvents, activeTab, activeEventTab, filterText, viewMode]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Reset to first page when filter or tab changes
    useMemo(() => {
        setCurrentPage(1);
    }, [filterText, activeTab, activeEventTab, viewMode]);

    // Pagination handlers
    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) pages.push('...');
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    // Handle view application click
    const handleViewApplication = (item: BarangayData | EventData) => {
        if (viewMode === 'events') {
            setSelectedEvent(item as EventData);
        } else {
            setSelectedBarangay(item as BarangayData);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBarangay(null);
        setSelectedEvent(null);
    };

    const handleSuccess = () => {
        // Refresh only the data (not the whole page) using Inertia
        router.reload({ only: ['submissions', 'events', 'allSubmissions', 'allEvents', 'submissionStats', 'eventStats', 'allSubmissionStats', 'allEventStats'] });
    };

    return (
        <>
            <Head title="CHPortal">
                 
            </Head>
            <Header />
            
            {/* Main Content */}
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden welcome-background">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                                        radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)`,
                    }}></div>
                </div>
                
                <div className="container mx-auto px-4 py-8 relative z-10">
                    
                    {/* Modern Header */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-block">
                            <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-gradient">
                                MY BARANGAY
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-gray-300 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                            Manage and monitor barangay applications and events
                        </p>
                    </div>

                    {/* Modern User Profile Section */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-up mb-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            {/* Left Side - User Info */}
                            <div className="flex items-center space-x-6">
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-3xl font-bold text-white">{getUserInitials(user.name)}</span>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
                                </div>
                                <div className="text-white">
                                    <h2 className="text-2xl font-bold mb-2">{user.name.toUpperCase()}</h2>
                                    <div className="flex flex-col lg:flex-row lg:space-x-8 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-gray-400 text-sm uppercase tracking-wider">Account Role</span>
                                            <div className="text-white font-semibold text-lg">{getRoleDisplayName(user.role.slug)}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-gray-400 text-sm uppercase tracking-wider">Email</span>
                                            <div className="text-white font-semibold text-lg">{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Side - Account Status */}
                            <div className="text-right">
                                {(user.role.slug === 'super-admin' || user.role.slug === 'super-admin-a') && (
                                    <Link href="/settings/profile" className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 
                                        rounded-md shadow-2xl hover:shadow-red-500/25 transition-all duration-300 
                                        hover:from-red-400 hover:to-red-500 hover:scale-105 
                                        focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900">
                                        <span className="relative z-10 flex items-center space-x-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Account Settings</span>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modern Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">
                                {viewMode === 'events' ? 'Approved Events' : 'Approved Barangays'}
                            </div>
                            <div className="text-white text-3xl font-bold">
                                {currentStats.approved}
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">
                                {viewMode === 'events' ? 'New Events' : 'Pending Applications'}
                            </div>
                            <div className="text-white text-3xl font-bold">
                                {currentStats.pending}
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">
                                {viewMode === 'events' ? 'Completed Events' : 'Renewal Required'}
                            </div>
                            <div className="text-white text-3xl font-bold">
                                {viewMode === 'events' ? currentStats.completed : (currentStats.under_review || 0) + (currentStats.renew || 0)}
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">
                                {viewMode === 'events' ? 'This Month Events' : 'My Applications'}
                            </div>
                            <div className="text-white text-3xl font-bold">
                                {currentStats.this_month}
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group lg:col-span-1 md:col-span-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">
                                {viewMode === 'events' ? 'Total Events' : 'Total Barangays'}
                            </div>
                            <div className="text-white text-3xl font-bold">
                                {currentStats.total}
                            </div>
                        </div>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <button 
                            onClick={() => setViewMode('barangays')}
                            className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                viewMode === 'barangays'
                                    ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-2xl hover:shadow-blue-500/25 hover:from-blue-400 hover:to-blue-500 focus:ring-blue-500/50'
                                    : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                            }`}>
                            <span className="relative z-10 flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span>Barangay Submissions</span>
                            </span>
                        </button>
                        <button 
                            onClick={() => setViewMode('events')}
                            className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                viewMode === 'events'
                                    ? 'text-white bg-gradient-to-r from-purple-500 to-purple-600 shadow-2xl hover:shadow-purple-500/25 hover:from-purple-400 hover:to-purple-500 focus:ring-purple-500/50'
                                    : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                            }`}>
                            <span className="relative z-10 flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Events</span>
                            </span>
                        </button>
                    </div>

                    {/* Barangay Submission Tabs - Only show when in barangays view mode */}
                    {viewMode === 'barangays' && (
                        <div className="flex flex-wrap gap-4 mb-6">
                            <button 
                                onClick={() => setActiveTab('pending')}
                                className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    activeTab === 'pending'
                                        ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-2xl hover:shadow-orange-500/25 hover:from-orange-400 hover:to-orange-500 focus:ring-orange-500/50'
                                        : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                                }`}>
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Pending Approval ({activeTab === 'masterlist' ? allSubmissionStats.pending : submissionStats.pending})</span>
                                </span>
                                {activeTab === 'pending' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                            </button>
                            <button 
                                onClick={() => setActiveTab('pre-approved')}
                                className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    activeTab === 'pre-approved'
                                        ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-2xl hover:shadow-blue-500/25 hover:from-blue-400 hover:to-blue-500 focus:ring-blue-500/50'
                                        : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                                }`}>
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Pre-Approved ({activeTab === 'masterlist' ? allSubmissionStats.pre_approved || 0 : submissionStats.pre_approved || 0})</span>
                                </span>
                                {activeTab === 'pre-approved' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                            </button>
                            <button 
                                onClick={() => setActiveTab('renewals')}
                                className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    activeTab === 'renewals'
                                        ? 'text-white bg-gradient-to-r from-purple-500 to-purple-600 shadow-2xl hover:shadow-purple-500/25 hover:from-purple-400 hover:to-purple-500 focus:ring-purple-500/50'
                                        : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                                }`}>
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Renewals ({(activeTab === 'masterlist' ? allSubmissionStats.under_review || 0 : submissionStats.under_review || 0) + (activeTab === 'masterlist' ? allSubmissionStats.renew || 0 : submissionStats.renew || 0)})</span>
                                </span>
                                {activeTab === 'renewals' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                            </button>
                            <button 
                                onClick={() => setActiveTab('approved')}
                                className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    activeTab === 'approved'
                                        ? 'text-white bg-gradient-to-r from-green-500 to-green-600 shadow-2xl hover:shadow-green-500/25 hover:from-green-400 hover:to-green-500 focus:ring-green-500/50'
                                        : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                                }`}>
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Approved Barangays ({activeTab === 'masterlist' || activeTab === 'approved' ? allSubmissionStats.approved : submissionStats.approved})</span>
                                </span>
                                {activeTab === 'approved' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                            </button>
                            <button 
                                onClick={() => setActiveTab('masterlist')}
                                className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    activeTab === 'masterlist'
                                        ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-2xl hover:shadow-blue-500/25 hover:from-blue-400 hover:to-blue-500 focus:ring-blue-500/50'
                                        : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                                }`}>
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>Masterlist ({allSubmissionStats.total})</span>
                                </span>
                                {activeTab === 'masterlist' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                            </button>
                        </div>
                    )}
                    {/* Event Tabs - Only show when in events view mode */}
                    {viewMode === 'events' && (
                        <div className="flex flex-wrap gap-4 mb-6">
                            <button 
                                onClick={() => setActiveEventTab('new')}
                                className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    activeEventTab === 'new'
                                        ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-2xl hover:shadow-orange-500/25 hover:from-orange-400 hover:to-orange-500 focus:ring-orange-500/50'
                                        : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                                }`}>
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>New Events ({activeEventTab === 'all' ? allEventStats.pending : eventStats.pending})</span>
                                </span>
                            </button>
                            <button 
                                onClick={() => setActiveEventTab('pre-approved')}
                                className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    activeEventTab === 'pre-approved'
                                        ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-2xl hover:shadow-blue-500/25 hover:from-blue-400 hover:to-blue-500 focus:ring-blue-500/50'
                                        : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                                }`}>
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Pre-Approved Events ({activeEventTab === 'all' ? allEventStats.pre_approved || 0 : eventStats.pre_approved || 0})</span>
                                </span>
                            </button>
                            <button 
                                onClick={() => setActiveEventTab('approved')}
                                className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    activeEventTab === 'approved'
                                        ? 'text-white bg-gradient-to-r from-green-500 to-green-600 shadow-2xl hover:shadow-green-500/25 hover:from-green-400 hover:to-green-500 focus:ring-green-500/50'
                                        : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                                }`}>
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    <span>Approved Events ({activeEventTab === 'all' || activeEventTab === 'approved' ? allEventStats.approved : eventStats.approved})</span>
                                </span>
                            </button>
                            <button 
                                onClick={() => setActiveEventTab('cleared')}
                                className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    activeEventTab === 'cleared'
                                        ? 'text-white bg-gradient-to-r from-gray-500 to-gray-600 shadow-2xl hover:shadow-gray-500/25 hover:from-gray-400 hover:to-gray-500 focus:ring-gray-500/50'
                                        : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                                }`}>
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Cleared Events ({activeEventTab === 'all' ? allEventStats.cleared || 0 : eventStats.cleared || 0})</span>
                                </span>
                            </button>
                            <button 
                                onClick={() => setActiveEventTab('all')}
                                className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                    activeEventTab === 'all'
                                        ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-2xl hover:shadow-blue-500/25 hover:from-blue-400 hover:to-blue-500 focus:ring-blue-500/50'
                                        : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                                }`}>
                                <span className="relative z-10 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span>All Events ({allEventStats.total})</span>
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Modern Barangay Management Section */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-up">
                        {/* Modern Header with Filter and Items Per Page */}
                        <div className="space-y-6 mb-8">
                            <div className="flex items-center space-x-4">
                                <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                <h3 className="text-3xl font-bold text-white">
                                    {viewMode === 'events' ? 'Event Management' : 'Barangay Management'}
                                    {viewMode === 'events' && activeEventTab === 'new' && ' - New Events'}
                                    {viewMode === 'events' && activeEventTab === 'pre-approved' && ' - Pre-Approved Events'}
                                    {viewMode === 'events' && activeEventTab === 'approved' && ' - Approved Events'}
                                    {viewMode === 'events' && activeEventTab === 'cleared' && ' - Cleared Events'}
                                    {viewMode === 'events' && activeEventTab === 'all' && ' - All Events'}
                                    {viewMode === 'barangays' && activeTab === 'pending' && ' - Pending Approval'}
                                    {viewMode === 'barangays' && activeTab === 'pre-approved' && ' - Pre-Approved'}
                                    {viewMode === 'barangays' && activeTab === 'renewals' && ' - Renewals'}
                                    {viewMode === 'barangays' && activeTab === 'approved' && ' - Approved Barangays'}
                                    {viewMode === 'barangays' && activeTab === 'masterlist' && ' - Masterlist'}
                                </h3>
                            </div>
                            
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="text-white">
                                        <span className="text-lg font-semibold">Total: {filteredData.length}</span>
                                        {filteredData.length !== barangayData.length && (
                                            <span className="text-gray-400 text-sm ml-2">
                                                (filtered from {barangayData.length})
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white 
                                                focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                transition-all duration-300 hover:bg-white/15 appearance-none cursor-pointer"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                color: 'white',
                                                WebkitAppearance: 'none',
                                                MozAppearance: 'none',
                                                appearance: 'none'
                                            }}
                                        >
                                            <option value={5} style={{ backgroundColor: 'rgb(17, 24, 39)', color: 'white' }}>10 per page</option>
                                            <option value={10} style={{ backgroundColor: 'rgb(17, 24, 39)', color: 'white' }}>15 per page</option>
                                            <option value={15} style={{ backgroundColor: 'rgb(17, 24, 39)', color: 'white' }}>20 per page</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder={viewMode === 'events' ? "Search" : "Search"}
                                            value={filterText}
                                            onChange={(e) => setFilterText(e.target.value)}
                                            className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 
                                                focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                                transition-all duration-300 hover:bg-white/15 w-80"
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                color: 'white',
                                                WebkitAppearance: 'none',
                                                MozAppearance: 'none',
                                                appearance: 'none'
                                            }}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {filterText && (
                                        <button
                                            onClick={() => setFilterText('')}
                                            className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                                            title="Clear filter"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modern Pagination Info */}
                        {filteredData.length > 0 && (
                            <div className="flex justify-between items-center mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                <div className="text-gray-300 text-sm">
                                    Showing <span className="text-white font-semibold">{startIndex + 1}</span> to <span className="text-white font-semibold">{Math.min(endIndex, filteredData.length)}</span> of <span className="text-white font-semibold">{filteredData.length}</span> entries
                                </div>
                                <div className="text-gray-300 text-sm">
                                    Page <span className="text-white font-semibold">{currentPage}</span> of <span className="text-white font-semibold">{totalPages}</span>
                                </div>
                            </div>
                        )}

                        {/* Modern No results message */}
                        {filteredData.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                                    </svg>
                                </div>
                                <div className="text-gray-300 text-lg mb-2">No {viewMode === 'events' ? 'events' : 'barangays'} found</div>
                                <div className="text-gray-400 text-sm">Try adjusting your search criteria</div>
                            </div>
                        )}

                        {/* Table - Desktop View */}
                        {currentData.length > 0 && (
                            <div className="hidden lg:block">
                                {/* Modern Table Headers */}
                                {viewMode === 'events' ? (
                                    <div className="grid grid-cols-9 gap-4 mb-4 pb-4 border-b border-white/20">
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Event Name</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Location</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Date</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Barangay</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Contact Person</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Status</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Pre-Approved By</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Participants</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Details</div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-9 gap-4 mb-4 pb-4 border-b border-white/20">
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Barangay</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">City/Municipality</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Province</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Region</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Applicant</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Status</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Pre-Approved By</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Tier</div>
                                        <div className="text-gray-300 text-sm font-semibold uppercase tracking-wider">Details</div>
                                    </div>
                                )}

                                {/* Modern Table Rows */}
                                {currentData.map((item, index) => (
                                    <div key={startIndex + index} className="grid grid-cols-9 gap-4 py-4 border-b border-white/10 hover:bg-white/5 rounded-xl transition-all duration-300 group">
                                        {viewMode === 'events' ? (
                                            <>
                                                <div className="text-white text-sm font-medium">{(item as EventData).event_name}</div>
                                                <div className="text-white text-sm">{(item as EventData).event_location}</div>
                                                <div className="text-white text-sm">{new Date((item as EventData).event_date).toLocaleDateString()}</div>
                                                <div className="text-white text-sm">{(item as EventData).barangay_submission?.barangay_name || 'N/A'}</div>
                                                <div className="text-white text-sm">{(item as EventData).contact_person}</div>
                                                <div className={`text-sm font-semibold ${
                                                    (item as EventData).status === 'APPROVED' ? 'text-green-400' :
                                                    (item as EventData).status === 'PRE_APPROVED' ? 'text-blue-400' :
                                                    (item as EventData).status === 'PENDING' ? 'text-yellow-400' :
                                                    (item as EventData).status === 'REJECTED' ? 'text-red-400' :
                                                    (item as EventData).status === 'COMPLETED' ? 'text-blue-400' :
                                                    (item as EventData).status === 'CLEARED' ? 'text-gray-400' : 'text-gray-400'
                                                }`}>
                                                    {(item as EventData).status}
                                                </div>
                                                <div className="text-white text-sm">
                                                    {(item as EventData).status === 'PRE_APPROVED' ? 
                                                        (item as EventData).reviewedBy?.name || 'Community Lead' : 
                                                        '-'
                                                    }
                                                </div>
                                                <div className="text-white text-sm">{(item as EventData).expected_participants}</div>
                                                <div>
                                                    <button 
                                                        onClick={() => handleViewApplication(item as any)}
                                                        className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-white/10 backdrop-blur-sm border border-white/20 
                                                            rounded-xl shadow-lg hover:shadow-white/10 transition-all duration-300 
                                                            hover:bg-white/20 hover:scale-105 
                                                            focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                    >
                                                        <span className="relative z-10 flex items-center space-x-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span>View</span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-white text-sm font-medium">{(item as BarangayData).barangay_name}</div>
                                                <div className="text-white text-sm">{(item as BarangayData).municipality_name}</div>
                                                <div className="text-white text-sm">{(item as BarangayData).province_name}</div>
                                                <div className="text-white text-sm">{(item as BarangayData).region_name}</div>
                                                <div className="text-white text-sm">{(item as BarangayData).second_party_name}</div>
                                                <div className={`text-sm font-semibold ${
                                                    (item as BarangayData).status === 'APPROVED' ? 'text-green-400' :
                                                    (item as BarangayData).status === 'PRE_APPROVED' ? 'text-blue-400' :
                                                    (item as BarangayData).status === 'PENDING' ? 'text-yellow-400' :
                                                    (item as BarangayData).status === 'REJECTED' ? 'text-red-400' :
                                                    (item as BarangayData).status === 'RENEW' ? 'text-orange-400' : 'text-blue-400'
                                                }`}>
                                                    {(item as BarangayData).status}
                                                </div>
                                                <div className="text-white text-sm">
                                                    {(item as BarangayData).status === 'PRE_APPROVED' ? 
                                                        (item as BarangayData).reviewedBy?.name || 'Community Lead' : 
                                                        '-'
                                                    }
                                                </div>
                                                <div className="flex items-center">
                                                    {(item as BarangayData).status === 'APPROVED' ? (
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierBadgeColor((item as BarangayData).tier)}`}>
                                                            {getTierDisplayName((item as BarangayData).tier)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">-</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <button 
                                                        onClick={() => handleViewApplication(item as any)}
                                                        className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-white/10 backdrop-blur-sm border border-white/20 
                                                            rounded-xl shadow-lg hover:shadow-white/10 transition-all duration-300 
                                                            hover:bg-white/20 hover:scale-105 
                                                            focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                    >
                                                        <span className="relative z-10 flex items-center space-x-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span>View</span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Modern Mobile View */}
                        {currentData.length > 0 && (
                            <div className="lg:hidden space-y-4">
                                {currentData.map((item, index) => (
                                    <div key={startIndex + index} className="bg-white/5 backdrop-blur-sm rounded-md p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                                        {viewMode === 'events' ? (
                                            <>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="text-white font-bold text-lg">{(item as EventData).event_name}</div>
                                                        <div className="text-gray-300 text-sm">{(item as EventData).event_location}</div>
                                                        <div className="text-gray-400 text-xs mt-1">{new Date((item as EventData).event_date).toLocaleDateString()}</div>
                                                    </div>
                                                    <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                                                        (item as EventData).status === 'APPROVED' ? 'text-green-400 bg-green-400/20' :
                                                        (item as EventData).status === 'PRE_APPROVED' ? 'text-blue-400 bg-blue-400/20' :
                                                        (item as EventData).status === 'PENDING' ? 'text-yellow-400 bg-yellow-400/20' :
                                                        (item as EventData).status === 'REJECTED' ? 'text-red-400 bg-red-400/20' :
                                                        (item as EventData).status === 'COMPLETED' ? 'text-blue-400 bg-blue-400/20' :
                                                        (item as EventData).status === 'CLEARED' ? 'text-gray-400 bg-gray-400/20' : 'text-gray-400 bg-gray-400/20'
                                                    }`}>
                                                        {(item as EventData).status}
                                                    </div>
                                                </div>
                                                <div className="text-gray-300 text-sm mb-2">
                                                    <span className="text-gray-400">Barangay:</span> {(item as EventData).barangay_submission?.barangay_name || 'N/A'}
                                                </div>
                                                <div className="text-gray-300 text-sm mb-2">
                                                    <span className="text-gray-400">Contact:</span> {(item as EventData).contact_person}
                                                </div>
                                                {(item as EventData).status === 'PRE_APPROVED' && (
                                                    <div className="text-gray-300 text-sm mb-2">
                                                        <span className="text-gray-400">Pre-Approved By:</span> {(item as EventData).reviewedBy?.name || 'Community Lead'}
                                                    </div>
                                                )}
                                                <div className="text-gray-300 text-sm mb-4">
                                                    <span className="text-gray-400">Expected Participants:</span> {(item as EventData).expected_participants}
                                                </div>
                                                <button 
                                                    onClick={() => handleViewApplication(item as any)}
                                                    className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-white/10 backdrop-blur-sm border border-white/20 
                                                        rounded-xl shadow-lg hover:shadow-white/10 transition-all duration-300 
                                                        hover:bg-white/20 hover:scale-105 
                                                        focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                >
                                                    <span className="relative z-10 flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        <span>View Event</span>
                                                    </span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="text-white font-bold text-lg">{(item as BarangayData).barangay_name}</div>
                                                        <div className="text-gray-300 text-sm">{(item as BarangayData).municipality_name}, {(item as BarangayData).province_name}</div>
                                                        <div className="text-gray-400 text-xs mt-1">{(item as BarangayData).region_name}</div>
                                                    </div>
                                                    <div className={`text-sm font-bold px-3 py-1 rounded-full ${
                                                        (item as BarangayData).status === 'APPROVED' ? 'text-green-400 bg-green-400/20' :
                                                        (item as BarangayData).status === 'PRE_APPROVED' ? 'text-blue-400 bg-blue-400/20' :
                                                        (item as BarangayData).status === 'PENDING' ? 'text-yellow-400 bg-yellow-400/20' :
                                                        (item as BarangayData).status === 'REJECTED' ? 'text-red-400 bg-red-400/20' :
                                                        (item as BarangayData).status === 'RENEW' ? 'text-orange-400 bg-orange-400/20' : 'text-blue-400 bg-blue-400/20'
                                                    }`}>
                                                        {(item as BarangayData).status}
                                                    </div>
                                                </div>
                                                <div className="text-gray-300 text-sm mb-4">
                                                    <span className="text-gray-400">Applicant:</span> {(item as BarangayData).second_party_name}
                                                </div>
                                                {(item as BarangayData).status === 'PRE_APPROVED' && (
                                                    <div className="text-gray-300 text-sm mb-2">
                                                        <span className="text-gray-400">Pre-Approved By:</span> {(item as BarangayData).reviewedBy?.name || 'Community Lead'}
                                                    </div>
                                                )}
                                                {(item as BarangayData).status === 'APPROVED' && (
                                                    <div className="mb-4">
                                                        <span className="text-gray-400 text-sm">Tier:</span>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${getTierBadgeColor((item as BarangayData).tier)}`}>
                                                            {getTierDisplayName((item as BarangayData).tier)}
                                                        </span>
                                                    </div>
                                                )}
                                                <button 
                                                    onClick={() => handleViewApplication(item as any)}
                                                    className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-white/10 backdrop-blur-sm border border-white/20 
                                                        rounded-xl shadow-lg hover:shadow-white/10 transition-all duration-300 
                                                        hover:bg-white/20 hover:scale-105 
                                                        focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                >
                                                    <span className="relative z-10 flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        <span>View Application</span>
                                                    </span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Modern Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-6">
                                {/* Previous/Next buttons */}
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className={`group relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold transition-all duration-300 ${
                                            currentPage === 1
                                                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                                : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-white/10 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900'
                                        }`}
                                    >
                                        <span className="relative z-10 flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            <span>Previous</span>
                                        </span>
                                    </button>
                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`group relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold transition-all duration-300 ${
                                            currentPage === totalPages
                                                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                                : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg hover:shadow-white/10 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900'
                                        }`}
                                    >
                                        <span className="relative z-10 flex items-center space-x-2">
                                            <span>Next</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>

                                {/* Page numbers */}
                                <div className="flex items-center space-x-2">
                                    {getPageNumbers().map((page, index) => (
                                        <button
                                            key={index}
                                            onClick={() => typeof page === 'number' && goToPage(page)}
                                            disabled={typeof page !== 'number'}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                                page === currentPage
                                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-2xl hover:shadow-yellow-500/25 hover:scale-105'
                                                    : typeof page === 'number'
                                                    ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-white/10 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900'
                                                    : 'text-gray-500 cursor-default'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                {/* Jump to page */}
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-300 text-sm">Go to:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={totalPages}
                                        value={currentPage}
                                        onChange={(e) => {
                                            const page = parseInt(e.target.value);
                                            if (page >= 1 && page <= totalPages) {
                                                goToPage(page);
                                            }
                                        }}
                                        className="w-20 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 
                                            focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                            transition-all duration-300 hover:bg-white/15 text-center"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            color: 'white',
                                            WebkitAppearance: 'none',
                                            MozAppearance: 'none',
                                            appearance: 'none'
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* View Info Modal */}
            {viewMode === 'barangays' && (
                <ViewInfoModal 
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    barangayData={selectedBarangay}
                    user={user}
                    onSuccess={handleSuccess}
                />
            )}
            
            {/* View Event Modal */}
            {viewMode === 'events' && (
                <ViewEventModal 
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    eventData={selectedEvent}
                    onSuccess={handleSuccess}
                    user={user}
                />
            )}
        </>
    );
}

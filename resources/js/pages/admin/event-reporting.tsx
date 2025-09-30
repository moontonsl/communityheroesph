import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Header from '@/pages/partials/header';

interface EventData {
    id: number;
    event_id: string;
    event_name: string;
    event_description: string;
    event_date: string;
    event_location: string;
    campaign: string;
    expected_participants: number;
    status: string;
    barangay_submission?: {
        barangay_name: string;
        municipality_name: string;
        province_name: string;
        region_name: string;
    };
    appliedBy?: {
        name: string;
    };
    assignedUser?: {
        name: string;
    };
}

interface ReportData {
    id: number;
    report_id: string;
    event_id: number;
    event_name: string;
    event_date: string;
    status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED';
    first_clearance_status?: 'PENDING' | 'CLEARED';
    final_clearance_status?: 'PENDING' | 'CLEARED';
    created_at: string;
    updated_at: string;
    event?: EventData;
    reportedBy?: {
        name: string;
    };
    reviewedBy?: {
        name: string;
    };
    approvedBy?: {
        name: string;
    };
}

interface Stats {
    total_reports: number;
    draft_reports: number;
    submitted_reports: number;
    pre_approved_reports: number;
    reviewed_reports: number;
    approved_reports: number;
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

interface EventReportingProps {
    events: EventData[];
    reports: ReportData[];
    stats: Stats;
    user: User;
}

export default function EventReporting({ events, reports, stats, user }: EventReportingProps) {
    const [activeTab, setActiveTab] = useState<'events' | 'reports'>('events');
    const [filterText, setFilterText] = useState('');

    // Helper function to get status badge color
    const getStatusBadgeColor = (status: string): string => {
        switch (status) {
            case 'DRAFT':
                return 'bg-gray-100 text-gray-800';
            case 'SUBMITTED':
                return 'bg-blue-100 text-blue-800';
            case 'PRE_APPROVED':
                return 'bg-purple-100 text-purple-800';
            case 'REVIEWED':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Helper function to get role display name
    const getRoleDisplayName = (roleSlug: string): string => {
        switch (roleSlug) {
            case 'area-admin':
                return 'Area Admin';
            case 'community-lead':
                return 'Community Lead';
            case 'super-admin':
                return 'Super Admin';
            case 'super-admin-a':
                return 'Super Admin A';
            case 'super-admin-b':
                return 'Super Admin B';
            default:
                return 'User';
        }
    };

    // Filter data based on search
    const filteredEvents = events.filter(event => 
        event.event_name.toLowerCase().includes(filterText.toLowerCase()) ||
        event.event_location.toLowerCase().includes(filterText.toLowerCase()) ||
        event.campaign.toLowerCase().includes(filterText.toLowerCase()) ||
        event.barangay_submission?.barangay_name.toLowerCase().includes(filterText.toLowerCase())
    );

    const filteredReports = reports.filter(report => 
        report.event_name.toLowerCase().includes(filterText.toLowerCase()) ||
        report.report_id.toLowerCase().includes(filterText.toLowerCase()) ||
        report.status.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <>
            <Head title="Event Reporting" />
            <Header />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden welcome-background">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                                        radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)`,
                    }}></div>
                </div>
                
                <div className="container mx-auto px-4 py-8 relative z-10">
                    
                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-block">
                            <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-gradient">
                                EVENT REPORTING
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-gray-300 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                            Create and manage post-event reports for completed events
                        </p>
                    </div>

                    {/* User Info */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-up mb-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl">
                                    <span className="text-2xl font-bold text-white">
                                        {user.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                                    </span>
                                </div>
                                <div className="text-white">
                                    <h2 className="text-xl font-bold mb-2">{user.name.toUpperCase()}</h2>
                                    <div className="text-gray-300">{getRoleDisplayName(user.role.slug)}</div>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <Link 
                                    href="/event-reporting/create"
                                    className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-green-600 
                                        rounded-md shadow-2xl hover:shadow-green-500/25 transition-all duration-300 
                                        hover:from-green-400 hover:to-green-500 hover:scale-105 
                                        focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900">
                                    <span className="relative z-10 flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span>Create New Report</span>
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">Total Reports</div>
                            <div className="text-white text-3xl font-bold">{stats.total_reports}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">Draft</div>
                            <div className="text-white text-3xl font-bold">{stats.draft_reports}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">Submitted</div>
                            <div className="text-white text-3xl font-bold">{stats.submitted_reports}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">Pre-Approved</div>
                            <div className="text-white text-3xl font-bold">{stats.pre_approved_reports}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">Reviewed</div>
                            <div className="text-white text-3xl font-bold">{stats.reviewed_reports}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-md p-6 text-center shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-gray-300 text-sm mb-2 uppercase tracking-wider">Approved</div>
                            <div className="text-white text-3xl font-bold">{stats.approved_reports}</div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <button 
                            onClick={() => setActiveTab('events')}
                            className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                activeTab === 'events'
                                    ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-2xl hover:shadow-blue-500/25 hover:from-blue-400 hover:to-blue-500 focus:ring-blue-500/50'
                                    : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                            }`}>
                            <span className="relative z-10 flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Available Events ({filteredEvents.length})</span>
                            </span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('reports')}
                            className={`group relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-300 rounded-md shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                activeTab === 'reports'
                                    ? 'text-white bg-gradient-to-r from-purple-500 to-purple-600 shadow-2xl hover:shadow-purple-500/25 hover:from-purple-400 hover:to-purple-500 focus:ring-purple-500/50'
                                    : 'text-white bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-white/10 hover:bg-white/20 focus:ring-white/20'
                            }`}>
                            <span className="relative z-10 flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>My Reports ({filteredReports.length})</span>
                            </span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder={`Search ${activeTab === 'events' ? 'events' : 'reports'}...`}
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                className="w-full px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 
                                    focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 
                                    transition-all duration-300 hover:bg-white/15"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-up">
                        
                        {activeTab === 'events' ? (
                            <>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></div>
                                    <h3 className="text-3xl font-bold text-white">Available Events for Reporting</h3>
                                </div>

                                {filteredEvents.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
                                            </svg>
                                        </div>
                                        <div className="text-gray-300 text-lg mb-2">No events available for reporting</div>
                                        <div className="text-gray-400 text-sm">All approved events have been reported or no approved events are available</div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredEvents.map((event) => (
                                            <div key={event.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-bold text-lg mb-2">{event.event_name}</h4>
                                                        <p className="text-gray-300 text-sm mb-2">{event.event_location}</p>
                                                        <p className="text-gray-400 text-xs">{new Date(event.event_date).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                        event.status === 'APPROVED' ? 'text-green-400 bg-green-400/20' :
                                                        event.status === 'COMPLETED' ? 'text-green-400 bg-green-400/20' :
                                                        event.status === 'CLEARED' ? 'text-blue-400 bg-blue-400/20' : 'text-gray-400 bg-gray-400/20'
                                                    }`}>
                                                        {event.status}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-gray-300 text-sm mb-4">
                                                    <div className="mb-1">
                                                        <span className="text-gray-400">Campaign:</span> {event.campaign}
                                                    </div>
                                                    <div className="mb-1">
                                                        <span className="text-gray-400">Barangay:</span> {event.barangay_submission?.barangay_name || 'N/A'}
                                                    </div>
                                                    <div className="mb-1">
                                                        <span className="text-gray-400">Expected Participants:</span> {event.expected_participants}
                                                    </div>
                                                </div>

                                                <Link 
                                                    href={`/event-reporting/create?event_id=${event.id}`}
                                                    className="group relative inline-flex items-center justify-center w-full px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-green-600 
                                                        rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 
                                                        hover:from-green-400 hover:to-green-500 hover:scale-105 
                                                        focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900">
                                                    <span className="relative z-10 flex items-center space-x-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        <span>Create Report</span>
                                                    </span>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
                                    <h3 className="text-3xl font-bold text-white">
                                        {(user?.role?.slug === 'super-admin' || user?.role?.slug === 'super-admin-a' || user?.role?.slug === 'super-admin-b') 
                                            ? 'All Event Reports' 
                                            : 'My Event Reports'
                                        }
                                    </h3>
                                </div>

                                {filteredReports.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="text-gray-300 text-lg mb-2">No reports found</div>
                                        <div className="text-gray-400 text-sm">
                                            {(user?.role?.slug === 'super-admin' || user?.role?.slug === 'super-admin-a' || user?.role?.slug === 'super-admin-b') 
                                                ? 'No event reports have been submitted yet' 
                                                : 'Create your first event report to get started'
                                            }
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredReports.map((report) => (
                                            <div key={report.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-bold text-lg mb-2">{report.event_name}</h4>
                                                        <p className="text-gray-300 text-sm mb-2">Report ID: {report.report_id}</p>
                                                        <p className="text-gray-400 text-xs">{new Date(report.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end space-y-2">
                                                        <div className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusBadgeColor(report.status)}`}>
                                                            {report.status}
                                                        </div>
                                                        {(report.first_clearance_status || report.final_clearance_status) && (
                                                            <div className="flex space-x-2">
                                                                {report.first_clearance_status && (
                                                                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                                        report.first_clearance_status === 'CLEARED' 
                                                                            ? 'text-green-400 bg-green-400/20' 
                                                                            : 'text-yellow-400 bg-yellow-400/20'
                                                                    }`}>
                                                                        First: {report.first_clearance_status}
                                                                    </div>
                                                                )}
                                                                {report.final_clearance_status && (
                                                                    <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                                        report.final_clearance_status === 'CLEARED' 
                                                                            ? 'text-green-400 bg-green-400/20' 
                                                                            : 'text-yellow-400 bg-yellow-400/20'
                                                                    }`}>
                                                                        Final: {report.final_clearance_status}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                    <div className="text-gray-300 text-sm">
                                                        {report.reviewedBy && (
                                                            <div>Reviewed by: {report.reviewedBy.name}</div>
                                                        )}
                                                        {report.approvedBy && (
                                                            <div>Approved by: {report.approvedBy.name}</div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex space-x-2">
                                                        <Link 
                                                            href={`/event-reporting/${report.id}`}
                                                            className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-white/10 backdrop-blur-sm border border-white/20 
                                                                rounded-xl shadow-lg hover:shadow-white/10 transition-all duration-300 
                                                                hover:bg-white/20 hover:scale-105 
                                                                focus:outline-none focus:ring-4 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900">
                                                            <span className="relative z-10 flex items-center space-x-1">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                <span>View</span>
                                                            </span>
                                                        </Link>
                                                        
                                                        {report.status === 'DRAFT' && (
                                                            <Link 
                                                                href={`/event-reporting/${report.id}/edit`}
                                                                className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 
                                                                    rounded-xl shadow-lg hover:shadow-blue-500/10 transition-all duration-300 
                                                                    hover:bg-blue-500/30 hover:scale-105 
                                                                    focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-gray-900">
                                                                <span className="relative z-10 flex items-center space-x-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                    <span>Edit</span>
                                                                </span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

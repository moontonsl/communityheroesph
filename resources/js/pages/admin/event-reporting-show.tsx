import { Head, Link, usePage } from '@inertiajs/react';
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
    event_description: string;
    event_date: string;
    event_location: string;
    campaign: string;
    pic?: string;
    cash_allocation?: number;
    diamonds_expenditure?: number;
    total_cost_php?: number;
    post_event_file_path?: string;
    post_event_file_name?: string;
    status: 'DRAFT' | 'SUBMITTED' | 'PRE_APPROVED' | 'REVIEWED' | 'APPROVED';
    first_clearance_status: 'PENDING' | 'CLEARED';
    final_clearance_status: 'PENDING' | 'CLEARED';
    admin_notes?: string;
    created_at: string;
    updated_at: string;
    reviewed_at?: string;
    approved_at?: string;
    first_cleared_at?: string;
    final_cleared_at?: string;
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
    firstClearedBy?: {
        name: string;
    };
    finalClearedBy?: {
        name: string;
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

interface EventReportingShowProps {
    report: ReportData;
    user: User;
}

export default function EventReportingShow({ report, user }: EventReportingShowProps) {
    const { flash } = usePage().props as any;
    // Helper function to get status badge color
    const getStatusBadgeColor = (status: string): string => {
        switch (status) {
            case 'DRAFT':
                return 'bg-gray-100 text-gray-800';
            case 'SUBMITTED':
                return 'bg-blue-100 text-blue-800';
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

    return (
        <>
            <Head title={`Event Report - ${report.report_id}`} />
            <Header />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden welcome-background">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 0%, transparent 50%), 
                                        radial-gradient(circle at 75% 75%, #f59e0b 0%, transparent 50%)`,
                    }}></div>
                </div>

                {/* Success Message */}
                {flash?.success && (
                    <div className="relative z-10 bg-green-500/20 border border-green-500/30 rounded-lg p-4 mx-4 mt-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-green-400 font-semibold">{flash.success}</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {flash?.error && (
                    <div className="relative z-10 bg-red-500/20 border border-red-500/30 rounded-lg p-4 mx-4 mt-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <p className="text-red-400 font-semibold">{flash.error}</p>
                        </div>
                    </div>
                )}
                
                <div className="container mx-auto px-4 py-8 relative z-10">
                    
                    {/* Header */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-block">
                            <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-gradient">
                                EVENT REPORT
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-gray-300 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                            Report ID: {report.report_id}
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 animate-slide-up">
                            
                            {/* Report Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{report.event_name}</h2>
                                    <p className="text-gray-300">{report.event_location}</p>
                                    <p className="text-gray-400 text-sm">{new Date(report.event_date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-bold px-3 py-1 rounded-full ${getStatusBadgeColor(report.status)}`}>
                                        {report.status}
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Created: {new Date(report.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Report Information Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                
                                {/* Event Information */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4">Event Information</h3>
                                    <div className="space-y-3 text-gray-300">
                                        <div>
                                            <span className="text-gray-400">Event ID:</span> {report.event?.event_id || 'N/A'}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Campaign:</span> {report.campaign}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Expected Participants:</span> {report.event?.expected_participants || 'N/A'}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Barangay:</span> {report.event?.barangay_submission?.barangay_name || 'N/A'}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Municipality:</span> {report.event?.barangay_submission?.municipality_name || 'N/A'}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Province:</span> {report.event?.barangay_submission?.province_name || 'N/A'}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Region:</span> {report.event?.barangay_submission?.region_name || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Report Details */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <h3 className="text-xl font-bold text-white mb-4">Report Details</h3>
                                    <div className="space-y-3 text-gray-300">
                                        <div>
                                            <span className="text-gray-400">Report ID:</span> {report.report_id}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Reported By:</span> {report.reportedBy?.name || 'N/A'}
                                        </div>
                                        {report.reviewedBy && (
                                            <div>
                                                <span className="text-gray-400">Reviewed By:</span> {report.reviewedBy.name}
                                            </div>
                                        )}
                                        {report.approvedBy && (
                                            <div>
                                                <span className="text-gray-400">Approved By:</span> {report.approvedBy.name}
                                            </div>
                                        )}
                                        {report.reviewed_at && (
                                            <div>
                                                <span className="text-gray-400">Reviewed At:</span> {new Date(report.reviewed_at).toLocaleDateString()}
                                            </div>
                                        )}
                                        {report.approved_at && (
                                            <div>
                                                <span className="text-gray-400">Approved At:</span> {new Date(report.approved_at).toLocaleDateString()}
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-gray-400">Last Updated:</span> {new Date(report.updated_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Report Content */}
                            <div className="space-y-8">
                                
                                {/* Post Event Information - Super Admin Only */}
                                {(user?.role?.slug === 'super-admin-a' || user?.role?.slug === 'super-admin' || user?.role?.slug === 'super-admin-b') && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-4">Post Event Information</h3>
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-gray-400 text-sm font-semibold mb-2">PIC</label>
                                                    <p className="text-white">{report.pic || 'Not specified'}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-400 text-sm font-semibold mb-2">Cash Allocation</label>
                                                    <p className="text-white">₱{report.cash_allocation ? Number(report.cash_allocation).toLocaleString() : '0.00'}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-400 text-sm font-semibold mb-2">Diamonds Expenditure</label>
                                                    <p className="text-white">{report.diamonds_expenditure || '0'} diamonds</p>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-400 text-sm font-semibold mb-2">Total Cost (PHP)</label>
                                                    <p className="text-white font-bold text-lg">₱{report.total_cost_php ? Number(report.total_cost_php).toLocaleString() : '0.00'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Clearance Status */}
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Clearance Status</h3>
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-gray-400 font-semibold">First Clearance</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        report.first_clearance_status === 'CLEARED' 
                                                            ? 'text-green-400 bg-green-400/20' 
                                                            : 'text-yellow-400 bg-yellow-400/20'
                                                    }`}>
                                                        {report.first_clearance_status}
                                                    </span>
                                                </div>
                                                {report.firstClearedBy && (
                                                    <p className="text-gray-300 text-sm">
                                                        Cleared by: {report.firstClearedBy?.name}
                                                    </p>
                                                )}
                                                {report.first_cleared_at && (
                                                    <p className="text-gray-300 text-sm">
                                                        Date: {new Date(report.first_cleared_at).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-gray-400 font-semibold">Final Clearance</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        report.final_clearance_status === 'CLEARED' 
                                                            ? 'text-green-400 bg-green-400/20' 
                                                            : 'text-yellow-400 bg-yellow-400/20'
                                                    }`}>
                                                        {report.final_clearance_status}
                                                    </span>
                                                </div>
                                                {report.finalClearedBy && (
                                                    <p className="text-gray-300 text-sm">
                                                        Cleared by: {report.finalClearedBy?.name}
                                                    </p>
                                                )}
                                                {report.final_cleared_at && (
                                                    <p className="text-gray-300 text-sm">
                                                        Date: {new Date(report.final_cleared_at).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Event File */}
                                {report.post_event_file_path && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-4">Post Event Report File</h3>
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-white font-semibold">{report.post_event_file_name}</p>
                                                        <p className="text-gray-400 text-sm">PDF Document</p>
                                                    </div>
                                                </div>
                                                <a
                                                    href={`/storage/${report.post_event_file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                                >
                                                    View File
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Admin Notes */}
                                {report.admin_notes && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-4">Admin Notes</h3>
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{report.admin_notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                                <Link 
                                    href="/event-reporting"
                                    className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
                                >
                                    ← Back to Reports
                                </Link>
                                
                                <div className="flex space-x-4">
                                    {/* Edit Report - Only for Area Admin when status is DRAFT and clearances are not completed */}
                                    {user?.role?.slug === 'area-admin' && report.status === 'DRAFT' && report.first_clearance_status !== 'CLEARED' && report.final_clearance_status !== 'CLEARED' && (
                                        <Link 
                                            href={`/event-reporting/${report.id}/edit`}
                                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                        >
                                            Edit Report
                                        </Link>
                                    )}
                                    
                                    {/* Submit Report - Only for Area Admin when status is DRAFT and clearances are not completed */}
                                    {user?.role?.slug === 'area-admin' && report.status === 'DRAFT' && report.first_clearance_status !== 'CLEARED' && report.final_clearance_status !== 'CLEARED' && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to submit this report? Once submitted, it cannot be edited.')) {
                                                    console.log('Submitting report:', report.id);
                                                    // Submit report
                                                    fetch(`/event-reporting/${report.id}/submit`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                        },
                                                    })
                                                    .then(response => {
                                                        console.log('Submit response status:', response.status);
                                                        if (response.ok) {
                                                            console.log('Report submitted successfully');
                                                            window.location.reload();
                                                        } else {
                                                            console.error('Submit failed:', response.statusText);
                                                            alert('Failed to submit report. Please try again.');
                                                        }
                                                    })
                                                    .catch(error => {
                                                        console.error('Submit error:', error);
                                                        alert('Error submitting report. Please try again.');
                                                    });
                                                }
                                            }}
                                            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                        >
                                            Submit Report
                                        </button>
                                    )}

                                    {/* Community Lead Pre-approve Action */}
                                    {user?.role?.slug === 'community-lead' && report.status === 'SUBMITTED' && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to pre-approve this report?')) {
                                                    fetch(`/event-reporting/${report.id}/pre-approve`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                        },
                                                        body: JSON.stringify({
                                                            admin_notes: 'Pre-approved by Community Lead'
                                                        })
                                                    }).then(() => {
                                                        window.location.reload();
                                                    });
                                                }
                                            }}
                                            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                                        >
                                            Pre-approve Report
                                        </button>
                                    )}

                                    {/* Super Admin A Review and Approve Actions */}
                                    {user?.role?.slug === 'super-admin-a' && report.status === 'PRE_APPROVED' && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to review this report?')) {
                                                    fetch(`/event-reporting/${report.id}/review`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                        },
                                                        body: JSON.stringify({
                                                            admin_notes: 'Reviewed by Super Admin A'
                                                        })
                                                    }).then(() => {
                                                        window.location.reload();
                                                    });
                                                }
                                            }}
                                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                        >
                                            Review Report
                                        </button>
                                    )}

                                    {user?.role?.slug === 'super-admin-a' && report.status === 'REVIEWED' && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to approve this report?')) {
                                                    fetch(`/event-reporting/${report.id}/approve`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                        },
                                                        body: JSON.stringify({
                                                            admin_notes: 'Approved by Super Admin A'
                                                        })
                                                    }).then(() => {
                                                        window.location.reload();
                                                    });
                                                }
                                            }}
                                            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                        >
                                            Approve Report
                                        </button>
                                    )}

                                    {/* Super Admin Actions */}
                                    {(user?.role?.slug === 'super-admin-a' || user?.role?.slug === 'super-admin') && report.status === 'APPROVED' && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to perform first clearance?')) {
                                                    fetch(`/event-reporting/${report.id}/first-clearance`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                        },
                                                    }).then(() => {
                                                        window.location.reload();
                                                    });
                                                }
                                            }}
                                            disabled={report.first_clearance_status === 'CLEARED'}
                                            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            First Clearance
                                        </button>
                                    )}

                                    {user?.role?.slug === 'super-admin-b' && report.first_clearance_status === 'CLEARED' && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to perform final clearance?')) {
                                                    fetch(`/event-reporting/${report.id}/final-clearance`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                        },
                                                    }).then(() => {
                                                        window.location.reload();
                                                    });
                                                }
                                            }}
                                            disabled={report.final_clearance_status === 'CLEARED'}
                                            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            Final Clearance
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

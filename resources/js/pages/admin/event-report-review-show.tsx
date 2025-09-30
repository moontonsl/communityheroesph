import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FileText, Calendar, MapPin, Users, Download, CheckCircle, Clock, AlertCircle, DollarSign, Gem, User } from 'lucide-react';

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
    event?: {
        id: number;
        event_name: string;
        event_description: string;
        event_date: string;
        event_location: string;
        campaign: string;
        expected_participants: number;
        status: string;
    };
    reportedBy?: {
        id: number;
        name: string;
        email: string;
    };
    reviewedBy?: {
        id: number;
        name: string;
        email: string;
    };
    approvedBy?: {
        id: number;
        name: string;
        email: string;
    };
    firstClearedBy?: {
        id: number;
        name: string;
        email: string;
    };
    finalClearedBy?: {
        id: number;
        name: string;
        email: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    role?: {
        slug: string;
        name: string;
    };
}

interface Props {
    report: ReportData;
    user: User;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function EventReportReviewShow({ report, user, flash }: Props) {
    const [adminNotes, setAdminNotes] = useState(report.admin_notes || '');
    const [isUpdatingFinancials, setIsUpdatingFinancials] = useState(false);
    const [financialData, setFinancialData] = useState({
        pic: report.pic || '',
        cash_allocation: report.cash_allocation || '',
        diamonds_expenditure: report.diamonds_expenditure || '',
        total_cost_php: report.total_cost_php || ''
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return <AlertCircle className="w-5 h-5" />;
            case 'SUBMITTED':
                return <Clock className="w-5 h-5" />;
            case 'PRE_APPROVED':
                return <CheckCircle className="w-5 h-5" />;
            case 'REVIEWED':
                return <CheckCircle className="w-5 h-5" />;
            case 'APPROVED':
                return <CheckCircle className="w-5 h-5" />;
            default:
                return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return 'text-gray-400 bg-gray-400/20';
            case 'SUBMITTED':
                return 'text-blue-400 bg-blue-400/20';
            case 'PRE_APPROVED':
                return 'text-purple-400 bg-purple-400/20';
            case 'REVIEWED':
                return 'text-yellow-400 bg-yellow-400/20';
            case 'APPROVED':
                return 'text-green-400 bg-green-400/20';
            default:
                return 'text-gray-400 bg-gray-400/20';
        }
    };

    const getClearanceColor = (status: string) => {
        return status === 'CLEARED' 
            ? 'text-green-400 bg-green-400/20' 
            : 'text-yellow-400 bg-yellow-400/20';
    };

    const handleReview = () => {
        if (confirm('Are you sure you want to review this report?')) {
            fetch(`/event-report-review/${report.id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    admin_notes: adminNotes
                })
            }).then(() => {
                window.location.reload();
            });
        }
    };

    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this report?')) {
            fetch(`/event-report-review/${report.id}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    admin_notes: adminNotes
                })
            }).then(() => {
                window.location.reload();
            });
        }
    };

    const handleFirstClearance = () => {
        if (confirm('Are you sure you want to mark this report as first cleared?')) {
            fetch(`/event-report-review/${report.id}/first-clearance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                }
            }).then(() => {
                window.location.reload();
            });
        }
    };

    const handleFinalClearance = () => {
        if (confirm('Are you sure you want to mark this report as final cleared?')) {
            fetch(`/event-report-review/${report.id}/final-clearance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                }
            }).then(() => {
                window.location.reload();
            });
        }
    };

    const handleUpdateFinancials = () => {
        setIsUpdatingFinancials(true);
        fetch(`/event-report-review/${report.id}/financials`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify(financialData)
        }).then(() => {
            setIsUpdatingFinancials(false);
            window.location.reload();
        }).catch(() => {
            setIsUpdatingFinancials(false);
        });
    };

    return (
        <AppLayout
            user={user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Event Report Review
                </h2>
            }
        >
            <Head title={`Event Report Review - ${report.event_name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Flash Messages */}
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

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{report.event_name}</h1>
                                <p className="text-gray-400">Report ID: {report.report_id}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className={`text-sm font-bold px-3 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(report.status)}`}>
                                    {getStatusIcon(report.status)}
                                    <span>{report.status}</span>
                                </div>
                                <Link
                                    href="/event-report-review"
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Back to Reports
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Event Information */}
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">Event Information</h3>
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-400 text-sm font-semibold mb-2">Event Name</label>
                                            <p className="text-white">{report.event_name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm font-semibold mb-2">Event Date</label>
                                            <p className="text-white">{new Date(report.event_date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm font-semibold mb-2">Event Location</label>
                                            <p className="text-white">{report.event_location}</p>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm font-semibold mb-2">Campaign</label>
                                            <p className="text-white">{report.campaign}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-gray-400 text-sm font-semibold mb-2">Event Description</label>
                                            <p className="text-white">{report.event_description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Information - Only for Super Admin and Super Admin A */}
                            {(user?.role?.slug === 'super-admin' || user?.role?.slug === 'super-admin-a') && (
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Financial Information</h3>
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-400 text-sm font-semibold mb-2">PIC</label>
                                                <input
                                                    type="text"
                                                    value={financialData.pic}
                                                    onChange={(e) => setFinancialData({...financialData, pic: e.target.value})}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter PIC name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 text-sm font-semibold mb-2">Cash Allocation</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={financialData.cash_allocation}
                                                    onChange={(e) => setFinancialData({...financialData, cash_allocation: e.target.value})}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 text-sm font-semibold mb-2">Diamonds Expenditure</label>
                                                <input
                                                    type="number"
                                                    value={financialData.diamonds_expenditure}
                                                    onChange={(e) => setFinancialData({...financialData, diamonds_expenditure: e.target.value})}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 text-sm font-semibold mb-2">Total Cost (PHP)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={financialData.total_cost_php}
                                                    onChange={(e) => setFinancialData({...financialData, total_cost_php: e.target.value})}
                                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                onClick={handleUpdateFinancials}
                                                disabled={isUpdatingFinancials}
                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg transition-colors"
                                            >
                                                {isUpdatingFinancials ? 'Updating...' : 'Update Financial Information'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Post Event File */}
                            {report.post_event_file_path && (
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Post Event Reporting File</h3>
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="w-8 h-8 text-blue-400" />
                                            <div>
                                                <p className="text-white font-semibold">{report.post_event_file_name}</p>
                                                <a
                                                    href={`/storage/${report.post_event_file_path}`}
                                                    download
                                                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span>Download File</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes */}
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">Admin Notes</h3>
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Add admin notes..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Report Status */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Report Status</h3>
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Status</span>
                                            <div className={`text-sm font-bold px-2 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                                                {getStatusIcon(report.status)}
                                                <span>{report.status}</span>
                                            </div>
                                        </div>
                                        
                                        {report.reviewedBy && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Reviewed by</span>
                                                <span className="text-white">{report.reviewedBy.name}</span>
                                            </div>
                                        )}
                                        
                                        {report.reviewed_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Reviewed at</span>
                                                <span className="text-white">{new Date(report.reviewed_at).toLocaleString()}</span>
                                            </div>
                                        )}
                                        
                                        {report.approvedBy && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Approved by</span>
                                                <span className="text-white">{report.approvedBy.name}</span>
                                            </div>
                                        )}
                                        
                                        {report.approved_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Approved at</span>
                                                <span className="text-white">{new Date(report.approved_at).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Clearance Status */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Clearance Status</h3>
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">First Clearance</span>
                                            <div className={`text-sm font-bold px-2 py-1 rounded-full ${getClearanceColor(report.first_clearance_status)}`}>
                                                {report.first_clearance_status}
                                            </div>
                                        </div>
                                        
                                        {report.firstClearedBy && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Cleared by</span>
                                                <span className="text-white">{report.firstClearedBy.name}</span>
                                            </div>
                                        )}
                                        
                                        {report.first_cleared_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Cleared at</span>
                                                <span className="text-white">{new Date(report.first_cleared_at).toLocaleString()}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Final Clearance</span>
                                            <div className={`text-sm font-bold px-2 py-1 rounded-full ${getClearanceColor(report.final_clearance_status)}`}>
                                                {report.final_clearance_status}
                                            </div>
                                        </div>
                                        
                                        {report.finalClearedBy && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Cleared by</span>
                                                <span className="text-white">{report.finalClearedBy.name}</span>
                                            </div>
                                        )}
                                        
                                        {report.final_cleared_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Cleared at</span>
                                                <span className="text-white">{new Date(report.final_cleared_at).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <div className="space-y-3">
                                        {/* Review Button - Super Admin and Super Admin A */}
                                        {(user?.role?.slug === 'super-admin' || user?.role?.slug === 'super-admin-a') && report.status === 'PRE_APPROVED' && (
                                            <button
                                                onClick={handleReview}
                                                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                            >
                                                Review Report
                                            </button>
                                        )}

                                        {/* Approve Button - Super Admin and Super Admin A */}
                                        {(user?.role?.slug === 'super-admin' || user?.role?.slug === 'super-admin-a') && report.status === 'REVIEWED' && (
                                            <button
                                                onClick={handleApprove}
                                                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                            >
                                                Approve Report
                                            </button>
                                        )}

                                        {/* First Clearance Button - Super Admin and Super Admin A */}
                                        {(user?.role?.slug === 'super-admin' || user?.role?.slug === 'super-admin-a') && report.status === 'APPROVED' && report.first_clearance_status === 'PENDING' && (
                                            <button
                                                onClick={handleFirstClearance}
                                                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                                            >
                                                First Clearance
                                            </button>
                                        )}

                                        {/* Final Clearance Button - Super Admin B only */}
                                        {user?.role?.slug === 'super-admin-b' && report.first_clearance_status === 'CLEARED' && report.final_clearance_status === 'PENDING' && (
                                            <button
                                                onClick={handleFinalClearance}
                                                className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                            >
                                                Final Clearance
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Report Information */}
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Report Information</h3>
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Reported by</span>
                                            <span className="text-white">{report.reportedBy?.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Created</span>
                                            <span className="text-white">{new Date(report.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Last updated</span>
                                            <span className="text-white">{new Date(report.updated_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

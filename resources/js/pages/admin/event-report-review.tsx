import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FileText, Search, Calendar, MapPin, Users, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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
    status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED';
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
    role?: {
        slug: string;
        name: string;
    };
}

interface Props {
    reports: ReportData[];
    stats: Stats;
    user: User;
}

export default function EventReportReview({ reports, stats, user }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Filter reports based on search term and status
    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchesSearch = 
                report.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.event_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.reportedBy?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.report_id.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [reports, searchTerm, statusFilter]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'DRAFT':
                return <AlertCircle className="w-4 h-4" />;
            case 'SUBMITTED':
                return <Clock className="w-4 h-4" />;
            case 'PRE_APPROVED':
                return <CheckCircle className="w-4 h-4" />;
            case 'REVIEWED':
                return <CheckCircle className="w-4 h-4" />;
            case 'APPROVED':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
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

    return (
        <AppLayout>
            <Head title="Event Report Review" />

            <div className="py-12 ">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Event Report Review</h1>
                        <p className="text-gray-400">Review and manage submitted event reports</p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <FileText className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">TOTAL REPORTS</p>
                                    <p className="text-2xl font-bold text-white">{stats.total_reports}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-500/20 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">DRAFT</p>
                                    <p className="text-2xl font-bold text-white">{stats.draft_reports}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Clock className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">SUBMITTED</p>
                                    <p className="text-2xl font-bold text-white">{stats.submitted_reports}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">PRE-APPROVED</p>
                                    <p className="text-2xl font-bold text-white">{stats.pre_approved_reports}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">REVIEWED</p>
                                    <p className="text-2xl font-bold text-white">{stats.reviewed_reports}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">APPROVED</p>
                                    <p className="text-2xl font-bold text-white">{stats.approved_reports}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search reports..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="md:w-48">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all" className="bg-gray-800">All Status</option>
                                    <option value="DRAFT" className="bg-gray-800">Draft</option>
                                    <option value="SUBMITTED" className="bg-gray-800">Submitted</option>
                                    <option value="PRE_APPROVED" className="bg-gray-800">Pre-Approved</option>
                                    <option value="REVIEWED" className="bg-gray-800">Reviewed</option>
                                    <option value="APPROVED" className="bg-gray-800">Approved</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-white mb-6">All Event Reports ({filteredReports.length})</h3>
                            
                            {filteredReports.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <div className="text-gray-300 text-lg mb-2">No reports found</div>
                                    <div className="text-gray-400 text-sm">
                                        {searchTerm || statusFilter !== 'all' 
                                            ? 'Try adjusting your search or filter criteria' 
                                            : 'No event reports have been submitted yet'
                                        }
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredReports.map((report) => (
                                        <div key={report.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h4 className="text-xl font-bold text-white">{report.event_name}</h4>
                                                        <div className={`text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                                                            {getStatusIcon(report.status)}
                                                            <span>{report.status}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                        <div className="flex items-center space-x-2 text-gray-300">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{report.event_location}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-gray-300">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{new Date(report.event_date).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-gray-300">
                                                            <FileText className="w-4 h-4" />
                                                            <span>Report ID: {report.report_id}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-gray-300">
                                                            <Users className="w-4 h-4" />
                                                            <span>Reported by: {report.reportedBy?.name}</span>
                                                        </div>
                                                    </div>

                                                    {/* Clearance Status */}
                                                    {(report.first_clearance_status || report.final_clearance_status) && (
                                                        <div className="flex space-x-2 mt-3">
                                                            {report.first_clearance_status && (
                                                                <div className={`text-xs font-bold px-2 py-1 rounded-full ${getClearanceColor(report.first_clearance_status)}`}>
                                                                    First: {report.first_clearance_status}
                                                                </div>
                                                            )}
                                                            {report.final_clearance_status && (
                                                                <div className={`text-xs font-bold px-2 py-1 rounded-full ${getClearanceColor(report.final_clearance_status)}`}>
                                                                    Final: {report.final_clearance_status}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <Link
                                                        href={`/event-report-review/${report.id}`}
                                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span>Review</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

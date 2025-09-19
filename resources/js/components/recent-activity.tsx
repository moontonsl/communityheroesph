import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, MapPin, User, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface RecentSubmission {
    id: number;
    submission_id: string;
    barangay_name: string;
    municipality_name: string;
    province_name: string;
    region_name: string;
    status: string;
    created_at: string;
}

interface RecentEvent {
    id: number;
    event_id: string;
    event_name: string;
    event_date: string;
    status: string;
    created_at: string;
    barangay_submission: {
        barangay_name: string;
        municipality_name: string;
        province_name: string;
        region_name: string;
    };
    applied_by: {
        name: string;
    };
}

interface RecentActivityProps {
    recentSubmissions: RecentSubmission[];
    recentEvents: RecentEvent[];
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusConfig = {
        'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
        'APPROVED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
        'REJECTED': { color: 'bg-red-100 text-red-800', icon: XCircle },
        'UNDER_REVIEW': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
        'COMPLETED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
        'CANCELLED': { color: 'bg-gray-100 text-gray-800', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['PENDING'];
    const Icon = config.icon;

    return (
        <Badge className={`${config.color} flex items-center gap-1`}>
            <Icon className="h-3 w-3" />
            {status.replace('_', ' ')}
        </Badge>
    );
};

const RecentActivity: React.FC<RecentActivityProps> = ({ recentSubmissions, recentEvents }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:border-yellow-400/50">
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-yellow-400/20 rounded-2xl">
                            <MapPin className="h-6 w-6 text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Recent Barangay Submissions</h3>
                    </div>
                    <div className="space-y-6">
                        {recentSubmissions.length > 0 ? (
                            recentSubmissions.map((submission) => (
                                <div key={submission.id} className="group/item bg-gradient-to-r from-yellow-400/10 to-transparent rounded-2xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white mb-1">
                                                {submission.barangay_name}
                                            </h4>
                                            <p className="text-sm text-gray-300 mb-1">
                                                {submission.municipality_name}, {submission.province_name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {submission.region_name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <StatusBadge status={submission.status} />
                                            <p className="text-xs text-gray-400 mt-2">
                                                {formatDate(submission.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className="font-mono bg-gray-800 px-2 py-1 rounded text-gray-300">
                                            {submission.submission_id}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-400 font-medium">No recent submissions</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:border-yellow-400/50">
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-yellow-400/20 rounded-2xl">
                            <Calendar className="h-6 w-6 text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Recent Event Applications</h3>
                    </div>
                    
                    <div className="space-y-6">
                        {recentEvents.length > 0 ? (
                            recentEvents.map((event) => (
                                <div key={event.id} className="group/item bg-gradient-to-r from-yellow-400/10 to-transparent rounded-2xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white mb-1">
                                                {event.event_name}
                                            </h4>
                                            <p className="text-sm text-gray-300 mb-2">
                                                {event.barangay_submission.barangay_name}, {event.barangay_submission.municipality_name}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(event.event_date).toLocaleDateString('en-PH')}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    <span>{event.applied_by.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <StatusBadge status={event.status} />
                                            <p className="text-xs text-gray-400 mt-2">
                                                {formatDate(event.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className="font-mono bg-gray-800 px-2 py-1 rounded text-gray-300">
                                            {event.event_id}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-400 font-medium">No recent events</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentActivity;

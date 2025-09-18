import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/pages/partials/header';

interface BarangaySubmission {
    id: number;
    submission_id: string;
    region_name: string;
    province_name: string;
    municipality_name: string;
    barangay_name: string;
    zip_code: string;
    population: number;
    second_party_name: string;
    position: string;
    date_signed: string;
    stage: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export default function MyBarangays() {
    const [submissions, setSubmissions] = useState<BarangaySubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        try {
            setLoading(true);
            // This would typically fetch user's submissions
            // For demo purposes, we'll show sample data
            const sampleData: BarangaySubmission[] = [
                {
                    id: 1,
                    submission_id: 'CH-ABC12345',
                    region_name: 'National Capital Region (NCR)',
                    province_name: 'Metro Manila',
                    municipality_name: 'City of Caloocan',
                    barangay_name: 'Barangay 1',
                    zip_code: '1400',
                    population: 2319,
                    second_party_name: 'Juan Dela Cruz',
                    position: 'Barangay Captain',
                    date_signed: '2025-01-01',
                    stage: 'NEW',
                    status: 'PENDING',
                    created_at: '2025-01-11T10:00:00Z',
                    updated_at: '2025-01-11T10:00:00Z'
                },
                {
                    id: 2,
                    submission_id: 'CH-DEF67890',
                    region_name: 'Calabarzon',
                    province_name: 'Laguna',
                    municipality_name: 'City of Calamba',
                    barangay_name: 'Barangay Poblacion',
                    zip_code: '4027',
                    population: 5420,
                    second_party_name: 'Maria Santos',
                    position: 'Barangay Captain',
                    date_signed: '2025-01-05',
                    stage: 'RENEWAL',
                    status: 'APPROVED',
                    created_at: '2025-01-05T14:30:00Z',
                    updated_at: '2025-01-08T09:15:00Z'
                }
            ];
            setSubmissions(sampleData);
        } catch (error) {
            console.error('Error loading submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-500 text-yellow-900';
            case 'APPROVED':
                return 'bg-green-500 text-green-900';
            case 'REJECTED':
                return 'bg-red-500 text-red-900';
            case 'UNDER_REVIEW':
                return 'bg-blue-500 text-blue-900';
            default:
                return 'bg-gray-500 text-gray-900';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'Pending Review';
            case 'APPROVED':
                return 'Approved';
            case 'REJECTED':
                return 'Rejected';
            case 'UNDER_REVIEW':
                return 'Under Review';
            default:
                return status;
        }
    };

    const filteredSubmissions = submissions.filter(submission => {
        if (filter === 'all') return true;
        return submission.status.toLowerCase() === filter.toLowerCase();
    });

    return (
        <>
            <Head title="My Barangays">
                {/* Global Poppins font is already set in CSS */}
            </Head>
            
            <Header />

            {/* Main Content with Background Image */}
            <div className="min-h-screen welcome-background relative">
                <div className="relative z-10 pt-8">
                    <div className="max-w-7xl mx-auto px-4">
                        {/* Page Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-5xl font-bold text-white mb-2">MY BARANGAYS</h1>
                            <p className="text-yellow-400 text-lg">Track your barangay registration submissions</p>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-800 rounded-lg p-1">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        filter === 'all'
                                            ? 'bg-yellow-400 text-black'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('pending')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        filter === 'pending'
                                            ? 'bg-yellow-400 text-black'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => setFilter('approved')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        filter === 'approved'
                                            ? 'bg-yellow-400 text-black'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Approved
                                </button>
                                <button
                                    onClick={() => setFilter('rejected')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        filter === 'rejected'
                                            ? 'bg-yellow-400 text-black'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Rejected
                                </button>
                            </div>
                        </div>

                        {/* Submissions List */}
                        <div className="bg-gray-200/0 backdrop-blur-sm rounded-4xl p-6 shadow-2xl border-4 border-gray-500">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
                                    <p className="text-white mt-4">Loading submissions...</p>
                                </div>
                            ) : filteredSubmissions.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-400 text-lg">No submissions found</p>
                                    <Link
                                        href="/registerbarangay"
                                        className="inline-block mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-xl transition-colors"
                                    >
                                        Register New Barangay
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredSubmissions.map((submission) => (
                                        <div
                                            key={submission.id}
                                            className="bg-gray-800 rounded-lg p-6 border border-gray-600 hover:border-yellow-400 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">
                                                        {submission.barangay_name}
                                                    </h3>
                                                    <p className="text-gray-400">
                                                        {submission.municipality_name}, {submission.province_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Submission ID: {submission.submission_id}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}
                                                >
                                                    {getStatusText(submission.status)}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-400">Population</p>
                                                    <p className="text-white font-semibold">{submission.population?.toLocaleString() || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Zip Code</p>
                                                    <p className="text-white font-semibold">{submission.zip_code || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Stage</p>
                                                    <p className="text-white font-semibold">{submission.stage}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="border-t border-gray-600 pt-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-gray-400">Contact Person</p>
                                                        <p className="text-white">{submission.second_party_name} - {submission.position}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-400">Submitted</p>
                                                        <p className="text-white">
                                                            {new Date(submission.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="text-center mt-8">
                            <Link
                                href="/Transaction"
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl border-2 border-gray-400 text-lg transition-colors duration-200 mr-4"
                            >
                                BACK TO TRANSACTIONS
                            </Link>
                            <Link
                                href="/registerbarangay"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-xl border-2 border-yellow-400 text-lg transition-colors duration-200"
                            >
                                REGISTER NEW BARANGAY
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

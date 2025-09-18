import { Head, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Header from '@/pages/partials/header';
import ViewInfoModal from './modal/viewInfo';
import styles from '@/components/CSS/CHTransaction.module.css';

interface BarangayData {
    id: string;
    barangay: string;
    city: string;
    province: string;
    region: string;
    applicant: string;
    status: string;
}

export default function CHPortal() {
    // State for filter input
    const [filterText, setFilterText] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBarangay, setSelectedBarangay] = useState<BarangayData | null>(null);

    // Sample data - in a real app this would come from props or API
    const barangayData: BarangayData[] = [
        { id: '1', barangay: "Umali", city: "Lupao", province: "Nueva Ecija", region: "Central Luzon", applicant: "Juan Dela Cruz", status: "Pending" },
        { id: '2', barangay: "San Jose", city: "Cabanatuan", province: "Nueva Ecija", region: "Central Luzon", applicant: "Maria Santos", status: "Approved" },
        { id: '3', barangay: "Umali", city: "Lupao", province: "Nueva Ecija", region: "Central Luzon", applicant: "Juan Dela Cruz", status: "Pending" },
        { id: '4', barangay: "San Jose", city: "Cabanatuan", province: "Nueva Ecija", region: "Central Luzon", applicant: "Maria Santos", status: "Approved" },
        { id: '5', barangay: "Bagumbayan", city: "Science City of Muñoz", province: "Nueva Ecija", region: "Central Luzon", applicant: "Carlos Villanueva", status: "Pending" },
        { id: '6', barangay: "San Antonio", city: "San Jose City", province: "Nueva Ecija", region: "Central Luzon", applicant: "Rosa Fernandez", status: "Approved" },
        { id: '7', barangay: "Bantug", city: "Palayan City", province: "Nueva Ecija", region: "Central Luzon", applicant: "Miguel Torres", status: "Rejected" },
        { id: '8', barangay: "Rizal", city: "Gapan", province: "Nueva Ecija", region: "Central Luzon", applicant: "Carmen Lopez", status: "Pending" },
        { id: '9', barangay: "San Isidro", city: "Cabanatuan", province: "Nueva Ecija", region: "Central Luzon", applicant: "Roberto Cruz", status: "Approved" },
        { id: '10', barangay: "Mabini", city: "Lupao", province: "Nueva Ecija", region: "Central Luzon", applicant: "Elena Ramos", status: "Pending" },
        { id: '11', barangay: "Burgos", city: "Talavera", province: "Nueva Ecija", region: "Central Luzon", applicant: "Francisco Morales", status: "Rejected" }
    ];

    // Filtered data based on search input
    const filteredData = useMemo(() => {
        if (!filterText) return barangayData;
        
        const searchTerm = filterText.toLowerCase();
        return barangayData.filter(item => 
            item.barangay.toLowerCase().includes(searchTerm) ||
            item.city.toLowerCase().includes(searchTerm) ||
            item.province.toLowerCase().includes(searchTerm) ||
            item.region.toLowerCase().includes(searchTerm) ||
            item.applicant.toLowerCase().includes(searchTerm) ||
            item.status.toLowerCase().includes(searchTerm)
        );
    }, [filterText]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Reset to first page when filter changes
    useMemo(() => {
        setCurrentPage(1);
    }, [filterText]);

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
    const handleViewApplication = (barangay: BarangayData) => {
        setSelectedBarangay(barangay);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBarangay(null);
    };

    return (
        <>
            <Head title="CHPortal">
                {/* Global Poppins font is already set in CSS */}
            </Head>
            <Header />
            
            {/* Main Content with Background Image */}
            <div className="min-h-screen welcome-background relative">
                <div className="container mx-auto px-4 py-8 relative z-10">
                    
                    {/* MY BARANGAY Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2 font-tt-dugs">MY BARANGAY</h1>
                    </div>

                    {/* User Profile Section */}
                    <div className={`${styles.portalCard} rounded-lg p-6 mb-8`}>
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                            {/* Left Side - User Info */}
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                                    <span className="text-2xl font-bold text-white">SM</span>
                                </div>
                                <div className="text-white">
                                    <h2 className="text-xl font-bold">SEAN KENNETH MANLUPIG</h2>
                                    <div className="flex flex-col lg:flex-row lg:space-x-8 mt-2 text-sm gap-2 lg:gap-0">
                                        <div>
                                            <span className="text-gray-400">Account Role</span>
                                            <div className="text-white font-semibold">Super Admin</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Area</span>
                                            <div className="text-white font-semibold">Luzon</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Side - Account Status */}
                            <div className="text-right">
                                <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25">
                                    Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 ${styles.responsiveGrid5}`}>
                        <div className={`${styles.statCard} rounded-lg p-4 text-center`}>
                            <div className="text-gray-300 text-sm mb-2">Approved</div>
                            <div className="text-white text-2xl font-bold">122</div>
                        </div>
                        <div className={`${styles.statCard} rounded-lg p-4 text-center`}>
                            <div className="text-gray-300 text-sm mb-2">New</div>
                            <div className="text-white text-2xl font-bold">100</div>
                        </div>
                        <div className={`${styles.statCard} rounded-lg p-4 text-center`}>
                            <div className="text-gray-300 text-sm mb-2">Renewal</div>
                            <div className="text-white text-2xl font-bold">122</div>
                        </div>
                        <div className={`${styles.statCard} rounded-lg p-4 text-center`}>
                            <div className="text-gray-300 text-sm mb-2">Event Application</div>
                            <div className="text-white text-2xl font-bold">122</div>
                        </div>
                        <div className={`${styles.statCard} rounded-lg p-4 text-center lg:col-span-1 md:col-span-3`}>
                            <div className="text-gray-300 text-sm mb-2">Approved Event</div>
                            <div className="text-white text-2xl font-bold">122</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex flex-wrap gap-3 mb-6 ${styles.responsiveFlexWrap}`}>
                        <button className={`${styles.actionButton} active bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg text-sm font-semibold`}>
                            Pending Approval (122)
                        </button>
                        <button className={`${styles.actionButton} bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold`}>
                            Renewals (122)
                        </button>
                        <button className={`${styles.actionButton} bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold`}>
                            Approved Barangays (18)
                        </button>
                        <button className={`${styles.actionButton} bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold`}>
                            Masterlist (589)
                        </button>
                        <button className={`${styles.actionButton} bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold`}>
                            New Events (10)
                        </button>
                        <button className={`${styles.actionButton} bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold`}>
                            Approved Events (589)
                        </button>
                        <button className={`${styles.actionButton} bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold`}>
                            Event Reporting (589)
                        </button>
                        <button className={`${styles.actionButton} bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold`}>
                            All Events (589)
                        </button>
                    </div>

                    {/* Barangay Management Section */}
                    <div className={`${styles.portalTable} ${styles.portalCard} rounded-lg p-6`}>
                        {/* Header with Filter and Items Per Page */}
                        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-white text-lg font-semibold">
                                    Barangays: {filteredData.length}
                                    {filteredData.length !== barangayData.length && (
                                        <span className="text-gray-400 text-sm ml-2">
                                            (filtered from {barangayData.length})
                                        </span>
                                    )}
                                </h3>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="bg-gray-700/80 text-white px-3 py-1 rounded-lg text-sm border border-gray-600 focus:border-yellow-500 focus:outline-none"
                                >
                                    <option value={5}>5 per page</option>
                                    <option value={10}>10 per page</option>
                                    <option value={15}>15 per page</option>
                                    <option value={20}>20 per page</option>
                                </select>
                            </div>
                            <div className="flex items-center space-x-4">
                                <input 
                                    type="text" 
                                    placeholder="Filter by barangay, city, applicant, status..."
                                    value={filterText}
                                    onChange={(e) => setFilterText(e.target.value)}
                                    className="bg-gray-700/80 text-white px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300 w-80"
                                />
                                {filterText && (
                                    <button
                                        onClick={() => setFilterText('')}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                        title="Clear filter"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Pagination Info */}
                        {filteredData.length > 0 && (
                            <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                                <div>
                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
                                </div>
                                <div>
                                    Page {currentPage} of {totalPages}
                                </div>
                            </div>
                        )}

                        {/* No results message */}
                        {filteredData.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-lg mb-2">No barangays found</div>
                                <div className="text-gray-500 text-sm">Try adjusting your search criteria</div>
                            </div>
                        )}

                        {/* Table - Desktop View */}
                        {currentData.length > 0 && (
                            <div className="hidden lg:block">
                                {/* Table Headers */}
                                <div className={`${styles.tableGrid} mb-4 pb-2 border-b border-gray-600`}>
                                    <div className="text-gray-400 text-sm font-semibold">Barangay</div>
                                    <div className="text-gray-400 text-sm font-semibold">City/Municipality</div>
                                    <div className="text-gray-400 text-sm font-semibold">Province</div>
                                    <div className="text-gray-400 text-sm font-semibold">Region</div>
                                    <div className="text-gray-400 text-sm font-semibold">Applicant</div>
                                    <div className="text-gray-400 text-sm font-semibold">Status</div>
                                    <div className="text-gray-400 text-sm font-semibold">Details</div>
                                </div>

                                {/* Table Rows */}
                                {currentData.map((item, index) => (
                                    <div key={startIndex + index} className={`${styles.tableRow} ${styles.tableGrid} py-3 border-b border-gray-700/50 rounded-lg transition-all duration-300`}>
                                        <div className="text-white text-sm">{item.barangay}</div>
                                        <div className="text-white text-sm">{item.city}</div>
                                        <div className="text-white text-sm">{item.province}</div>
                                        <div className="text-white text-sm">{item.region}</div>
                                        <div className="text-white text-sm">{item.applicant}</div>
                                        <div className={`text-sm font-semibold ${
                                            item.status === 'Approved' ? 'text-green-500' :
                                            item.status === 'Pending' ? 'text-yellow-500' :
                                            item.status === 'Rejected' ? 'text-red-500' : 'text-gray-500'
                                        }`}>
                                            {item.status}
                                        </div>
                                        <div>
                                            <button 
                                                onClick={() => handleViewApplication(item)}
                                                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                                            >
                                                View Application
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Table - Mobile View */}
                        {currentData.length > 0 && (
                            <div className="lg:hidden space-y-4">
                                {currentData.map((item, index) => (
                                    <div key={startIndex + index} className={`${styles.tableRow} bg-gray-800/50 rounded-lg p-4 transition-all duration-300`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="text-white font-semibold">{item.barangay}</div>
                                                <div className="text-gray-400 text-sm">{item.city}, {item.province}</div>
                                            </div>
                                            <div className={`text-sm font-semibold ${
                                                item.status === 'Approved' ? 'text-green-500' :
                                                item.status === 'Pending' ? 'text-yellow-500' :
                                                item.status === 'Rejected' ? 'text-red-500' : 'text-gray-500'
                                            }`}>
                                                {item.status}
                                            </div>
                                        </div>
                                        <div className="text-gray-300 text-sm mb-2">
                                            Applicant: {item.applicant}
                                        </div>
                                        <button 
                                            onClick={() => handleViewApplication(item)}
                                            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            View Application
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                                {/* Previous/Next buttons */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                            currentPage === 1
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-md hover:shadow-lg'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                            currentPage === totalPages
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-md hover:shadow-lg'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>

                                {/* Page numbers */}
                                <div className="flex items-center space-x-1">
                                    {getPageNumbers().map((page, index) => (
                                        <button
                                            key={index}
                                            onClick={() => typeof page === 'number' && goToPage(page)}
                                            disabled={typeof page !== 'number'}
                                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                                page === currentPage
                                                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg'
                                                    : typeof page === 'number'
                                                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-md hover:shadow-lg'
                                                    : 'text-gray-500 cursor-default'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                {/* Jump to page */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-400 text-sm">Go to:</span>
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
                                        className="bg-gray-700/80 text-white px-2 py-1 rounded-lg text-sm border border-gray-600 focus:border-yellow-500 focus:outline-none w-16 text-center"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* View Info Modal */}
            <ViewInfoModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                barangayData={selectedBarangay}
            />
        </>
    );
}

import React from 'react';

interface ViewMoaModalProps {
    isOpen: boolean;
    onClose: () => void;
    barangayName?: string;
}

export default function ViewMoaModal({ isOpen, onClose, barangayName = "Umali" }: ViewMoaModalProps) {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            {/* Modal Overlay */}
            <div 
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                onClick={handleOverlayClick}
            >
                {/* Modal Card */}
                <div className="bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800">
                        <h2 className="text-white text-lg font-bold">MOA - {barangayName}</h2>
                        <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-white p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <span className="text-gray-400 text-sm">100%</span>
                            <button className="text-gray-400 hover:text-white p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                            </button>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-white p-1"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Document Content */}
                    <div className="bg-white h-[70vh] overflow-y-auto p-8">
                        <div className="max-w-3xl mx-auto bg-white">
                            {/* Document Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-xl font-bold text-gray-800 mb-2">Partnership Development</h1>
                                <h2 className="text-lg font-semibold text-gray-700">League Pilot</h2>
                            </div>

                            {/* MOA Content */}
                            <div className="space-y-6 text-gray-800 text-sm leading-relaxed">
                                <div>
                                    <h3 className="font-bold text-base mb-2">Memorandum of Understanding</h3>
                                    <p className="mb-2">Between:</p>
                                    <p className="ml-4 mb-1">Barangay {barangayName}</p>
                                    <p className="ml-4 mb-1">And Community Heroes PH</p>
                                    <p className="ml-4 mb-4">For Community Development Programs</p>
                                </div>

                                <div>
                                    <p className="mb-4">
                                        This Memorandum of Understanding establishes a framework between Community Heroes 
                                        PH and organization for community development programs and initiatives.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold mb-2">I. MISSION</h4>
                                    <p className="mb-4">
                                        Both organizations share this organization's mission. The league aims to use data-driven 
                                        approaches to measure progress of community development initiatives.
                                    </p>
                                    <p className="mb-4">
                                        Both parties will work together to implement community programs and measure their 
                                        effectiveness through data collection and analysis.
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-4">
                                        Together, the Parties agree that this Memorandum of Understanding is intended 
                                        to foster cooperation and partnership between the organizations. Each party is committed 
                                        to supporting community development initiatives that benefit local residents and 
                                        promote sustainable growth within the barangay.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold mb-2">II. PURPOSE AND SCOPE</h4>
                                    <p className="mb-4">
                                        This collaboration will focus on joint programs and initiatives that benefit the 
                                        community and its organizations. Key focus areas include health and safety initiatives, 
                                        educational programs, and economic development projects.
                                    </p>
                                    <p className="mb-4">The key activities include:</p>
                                    <ul className="list-disc ml-6 mb-4 space-y-1">
                                        <li>How can we help you community needs?</li>
                                        <li>What are the most pressing issues?</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="mb-4">
                                        In both cases of technical assistance, the key responsibility of this 
                                        collaboration is to ensure that community development programs are effective and 
                                        sustainable. Both partners will work together to identify community needs and develop 
                                        appropriate solutions that benefit all stakeholders involved with this MOU.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold mb-2">III. RESPONSIBILITIES</h4>
                                    <p className="mb-4">
                                        Each party will support a partner in terms of their official contact and coordinate the 
                                        delivery of key organization's resources and services. The central objective of each 
                                        party is to support and strengthen community development efforts.
                                    </p>
                                </div>

                                <div className="mt-8 text-center">
                                    <p className="mb-2">For project objectives with defined and approved deliverables</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    <div className="p-4 bg-gray-800 flex justify-center">
                        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>DOWNLOAD</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
} 
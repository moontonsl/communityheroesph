import { Head, Link } from '@inertiajs/react';
import Header from '@/pages/partials/header';
import styles from '@/components/CSS/CHTransaction.module.css';

export default function CHTransaction() {
    return (
        <>
            <Head title="CHTransaction">
                {/* Global Poppins font is already set in CSS */}
            </Head>
            <Header />
            {/* Main Content with Background Image */}
            <div className="min-h-screen welcome-background relative">
                <div className="relative z-10 pt-8 text-center">
                    <div className="flex flex-col lg:flex-row gap-2 relative z-10 items-center justify-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                            <img 
                                src="/images/homepage/caravan.png" 
                                alt="MLBB Barangay Caravan Logo" 
                                className="w-35 h-auto mx-auto"
                            />
                            <div className={`${styles.portalCard} rounded-lg p-6 mb-8`}>
                                <h2 className="text-2xl font-bold text-white mb-6 text-center font-tt-dugs">
                                    CHOOSE YOUR TRANSACTION
                                </h2>
                                <div className="space-y-4 w-90">
                                    <input
                                        type="text"
                                        placeholder="Register Barangay"
                                        className="w-full p-3 bg-dark-container text-white rounded-2xl border-2 border-yellow-400 focus:outline-none focus:border-yellow-300 text-center"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Apply Event"
                                        className="w-full p-3 bg-dark-container text-white rounded-2xl border-2 border-yellow-400 focus:outline-none focus:border-yellow-300 text-center"
                                    />
                                    <input
                                        type="text"
                                        placeholder="My Barangays"
                                        className="w-full p-3 bg-dark-container text-white rounded-2xl border-2 border-yellow-400 focus:outline-none focus:border-yellow-300 text-center"
                                    />
                                </div>
                            </div>
                            
                        </div>
                        <div className="flex flex-col items-center justify-center mt-10">
                            <img 
                                src="/images/homepage/chimage2.png"
                                style={{ marginTop: '100px' }}
                                alt="MLBB Barangay Caravan Logo" 
                                className="w-100 h-auto mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

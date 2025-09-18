import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/pages/partials/header';

export default function Homepage() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Homepage">
                {/* Global Poppins font is already set in CSS */}
            </Head>
            
            <Header />

            {/* Main Content with Background Image */}
            <div className="min-h-screen welcome-background flex items-center justify-center">
                {/* Welcome Content */}
                <div className="text-center text-white">
                    <h1 className="text-6xl font-bold mb-4">Welcome to Community Heroes PH</h1>
                    <p className="text-xl mb-8">Join our community of heroes</p>
                </div>
            </div>
        </>
    );
}

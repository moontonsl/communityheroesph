import { Head, Link, usePage } from '@inertiajs/react';
import { LogOut, User } from 'lucide-react';

export default function Header() {
    const { auth } = usePage().props;
    return (
        <>
            <header className="bg-black text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-1xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-17">
                        {/* Left Side - Logo and Brand */}
                        <div className="flex items-center space-x-4">
                            {/* Logo Container */}
                            <div className="relative">
                                {/* Logo Image */}
                                <img 
                                    src="/images/homepage/communityheroes-logo.png" 
                                    alt="Community Heroes Logo" 
                                    className="w-15 h-15 object-contain"
                                />
                            </div>
                            
                            {/* Brand Text */}
                            <div className="text-3xl font-black tracking-wider">
                                COMMUNITY HEROES PH
                            </div>
                        </div>
                        
                        {/* Right Side - User Menu and MLBB Logo */}
                        <div className="flex items-center space-x-4">
                            {/* User Info and Logout */}
                            {auth?.user && (
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-5 h-5 text-yellow-400" />
                                        <span className="text-sm text-gray-300">
                                            {auth.user.name}
                                        </span>
                                    </div>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm font-medium">Logout</span>
                                    </Link>
                                </div>
                            )}
                            
                            {/* MLBB Logo */}
                            <img 
                                src="/images/homepage/mlbb-logo.png" 
                                alt="Mobile Legends Bang Bang Logo" 
                                className="w-30 h-30 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

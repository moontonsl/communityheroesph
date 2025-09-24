import { Head, Link, usePage } from '@inertiajs/react';
import { LogOut, User, Menu, X, Home, Building, Calendar, Users, BarChart3, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { SharedData } from '@/types';

export default function Header() {
    const { auth } = usePage<SharedData>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isTransactionDropdownOpen, setIsTransactionDropdownOpen] = useState(false);
    
    // Refs for dropdown containers
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const transactionDropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const navigationLinks = [
        { name: 'Home', href: '/homepage', icon: Home },
        { name: 'My Barangays', href: '/MyBarangay', icon: Users },
    ];

    const transactionSubLinks = [
        { name: 'Register Barangay', href: '/registerbarangay', icon: Building },
        { name: 'Apply Event', href: '/apply-event', icon: Calendar },
    ];

    // Add admin links if user is admin
    const adminLinks = (auth?.user as any)?.role?.name === 'admin' ? [
        { name: 'Portal', href: '/MyBarangay', icon: Settings },
        { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    ] : [];

    const allLinks = [...navigationLinks, ...adminLinks];

    // Handle outside clicks to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            
            // Close user dropdown if clicking outside
            if (isUserDropdownOpen && userDropdownRef.current && !userDropdownRef.current.contains(target)) {
                setIsUserDropdownOpen(false);
            }
            
            // Close transaction dropdown if clicking outside
            if (isTransactionDropdownOpen && transactionDropdownRef.current && !transactionDropdownRef.current.contains(target)) {
                setIsTransactionDropdownOpen(false);
            }
            
            // Close mobile menu if clicking outside
            if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserDropdownOpen, isTransactionDropdownOpen, isMobileMenuOpen]);

    return (
        <>
            <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Left Side - Logo and Brand */}
                        <div className="flex items-center space-x-6">
                            <Link href="/homepage" className="group">
                                <img 
                                    src="/images/homepage/communityheroes-logo.png" 
                                    alt="Community Heroes Logo" 
                                    className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </Link>
                            <Link href="/homepage" className="text-2xl font-black tracking-wider bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300">
                                COMMUNITY HEROES PH
                            </Link>
                        </div>
                        
                        {/* Center - Navigation Links (Desktop) - Only show when authenticated */}
                        {auth?.user && (
                            <nav className="hidden lg:flex items-center space-x-3">
                                {navigationLinks.map((link) => {
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    );
                                })}
                                
                                {/* Transaction Dropdown - Hidden for Super Admin B */}
                                {auth?.user?.role?.slug !== 'super-admin-b' && (
                                <div className="relative" ref={transactionDropdownRef}>
                                    <button
                                        onClick={() => setIsTransactionDropdownOpen(!isTransactionDropdownOpen)}
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    >
                                        Transaction
                                    </button>
                                    
                                    {/* Transaction Dropdown Menu */}
                                    {isTransactionDropdownOpen && (
                                        <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <Link
                                                href="/Transaction"
                                                onClick={() => setIsTransactionDropdownOpen(false)}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <BarChart3 className="w-4 h-4" />
                                                <span>Transaction</span>
                                            </Link>
                                            {transactionSubLinks.map((link) => {
                                                const Icon = link.icon;
                                                return (
                                                    <Link
                                                        key={link.name}
                                                        href={link.href}
                                                        onClick={() => setIsTransactionDropdownOpen(false)}
                                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                        <span>{link.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                )}
                                
                                {/* Admin Links */}
                                {adminLinks.map((link) => {
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}
                        
                        {/* Right Side - User Menu, Mobile Menu Button, and MLBB Logo */}
                        <div className="flex items-center space-x-4">
                            {/* User Dropdown */}
                            {auth?.user && (
                                <div className="hidden md:block relative" ref={userDropdownRef}>
                                    <button
                                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                    >
                                        <User className="w-6 h-6 text-yellow-400" />
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                                            </div>
                                            <Link
                                                href="/settings/profile"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Account Settings</span>
                                            </Link>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            
                            {/* MLBB Logo */}
                            <div className="flex items-center group">
                                <img 
                                    src="/images/homepage/mlbb-logo.png" 
                                    alt="Mobile Legends Bang Bang Logo" 
                                    className="w-30 h-30 hidden lg:block object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Navigation Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden border-t border-white/10 bg-black/50 backdrop-blur-md" ref={mobileMenuRef}>
                            <nav className="px-4 py-4 space-y-2">
                                {auth?.user ? (
                                    <>
                                        {navigationLinks.map((link) => {
                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                                >
                                                    <span className="font-medium">{link.name}</span>
                                                </Link>
                                            );
                                        })}
                                        
                                        {/* Transaction Section */}
                                        <div className="px-4 py-3 text-gray-300 font-medium">
                                            Transaction
                                        </div>
                                        <Link
                                            href="/Transaction"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="px-8 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                        >
                                            <span className="font-medium">Transaction</span>
                                        </Link>
                                        {transactionSubLinks.map((link) => {
                                            const Icon = link.icon;
                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center space-x-3 px-8 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span className="font-medium">{link.name}</span>
                                                </Link>
                                            );
                                        })}
                                        
                                        {/* Admin Links */}
                                        {adminLinks.map((link) => {
                                            return (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                                >
                                                    <span className="font-medium">{link.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <div className="px-4 py-3 text-gray-300 text-center">
                                        Please log in to access navigation
                                    </div>
                                )}
                                
                                {/* Mobile User Info and Logout */}
                                {auth?.user && (
                                    <div className="border-t border-white/10 pt-4 mt-4">
                                        <div className="flex items-center space-x-3 px-4 py-3 text-gray-300">
                                            <User className="w-5 h-5 text-yellow-400" />
                                            <span className="text-sm">{auth.user.name}</span>
                                        </div>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-red-600/20 transition-all duration-200 group"
                                        >
                                            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors duration-200" />
                                            <span className="font-medium">Logout</span>
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}

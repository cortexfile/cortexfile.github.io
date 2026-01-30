import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
    LayoutDashboard,
    Package,
    Palette,
    Star,
    Zap,
    Image,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Settings
} from 'lucide-react';

interface NavItem {
    name: string;
    path: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Appearance', path: '/admin/appearance', icon: Palette },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'Features', path: '/admin/features', icon: Zap },
    { name: 'Media Library', path: '/admin/media', icon: Image },
];

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const NavLinkItem = ({ item }: { item: NavItem }) => (
        <NavLink
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-cyber-primary to-cyber-accent text-white shadow-lg shadow-cyber-primary/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
            }
            onClick={() => setMobileMenuOpen(false)}
        >
            <item.icon size={20} />
            {sidebarOpen && <span className="font-medium">{item.name}</span>}
            {sidebarOpen && (
                <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </NavLink>
    );

    return (
        <div className="min-h-screen bg-cyber-black flex">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex flex-col fixed left-0 top-0 h-full bg-cyber-dark border-r border-white/5 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyber-primary to-cyber-accent rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        C
                    </div>
                    {sidebarOpen && (
                        <div>
                            <h1 className="font-bold text-white">CortexFile</h1>
                            <p className="text-xs text-gray-500">Admin Panel</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLinkItem key={item.path} item={item} />
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                        <Settings size={20} />
                        {sidebarOpen && <span>Toggle Sidebar</span>}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-cyber-dark border-b border-white/5 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyber-primary to-cyber-accent rounded-lg flex items-center justify-center text-white font-bold">
                        C
                    </div>
                    <span className="font-bold text-white">Admin</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-gray-400 hover:text-white"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/80 z-40" onClick={() => setMobileMenuOpen(false)}>
                    <div
                        className="absolute left-0 top-16 bottom-0 w-64 bg-cyber-dark border-r border-white/5 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <NavLinkItem key={item.path} item={item} />
                            ))}
                        </nav>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-4 flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'
                    } mt-16 md:mt-0`}
            >
                <div className="p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

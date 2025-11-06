
import { useAuthStore } from '@/stores/useAuthStore';
import { Menu, Home, Store, Users, LogOut, ChevronUp, ChevronDown, User, Settings } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router';
import DashboardContent from '@/components/contents/dashboard-content';
import ClassContent from '@/components/contents/class-content';
import StoreContent from '@/components/contents/store-content';

const Dashboard = () => {

    const { signOut, user } = useAuthStore();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false); // mở sidebar trên mobile
    const [userMenuOpen, setUserMenuOpen] = useState(false); // mở menu user

    const [tab, setTab] = useState('dashboard');

    const handleTabClick = (e: React.MouseEvent, tab: string) => {
        e.preventDefault(); // chặn reload trang
        setTab(tab);
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/signin");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen">
            {/* SIDEBAR - Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm">
                {/* Logo */}
                <div className="p-4 border-b font-bold text-lg">MyApp</div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#dashboard" onClick={(e) => handleTabClick(e, 'dashboard')} className="flex items-center p-2 rounded hover:bg-sky-100">
                        <Home className="w-5 h-5 mr-2 text-sky-700" /> Dashboard
                    </a>
                    <a href="#" onClick={(e) => handleTabClick(e, 'class')} className="flex items-center p-2 rounded hover:bg-sky-100">
                        <Users className="w-5 h-5 mr-2 text-sky-700" /> Class
                    </a>
                    <a href="#" onClick={(e) => handleTabClick(e, 'store')} className="flex items-center p-2 rounded hover:bg-sky-100">
                        <Store className="w-5 h-5 mr-2 text-sky-700" /> Store
                    </a>
                </nav>

                {/* FOOTER: USER */}
                <div className="p-4 border-t relative">
                    <button
                        onClick={() => setUserMenuOpen((v) => !v)}
                        className="w-full flex items-center justify-between p-2 rounded hover:bg-sky-100"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center font-semibold">
                                {user?.lastName[0]}
                            </div>
                            <div className="text-left">
                                <div className="font-medium">{`${user?.lastName} ${user?.firstName}`}</div>
                                <div className="text-sm text-gray-500">{user?.email}</div>
                            </div>
                        </div>
                        {userMenuOpen ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </button>

                    {/* Menu xổ xuống */}
                    {userMenuOpen && (
                        <div className="absolute bottom-16 left-4 right-4 bg-white border shadow-lg rounded-md py-1 animate-fade-in">
                            <button className="flex items-center w-full px-3 py-2 hover:bg-sky-50">
                                <User className="w-4 h-4 mr-2" /> Profile
                            </button>
                            <button className="flex items-center w-full px-3 py-2 hover:bg-sky-50">
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </button>
                            <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 hover:bg-sky-50 text-red-500">
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* SIDEBAR - Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setOpen(false)}
                >
                    <aside
                        className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg p-4 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <span className="font-bold text-lg">MyApp</span>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <nav className="flex-1 space-y-2">
                            <a href="#" onClick={(e) => handleTabClick(e, 'dashboard')} className="flex items-center p-2 rounded hover:bg-sky-100">
                                <Home className="w-5 h-5 mr-2 text-sky-700" /> Dashboard
                            </a>
                            <a href="#" onClick={(e) => handleTabClick(e, 'class')} className="flex items-center p-2 rounded hover:bg-sky-100">
                                <Users className="w-5 h-5 mr-2 text-sky-700" /> Class
                            </a>
                            <a href="#" onClick={(e) => handleTabClick(e, 'store')} className="flex items-center p-2 rounded hover:bg-sky-100">
                                <Store className="w-5 h-5 mr-2 text-sky-700" /> Store
                            </a>
                        </nav>

                        {/* Footer user */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full p-2 mt-auto rounded hover:bg-sky-100 text-red-500"
                        >
                            <LogOut className="w-5 h-5 mr-2" /> Logout
                        </button>
                    </aside>
                </div>
            )}

            {/* CONTENT */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b flex items-center justify-between px-4 shadow-sm">
                    {/* Nút mở sidebar (mobile) */}
                    <button
                        className="md:hidden p-2 rounded hover:bg-sky-100"
                        onClick={() => setOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-semibold">{tab.toUpperCase()}</h1>
                </header>

                <main className="flex-1 p-6 bg-gray-50">
                    {tab == 'dashboard' && <DashboardContent />}
                    {tab == 'class' && <ClassContent />}
                    {tab == 'store' && <StoreContent />}
                </main>
            </div>
        </div>
    )
}

export default Dashboard

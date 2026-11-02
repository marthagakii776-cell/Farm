import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { ShoppingBag, User as UserIcon, LogOut, ChevronDown, Bell, Shield, Sprout, PlusCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddProduct?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenAddProduct }) => {
  const { currentUser, logout, setIsAuthModalOpen, setAuthModalMode, setIsProfileModalOpen, switchAccount, allDemoUsers } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const navItems = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'farm-manager', label: 'Farm Management' },
    { id: 'weather', label: 'Weather Forecast' },
    { id: 'education', label: 'Learning Center' },
    { id: 'messages', label: 'Messages' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFDF9]/95 backdrop-blur-md border-b border-stone-200">
      {/* Role Quick-Switch bar for easy live demonstration of all 5 user profiles */}
      <div className="bg-emerald-950 text-emerald-100/90 text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-900/60 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <span className="font-medium text-emerald-300">Live Role Simulator:</span>
          <span>Switch account to preview different role permissions</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {allDemoUsers.map((u) => {
            const isActive = currentUser?.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => switchAccount(u.role)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors capitalize ${
                  isActive
                    ? 'bg-emerald-500 text-white font-semibold'
                    : 'bg-emerald-900/70 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                {u.role === 'admin' ? 'Admin' : u.role}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (Action Area) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 sm:gap-8">
        
        {/* Zone 1: Single Wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-left group flex items-center gap-2.5 whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-sm">
            <Sprout className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-emerald-950 font-display block leading-none">
              Farmers Hub
            </span>
            <span className="text-[10px] text-stone-500 font-sans tracking-wide">
              Growing Together, Feeding the Future
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'text-emerald-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-700'
                    : 'hover:text-emerald-800 text-stone-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`relative py-1 whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 ${
                activeTab === 'admin'
                  ? 'text-amber-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-600'
                  : 'text-amber-800 hover:text-amber-900 font-medium'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Farmer Quick Add Product Button */}
          {(currentUser?.role === 'farmer' || currentUser?.role === 'admin') && onOpenAddProduct && (
            <button
              onClick={onOpenAddProduct}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>List Produce</span>
            </button>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View Shopping Cart"
            className="relative p-2 text-stone-700 hover:text-emerald-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Account / Profile Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-300 hover:bg-stone-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-semibold uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-stone-900 leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-stone-500 capitalize">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {/* Dropdown Menu */}
              {showRoleMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setShowRoleMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded capitalize">
                      {currentUser.role} Account
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="w-full px-4 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                      Edit Profile & Contact
                    </button>
                    <button
                      onClick={() => setActiveTab('farm-manager')}
                      className="w-full px-4 py-2 text-left text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Sprout className="w-3.5 h-3.5 text-stone-500" />
                      Farm & Ledger Dashboard
                    </button>
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => setActiveTab('admin')}
                        className="w-full px-4 py-2 text-left text-xs text-amber-900 hover:bg-amber-50 flex items-center gap-2 font-medium"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-600" />
                        Admin Control Panel
                      </button>
                    )}
                  </div>

                  <div className="border-t border-stone-100 pt-1">
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                Join Hub
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-stone-200/80 bg-white px-2 py-2 text-xs font-medium text-stone-600 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2 py-1 rounded whitespace-nowrap ${
              activeTab === item.id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-stone-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

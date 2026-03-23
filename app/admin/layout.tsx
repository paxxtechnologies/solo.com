"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SoloLogo } from "@/components/ui/SoloLogo";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Tags,
  Megaphone,
  Gift,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/promotions", label: "Promotions", icon: Tags },
  { href: "/admin/rewards", label: "Rewards & Loyalty", icon: Gift },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-solo-soft-gray font-sans selection:bg-solo-green/30 selection:text-solo-deep-navy">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-solo-navy/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Premium Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-solo-navy to-solo-deep-navy shadow-2xl transform transition-all duration-500 ease-out lg:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Abstract Glowing Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-solo-green/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Logo Section */}
        <div className="relative flex items-center justify-between h-20 px-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="transform group-hover:scale-105 transition-transform duration-300">
              <SoloLogo size="sm" variant="reversed" showTagline={false} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[10px] tracking-widest text-solo-green uppercase">Portal</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-1.5 relative z-10">
          <div className="text-[10px] font-bold tracking-widest text-solo-mint/40 uppercase mb-4 px-3 mt-2">Menu</div>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                  ? "bg-gradient-to-r from-solo-green/20 to-transparent border-l-2 border-solo-green text-white shadow-sm"
                  : "text-solo-mint/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-solo-green scale-110' : 'group-hover:scale-110 group-hover:text-solo-mint'}`} />
                <span className={`font-semibold tracking-wide text-sm ${isActive ? 'text-white' : ''}`}>{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-solo-green shadow-[0_0_8px_rgba(0,200,150,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-5 border-t border-white/5 relative z-10 bg-black/10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-xl transition-all duration-300 group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold text-sm">Return to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-72 flex flex-col flex-1 min-h-screen">
        {/* Glassmorphic Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-xl border-b border-solo-muted/10 flex items-center justify-between px-6 lg:px-10 shadow-sm">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-solo-navy hover:bg-solo-soft-gray transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Smart Search */}
            <div className="hidden md:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-solo-muted group-focus-within:text-solo-green transition-colors" />
              <input
                type="text"
                placeholder="Search across your store..."
                className="w-80 pl-11 pr-4 py-2.5 rounded-full border border-solo-muted/20 bg-solo-soft-gray/50 text-solo-navy placeholder:text-solo-muted/70 focus:outline-none focus:ring-2 focus:ring-solo-green/30 focus:border-solo-green/50 transition-all duration-300 font-medium text-sm shadow-inner"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded border border-solo-muted/20 text-[10px] font-bold text-solo-muted bg-white">
                ⌘K
              </div>
            </div>
          </div>

          {/* Right Side Settings */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative w-10 h-10 flex items-center justify-center text-solo-navy hover:bg-solo-soft-gray rounded-full transition-all duration-300 group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-solo-red rounded-full shadow-[0_0_8px_rgba(230,57,70,0.8)] animate-pulse" />
            </button>

            <div className="w-px h-8 bg-solo-muted/20 mx-1 hidden sm:block"></div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 hover:bg-solo-soft-gray rounded-full transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-solo-navy to-solo-green flex items-center justify-center shadow-md pb-0.5">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="font-bold text-sm text-solo-navy">Gil Admin</span>
                  <span className="text-[10px] text-solo-muted font-semibold uppercase">Superuser</span>
                </div>
                <ChevronDown className="w-4 h-4 text-solo-muted hidden sm:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-solo-muted/10 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-solo-muted/10 mb-2">
                      <p className="font-bold text-sm text-solo-navy">Gil Admin</p>
                      <p className="text-xs text-solo-muted">admin@solostore.com</p>
                    </div>
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-solo-soft-gray text-solo-navy font-medium text-sm mx-2 rounded-lg transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" /> Account Settings
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-solo-red/10 text-solo-red font-medium text-sm mx-2 rounded-lg transition-colors mt-1"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LogOut className="w-4 h-4" /> Sign Out securely
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

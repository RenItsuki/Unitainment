"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Film, 
  Tv, 
  Gamepad2, 
  Sparkles, 
  BookmarkCheck, 
  MessageSquare, 
  Radio, 
  Search, 
  User, 
  LogOut, 
  Menu, 
  X,
  Compass,
  Heart
} from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { SearchModal } from "@/components/SearchModal";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Compute breadcrumb title for desktop
  const getPageTitle = (path: string) => {
    if (path === "/") return "Discover & Explore";
    if (path.startsWith("/movies")) return "Movies & TV Shows (IMDb)";
    if (path.startsWith("/anime")) return "Anime & Manga (MyAnimeList)";
    if (path.startsWith("/games")) return "Video Games (RAWG & Steam)";
    if (path.startsWith("/forum")) return "Community Forums";
    if (path.startsWith("/chat")) return "Live Chat Lounge";
    if (path.startsWith("/donate")) return "Support Unitainment";
    if (path.startsWith("/library")) return "My Library & Watchlist";
    if (path.startsWith("/profile")) return "User Profile";
    if (path.startsWith("/media")) return "Title Overview & Reviews";
    return "Entertainment Hub";
  };

  // Mobile drawer links
  const mobileCategories = [
    { href: "/movies", label: "Movies & TV", icon: Film, badge: "IMDb" },
    { href: "/anime", label: "Anime & Manga", icon: Tv, badge: "MAL" },
    { href: "/games", label: "Video Games", icon: Gamepad2, badge: "Steam & RAWG" },
    { href: "/forum", label: "Community Forums", icon: MessageSquare, badge: "Forms" },
    { href: "/chat", label: "Live Chat Lounge", icon: Radio, badge: "Live", pulse: true },
    { href: "/donate", label: "Support Project", icon: Heart, badge: "Donate" },
    { href: "/library", label: "My Library", icon: BookmarkCheck, badge: "Tracking" },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#080c14]/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Mobile Logo (Visible only on mobile where LeftNavbar is hidden) */}
          <Link href="/" className="flex md:hidden items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/15 shadow-md shadow-cyan-500/20 bg-[#080c14]">
              <img
                src="/logo.png"
                alt="Unitainment Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-extrabold text-sm tracking-wider text-white">
              UNITAINMENT
            </span>
          </Link>

          {/* Desktop Breadcrumb / Section Title */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block -mb-0.5">
                Unitainment Hub
              </span>
              <h2 className="text-sm font-black text-white">
                {getPageTitle(pathname)}
              </h2>
            </div>
          </div>

          {/* Global Search Bar (Prominent and responsive) */}
          <div className="flex-1 max-w-md mx-auto hidden sm:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-400 bg-slate-900/90 hover:text-white hover:bg-slate-800 border border-white/10 rounded-xl transition-all shadow-inner group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Search Movies, Anime (MAL), Games (Steam)...</span>
              </div>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-black/50 rounded border border-white/10">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Donate / Support Button */}
            <Link
              href="/donate"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all active:scale-95"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>Donate</span>
            </Link>

            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              title="Search"
            >
              <Search className="w-5 h-5 text-cyan-400" />
            </button>

            {/* User Session Profile / Login */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors border border-white/5"
                >
                  <img
                    src={session.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.name || "user"}`}
                    alt={session.user.name || "User"}
                    className="w-7 h-7 rounded-lg border border-cyan-500/40 object-cover"
                  />
                  <span className="hidden lg:inline text-xs font-semibold text-slate-200 max-w-[90px] truncate">
                    {session.user.name?.split(" ")[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 py-2 rounded-xl glass-panel border border-white/10 shadow-2xl z-50 animate-in fade-in zoom-in-95"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs font-semibold text-white truncate">{session.user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/library"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                      <span>My Library</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 rounded-xl transition-all shadow-md active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#080c14]/98 px-4 py-4 space-y-3 backdrop-blur-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-2">
              Navigation Menu
            </span>
            <div className="space-y-1">
              {mobileCategories.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-xl transition-all ${
                      isActive
                        ? "text-white bg-white/10 font-bold border border-white/10 shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-slate-900 border border-white/10 text-slate-400">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

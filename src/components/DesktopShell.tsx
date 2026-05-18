import React from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Heart, MessageSquare, Compass, User, LogOut, Flame, Sparkles } from "lucide-react";

interface DesktopShellProps {
  middle: React.ReactNode;
  right: React.ReactNode;
}

export function DesktopShell({ middle, right }: DesktopShellProps) {
  const { path } = useRouter();

  // Determine active states
  const isDiscover = path === "/" || path === "/app/discover";
  const isLikes = path === "/app/likes";
  const isMatches = path === "/app/matches";
  const isProfile = path === "/app/profile";

  return (
    <div className="hidden md:grid grid-cols-12 gap-8 max-w-7xl mx-auto w-full select-none pt-4 min-h-[calc(100vh-3rem)]">
      {/* 1. Left Sidebar Navigation (Col span 3) */}
      <aside className="col-span-3 flex flex-col justify-between border-r border-slate-100 pr-6 sticky top-6 h-[calc(100vh-6rem)]">
        <div className="space-y-8">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-2 px-3">
            <div className="h-10 w-10 rounded-2xl bg-linear-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-md animate-pulse">
              <Flame className="h-5.5 w-5.5 text-white fill-white/10" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-linear-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent leading-none">
                Bunkie
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                DISCOVER COZY
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <Link
              to="/app/discover"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:bg-slate-100/50 ${
                isDiscover
                  ? "bg-slate-900 text-white shadow-soft hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Compass className="h-5 w-5" strokeWidth={isDiscover ? 2.5 : 2} />
              <span>Discover</span>
              {isDiscover && <Sparkles className="h-4 w-4 text-rose-400 shrink-0 ml-auto animate-bounce" />}
            </Link>

            <Link
              to="/app/likes"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:bg-slate-100/50 ${
                isLikes
                  ? "bg-slate-900 text-white shadow-soft hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Heart className="h-5 w-5" strokeWidth={isLikes ? 2.5 : 2} />
              <span>Likes</span>
            </Link>

            <Link
              to="/app/matches"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:bg-slate-100/50 ${
                isMatches
                  ? "bg-slate-900 text-white shadow-soft hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <MessageSquare className="h-5 w-5" strokeWidth={isMatches ? 2.5 : 2} />
              <span>Matches</span>
            </Link>

            <Link
              to="/app/profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:bg-slate-100/50 ${
                isProfile
                  ? "bg-slate-900 text-white shadow-soft hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User className="h-5 w-5" strokeWidth={isProfile ? 2.5 : 2} />
              <span>My Profile</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Profile card */}
        <div className="border-t border-slate-100 pt-5 px-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full border border-slate-200 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="My Profile avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 leading-none">
                Chioma Nze
              </h4>
              <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                UNN • Verified Student
              </span>
            </div>
          </div>
          <button 
            onClick={() => alert("Mock Logout Successful")}
            className="flex items-center gap-2 text-xs font-bold text-rose-500 hover:text-rose-600 transition px-1 py-1 rounded-lg"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Middle Grid Main Content (Col span 6 if right sidebar exists, otherwise 9) */}
      <section className={right ? "col-span-6 overflow-y-auto pr-2 scrollbar-none h-[calc(100vh-3rem)]" : "col-span-9 overflow-y-auto pr-2 scrollbar-none h-[calc(100vh-3rem)]"}>
        {middle}
      </section>

      {/* 3. Right Sidebar Filters (Col span 3) */}
      {right && (
        <aside className="col-span-3 border-l border-slate-100 pl-6 sticky top-6 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none">
          {right}
        </aside>
      )}
    </div>
  );
}

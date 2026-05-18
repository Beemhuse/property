import { useState, useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Heart, MessageSquare, Compass, User, ChevronLeft, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ToastMessage } from "@/lib/error";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { path } = useRouter();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Listen for global custom events for toast messages
  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      if (customEvent.detail) {
        setToasts((prev) => [...prev, customEvent.detail]);
        
        // Auto remove after 3.5s
        setTimeout(() => {
          removeToast(customEvent.detail.id);
        }, 3500);
      }
    };

    window.addEventListener("bunkie-toast", handleToast);
    return () => window.removeEventListener("bunkie-toast", handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Determine active tab based on path
  const isDiscover = path === "/" || path === "/app/discover";
  const isLikes = path === "/app/likes";
  const isMatches = path === "/app/matches";
  const isProfile = path === "/app/profile";

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-20 md:pb-0">
      {/* Toast Notification Container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`flex items-center justify-between p-4 rounded-2xl shadow-card backdrop-blur-md border ${
                toast.type === "success"
                  ? "bg-emerald-500/95 text-white border-emerald-400"
                  : "bg-rose-500/95 text-white border-rose-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {toast.type === "success" && <Sparkles className="h-4 w-4 shrink-0 animate-bounce" />}
                <p className="text-sm font-semibold">{toast.text}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Container Shell */}
      <main className="w-full max-w-7xl px-4 md:px-8 py-6 flex-grow">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on medium screens and up) */}
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-white/90 backdrop-blur-lg border-t border-slate-100 flex items-center justify-around px-6 z-40 md:hidden shadow-soft">
        <Link
          to="/app/discover"
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            isDiscover ? "text-primary" : "text-slate-400"
          }`}
        >
          <Compass className="h-5.5 w-5.5" strokeWidth={isDiscover ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Discover</span>
        </Link>

        <Link
          to="/app/likes"
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            isLikes ? "text-primary" : "text-slate-400"
          }`}
        >
          <Heart className="h-5.5 w-5.5" strokeWidth={isLikes ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Likes</span>
        </Link>

        <Link
          to="/app/matches"
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            isMatches ? "text-primary" : "text-slate-400"
          }`}
        >
          <MessageSquare className="h-5.5 w-5.5" strokeWidth={isMatches ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Matches</span>
        </Link>

        <Link
          to="/app/profile"
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            isProfile ? "text-primary" : "text-slate-400"
          }`}
        >
          <User className="h-5.5 w-5.5" strokeWidth={isProfile ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  const { path } = useRouter();
  
  // Show back arrow if we are not at the root list discover page
  const canGoBack = path !== "/" && path !== "/app/discover";

  return (
    <header className="flex items-center justify-between mb-5 select-none pt-2">
      <div className="flex items-center gap-3">
        {canGoBack && (
          <button
            onClick={() => window.history.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-soft hover:bg-slate-50 transition active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
        )}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-tight tracking-tight flex items-center gap-1.5">
            {title === "Discover" && <Sparkles className="h-5 w-5 text-primary fill-primary/10 shrink-0" />}
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {right && <div className="flex items-center">{right}</div>}
    </header>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Phone, X, Heart, Sparkles, Home } from "lucide-react";
import confetti from "canvas-confetti";
import type { Space } from "@/hooks/use-bunkie-api";

export function MatchCelebration() {
  const [matchedSpace, setMatchedSpace] = useState<Space | null>(null);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const handleMatch = (e: Event) => {
      const customEvent = e as CustomEvent<Space>;
      if (customEvent.detail) {
        setMatchedSpace(customEvent.detail);
        setShowPhone(false);
        
        // Trigger high-fidelity confetti bursts!
        setTimeout(() => {
          triggerConfetti();
        }, 300);
      }
    };

    window.addEventListener("bunkie-match-celebration", handleMatch);
    return () => window.removeEventListener("bunkie-match-celebration", handleMatch);
  }, []);

  const triggerConfetti = () => {
    const end = Date.now() + (2.5 * 1000); // 2.5 seconds
    const colors = ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#3b82f6"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleClose = () => {
    setMatchedSpace(null);
  };

  return (
    <AnimatePresence>
      {matchedSpace && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md px-4"
        >
          {/* Main Card Viewport */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/10 p-8 text-center text-white shadow-glow"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Glowing Icon Header */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full bg-rose-500/35 blur-xl"
                />
                <div className="relative h-16 w-16 rounded-2xl bg-linear-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg border border-white/20">
                  <Heart className="h-8 w-8 text-white fill-white animate-pulse" />
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-black bg-linear-to-r from-rose-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent flex items-center justify-center gap-1.5 leading-none">
                <span>It's a Match!</span>
                <Sparkles className="h-6 w-6 text-pink-400 fill-pink-400/20" />
              </h2>
              <p className="text-xs font-semibold text-slate-400 px-4 leading-relaxed">
                You and {matchedSpace.owner?.name || "the roommate"} are interested in the same cozy space!
              </p>
            </div>

            {/* 3D Animated Profile Bubbles */}
            <div className="relative flex items-center justify-center h-28 mb-8">
              {/* CHIOMA (User) Bubble */}
              <motion.div
                initial={{ x: -100, opacity: 0, rotate: -15 }}
                animate={{ x: -20, opacity: 1, rotate: -8 }}
                transition={{ type: "spring", delay: 0.15, stiffness: 180, damping: 15 }}
                className="relative z-10 h-24 w-24 rounded-full overflow-hidden border-4 border-slate-900 shadow-card"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="My avatar"
                  className="h-full w-full object-cover"
                />
              </motion.div>

              {/* Match Space/Roommate Bubble */}
              <motion.div
                initial={{ x: 100, opacity: 0, rotate: 15 }}
                animate={{ x: 20, opacity: 1, rotate: 8 }}
                transition={{ type: "spring", delay: 0.25, stiffness: 180, damping: 15 }}
                className="relative z-10 h-24 w-24 rounded-full overflow-hidden border-4 border-slate-900 shadow-card"
              >
                <img
                  src={matchedSpace.owner?.avatar}
                  alt={matchedSpace.owner?.name}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              {/* Glowing Heart Connector */}
              <motion.div
                initial={{ scale: 0, rotate: 45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.5, stiffness: 300 }}
                className="absolute z-20 h-10 w-10 rounded-xl bg-rose-500 flex items-center justify-center shadow-md border border-white/20"
              >
                <Heart className="h-5 w-5 text-white fill-white shrink-0" />
              </motion.div>
            </div>

            {/* Matched Space card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex items-center gap-3.5 text-left">
              <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-white/5">
                <img
                  src={matchedSpace.photos?.[0]}
                  alt={matchedSpace.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-0.5">
                  <Home className="h-2.5 w-2.5" /> {matchedSpace.type}
                </span>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">
                  {matchedSpace.title}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  ₦{matchedSpace.price}k per annum • {matchedSpace.area}
                </p>
              </div>
            </div>

            {/* Call CTAs */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  alert(`Sending custom roommate introductory message to ${matchedSpace.owner?.name}!`);
                }}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-glow hover:shadow-glow/50 transition active:scale-95 cursor-pointer"
              >
                <MessageSquare className="h-4.5 w-4.5 shrink-0" />
                <span>Send Chat Introduction</span>
              </button>

              <button
                onClick={() => setShowPhone(true)}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-sm transition active:scale-95 cursor-pointer"
              >
                <Phone className="h-4.5 w-4.5 shrink-0" />
                <span>{showPhone ? matchedSpace.owner?.phone : `Call ${matchedSpace.owner?.name}`}</span>
              </button>

              <button
                onClick={handleClose}
                className="py-3 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer mt-2"
              >
                Keep Discovering Spaces
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

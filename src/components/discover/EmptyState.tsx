import { Sparkles, RefreshCw, Compass, SlidersHorizontal } from "lucide-react";
import { useSpaces } from "@/hooks/use-bunkie-api";

export function EmptyState() {
  const { resetAllSwipes } = useSpaces();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white/70 border border-slate-100 rounded-[2.5rem] shadow-soft backdrop-blur-md">
      {/* 1. Pulsing Radar Location Icon */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute inset-0 h-24 w-24 rounded-full bg-rose-500/10 animate-ping" />
        <div className="absolute inset-0 h-16 w-16 rounded-full bg-rose-500/20 animate-pulse" />
        <div className="relative h-14 w-14 rounded-2xl bg-linear-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-md">
          <Compass className="h-7 w-7 text-white animate-spin-slow" />
        </div>
      </div>

      {/* 2. Text Content */}
      <div className="max-w-xs space-y-2 mb-8">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-1.5">
          <span>End of the Deck!</span>
          <Sparkles className="h-5 w-5 text-rose-400 fill-rose-100" />
        </h3>
        <p className="text-xs font-semibold text-slate-500 leading-relaxed">
          You've swiped on all available listings in this area. Adjust your location filters or restart your deck to find matches.
        </p>
      </div>

      {/* 3. CTA Buttons */}
      <div className="flex flex-col gap-2.5 w-full max-w-xs">
        <button
          onClick={resetAllSwipes}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-soft hover:bg-slate-800 transition active:scale-95 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Rewind & Restart Deck</span>
        </button>

        <button
          onClick={() => {
            // Trigger filter reset event or action
            const event = new CustomEvent("bunkie-reset-filters");
            window.dispatchEvent(event);
          }}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100/70 transition active:scale-95 cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Clear Active Filters</span>
        </button>
      </div>
    </div>
  );
}

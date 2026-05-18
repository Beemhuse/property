import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { SlidersHorizontal, MapPin, DollarSign, Users, Award, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  region: string;
  setRegion: (region: string) => void;
  maxBudget: number;
  setMaxBudget: (budget: number) => void;
  gender: string;
  setGender: (gender: string) => void;
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
  availableRegions: string[];
  availableLifestyleTags: string[];
}

export function FilterPanel({
  region,
  setRegion,
  maxBudget,
  setMaxBudget,
  gender,
  setGender,
  selectedTags,
  setSelectedTags,
  availableRegions,
  availableLifestyleTags,
}: FilterPanelProps) {

  // Auto-reset filters when event is fired from EmptyState
  useEffect(() => {
    const handleReset = () => {
      setRegion("All regions");
      setMaxBudget(250);
      setGender("Any");
      setSelectedTags([]);
    };

    window.addEventListener("bunkie-reset-filters", handleReset);
    return () => window.removeEventListener("bunkie-reset-filters", handleReset);
  }, [setRegion, setMaxBudget, setGender, setSelectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleResetAll = () => {
    setRegion("All regions");
    setMaxBudget(250);
    setGender("Any");
    setSelectedTags([]);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-soft space-y-6 select-none">
      {/* Panel Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Discovery Filters
          </h3>
        </div>
        <button
          onClick={handleResetAll}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors cursor-pointer"
          title="Reset all filters"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Location filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span>Preferred Area</span>
        </label>
        <div className="relative">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer appearance-none"
          >
            {availableRegions.map((regionOption) => (
              <option key={regionOption} value={regionOption}>
                {regionOption}
              </option>
            ))}
          </select>
          {/* Custom dropdown indicator */}
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Budget slider */}
      <div className="space-y-3.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
            <span>Max Budget</span>
          </label>
          <span className="text-sm font-extrabold text-primary bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100">
            ₦{maxBudget}k
          </span>
        </div>
        <div className="space-y-1">
          <input
            type="range"
            min="80"
            max="250"
            step="5"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-hidden"
          />
          <div className="flex justify-between text-[10px] font-black text-slate-400 px-1">
            <span>₦80k</span>
            <span>₦150k</span>
            <span>₦250k</span>
          </div>
        </div>
      </div>

      {/* 3. Roommate Gender Preference */}
      <div className="space-y-3">
        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          <span>Roommate Gender</span>
        </label>
        <div className="flex gap-2">
          {["Any", "Male", "Female"].map((genderOption) => {
            const isActive = gender.toLowerCase() === genderOption.toLowerCase();
            return (
              <button
                key={genderOption}
                onClick={() => setGender(genderOption)}
                className={`flex-grow py-2.5 rounded-xl text-xs font-bold text-center border transition cursor-pointer select-none active:scale-95 ${
                  isActive
                    ? "bg-slate-900 border-slate-900 text-white shadow-soft"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {genderOption}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Amenities Multi-select */}
      <div className="space-y-3">
        <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-slate-400" />
          <span>Desired Amenities</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availableLifestyleTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`flex items-center justify-center py-2.5 px-3 rounded-xl border text-[11px] font-bold text-center transition cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? "bg-rose-500 border-rose-500 text-white shadow-glow"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

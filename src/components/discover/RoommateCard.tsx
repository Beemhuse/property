import { BadgeCheck, MapPin, Sparkles, Building, Briefcase } from "lucide-react";
import { Image } from "@/components/ui/image";
import type { Space } from "@/hooks/use-bunkie-api";

interface RoommateCardProps {
  r: Space;
  stacked?: boolean;
}

export function RoommateCard({ r, stacked = false }: RoommateCardProps) {
  const photo = r.photos?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267";
  const budget = `₦${r.price.toLocaleString()}k`;

  return (
    <article
      className={`relative w-full h-full overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-card border border-white/10 transition-all select-none ${
        stacked ? "pointer-events-none" : "hover:shadow-glow/20"
      }`}
    >
      {/* 1. Main Background Image */}
      <Image
        src={photo}
        alt={r.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* 2. Linear dark overlay for premium legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 via-25% to-transparent" />

      {/* 3. Floating Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-2">
          {r.isPublished && (
            <div className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-black text-primary shadow-soft">
              <BadgeCheck className="h-3.5 w-3.5 fill-current text-primary" />
              <span>Verified Space</span>
            </div>
          )}
          {r.matchScore !== undefined && r.matchScore > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-3 py-1.5 text-xs font-black text-white shadow-glow">
              <Sparkles className="h-3.5 w-3.5 animate-bounce shrink-0" />
              <span>{r.matchScore}% Compatibility</span>
            </div>
          )}
        </div>

        {/* Floating price tag */}
        <span className="rounded-2xl bg-slate-950/80 backdrop-blur-md px-3.5 py-2 text-sm font-black text-white border border-white/10">
          {budget}
        </span>
      </div>

      {/* 4. Details Footer Section (Bottom) */}
      <div className="absolute bottom-0 inset-x-0 p-6 pt-12 text-white flex flex-col gap-4">
        {/* Title & Type */}
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-950/40 backdrop-blur-xs px-2 py-0.5 rounded-md mb-2">
            <Building className="h-3 w-3" /> {r.type}
          </span>
          <h3 className="text-xl font-black leading-tight tracking-tight drop-shadow-md text-white">
            {r.title}
          </h3>
        </div>

        {/* Owner Profile Overlay (Tinder Style) */}
        {r.owner && (
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-inner">
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shrink-0 shadow-soft">
              <img
                src={r.owner.avatar}
                alt={r.owner.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white leading-none flex items-center gap-1">
                <span>{r.owner.name}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              </h4>
              {r.owner.occupation && (
                <span className="text-[10px] text-white/70 font-semibold mt-1 flex items-center gap-1 truncate">
                  <Briefcase className="h-3 w-3" /> {r.owner.occupation}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Location & Tags */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span>{r.area}</span>
          </div>

          {/* Tag Chips */}
          {r.amenities && r.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {r.amenities.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white/90 border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

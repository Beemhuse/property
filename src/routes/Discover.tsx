import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { Heart, X, BadgeCheck, MapPin, SlidersHorizontal, Star, Compass, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DesktopShell } from "@/components/DesktopShell";
import { useSpaces, useMatchMutation } from "@/hooks/use-bunkie-api";
import type { Space } from "@/hooks/use-bunkie-api";
import { ListingGridSkeleton } from "@/components/ListingSkeleton";
import { apiFetch } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { toastError, toastSuccess } from "@/lib/error";
import { RoommateCard } from "@/components/discover/RoommateCard";
import { ActionBtn } from "@/components/discover/ActionBtn";
import { EmptyState } from "@/components/discover/EmptyState";
import { FilterPanel } from "@/components/discover/FilterPanel";
import { Image } from "@/components/ui/image";

export const Route = createFileRoute("/app/discover")({
  head: () => ({
    meta: [
      { title: "Discover roommates — Bunkie" },
      {
        name: "description",
        content: "Browse verified students looking for a roommate across campuses on Bunkie.",
      },
    ],
  }),
  loader: async ({ context }: { context: any }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["spaces"],
      queryFn: () => apiFetch(ENDPOINTS.SPACES.LIST),
    });
  },
  component: Discover,
});

export function Discover() {
  const { data: spaces, isLoading } = useSpaces();
  const [region, setRegion] = useState("All regions");
  const [maxBudget, setMaxBudget] = useState(250); // Set default to max
  const [gender, setGender] = useState("Any");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract unique values from spaces data
  const availableRegions = useMemo(() => {
    if (!spaces) return ["All regions"];
    const regions = [...new Set(spaces.map((space) => space.area))].sort();
    return ["All regions", ...regions];
  }, [spaces]);

  const availableLifestyleTags = useMemo(() => {
    if (!spaces) return [];
    const allAmenities = spaces.flatMap((space) => space.amenities || []);
    return [...new Set(allAmenities)].sort();
  }, [spaces]);


  const filteredSpaces = useMemo(() => {
    if (!spaces) return [];

    return spaces.filter((space) => {
      // 1. Filter by Region
      const matchesRegion =
        region === "All regions" || space.area === region;

      // 2. Filter by Price Budget
      const matchesBudget = space.price <= maxBudget;

      // 3. Filter by Gender Roommate Prefs
      const genders = (space.roommatePrefs || []).map((g) =>
        g.toLowerCase()
      );
      const matchesGender =
        gender === "Any" ||
        genders.includes(gender.toLowerCase()) ||
        genders.includes("any");

      // 4. Filter by Amenities tags
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) =>
          (space.amenities || []).includes(tag)
        );

      return matchesRegion && matchesBudget && matchesGender && matchesTags;
    });
  }, [spaces, region, maxBudget, gender, selectedTags]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-5 max-w-5xl mx-auto">
          <ListingGridSkeleton />
        </div>
      </AppShell>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <MobileDiscover
          spaces={filteredSpaces}
          region={region}
          setRegion={setRegion}
          availableRegions={availableRegions}
        />
      </div>
      <DesktopShell
        middle={
          <DesktopGrid
            spaces={filteredSpaces}
            region={region}
            setRegion={setRegion}
            availableRegions={availableRegions}
          />
        }
        right={
          <FilterPanel
            region={region}
            setRegion={setRegion}
            maxBudget={maxBudget}
            setMaxBudget={setMaxBudget}
            gender={gender}
            setGender={setGender}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            availableRegions={availableRegions}
            availableLifestyleTags={availableLifestyleTags}
          />
        }
      />
    </>
  );
}

/* -------- Mobile (swipe) -------- */

function MobileDiscover({
  spaces,
  region,
  setRegion,
  availableRegions,
}: {
  spaces: Space[];
  region: string;
  setRegion: (region: string) => void;
  availableRegions: string[];
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [showActions, setShowActions] = useState(false);
  const matchMutation = useMatchMutation();

  // Reset index when space count resets (e.g. from Rewind deck)
  useEffect(() => {
    if (spaces.length > 0 && index >= spaces.length) {
      setIndex(0);
    }
  }, [spaces, index]);

  // Filter out already liked/skipped ones in the deck to match Tinder
  const activeDeck = useMemo(() => {
    return spaces.filter((s) => !s.isLiked && !s.isSkipped);
  }, [spaces]);

  // Use index relative to the active deck
  const current = activeDeck[0];
  const next = activeDeck[1];
  const empty = !current;

  // Listen to keyboard shortcut keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (empty) return;
      if (e.key === "ArrowLeft") {
        handleSwipe("left");
      } else if (e.key === "ArrowRight") {
        handleSwipe("right");
      } else if (e.key === "ArrowUp") {
        setShowActions(true);
      } else if (e.key === "ArrowDown") {
        setShowActions(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [empty, current]);

  const handleSwipe = async (dir: "left" | "right") => {
    if (!current) return;
    setDirection(dir);

    // Save swipe action locally in database
    if (dir === "left") {
      await matchMutation.skipSpace(current.id);
    } else {
      try {
        const res = await matchMutation.mutateAsync(current.id);
        if (res.matched) {
          toastSuccess("It's a Match! 🎉");
        } else {
          toastSuccess("Interested! Liking logged successfully.");
        }
      } catch (err) {
        toastError(err, "Failed to swipe like");
      }
    }

    setTimeout(() => {
      setDirection(null);
    }, 250);
  };

  const handleLike = async () => {
    if (!current) return;
    await handleSwipe("right");
  };

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x > 120) {
      handleSwipe("right");
    } else if (info.offset.x < -120) {
      handleSwipe("left");
    } else if (info.offset.y < -80) {
      setShowActions(true);
    } else if (info.offset.y > 80) {
      setShowActions(false);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 bottom-16 bg-slate-950 z-30 select-none overflow-hidden flex flex-col justify-between">
      {/* 1. Translucent floating top nav */}
      <div className="absolute top-4 inset-x-4 z-40 flex items-center justify-between bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 text-white shadow-soft">
        <div className="flex flex-col">
          <span className="text-xs font-black tracking-wider uppercase text-rose-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 fill-rose-400" /> Bunkie Discover
          </span>
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Swipe left to Skip • right to Like
          </span>
        </div>
        
        <button
          onClick={() => {
            const event = new CustomEvent("bunkie-reset-filters");
            window.dispatchEvent(event);
            toastSuccess("Filters reset to default!");
          }}
          className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-95 transition cursor-pointer"
          aria-label="Filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* 2. Horizontal Regions scrolling chips list */}
      <div className="absolute top-20 inset-x-0 z-40 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none">
        {availableRegions.map((regionOption) => (
          <button
            key={regionOption}
            onClick={() => setRegion(regionOption)}
            className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-black transition cursor-pointer select-none active:scale-95 border ${
              region === regionOption
                ? "bg-rose-500 border-rose-500 text-white shadow-glow"
                : "bg-slate-900/60 border-white/5 text-slate-300 backdrop-blur-md"
            }`}
          >
            {regionOption}
          </button>
        ))}
      </div>

      {/* 3. Card Stack Deck Area */}
      <div className="relative w-full h-full z-10">
        {empty ? (
          <div className="absolute inset-x-4 top-36 bottom-6 flex items-center justify-center">
            <EmptyState />
          </div>
        ) : (
          <div className="absolute inset-0">
            {next && (
              <div className="absolute inset-0 scale-[0.96] opacity-40 z-0 select-none pointer-events-none">
                <RoommateCard r={next} stacked />
              </div>
            )}
            <AnimatePresence>
              <motion.div
                key={current.id}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={onDragEnd}
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                  x: direction === "right" ? 450 : direction === "left" ? -450 : 0,
                  rotate: direction === "right" ? 20 : direction === "left" ? -20 : 0,
                  opacity: 0,
                }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
              >
                <Link to={`/app/spaces/${current.id}`} className="block h-full w-full">
                  <RoommateCard r={current} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 4. Action Slide-up Drawer */}
      {!empty && (
        <motion.div
          animate={{
            y: showActions ? 0 : 100,
            opacity: showActions ? 1 : 0.8
          }}
          transition={{ type: "spring", damping: 26, stiffness: 210 }}
          className="absolute bottom-4 inset-x-4 z-40 flex flex-col items-center gap-3 bg-slate-950/80 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-4 shadow-glow"
        >
          {/* Drag handlebar indicator */}
          <button
            onClick={() => setShowActions(!showActions)}
            className="flex flex-col items-center gap-1 cursor-pointer select-none group w-full py-1"
          >
            <div className="h-1 w-10 rounded-full bg-white/20 group-hover:bg-white/40 transition" />
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
              {showActions ? "Tap to close drawer" : "Swipe up / Press ArrowUp for actions"}
            </span>
          </button>

          <div className="flex items-center justify-center gap-6 w-full pt-1">
            <ActionBtn onClick={() => handleSwipe("left")} variant="skip" label="Skip">
              <X className="h-6 w-6 text-amber-500" strokeWidth={3} />
            </ActionBtn>
            
            <ActionBtn variant="star" label="Super like">
              <Star className="h-5 w-5 fill-current text-sky-500" />
            </ActionBtn>

            <ActionBtn onClick={handleLike} variant="like" label="Interested">
              <Heart
                className={`h-6 w-6 text-rose-500 transition-all ${
                  current.isLiked ? "fill-current" : ""
                }`}
                strokeWidth={current.isLiked ? 0 : 3}
              />
            </ActionBtn>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* -------- Desktop (grid) -------- */

function DesktopGrid({
  spaces,
  region,
  setRegion,
  availableRegions,
}: {
  spaces: Space[];
  region: string;
  setRegion: (region: string) => void;
  availableRegions: string[];
}) {
  const matchMutation = useMatchMutation();

  return (
    <div className="pb-8">
      {/* Upper header details */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Discover</h1>
          <p className="mt-1 text-sm font-semibold text-slate-400">
            {spaces.length} verified Bunkie spaces near you
          </p>
        </div>
        
        {/* Horizontal Scroll Regions selectors */}
        <div className="flex gap-2">
          {availableRegions.map((regionOption) => (
            <button
              key={regionOption}
              onClick={() => setRegion(regionOption)}
              className={`rounded-full px-4 py-2 text-xs font-black transition cursor-pointer select-none active:scale-95 ${
                region === regionOption
                  ? "bg-slate-900 text-white shadow-soft"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {regionOption}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing display */}
      {spaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-100 min-h-[40vh]">
          <Compass className="h-10 w-10 text-slate-300 animate-spin-slow mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No spaces matched your filters</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
            Try adjusting your maximum budget or unchecking some amenities to find more options.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spaces.map((r) => {
            const photo =
              r.photos?.[0] || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6";
            const budget = `₦${r.price.toLocaleString()}k`;

            return (
              <article
                key={r.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
              >
                {/* Visual Card Image Cover */}
                <div className="relative aspect-4/5 overflow-hidden">
                  <Image
                    src={photo}
                    alt={r.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Linear bottom fade scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />

                  {/* Verification & Match Score Badges */}
                  {r.isPublished && (
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black text-primary shadow-soft backdrop-blur-md">
                      <BadgeCheck className="h-3.5 w-3.5 fill-current text-primary" />
                      <span>Verified</span>
                    </div>
                  )}

                  {r.matchScore !== undefined && r.matchScore > 0 && (
                    <div className="absolute left-3 top-10 inline-flex items-center gap-1 rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-2.5 py-1 text-[9px] font-black text-white shadow-glow">
                      <span>{r.matchScore}% Match</span>
                    </div>
                  )}

                  {/* Liking Heart Circle button */}
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (r.isLiked) return;
                      try {
                        const res = await matchMutation.mutateAsync(r.id);
                        if (res.matched) {
                          toastSuccess("It's a Match! 🎉");
                        } else {
                          toastSuccess("Added to Liked Spaces!");
                        }
                      } catch (err) {
                        toastError(err, "Failed to like card");
                      }
                    }}
                    className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 backdrop-blur-md transition cursor-pointer select-none active:scale-90 ${
                      matchMutation.isPending
                        ? "opacity-50"
                        : r.isLiked
                          ? "bg-rose-500 text-white"
                          : "bg-white/90 text-slate-500 hover:text-rose-500"
                    }`}
                    aria-label="Like"
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider">
                      {r.isLiked ? "Interested" : "Interested?"}
                    </span>
                    <Heart className={`h-3.5 w-3.5 ${r.isLiked ? "fill-current" : ""}`} />
                  </button>

                  {/* Card Title details */}
                  <Link to={`/app/spaces/${r.id}`} className="block">
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <h3 className="text-base font-extrabold leading-tight text-white group-hover:text-rose-200 transition">
                        {r.title}
                      </h3>
                      <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-wide">
                        {r.type}
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Card text details */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> {r.area}
                      </span>
                      <span className="text-primary font-black">{budget}</span>
                    </div>
                    <p className="mt-2.5 line-clamp-2 text-xs font-semibold text-slate-500 leading-relaxed">
                      {r.description}
                    </p>
                  </div>

                  {/* Amenities tags chips */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(r.amenities || []).slice(0, 3).map((t: string) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

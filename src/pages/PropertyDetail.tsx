import { useState, useEffect } from "react";
import { useRouter, Link } from "@tanstack/react-router";
import {
  MapPin,
  Heart,
  ChevronLeft,
  BadgeCheck,
  Building,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Phone,
  Briefcase
} from "lucide-react";
import { useSpaces, useMatchMutation } from "@/hooks/use-bunkie-api";
import { AppShell } from "@/components/AppShell";
import { Image } from "@/components/ui/image";
import { toastSuccess } from "@/lib/error";

export function PropertyDetail() {
  const { path } = useRouter();
  const { data: spaces, isLoading } = useSpaces();
  const matchMutation = useMatchMutation();
  const [photoIndex, setPhotoIndex] = useState(0);

  // Extract ID from path like /app/spaces/space-1
  const pathParts = path.split("/");
  const spaceId = pathParts[pathParts.length - 1] || "";
  
  const space = spaces.find((s) => s.id === spaceId);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [spaceId]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
        </div>
      </AppShell>
    );
  }

  if (!space) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center text-center p-8 min-h-[60vh]">
          <Compass className="h-12 w-12 text-slate-300 animate-spin-slow mb-4" />
          <h3 className="text-xl font-bold text-slate-800">Property Not Found</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-xs">
            The property listing you are trying to view does not exist or has been removed.
          </p>
          <Link
            to="/app/discover"
            className="mt-6 flex items-center gap-2 py-3 px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition"
          >
            <span>Back to Discover</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </AppShell>
    );
  }

  const photos = space.photos || ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"];
  const budget = `₦${space.price.toLocaleString()}k`;

  const handleInterested = async () => {
    try {
      const res = await matchMutation.mutateAsync(space.id);
      if (res.matched) {
        toastSuccess("It's a Match! Celebration triggered 🎉");
      } else {
        toastSuccess("Interested! Liking logged successfully.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto pb-12 select-none">
        {/* Floating Top Nav bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft hover:bg-slate-50 transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
          
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">
            Space Details
          </h3>

          <button
            onClick={handleInterested}
            disabled={space.isLiked}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-soft transition active:scale-95 cursor-pointer ${
              space.isLiked
                ? "bg-rose-500 border-rose-500 text-white"
                : "border border-slate-200 bg-white text-slate-400 hover:text-rose-500"
            }`}
          >
            <Heart className={`h-5 w-5 ${space.isLiked ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Column A: Gallery Carousel (Col span 7) */}
          <div className="col-span-1 md:col-span-7 space-y-4">
            <div className="relative aspect-4/3 md:aspect-video rounded-[2rem] overflow-hidden shadow-card border border-slate-100 bg-slate-900">
              <Image
                src={photos[photoIndex]}
                alt={space.title}
                className="h-full w-full object-cover"
              />
              
              {/* Image gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              
              {/* Carousel controls */}
              {photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        photoIndex === i ? "w-6 bg-white" : "w-2 bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Photo Thumbnails */}
            {photos.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIndex(i)}
                    className={`h-16 w-20 rounded-2xl overflow-hidden shrink-0 border-2 transition ${
                      photoIndex === i ? "border-primary" : "border-slate-200 opacity-60"
                    }`}
                  >
                    <img src={photo} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Column B: Info section (Col span 5) */}
          <div className="col-span-1 md:col-span-5 space-y-6">
            <div>
              {/* Title type */}
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary bg-rose-50 px-2.5 py-1 rounded-md mb-3 border border-rose-100/50">
                <Building className="h-3.5 w-3.5" /> {space.type}
              </span>

              {/* Title */}
              <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {space.title}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-1 text-slate-500 text-sm font-semibold mt-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>{space.area}</span>
              </div>
            </div>

            {/* Budget Display Card */}
            <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Total Rent
                </span>
                <p className="text-xs font-semibold text-slate-500">
                  Subsidized Semester Plan
                </p>
              </div>
              <span className="text-xl font-black text-primary bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-soft">
                {budget}
              </span>
            </div>

            {/* Landlord Profile card */}
            {space.owner && (
              <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-soft space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                    <img src={space.owner.avatar} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 leading-none">
                      {space.owner.name}
                    </h4>
                    {space.owner.occupation && (
                      <span className="text-[10px] font-semibold text-slate-400 mt-1.5 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {space.owner.occupation}
                      </span>
                    )}
                  </div>
                  <BadgeCheck className="h-5 w-5 text-primary fill-rose-50 shrink-0 ml-auto" />
                </div>
                
                {/* direct call CTA */}
                <button
                  onClick={() => alert(`Calling matched roommate: ${space.owner?.phone}`)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition active:scale-95 cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call {space.owner.name}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mt-10 border-t border-slate-100 pt-8 space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-slate-900">
              About this Space
            </h3>
            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              {space.description}
            </p>
          </div>

          {/* Amenities checklist */}
          {space.amenities && space.amenities.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">
                Included Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {space.amenities.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 border border-slate-200"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Roommate preferences */}
          {space.roommatePrefs && space.roommatePrefs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">
                Roommate Preference
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <p className="text-xs font-bold text-slate-600">
                  Prefers: <span className="text-primary font-black uppercase">{space.roommatePrefs.join(", ")}</span> Roommates
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

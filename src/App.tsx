import { RouterProvider, useRouter, Link } from "@tanstack/react-router";
import { Discover } from "@/routes/Discover";
import { PropertyDetail } from "@/pages/PropertyDetail";
import { MatchCelebration } from "@/components/discover/MatchCelebration";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { useSpaces } from "@/hooks/use-bunkie-api";
import { MapPin, Heart, Sparkles, MessageSquare, ExternalLink, ShieldCheck, Tag } from "lucide-react";
import { Image } from "@/components/ui/image";

// Route Dispatcher Component
function AppContent() {
  const { path } = useRouter();

  // Route: /app/spaces/$id
  if (path.startsWith("/app/spaces/")) {
    return <PropertyDetail />;
  }

  // Route: /app/likes
  if (path === "/app/likes") {
    return <LikesPage />;
  }

  // Route: /app/matches
  if (path === "/app/matches") {
    return <MatchesPage />;
  }

  // Route: /app/profile
  if (path === "/app/profile") {
    return <ProfilePage />;
  }

  // Fallback / Route: / or /app/discover
  return <Discover />;
}

// 1. Likes Page component
function LikesPage() {
  const { data: spaces } = useSpaces();
  const likedSpaces = spaces.filter((s) => s.isLiked);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto pb-8 select-none">
        <ScreenHeader
          title="Liked Spaces"
          subtitle="All rooms and hostels you shown interest in"
        />

        {likedSpaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[2rem] border border-slate-100 min-h-[45vh] shadow-soft">
            <Heart className="h-12 w-12 text-slate-200 mb-4 animate-pulse" />
            <h3 className="text-lg font-extrabold text-slate-800">No Liked Listings</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
              When swiping or exploring desktop cards, click the heart to save spaces you love.
            </p>
            <Link
              to="/app/discover"
              className="mt-6 flex items-center gap-2 py-3 px-6 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            >
              <span>Start Exploring</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {likedSpaces.map((space) => (
              <Link
                key={space.id}
                to={`/app/spaces/${space.id}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card cursor-pointer"
              >
                <div className="aspect-4/3 w-full overflow-hidden relative">
                  <Image src={space.photos?.[0] || ""} alt={space.title} />
                  <div className="absolute top-3 right-3 bg-rose-500 text-white p-2 rounded-xl border border-white/10 shadow-soft">
                    <Heart className="h-4 w-4 fill-current" />
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block">
                    {space.type}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-800 truncate mt-1 group-hover:text-primary transition-colors">
                    {space.title}
                  </h4>
                  <div className="flex justify-between items-center mt-3 text-xs font-semibold">
                    <span className="text-slate-400 flex items-center gap-0.5 truncate">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{space.area}</span>
                    </span>
                    <span className="text-primary font-black shrink-0">₦{space.price}k</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

// 2. Matches Page component
function MatchesPage() {
  const { data: spaces } = useSpaces();
  
  // Simulated matches: list rooms liked where random match logic succeeded
  const matches = spaces.filter((s) => s.isLiked && s.matchScore && s.matchScore > 90);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto pb-8 select-none">
        <ScreenHeader
          title="My Matches"
          subtitle="Verified roommates interested in sharing a home"
        />

        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[2rem] border border-slate-100 min-h-[45vh] shadow-soft">
            <MessageSquare className="h-12 w-12 text-slate-200 mb-4" />
            <h3 className="text-lg font-extrabold text-slate-800">No Matches Yet</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
              Liking student listings with high compatibility match scores increases your chances of getting matched!
            </p>
            <Link
              to="/app/discover"
              className="mt-6 flex items-center gap-2 py-3 px-6 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            >
              <span>Keep Swiping</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((space) => (
              <div
                key={space.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl bg-white border border-slate-100 shadow-soft hover:shadow-card transition duration-300 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full overflow-hidden border border-slate-200 shrink-0">
                      <img src={space.owner?.avatar} alt="" className="h-full w-full object-cover" />
                    </div>
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-slate-800">
                        {space.owner?.name}
                      </h4>
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-black text-rose-500 border border-rose-100">
                        <Sparkles className="h-2.5 w-2.5 fill-current" />
                        <span>{space.matchScore}% Match</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Matched space: <span className="text-slate-600 font-bold">{space.title}</span>
                    </p>
                    <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50/70 border border-indigo-100/50 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                      {space.owner?.occupation}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Link
                    to={`/app/spaces/${space.id}`}
                    className="flex items-center gap-1 px-4 py-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-600 text-xs font-bold transition active:scale-95 cursor-pointer"
                  >
                    <span>View Space</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <button
                    onClick={() => {
                      alert(`Direct introductory chat opened to ${space.owner?.name}!`);
                    }}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-soft hover:shadow-glow/20 transition active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5 fill-current" />
                    <span>Send Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

// 3. Profile Page component
function ProfilePage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto pb-8 select-none">
        <ScreenHeader title="My Profile" subtitle="Student housing identity profile" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Card left: 3D ID badge */}
          <div className="col-span-1 md:col-span-4 bg-slate-900 border border-white/10 rounded-[2rem] p-6 text-white text-center shadow-card relative overflow-hidden">
            {/* abstract elements */}
            <div className="absolute top-0 right-0 h-28 w-28 bg-pink-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 h-28 w-28 bg-rose-500/10 rounded-full blur-2xl" />
            
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/10 shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="My avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <h3 className="text-lg font-black tracking-tight leading-none text-white">
              Chioma Nze
            </h3>
            <span className="text-[10px] font-bold text-rose-400 mt-1 block uppercase tracking-widest">
              Verified Student Profile
            </span>

            <div className="mt-6 flex justify-around border-t border-white/5 pt-5 text-left">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">
                  Campus
                </span>
                <span className="text-xs font-bold text-white">UNN</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">
                  Gender
                </span>
                <span className="text-xs font-bold text-white">Female</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">
                  Likes Sent
                </span>
                <span className="text-xs font-bold text-white">12</span>
              </div>
            </div>
          </div>

          {/* Details right: Profile Preferences form */}
          <div className="col-span-1 md:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-soft space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                <h3 className="text-base font-extrabold text-slate-800">
                  Student Verification Check
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Your profile is officially verified for active roommate compatibility searches. Complete roommate preferences are computed automatically.
              </p>
            </div>

            <div className="border-t border-slate-50 pt-5 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                My LifeStyle Preferences
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Early Bird", "WiFi Needed", "Clean Focused", "No Parties", "Quiet Study Zone"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600"
                  >
                    <Tag className="h-3 w-3 text-slate-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-50 pt-5">
              <button
                onClick={() => alert("Profile edits updated successfully!")}
                className="w-full py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition active:scale-95 cursor-pointer shadow-soft text-center"
              >
                Save Preferences Updates
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}

export function App() {
  return (
    <RouterProvider>
      {/* 1. Global Page Content Router */}
      <AppContent />
      
      {/* 2. Global Celebration Overlay (confetti matched trigger) */}
      <MatchCelebration />
    </RouterProvider>
  );
}

export default App;

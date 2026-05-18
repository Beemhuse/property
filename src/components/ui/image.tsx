import { useState, useEffect } from "react";

export function Image({
  src,
  alt,
  className = "",
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  [key: string]: any;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setLoaded(false);
    setError(false);
  }, [src]);

  // Premium fallback cozy apartment photo if any link fails
  const fallbackSrc = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

  return (
    <div className={`relative overflow-hidden w-full h-full bg-slate-100 ${className}`}>
      {/* Premium blur/pulse loading placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        {...props}
      />
    </div>
  );
}

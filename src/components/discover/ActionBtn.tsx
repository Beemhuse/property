import React from "react";

interface ActionBtnProps {
  onClick?: (e: React.MouseEvent) => void;
  variant: "skip" | "star" | "like";
  label: string;
  children: React.ReactNode;
}

export function ActionBtn({ onClick, variant, label, children }: ActionBtnProps) {
  // Map variant styles
  const styles = {
    skip: {
      btn: "border border-amber-200 bg-amber-50 text-amber-500 hover:bg-amber-100 hover:border-amber-300 hover:shadow-[0_8px_20px_-4px_rgba(245,158,11,0.25)]",
      ripple: "bg-amber-400"
    },
    star: {
      btn: "border border-sky-200 bg-sky-50 text-sky-500 hover:bg-sky-100 hover:border-sky-300 hover:shadow-[0_8px_20px_-4px_rgba(14,165,233,0.25)]",
      ripple: "bg-sky-400"
    },
    like: {
      btn: "border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:border-rose-300 hover:shadow-[0_8px_20px_-4px_rgba(244,63,94,0.3)]",
      ripple: "bg-rose-400"
    }
  };

  return (
    <button
      onClick={onClick}
      className={`relative grid h-16 w-16 place-items-center rounded-full bg-white shadow-soft transition-all duration-300 active:scale-90 hover:scale-110 cursor-pointer ${styles[variant].btn}`}
      aria-label={label}
    >
      {/* Ripple active ring effect */}
      <span className="absolute inset-0 rounded-full scale-100 opacity-0 active:scale-150 active:opacity-20 transition-all duration-500 bg-current" />
      
      <span className="relative z-10 flex items-center justify-center shrink-0">
        {children}
      </span>
    </button>
  );
}

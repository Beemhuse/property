import { useState, useEffect, useCallback } from "react";
import rawSpaces from "../data/properties.json";

// Define the Space structure
export type Space = {
  id: string;
  title: string;
  price: number;
  area: string;
  type: string;
  description: string;
  photos?: string[];
  amenities?: string[];
  isPublished?: boolean;
  isLiked?: boolean;
  isSkipped?: boolean;
  owner?: {
    name?: string;
    gender?: string;
    avatar?: string;
    phone?: string;
    occupation?: string;
  };
  roommatePrefs?: string[];
  matchScore?: number;
};

// Key for local storage
const LOCAL_STORAGE_KEY = "bunkie_spaces_data";

// Helper to get or set initial spaces in localStorage
const getStoredSpaces = (): Space[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored spaces", e);
    }
  }
  
  // Initialize with raw JSON, ensuring all properties are there
  const initial = rawSpaces.map(space => ({
    ...space,
    isLiked: false,
    isSkipped: false
  })) as Space[];
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveSpacesToStorage = (spaces: Space[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(spaces));
};

// Global event listeners to sync state between multiple hook instances
const listeners = new Set<() => void>();
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Custom Match Event for the overlay celebration
export const triggerMatchCelebration = (space: Space) => {
  const event = new CustomEvent("bunkie-match-celebration", { detail: space });
  window.dispatchEvent(event);
};

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state on change
  const syncSpaces = useCallback(() => {
    setSpaces(getStoredSpaces());
  }, []);

  useEffect(() => {
    // Initial sync
    syncSpaces();
    
    // Subscribe to updates
    listeners.add(syncSpaces);
    
    // Simulate initial loading network delay for premium skeleton loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => {
      listeners.delete(syncSpaces);
      clearTimeout(timer);
    };
  }, [syncSpaces]);

  const resetAllSwipes = useCallback(() => {
    const initial = rawSpaces.map(space => ({
      ...space,
      isLiked: false,
      isSkipped: false
    })) as Space[];
    saveSpacesToStorage(initial);
    notifyListeners();
  }, []);

  return {
    data: spaces,
    isLoading,
    resetAllSwipes
  };
}

export function useMatchMutation() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (spaceId: string): Promise<{ matched: boolean; space: Space }> => {
    setIsPending(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const spaces = getStoredSpaces();
    const index = spaces.findIndex(s => s.id === spaceId);
    
    if (index === -1) {
      setIsPending(false);
      throw new Error("Space not found");
    }
    
    // Mark as liked
    spaces[index].isLiked = true;
    saveSpacesToStorage(spaces);
    notifyListeners();
    setIsPending(false);

    const space = spaces[index];

    // Simulate match algorithm:
    // For premium Tinder-feel, we trigger a match 50% of the time,
    // as long as the matchScore is > 85% or on specific spaces
    const isMatch = Math.random() > 0.4;
    
    if (isMatch) {
      // Trigger celebration event
      setTimeout(() => {
        triggerMatchCelebration(space);
      }, 350); // slight delay after swipe exit animation completes
    }

    return {
      matched: isMatch,
      space
    };
  };

  const mutate = (spaceId: string) => {
    mutateAsync(spaceId).catch(err => {
      console.error("Mutation failed", err);
    });
  };

  const skipSpace = async (spaceId: string) => {
    const spaces = getStoredSpaces();
    const index = spaces.findIndex(s => s.id === spaceId);
    if (index !== -1) {
      spaces[index].isSkipped = true;
      saveSpacesToStorage(spaces);
      notifyListeners();
    }
  };

  return {
    mutate,
    mutateAsync,
    isPending,
    skipSpace
  };
}

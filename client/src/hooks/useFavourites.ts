import { create } from 'zustand';

const STORAGE_KEY = 'sportscore_favourites';

function loadFromStorage(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Set(JSON.parse(stored));
  } catch {}
  return new Set();
}

interface FavouritesState {
  favourites: Set<string>;
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
}

const useFavouritesStore = create<FavouritesState>((set, get) => ({
  favourites: loadFromStorage(),
  toggleFavourite: (id: string) => {
    const next = new Set(get().favourites);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    set({ favourites: next });
  },
  isFavourite: (id: string) => get().favourites.has(id),
}));

export function useFavourites() {
  const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite);
  const isFavourite = useFavouritesStore((s) => s.isFavourite);
  const favourites = useFavouritesStore((s) => s.favourites);
  return { favourites, toggleFavourite, isFavourite };
}

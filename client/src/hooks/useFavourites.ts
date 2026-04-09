import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sportscore_favourites';

export function useFavourites() {
  const [favourites, setFavourites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFavourites(new Set(JSON.parse(stored)));
    }
  }, []);

  const toggleFavourite = (id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const isFavourite = (id: string) => favourites.has(id);

  return { favourites, toggleFavourite, isFavourite };
}
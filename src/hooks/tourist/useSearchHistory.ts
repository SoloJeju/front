import { useState, useEffect } from 'react';

const STORAGE_KEY = 'searchHistory';

export function useSearchHistory(limit = 10) {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const updateHistory = (newItem: string) => {
    let updated = [newItem, ...searchHistory.filter((h) => h !== newItem)];
    if (updated.length > limit) {
      updated = updated.slice(0, limit);
    }
    setSearchHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeHistoryItem = (item: string) => {
    const updated = searchHistory.filter((h) => h !== item);
    setSearchHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { searchHistory, updateHistory, removeHistoryItem };
}

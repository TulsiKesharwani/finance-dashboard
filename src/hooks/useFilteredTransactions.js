import { useMemo } from 'react';
import useStore from '../store/useStore';

export default function useFilteredTransactions() {
  const transactions = useStore((s) => s.transactions);
  const filters = useStore((s) => s.filters);

  return useMemo(() => {
    let result = [...transactions];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    // Type
    if (filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    // Date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const days = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }[filters.dateRange];
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - days);
      result = result.filter((t) => new Date(t.date) >= cutoff);
    }

    // Sort
    result.sort((a, b) => {
      const dir = filters.sortOrder === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') {
        return dir * (new Date(a.date) - new Date(b.date));
      }
      return dir * (a.amount - b.amount);
    });

    return result;
  }, [transactions, filters]);
}

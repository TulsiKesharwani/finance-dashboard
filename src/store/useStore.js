import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { transactions as mockTransactions } from '../data/mockData';

const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // Role
      role: 'admin', // 'admin' | 'viewer'
      setRole: (role) => set({ role }),

      // Transactions
      transactions: mockTransactions,
      addTransaction: (txn) =>
        set((s) => ({
          transactions: [
            { ...txn, id: `txn_${Date.now()}` },
            ...s.transactions,
          ],
        })),
      updateTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      // Filters
      filters: {
        search: '',
        category: 'all',
        type: 'all',
        dateRange: 'all', // 'all' | '7d' | '30d' | '90d' | '1y'
        sortBy: 'date', // 'date' | 'amount'
        sortOrder: 'desc',
      },
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () =>
        set({
          filters: {
            search: '',
            category: 'all',
            type: 'all',
            dateRange: 'all',
            sortBy: 'date',
            sortOrder: 'desc',
          },
        }),

      // Active page
      activePage: 'dashboard',
      setActivePage: (page) => set({ activePage: page }),

      // Modal
      modalOpen: false,
      modalTransaction: null,
      openModal: (txn = null) => set({ modalOpen: true, modalTransaction: txn }),
      closeModal: () => set({ modalOpen: false, modalTransaction: null }),
    }),
    {
      name: 'tulsi-finance-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        role: state.role,
        transactions: state.transactions,
      }),
    }
  )
);

export default useStore;

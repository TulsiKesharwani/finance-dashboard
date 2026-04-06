import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ArrowUpDown, Plus, Pencil, Trash2,
  Download, X, FileText,
} from 'lucide-react';
import useStore from '../store/useStore';
import useFilteredTransactions from '../hooks/useFilteredTransactions';

const PAGE_SIZE = 15;

const dateRanges = [
  { label: 'All Time', value: 'all' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last Year', value: '1y' },
];

const allCategories = [
  'Food & Dining', 'Shopping', 'Transportation', 'Entertainment',
  'Bills & Utilities', 'Health & Fitness', 'Travel', 'Education',
  'Salary', 'Freelance', 'Investments', 'Gifts',
];

export default function TransactionList() {
  const { filters, setFilter, resetFilters, openModal, deleteTransaction, role, darkMode } = useStore();
  const filtered = useFilteredTransactions();
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const isAdmin = role === 'admin';
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.dateRange !== 'all';

  const handleExport = () => {
    const headers = ['Date,Description,Category,Type,Amount'];
    const rows = filtered.map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`);
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectStyle = {
    padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 500, outline: 'none',
    background: darkMode ? '#334155' : '#f1f5f9',
    color: darkMode ? '#e2e8f0' : '#475569',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.02em' }}>
            Transactions
          </h2>
          <p style={{ fontSize: 13, color: darkMode ? '#64748b' : '#94a3b8' }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
            style={{ padding: '8px 14px', fontSize: 13, fontWeight: 600 }}
          >
            <Download style={{ width: 16, height: 16 }} />
            <span className="hidden sm:inline">Export CSV</span>
          </motion.button>
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openModal()}
              className="btn-primary flex items-center gap-2"
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              <Plus style={{ width: 16, height: 16 }} />
              <span className="hidden sm:inline">Add Transaction</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="card" style={{ padding: 16 }}>
        <div className="flex gap-2">
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              width: 16, height: 16, color: darkMode ? '#64748b' : '#94a3b8',
            }} />
            <input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => { setFilter('search', e.target.value); setPage(1); }}
              className="input-field"
              style={{ width: '100%', paddingLeft: 38, paddingRight: 16, paddingTop: 10, paddingBottom: 10, fontSize: 13 }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, position: 'relative',
              background: showFilters ? '#10b981' : darkMode ? '#334155' : '#f1f5f9',
              color: showFilters ? '#fff' : darkMode ? '#cbd5e1' : '#475569',
              transition: 'all 0.2s',
            }}
          >
            <Filter style={{ width: 16, height: 16 }} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute', top: -3, right: -3,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#10b981',
                  border: `2px solid ${darkMode ? '#1e293b' : '#fff'}`,
                }}
              />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={() => setFilter('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
            style={{
              display: 'flex', alignItems: 'center',
              padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: darkMode ? '#334155' : '#f1f5f9',
              color: darkMode ? '#cbd5e1' : '#475569',
            }}
          >
            <ArrowUpDown style={{ width: 16, height: 16 }} />
          </motion.button>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                paddingTop: 12, marginTop: 12,
                borderTop: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <select value={filters.type} onChange={(e) => { setFilter('type', e.target.value); setPage(1); }} style={selectStyle}>
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select value={filters.category} onChange={(e) => { setFilter('category', e.target.value); setPage(1); }} style={selectStyle}>
                  <option value="all">All Categories</option>
                  {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filters.dateRange} onChange={(e) => { setFilter('dateRange', e.target.value); setPage(1); }} style={selectStyle}>
                  {dateRanges.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ x: 2 }}
                  onClick={() => { resetFilters(); setPage(1); }}
                  style={{
                    marginTop: 8, display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: 600, color: '#10b981',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}
                >
                  <X style={{ width: 12, height: 12 }} /> Clear all filters
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transaction Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {paginated.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 16px' }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <FileText style={{ width: 48, height: 48, color: darkMode ? '#334155' : '#cbd5e1', marginBottom: 12 }} />
            </motion.div>
            <p style={{ fontSize: 14, fontWeight: 600, color: darkMode ? '#94a3b8' : '#64748b' }}>
              No transactions found
            </p>
            <p style={{ fontSize: 12, color: darkMode ? '#64748b' : '#94a3b8', marginTop: 4 }}>
              Try adjusting your filters
            </p>
          </motion.div>
        ) : (
          <>
            {/* Desktop header */}
            <div
              className="hidden lg:grid"
              style={{
                gridTemplateColumns: isAdmin ? '4fr 2fr 2fr 2fr 1.5fr' : '4fr 2fr 2fr 2fr',
                gap: 16, padding: '12px 24px',
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                color: darkMode ? '#64748b' : '#94a3b8',
                background: darkMode ? 'rgba(15,23,42,0.4)' : '#f8fafc',
                borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              }}
            >
              <div>Description</div>
              <div>Category</div>
              <div>Date</div>
              <div style={{ textAlign: 'right' }}>Amount</div>
              {isAdmin && <div style={{ textAlign: 'right' }}>Actions</div>}
            </div>

            {/* Rows */}
            <div>
              {paginated.map((txn, i) => (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, type: 'spring', stiffness: 200 }}
                  whileHover={{
                    backgroundColor: darkMode ? 'rgba(51,65,85,0.3)' : 'rgba(241,245,249,0.8)',
                    x: 2,
                  }}
                  className="lg:grid"
                  style={{
                    gridTemplateColumns: isAdmin ? '4fr 2fr 2fr 2fr 1.5fr' : '4fr 2fr 2fr 2fr',
                    gap: 16, padding: '14px 24px',
                    alignItems: 'center',
                    borderBottom: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}`,
                    cursor: 'default',
                  }}
                >
                  {/* Description */}
                  <div className="flex items-center gap-3">
                    <motion.span whileHover={{ scale: 1.2, rotate: 10 }} style={{ fontSize: 18 }}>
                      {txn.icon}
                    </motion.span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: 14, fontWeight: 500,
                        color: darkMode ? '#f1f5f9' : '#0f172a',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {txn.description}
                      </p>
                      <p className="lg:hidden" style={{ fontSize: 12, color: darkMode ? '#64748b' : '#94a3b8' }}>
                        {txn.category} · {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Category - desktop */}
                  <div className="hidden lg:block" style={{ fontSize: 13, color: darkMode ? '#94a3b8' : '#64748b' }}>
                    {txn.category}
                  </div>

                  {/* Date - desktop */}
                  <div className="hidden lg:block" style={{ fontSize: 13, color: darkMode ? '#94a3b8' : '#64748b' }}>
                    {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  {/* Amount */}
                  <div style={{
                    textAlign: 'right', fontSize: 14, fontWeight: 700,
                    color: txn.type === 'income' ? '#10b981' : '#f43f5e',
                    fontFeatureSettings: '"tnum"',
                  }}>
                    {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>

                  {/* Actions */}
                  {isAdmin && (
                    <div className="hidden lg:flex" style={{ justifyContent: 'flex-end', gap: 4 }}>
                      <motion.button
                        whileHover={{ scale: 1.15, backgroundColor: darkMode ? '#334155' : '#f1f5f9' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openModal(txn)}
                        style={{
                          padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: 'transparent', color: darkMode ? '#64748b' : '#94a3b8',
                          display: 'flex', transition: 'color 0.2s',
                        }}
                      >
                        <Pencil style={{ width: 15, height: 15 }} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15, color: '#f43f5e' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTransaction(txn.id)}
                        style={{
                          padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: 'transparent', color: darkMode ? '#64748b' : '#94a3b8',
                          display: 'flex', transition: 'color 0.2s',
                        }}
                      >
                        <Trash2 style={{ width: 15, height: 15 }} />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2" style={{ paddingTop: 4 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .map((p, i, arr) => (
              <span key={p} className="contents">
                {i > 0 && p - arr[i - 1] > 1 && (
                  <span style={{ padding: '0 4px', color: darkMode ? '#475569' : '#cbd5e1' }}>...</span>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPage(p)}
                  style={{
                    width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600,
                    background: page === p ? '#10b981' : 'transparent',
                    color: page === p ? '#fff' : darkMode ? '#94a3b8' : '#64748b',
                    boxShadow: page === p ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {p}
                </motion.button>
              </span>
            ))}
        </div>
      )}
    </motion.div>
  );
}

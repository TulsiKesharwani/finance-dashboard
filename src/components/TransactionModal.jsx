import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useStore from '../store/useStore';
import { categoryIcons } from '../data/mockData';

const expenseCategories = [
  'Food & Dining', 'Shopping', 'Transportation', 'Entertainment',
  'Bills & Utilities', 'Health & Fitness', 'Travel', 'Education',
];
const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts'];

export default function TransactionModal() {
  const { modalOpen, modalTransaction, closeModal, addTransaction, updateTransaction, darkMode } = useStore();
  const isEdit = !!modalTransaction;

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '', category: 'Food & Dining', amount: '', type: 'expense',
  });

  useEffect(() => {
    if (modalTransaction) {
      setForm({
        date: modalTransaction.date, description: modalTransaction.description,
        category: modalTransaction.category, amount: String(modalTransaction.amount),
        type: modalTransaction.type,
      });
    } else {
      setForm({ date: new Date().toISOString().split('T')[0], description: '', category: 'Food & Dining', amount: '', type: 'expense' });
    }
  }, [modalTransaction, modalOpen]);

  const categories = form.type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e) => {
    e.preventDefault();
    const txnData = { ...form, amount: parseFloat(form.amount), icon: categoryIcons[form.category] };
    if (isEdit) updateTransaction(modalTransaction.id, txnData);
    else addTransaction(txnData);
    closeModal();
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 12, fontSize: 13, outline: 'none',
    border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
    background: darkMode ? '#334155' : '#f8fafc',
    color: darkMode ? '#f1f5f9' : '#0f172a',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6,
    color: darkMode ? '#cbd5e1' : '#475569',
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 440, borderRadius: 20, overflow: 'hidden',
              background: darkMode ? '#1e293b' : '#fff',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px',
              borderBottom: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                {isEdit ? 'Edit Transaction' : 'New Transaction'}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
                style={{
                  padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: darkMode ? '#334155' : '#f1f5f9',
                  color: darkMode ? '#94a3b8' : '#64748b',
                  display: 'flex',
                }}
              >
                <X style={{ width: 18, height: 18 }} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Type Toggle */}
              <div style={{
                display: 'flex', gap: 4, padding: 4, borderRadius: 14,
                background: darkMode ? '#334155' : '#f1f5f9',
              }}>
                {['expense', 'income'].map((t) => (
                  <motion.button
                    key={t}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setForm((f) => ({ ...f, type: t, category: t === 'income' ? 'Salary' : 'Food & Dining' }))}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
                      background: form.type === t ? (t === 'income' ? '#10b981' : '#f43f5e') : 'transparent',
                      color: form.type === t ? '#fff' : darkMode ? '#94a3b8' : '#64748b',
                      boxShadow: form.type === t ? `0 4px 12px ${t === 'income' ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}` : 'none',
                      transition: 'all 0.25s',
                    }}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <input required value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. Coffee at Starbucks" style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = darkMode ? '#475569' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Amount ($)</label>
                  <input required type="number" step="0.01" min="0.01" value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="0.00" style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'; }}
                    onBlur={(e) => { e.target.style.borderColor = darkMode ? '#475569' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input required type="date" value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    style={{ ...inputStyle, colorScheme: darkMode ? 'dark' : 'light' }}
                    onFocus={(e) => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.15)'; }}
                    onBlur={(e) => { e.target.style.borderColor = darkMode ? '#475569' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <select value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {categories.map((c) => <option key={c} value={c}>{categoryIcons[c]} {c}</option>)}
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(16,185,129,0.35)' }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="btn-primary"
                style={{ padding: '12px 0', fontSize: 14, marginTop: 4 }}
              >
                {isEdit ? 'Update Transaction' : 'Add Transaction'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';

export default function RecentTransactions() {
  const transactions = useStore((s) => s.transactions);
  const darkMode = useStore((s) => s.darkMode);
  const setActivePage = useStore((s) => s.setActivePage);
  const recent = transactions.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, type: 'spring', stiffness: 120, damping: 16 }}
      className="card"
      style={{ padding: '24px' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom: 2 }}>
            Recent Transactions
          </h3>
          <p style={{ fontSize: 13, color: darkMode ? '#64748b' : '#94a3b8' }}>Latest activity</p>
        </div>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActivePage('transactions')}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 13, fontWeight: 600, color: '#10b981',
            background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          View all <ArrowRight style={{ width: 16, height: 16 }} />
        </motion.button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {recent.map((txn, i) => (
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.06, type: 'spring', stiffness: 150, damping: 18 }}
            whileHover={{
              x: 4,
              backgroundColor: darkMode ? 'rgba(51,65,85,0.4)' : 'rgba(241,245,249,0.8)',
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px', borderRadius: 12,
              cursor: 'default', transition: 'background 0.2s',
            }}
          >
            <motion.span
              whileHover={{ scale: 1.2, rotate: 10 }}
              style={{ fontSize: 20, flexShrink: 0 }}
            >
              {txn.icon}
            </motion.span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 14, fontWeight: 500,
                color: darkMode ? '#f1f5f9' : '#0f172a',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {txn.description}
              </p>
              <p style={{ fontSize: 12, color: darkMode ? '#64748b' : '#94a3b8' }}>
                {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {' · '}
                {txn.category}
              </p>
            </div>
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 + i * 0.06, type: 'spring', stiffness: 200 }}
              style={{
                fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
                color: txn.type === 'income' ? '#10b981' : '#f43f5e',
              }}
            >
              {txn.type === 'income' ? '+' : '-'}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

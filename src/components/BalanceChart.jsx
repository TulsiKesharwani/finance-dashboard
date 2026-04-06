import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import useStore from '../store/useStore';

const ranges = [
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '90D', value: 90 },
  { label: '1Y', value: 365 },
];

function CustomTooltip({ active, payload, label, darkMode }) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      style={{
        padding: '12px 16px', borderRadius: 12,
        background: darkMode ? '#1e293b' : '#fff',
        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        fontSize: 13,
      }}
    >
      <p style={{ fontWeight: 600, color: darkMode ? '#94a3b8' : '#64748b', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#10b981', fontWeight: 600 }}>Income: ${payload[0]?.value?.toLocaleString()}</p>
      <p style={{ color: '#f43f5e', fontWeight: 600 }}>Expenses: ${payload[1]?.value?.toLocaleString()}</p>
    </motion.div>
  );
}

export default function BalanceChart() {
  const transactions = useStore((s) => s.transactions);
  const darkMode = useStore((s) => s.darkMode);
  const [range, setRange] = useState(90);

  const data = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - range);
    const filtered = transactions.filter((t) => new Date(t.date) >= cutoff);

    const grouped = {};
    filtered.forEach((t) => {
      const key = range <= 30 ? t.date : t.date.substring(0, 7);
      if (!grouped[key]) grouped[key] = { income: 0, expenses: 0 };
      if (t.type === 'income') grouped[key].income += t.amount;
      else grouped[key].expenses += t.amount;
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({
        date: range <= 30
          ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : new Date(date + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income: Math.round(vals.income),
        expenses: Math.round(vals.expenses),
      }));
  }, [transactions, range]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, type: 'spring', stiffness: 120, damping: 16 }}
      className="card"
      style={{ padding: '24px' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom: 2 }}>
            Cash Flow
          </h3>
          <p style={{ fontSize: 13, color: darkMode ? '#64748b' : '#94a3b8' }}>
            Income vs Expenses over time
          </p>
        </div>
        <div style={{
          display: 'flex', gap: 4, padding: 4, borderRadius: 12,
          background: darkMode ? '#334155' : '#f1f5f9',
        }}>
          {ranges.map((r) => (
            <motion.button
              key={r.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRange(r.value)}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600,
                background: range === r.value
                  ? darkMode ? '#475569' : '#fff'
                  : 'transparent',
                color: range === r.value
                  ? darkMode ? '#f1f5f9' : '#0f172a'
                  : darkMode ? '#64748b' : '#94a3b8',
                boxShadow: range === r.value ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {r.label}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        key={range}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ height: 300 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false}
              tick={{ fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false}
              tick={{ fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`} />
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5}
              fill="url(#incomeGrad)" animationDuration={1200} />
            <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2.5}
              fill="url(#expenseGrad)" animationDuration={1200} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6" style={{ marginTop: 16 }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: darkMode ? '#94a3b8' : '#64748b' }}>Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f43f5e' }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: darkMode ? '#94a3b8' : '#64748b' }}>Expenses</span>
        </div>
      </div>
    </motion.div>
  );
}

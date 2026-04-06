import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useStore from '../store/useStore';
import { categoryColors, categoryIcons } from '../data/mockData';

function CustomTooltip({ active, payload, darkMode }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 10,
      background: darkMode ? '#1e293b' : '#fff',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      fontSize: 13,
    }}>
      <p style={{ fontWeight: 600, color: darkMode ? '#f1f5f9' : '#0f172a' }}>{d.name}</p>
      <p style={{ color: d.payload.fill, fontWeight: 600 }}>${d.value.toLocaleString()}</p>
    </div>
  );
}

export default function SpendingBreakdown() {
  const transactions = useStore((s) => s.transactions);
  const darkMode = useStore((s) => s.darkMode);

  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const grouped = {};
    expenses.forEach((t) => { grouped[t.category] = (grouped[t.category] || 0) + t.amount; });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: Math.round(value), icon: categoryIcons[name] }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, type: 'spring', stiffness: 120, damping: 16 }}
      className="card"
      style={{ padding: '24px', height: '100%' }}
    >
      <h3 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom: 2 }}>
        Spending Breakdown
      </h3>
      <p style={{ fontSize: 13, color: darkMode ? '#64748b' : '#94a3b8', marginBottom: 20 }}>
        Expense distribution by category
      </p>

      <div className="flex flex-col items-center" style={{ gap: 20 }}>
        {/* Donut chart */}
        <div style={{ width: 180, height: 180, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                paddingAngle={3} dataKey="value" strokeWidth={0}
                animationBegin={400} animationDuration={1000}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={categoryColors[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center total */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', textAlign: 'center',
          }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: darkMode ? '#64748b' : '#94a3b8' }}>Total</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#0f172a' }}>
              ${total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Category list */}
        <div style={{ width: '100%', maxHeight: 200, overflowY: 'auto', paddingRight: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.map((item, i) => {
              const pct = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06, type: 'spring', stiffness: 150 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 500,
                        color: darkMode ? '#cbd5e1' : '#475569',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: darkMode ? '#94a3b8' : '#64748b', marginLeft: 8 }}>
                        ${item.value.toLocaleString()}
                      </span>
                    </div>
                    <div style={{
                      height: 6, borderRadius: 3, overflow: 'hidden',
                      background: darkMode ? '#334155' : '#f1f5f9',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.6 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
                        style={{
                          height: '100%', borderRadius: 3,
                          background: categoryColors[item.name] || '#94a3b8',
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

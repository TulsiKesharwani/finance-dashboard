import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import useStore from '../store/useStore';
import { useMemo, useEffect, useState, useRef } from 'react';

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function AnimatedNumber({ value, duration = 1.5 }) {
  const [display, setDisplay] = useState('$0');
  const prevRef = useRef(0);

  useEffect(() => {
    const numericValue = parseInt(value.replace(/[^0-9-]/g, '')) || 0;
    const start = prevRef.current;
    const diff = numericValue - start;
    const startTime = performance.now();
    const dur = duration * 1000;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(formatCurrency(current));
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = numericValue;
    }
    requestAnimationFrame(tick);
  }, [value, duration]);

  return display;
}

export default function SummaryCards() {
  const transactions = useStore((s) => s.transactions);
  const darkMode = useStore((s) => s.darkMode);

  const stats = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const now = new Date();
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixtyDaysAgo = new Date(now); sixtyDaysAgo.setDate(now.getDate() - 60);

    const recentIncome = transactions.filter((t) => t.type === 'income' && new Date(t.date) >= thirtyDaysAgo).reduce((sum, t) => sum + t.amount, 0);
    const prevIncome = transactions.filter((t) => t.type === 'income' && new Date(t.date) >= sixtyDaysAgo && new Date(t.date) < thirtyDaysAgo).reduce((sum, t) => sum + t.amount, 0);
    const recentExpenses = transactions.filter((t) => t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo).reduce((sum, t) => sum + t.amount, 0);
    const prevExpenses = transactions.filter((t) => t.type === 'expense' && new Date(t.date) >= sixtyDaysAgo && new Date(t.date) < thirtyDaysAgo).reduce((sum, t) => sum + t.amount, 0);

    return {
      balance: income - expenses,
      income,
      expenses,
      incomeChange: prevIncome > 0 ? Math.round(((recentIncome - prevIncome) / prevIncome) * 100) : 0,
      expenseChange: prevExpenses > 0 ? Math.round(((recentExpenses - prevExpenses) / prevExpenses) * 100) : 0,
      savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0,
    };
  }, [transactions]);

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(stats.balance),
      Icon: Wallet,
      gradient: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
      gradientDark: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
      iconBg: '#10b981',
      accentColor: '#10b981',
      borderAccent: '#10b981',
      change: `${stats.savingsRate}% savings rate`,
      positive: stats.savingsRate > 0,
    },
    {
      title: 'Total Income',
      value: formatCurrency(stats.income),
      Icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
      gradientDark: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(14,165,233,0.05))',
      iconBg: '#0ea5e9',
      accentColor: '#0ea5e9',
      borderAccent: '#0ea5e9',
      change: `${stats.incomeChange > 0 ? '+' : ''}${stats.incomeChange}% vs last month`,
      positive: stats.incomeChange >= 0,
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.expenses),
      Icon: TrendingDown,
      gradient: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
      gradientDark: 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(244,63,94,0.05))',
      iconBg: '#f43f5e',
      accentColor: '#f43f5e',
      borderAccent: '#f43f5e',
      change: `${stats.expenseChange > 0 ? '+' : ''}${stats.expenseChange}% vs last month`,
      positive: stats.expenseChange <= 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: i * 0.12,
            type: 'spring',
            stiffness: 130,
            damping: 15,
          }}
          whileHover={{
            y: -6,
            scale: 1.02,
            transition: { type: 'spring', stiffness: 300, damping: 20 },
          }}
          whileTap={{ scale: 0.98 }}
          className="card"
          style={{
            padding: '24px',
            borderLeft: `4px solid ${card.borderAccent}`,
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gradient overlay */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '50%', height: '100%',
            background: darkMode ? card.gradientDark : card.gradient,
            opacity: 0.5,
            borderRadius: '0 16px 16px 0',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 200, damping: 12 }}
              style={{
                width: 44, height: 44, borderRadius: 12,
                background: card.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
                boxShadow: `0 4px 14px ${card.iconBg}40`,
              }}
            >
              <card.Icon style={{ width: 22, height: 22, color: '#fff' }} />
            </motion.div>

            <p style={{ fontSize: 13, fontWeight: 500, color: darkMode ? '#94a3b8' : '#64748b', marginBottom: 4 }}>
              {card.title}
            </p>
            <p style={{
              fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em',
              color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom: 8,
              fontFeatureSettings: '"tnum"',
            }}>
              <AnimatedNumber value={card.value} duration={1.2 + i * 0.2} />
            </p>

            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1, type: 'spring', stiffness: 150 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4, ease: 'easeInOut' }}
              >
                {card.positive ? (
                  <ArrowUpRight style={{ width: 16, height: 16, color: '#10b981' }} />
                ) : (
                  <ArrowDownRight style={{ width: 16, height: 16, color: '#f43f5e' }} />
                )}
              </motion.div>
              <span style={{ fontSize: 12, fontWeight: 600, color: card.positive ? '#10b981' : '#f43f5e' }}>
                {card.change}
              </span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

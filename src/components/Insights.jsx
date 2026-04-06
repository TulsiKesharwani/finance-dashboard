import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle, Target, Flame, PiggyBank, ArrowRight,
} from 'lucide-react';
import useStore from '../store/useStore';
import { categoryColors, categoryIcons } from '../data/mockData';

function formatCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

function CustomTooltip({ active, payload, darkMode }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      padding: '12px 16px', borderRadius: 12,
      background: darkMode ? '#1e293b' : '#fff',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: 13,
    }}>
      <p style={{ fontWeight: 600, color: darkMode ? '#94a3b8' : '#64748b' }}>{payload[0].payload.month}</p>
      <p style={{ color: '#10b981', fontWeight: 600 }}>Income: {formatCurrency(payload[0]?.value || 0)}</p>
      <p style={{ color: '#f43f5e', fontWeight: 600 }}>Expenses: {formatCurrency(payload[1]?.value || 0)}</p>
    </div>
  );
}

export default function Insights() {
  const transactions = useStore((s) => s.transactions);
  const darkMode = useStore((s) => s.darkMode);

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const income = transactions.filter((t) => t.type === 'income');

    const catSpend = {};
    expenses.forEach((t) => { catSpend[t.category] = (catSpend[t.category] || 0) + t.amount; });
    const topCategory = Object.entries(catSpend).sort((a, b) => b[1] - a[1])[0];

    const monthlyData = {};
    transactions.forEach((t) => {
      const key = t.date.substring(0, 7);
      if (!monthlyData[key]) monthlyData[key] = { income: 0, expenses: 0 };
      if (t.type === 'income') monthlyData[key].income += t.amount;
      else monthlyData[key].expenses += t.amount;
    });

    const months = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b)).slice(-6)
      .map(([month, vals]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        income: Math.round(vals.income), expenses: Math.round(vals.expenses),
      }));

    const now = new Date();
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixtyDaysAgo = new Date(now); sixtyDaysAgo.setDate(now.getDate() - 60);

    const recentExpenses = expenses.filter((t) => new Date(t.date) >= thirtyDaysAgo).reduce((s, t) => s + t.amount, 0);
    const prevExpenses = expenses.filter((t) => new Date(t.date) >= sixtyDaysAgo && new Date(t.date) < thirtyDaysAgo).reduce((s, t) => s + t.amount, 0);

    const totalIncome = income.reduce((s, t) => s + t.amount, 0);
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    const uniqueDays = new Set(expenses.map((t) => t.date)).size;
    const avgDaily = uniqueDays > 0 ? totalExpenses / uniqueDays : 0;
    const biggestExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];

    const catCount = {};
    expenses.forEach((t) => { catCount[t.category] = (catCount[t.category] || 0) + 1; });
    const mostFrequent = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];

    return {
      topCategory, months, recentExpenses, prevExpenses,
      expenseChange: prevExpenses > 0 ? ((recentExpenses - prevExpenses) / prevExpenses) * 100 : 0,
      savingsRate, avgDaily, biggestExpense, mostFrequent, totalIncome, totalExpenses,
    };
  }, [transactions]);

  const insightCards = [
    { icon: Flame, color: '#f43f5e', bg: '#fff1f2', bgDark: 'rgba(244,63,94,0.12)', title: 'Top Spending Category', value: insights.topCategory?.[0] || 'N/A', detail: insights.topCategory ? formatCurrency(insights.topCategory[1]) : '$0', emoji: insights.topCategory ? categoryIcons[insights.topCategory[0]] : '📊' },
    { icon: insights.expenseChange <= 0 ? TrendingDown : TrendingUp, color: insights.expenseChange <= 0 ? '#10b981' : '#f43f5e', bg: insights.expenseChange <= 0 ? '#ecfdf5' : '#fff1f2', bgDark: insights.expenseChange <= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)', title: 'Monthly Expense Trend', value: `${insights.expenseChange > 0 ? '+' : ''}${Math.round(insights.expenseChange)}%`, detail: 'vs previous 30 days', emoji: insights.expenseChange <= 0 ? '📉' : '📈' },
    { icon: PiggyBank, color: insights.savingsRate >= 20 ? '#10b981' : '#f59e0b', bg: insights.savingsRate >= 20 ? '#ecfdf5' : '#fffbeb', bgDark: insights.savingsRate >= 20 ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', title: 'Savings Rate', value: `${Math.round(insights.savingsRate)}%`, detail: insights.savingsRate >= 20 ? 'Great savings!' : 'Room to improve', emoji: '🐷' },
    { icon: Target, color: '#0ea5e9', bg: '#f0f9ff', bgDark: 'rgba(14,165,233,0.12)', title: 'Average Daily Spend', value: formatCurrency(insights.avgDaily), detail: 'across all categories', emoji: '🎯' },
    { icon: AlertTriangle, color: '#f59e0b', bg: '#fffbeb', bgDark: 'rgba(245,158,11,0.12)', title: 'Largest Expense', value: insights.biggestExpense ? formatCurrency(insights.biggestExpense.amount) : 'N/A', detail: insights.biggestExpense?.description || '', emoji: '⚡' },
    { icon: ArrowRight, color: '#8b5cf6', bg: '#f5f3ff', bgDark: 'rgba(139,92,246,0.12)', title: 'Most Frequent', value: insights.mostFrequent?.[0] || 'N/A', detail: insights.mostFrequent ? `${insights.mostFrequent[1]} transactions` : '', emoji: insights.mostFrequent ? categoryIcons[insights.mostFrequent[0]] : '📊' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.02em' }}>
          Financial Insights
        </h2>
        <p style={{ fontSize: 13, color: darkMode ? '#64748b' : '#94a3b8' }}>
          Key observations from your financial data
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insightCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 130, damping: 15 }}
            whileHover={{ y: -4, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            className="card"
            style={{ padding: 20, cursor: 'default' }}
          >
            <div className="flex items-start gap-3" style={{ marginBottom: 12 }}>
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 200, damping: 12 }}
                style={{
                  padding: 8, borderRadius: 10,
                  background: darkMode ? card.bgDark : card.bg,
                }}
              >
                <card.icon style={{ width: 20, height: 20, color: card.color }} />
              </motion.div>
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: i * 0.3 }}
                style={{ fontSize: 20 }}
              >
                {card.emoji}
              </motion.span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 500, color: darkMode ? '#94a3b8' : '#64748b', marginBottom: 2 }}>
              {card.title}
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom: 2, letterSpacing: '-0.02em' }}>
              {card.value}
            </p>
            <p style={{ fontSize: 12, color: darkMode ? '#64748b' : '#94a3b8' }}>
              {card.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Monthly Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 120, damping: 16 }}
        className="card"
        style={{ padding: 24 }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom: 2 }}>
          Monthly Comparison
        </h3>
        <p style={{ fontSize: 13, color: darkMode ? '#64748b' : '#94a3b8', marginBottom: 20 }}>
          Income vs Expenses by month
        </p>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insights.months} margin={{ top: 5, right: 5, left: -10, bottom: 0 }} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false}
                tick={{ fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false}
                tick={{ fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 12 }}
                tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Bar dataKey="income" radius={[6, 6, 0, 0]} fill="#10b981" maxBarSize={40} animationDuration={1000} />
              <Bar dataKey="expenses" radius={[6, 6, 0, 0]} fill="#f43f5e" maxBarSize={40} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
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

      {/* Quick Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 120, damping: 16 }}
        className="card"
        style={{ padding: 24 }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#0f172a', marginBottom: 16 }}>
          Quick Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Income', value: formatCurrency(insights.totalIncome), color: '#10b981', bg: '#ecfdf5', bgDark: 'rgba(16,185,129,0.1)' },
            { label: 'Total Expenses', value: formatCurrency(insights.totalExpenses), color: '#f43f5e', bg: '#fff1f2', bgDark: 'rgba(244,63,94,0.1)' },
            { label: 'Net Savings', value: formatCurrency(insights.totalIncome - insights.totalExpenses), color: '#0ea5e9', bg: '#f0f9ff', bgDark: 'rgba(14,165,233,0.1)' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.03 }}
              style={{
                padding: 16, borderRadius: 14,
                background: darkMode ? item.bgDark : item.bg,
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 600, color: item.color, marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: darkMode ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.02em' }}>
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

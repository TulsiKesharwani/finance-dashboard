import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import BalanceChart from './components/BalanceChart';
import SpendingBreakdown from './components/SpendingBreakdown';
import RecentTransactions from './components/RecentTransactions';
import TransactionList from './components/TransactionList';
import TransactionModal from './components/TransactionModal';
import Insights from './components/Insights';
import useStore from './store/useStore';

const pageTransition = {
  initial: { opacity: 0, y: 30, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(4px)' },
  transition: { type: 'spring', stiffness: 120, damping: 18 },
};

function Dashboard() {
  return (
    <motion.div {...pageTransition} className="space-y-6">
      <SummaryCards />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <BalanceChart />
        </div>
        <div className="xl:col-span-2">
          <SpendingBreakdown />
        </div>
      </div>
      <RecentTransactions />
    </motion.div>
  );
}

function Transactions() {
  return (
    <motion.div {...pageTransition}>
      <TransactionList />
    </motion.div>
  );
}

function InsightsPage() {
  return (
    <motion.div {...pageTransition}>
      <Insights />
    </motion.div>
  );
}

export default function App() {
  const { activePage, darkMode, role } = useStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop) setSidebarCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageTitles = {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    insights: 'Insights',
  };

  return (
    <div className="min-h-screen page-bg" style={{ transition: 'background 0.4s ease' }}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <main
        style={{
          marginLeft: isDesktop ? (sidebarCollapsed ? 72 : 260) : 0,
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Top bar */}
        <header
          className="topbar sticky top-0 z-20"
          style={{ padding: '16px 32px' }}
        >
          <div className="flex items-center justify-between" style={{ paddingLeft: !isDesktop ? 56 : 0 }}>
            <div>
              <h1 style={{
                fontSize: 22,
                fontWeight: 700,
                color: darkMode ? '#f1f5f9' : '#0f172a',
                letterSpacing: '-0.02em',
              }}>
                {pageTitles[activePage]}
              </h1>
              <p style={{ fontSize: 13, color: darkMode ? '#64748b' : '#94a3b8', marginTop: 2 }}>
                Welcome back — here's your financial overview
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="badge hidden sm:inline-flex"
                style={{
                  background: role === 'admin'
                    ? darkMode ? 'rgba(251,191,36,0.12)' : '#fffbeb'
                    : darkMode ? 'rgba(14,165,233,0.12)' : '#f0f9ff',
                  color: role === 'admin'
                    ? darkMode ? '#fbbf24' : '#d97706'
                    : darkMode ? '#38bdf8' : '#0284c7',
                }}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: role === 'admin' ? '#fbbf24' : '#38bdf8',
                }} />
                {role === 'admin' ? 'Admin' : 'Viewer'}
              </span>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
                background: darkMode ? 'rgba(16,185,129,0.15)' : '#d1fae5',
                color: darkMode ? '#34d399' : '#047857',
              }}>
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: isDesktop ? '32px' : '16px', maxWidth: 1280 }}>
          <AnimatePresence mode="wait">
            {activePage === 'dashboard' && <Dashboard key="dashboard" />}
            {activePage === 'transactions' && <Transactions key="transactions" />}
            {activePage === 'insights' && <InsightsPage key="insights" />}
          </AnimatePresence>
        </div>
      </main>

      <TransactionModal />
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Sun,
  Moon,
  Shield,
  Eye,
  ChevronLeft,
  Menu,
  Wallet,
} from 'lucide-react';
import useStore from '../store/useStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { activePage, setActivePage, darkMode, toggleDarkMode, role, setRole } = useStore();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="sidebar fixed top-0 left-0 h-full z-50 flex flex-col overflow-hidden"
        style={{
          transform: collapsed && typeof window !== 'undefined' && window.innerWidth < 1024 ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3" style={{ padding: '0 20px', height: 64, borderBottom: '1px solid #1e293b' }}>
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            }}
          >
            <Wallet style={{ width: 18, height: 18, color: '#fff' }} />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}
              >
                FinanceFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setActivePage(item.id);
                    if (window.innerWidth < 1024) setCollapsed(true);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 12,
                    fontSize: 14, fontWeight: 500,
                    border: 'none', cursor: 'pointer',
                    color: isActive ? '#34d399' : '#94a3b8',
                    background: isActive ? 'rgba(16,185,129,0.12)' : 'transparent',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'rgba(148,163,184,0.08)';
                    if (!isActive) e.currentTarget.style.color = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                    if (!isActive) e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bg"
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 12,
                        background: 'rgba(16,185,129,0.12)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />
                  )}
                  <item.icon style={{ width: 20, height: 20, flexShrink: 0, position: 'relative', zIndex: 1 }} />
                  {!collapsed && <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="nav-dot"
                      style={{
                        marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%',
                        background: '#34d399', position: 'relative', zIndex: 1,
                        boxShadow: '0 0 8px rgba(52,211,153,0.5)',
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Bottom controls */}
        <div style={{ padding: 12, borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Role switcher */}
          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 500,
              color: role === 'admin' ? '#fbbf24' : '#38bdf8',
              background: role === 'admin' ? 'rgba(251,191,36,0.1)' : 'rgba(56,189,248,0.1)',
              transition: 'all 0.3s',
            }}
          >
            {role === 'admin' ? (
              <Shield style={{ width: 20, height: 20, flexShrink: 0 }} />
            ) : (
              <Eye style={{ width: 20, height: 20, flexShrink: 0 }} />
            )}
            {!collapsed && <span style={{ textTransform: 'capitalize' }}>{role}</span>}
          </motion.button>

          {/* Dark mode */}
          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleDarkMode}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, color: '#94a3b8', background: 'transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(148,163,184,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
          >
            <motion.div
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {darkMode ? (
                <Sun style={{ width: 20, height: 20, flexShrink: 0 }} />
              ) : (
                <Moon style={{ width: 20, height: 20, flexShrink: 0 }} />
              )}
            </motion.div>
            {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </motion.button>

          {/* Collapse - desktop only */}
          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
            style={{
              width: '100%', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, color: '#94a3b8', background: 'transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(148,163,184,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <ChevronLeft style={{ width: 20, height: 20, flexShrink: 0 }} />
            </motion.div>
            {!collapsed && <span>Collapse</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile hamburger */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setCollapsed(false)}
        className="fixed z-30 lg:hidden"
        style={{
          top: 16, left: 16, padding: 10, borderRadius: 12,
          background: '#0f172a', color: '#fff', border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        <Menu style={{ width: 20, height: 20 }} />
      </motion.button>
    </>
  );
}

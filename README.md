# FinanceFlow — Finance Dashboard

A clean, interactive finance dashboard built with React, featuring smooth animations, responsive design, and intuitive financial data visualization.

![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff69b4)

## Features

### Dashboard Overview
- **Summary Cards** — Total Balance, Income, and Expenses with trend indicators
- **Cash Flow Chart** — Time-based area chart comparing income vs expenses (7D / 30D / 90D / 1Y)
- **Spending Breakdown** — Donut chart with animated category bars showing expense distribution
- **Recent Transactions** — Quick glance at the latest 6 transactions

### Transactions
- Full transaction list with pagination (15 per page)
- **Search** across descriptions and categories
- **Filtering** by type (income/expense), category, and date range
- **Sorting** by date or amount (ascending/descending)
- **CSV Export** — download filtered transactions
- Add / Edit / Delete transactions (admin only)

### Role-Based UI (RBAC)
- **Admin** — Can add, edit, and delete transactions
- **Viewer** — Read-only access; action buttons are hidden
- Toggle roles via the sidebar for demonstration

### Insights
- Top spending category
- Monthly expense trend (vs previous period)
- Savings rate analysis
- Average daily spend
- Largest single expense
- Most frequent category
- Monthly comparison bar chart
- Quick financial summary

### Additional Features
- **Dark Mode** with smooth transitions and persistent preference
- **Data Persistence** via localStorage (Zustand persist middleware)
- **Framer Motion Animations** — page transitions, card hover effects, staggered list reveals
- **Fully Responsive** — mobile-first sidebar with overlay, adaptive layouts
- **Empty State Handling** — graceful UI when no transactions match filters

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Vite) |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Charts | Recharts |
| State Management | Zustand (with persist) |
| Icons | Lucide React |

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx           # Navigation + role/theme controls
│   ├── SummaryCards.jsx       # Balance, income, expenses cards
│   ├── BalanceChart.jsx       # Time-series area chart
│   ├── SpendingBreakdown.jsx  # Donut chart + category bars
│   ├── RecentTransactions.jsx # Latest transactions widget
│   ├── TransactionList.jsx    # Full list with filters/pagination
│   ├── TransactionModal.jsx   # Add/edit transaction form
│   └── Insights.jsx           # Financial insights + bar chart
├── data/
│   └── mockData.js            # 150 generated transactions
├── hooks/
│   └── useFilteredTransactions.js # Memoized filter/sort logic
├── store/
│   └── useStore.js            # Zustand global state
├── App.jsx                    # Layout + page routing
├── main.jsx                   # Entry point
└── index.css                  # Tailwind + global styles
```

## Design Decisions

- **Zustand over Context/Redux** — minimal boilerplate, built-in persist, selective re-renders
- **Tailwind CSS 4** — utility-first with `@theme` for custom design tokens
- **Framer Motion** — smooth, spring-based animations for a premium feel
- **No router** — single-page state-based navigation keeps things simple for a dashboard
- **Mock data generator** — deterministic but realistic transactions across 12 categories

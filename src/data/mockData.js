const categories = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Bills & Utilities',
  'Health & Fitness',
  'Travel',
  'Education',
  'Investments',
  'Freelance',
  'Salary',
  'Gifts',
];

const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts'];

const descriptions = {
  'Food & Dining': ['Starbucks Coffee', 'Whole Foods Market', 'Uber Eats Order', 'Restaurant Dinner', 'Grocery Shopping'],
  'Shopping': ['Amazon Purchase', 'Nike Store', 'Apple Store', 'IKEA Furniture', 'Target Run'],
  'Transportation': ['Uber Ride', 'Gas Station', 'Metro Card Reload', 'Parking Fee', 'Car Maintenance'],
  'Entertainment': ['Netflix Subscription', 'Spotify Premium', 'Movie Tickets', 'Concert Tickets', 'Gaming Purchase'],
  'Bills & Utilities': ['Electric Bill', 'Internet Service', 'Phone Bill', 'Water Bill', 'Insurance Premium'],
  'Health & Fitness': ['Gym Membership', 'Pharmacy', 'Doctor Visit', 'Yoga Class', 'Health Supplements'],
  'Travel': ['Hotel Booking', 'Flight Ticket', 'Airbnb Stay', 'Travel Insurance', 'Car Rental'],
  'Education': ['Online Course', 'Book Purchase', 'Workshop Fee', 'Tuition Payment', 'Study Materials'],
  'Investments': ['Stock Dividend', 'Mutual Fund Return', 'Crypto Gains', 'Bond Interest', 'Rental Income'],
  'Freelance': ['Web Design Project', 'Consulting Fee', 'Content Writing', 'App Development', 'Design Work'],
  'Salary': ['Monthly Salary', 'Bonus Payment', 'Overtime Pay', 'Commission', 'Annual Bonus'],
  'Gifts': ['Birthday Gift Received', 'Holiday Gift', 'Wedding Gift', 'Cashback Reward', 'Referral Bonus'],
};

const categoryIcons = {
  'Food & Dining': '🍽️',
  'Shopping': '🛍️',
  'Transportation': '🚗',
  'Entertainment': '🎬',
  'Bills & Utilities': '📄',
  'Health & Fitness': '💪',
  'Travel': '✈️',
  'Education': '📚',
  'Investments': '📈',
  'Freelance': '💻',
  'Salary': '💰',
  'Gifts': '🎁',
};

function generateTransactions() {
  const transactions = [];
  const now = new Date(2026, 3, 6); // April 6, 2026

  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const isIncome = Math.random() < 0.3;
    const category = isIncome
      ? incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
      : categories.filter(c => !incomeCategories.includes(c))[Math.floor(Math.random() * 8)];

    const descs = descriptions[category];
    const description = descs[Math.floor(Math.random() * descs.length)];

    const amount = isIncome
      ? Math.round((Math.random() * 4500 + 500) * 100) / 100
      : Math.round((Math.random() * 450 + 10) * 100) / 100;

    transactions.push({
      id: `txn_${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      description,
      category,
      amount,
      type: isIncome ? 'income' : 'expense',
      icon: categoryIcons[category],
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const transactions = generateTransactions();

export const categoryColors = {
  'Food & Dining': '#f43f5e',
  'Shopping': '#8b5cf6',
  'Transportation': '#0ea5e9',
  'Entertainment': '#f59e0b',
  'Bills & Utilities': '#64748b',
  'Health & Fitness': '#10b981',
  'Travel': '#06b6d4',
  'Education': '#ec4899',
  'Investments': '#22c55e',
  'Freelance': '#a855f7',
  'Salary': '#14b8a6',
  'Gifts': '#f97316',
};

export { categoryIcons };

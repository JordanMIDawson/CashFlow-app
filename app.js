/**
 * ==========================================================================
 * Waterfall CashFlow - Client Core State & DOM Render Engine
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Local Storage Keys ---
  const STORAGE_KEY = 'cashflow_clean_v3';

  // --- Preset Color Palette for Categories and Tags ---
  const PRESET_COLOR_SWATCHES = [
    '#00f2fe', // Cyan
    '#10b981', // Emerald
    '#6366f1', // Indigo
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#f59e0b', // Amber/Gold
    '#fb923c', // Orange
    '#14b8a6', // Teal
    '#3b82f6', // Blue
    '#84cc16', // Lime
    '#94a3b8'  // Slate
  ];

  // Default color mappings for categories
  const DEFAULT_CATEGORY_COLORS = {
    'Groceries': '#10b981',
    'Food & Dining': '#00f2fe',
    'Coffee & Cafes': '#f59e0b',
    'Fast Food': '#fb923c',
    'Restaurants': '#f43f5e',
    'Shopping': '#ec4899',
    'Clothing': '#a855f7',
    'Electronics & Gadgets': '#3b82f6',
    'Personal Care': '#14b8a6',
    'Books & Stationery': '#8b5cf6',
    'Housing': '#eab308',
    'Utilities': '#38bdf8',
    'Internet & Phone': '#6366f1',
    'Transportation': '#10b981',
    'Fuel & Gas': '#f97316',
    'Public Transit': '#06b6d4',
    'Entertainment': '#6366f1',
    'Streaming & Apps': '#8b5cf6',
    'Vacation': '#f43f5e',
    'Hobbies & Gaming': '#ec4899',
    'Education': '#a855f7',
    'Books & Courses': '#8b5cf6',
    'School Supplies': '#06b6d4',
    'Healthcare': '#ef4444',
    'Pharmacy': '#14b8a6',
    'Fitness & Gym': '#10b981',
    'Salary': '#10b981',
    'Investments': '#3b82f6',
    'Savings Interest': '#00f2fe',
    'Gifts & Donations': '#ec4899',
    'Miscellaneous': '#94a3b8'
  };

  // Default color mappings for tags
  const DEFAULT_TAG_COLORS = {
    'Essentials': '#10b981',
    'Quick Bite': '#fb923c',
    'Monthly Pay': '#10b981',
    'Subscription': '#6366f1',
    'Monthly Savings': '#00f2fe',
    'Savings Interest': '#00f2fe',
    'Monthly Core': '#f59e0b',
    'Textbooks': '#a855f7',
    'Wardrobe': '#ec4899',
    'Tech': '#3b82f6',
    'Certification': '#8b5cf6',
    'Home Essentials': '#14b8a6',
    'General': '#00f2fe'
  };

  // --- Clean Initial Slate (Begin from 0) ---
  const initialData = {
    categoryColors: DEFAULT_CATEGORY_COLORS,
    tagColors: DEFAULT_TAG_COLORS,
    accounts: [
      {
        id: 'acc-primary',
        name: 'Primary Checking',
        institution: 'Personal Cash',
        type: 'checking',
        maskedNumber: '•••• 1001',
        balance: 0.00,
        groups: ['Primary Accounts', 'Checking'],
        group: 'Primary Accounts, Checking',
        icon: '💵'
      }
    ],
    transactions: [],
    budgets: [],
    customCategories: [],
    creditCards: [],
    creditProfile: {
      scores: {
        transunion: 750,
        equifax: 750,
        experian: 750,
        fico: 750
      },
      hardPulls: [],
      upcomingRemovals: 'No hard credit pulls recorded.'
    },
    vacationTracker: {
      isActive: false,
      locationName: 'None',
      tripBudget: 0.00,
      spent: 0.00
    },
    notifications: [
      {
        id: 'notif-welcome',
        type: 'info',
        title: 'Welcome to Cash Flow',
        text: 'Clean ledger initialized. Add your accounts, cards, or tap ➕ to record your first transaction.',
        time: 'Just now'
      }
    ]
  };

  // --- Sample Demo Data (Available on demand via Accounts -> Load Demo Data) ---
  const DEMO_DATA = {
    categoryColors: DEFAULT_CATEGORY_COLORS,
    tagColors: DEFAULT_TAG_COLORS,
    accounts: [
      {
        id: 'acc-primary',
        name: 'Primary Checking',
        institution: 'Personal Cash',
        type: 'checking',
        maskedNumber: '•••• 1001',
        balance: 0.00,
        groups: ['Primary Accounts', 'Checking'],
        group: 'Primary Accounts, Checking',
        icon: '💵'
      },
      {
        id: 'acc-checking',
        name: 'Chase Checking (Demo)',
        institution: 'Chase Bank',
        type: 'checking',
        maskedNumber: '•••• 4410',
        balance: 4250.00,
        groups: ['Demo & Test', 'Checking'],
        group: 'Demo & Test, Checking',
        icon: '🧪'
      },
      {
        id: 'acc-savings-chase',
        name: 'Chase Savings (Demo)',
        institution: 'Chase Bank',
        type: 'savings',
        maskedNumber: '•••• 9021',
        balance: 12450.20,
        groups: ['Demo & Test', 'Savings'],
        group: 'Demo & Test, Savings',
        icon: '🧪'
      },
      {
        id: 'acc-savings-ally',
        name: 'Ally Savings (Demo)',
        institution: 'Ally Bank',
        type: 'savings',
        maskedNumber: '•••• 7734',
        balance: 18500.00,
        groups: ['Demo & Test', 'Savings'],
        group: 'Demo & Test, Savings',
        icon: '🧪'
      },
      {
        id: 'card-sapphire',
        name: 'Sapphire Preferred (Demo)',
        institution: 'Chase Bank',
        type: 'credit',
        maskedNumber: '•••• 8912',
        balance: 432.00,
        groups: ['Demo & Test', 'Credit Cards'],
        group: 'Demo & Test, Credit Cards',
        icon: '💳'
      },
      {
        id: 'card-amex',
        name: 'Amex Gold (Demo)',
        institution: 'American Express',
        type: 'credit',
        maskedNumber: '•••• 3005',
        balance: 1250.00,
        groups: ['Demo & Test', 'Credit Cards'],
        group: 'Demo & Test, Credit Cards',
        icon: '💳'
      },
      {
        id: 'card-citi',
        name: 'Citi Double Cash (Demo)',
        institution: 'Citibank',
        type: 'credit',
        maskedNumber: '•••• 4892',
        balance: 210.00,
        groups: ['Demo & Test', 'Credit Cards'],
        group: 'Demo & Test, Credit Cards',
        icon: '💳'
      }
    ],
    transactions: [
      {
        id: 'tx-1',
        timestamp: '2026-05-28T10:30:00-07:00',
        merchant: 'Whole Foods',
        amount: 142.30,
        type: 'expense',
        category: 'Groceries',
        tag: 'Essentials',
        location: 'Whole Foods Seattle',
        notes: 'Weekly grocery shopping including fresh produce and organic dairy.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'card-amex',
        icon: '🛒'
      },
      {
        id: 'tx-2',
        timestamp: '2026-05-27T19:15:00-07:00',
        merchant: 'McDonalds',
        amount: 18.40,
        type: 'expense',
        category: 'Food & Dining',
        tag: 'Quick Bite',
        location: 'McDonalds Airport',
        notes: 'Dinner on the go during travel.',
        verified: true,
        receipt: 'Simulated Receipt Thumbnail',
        refunds: [
          { id: 'ref-mock', timestamp: '2026-05-27T20:00:00-07:00', amount: 5.50, notes: 'Refund for incorrect drink order' }
        ],
        accountId: 'card-sapphire',
        icon: '☕'
      },
      {
        id: 'tx-3',
        timestamp: '2026-05-26T09:00:00-07:00',
        merchant: 'Tech Solutions Inc',
        amount: 3800.00,
        type: 'income',
        category: 'Salary',
        tag: 'Monthly Pay',
        location: 'Remote Deposit',
        notes: 'Regular bi-weekly professional salary payout.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'acc-checking',
        icon: '💼'
      },
      {
        id: 'tx-4',
        timestamp: '2026-05-24T14:00:00-07:00',
        merchant: 'Netflix Subscription',
        amount: 15.99,
        type: 'expense',
        category: 'Entertainment',
        tag: 'Subscription',
        location: 'Online auto-pay',
        notes: 'Monthly premium streaming subscription.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'card-citi',
        icon: '🍿'
      },
      {
        id: 'tx-6',
        timestamp: '2026-05-20T09:00:00-07:00',
        merchant: 'Ally Auto-Save Transfer',
        amount: 600.00,
        type: 'income',
        category: 'Savings',
        tag: 'Monthly Savings',
        location: 'Ally Bank Wire',
        notes: 'Automated monthly transfer to high-yield savings reserve.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'acc-savings-ally',
        icon: '💰'
      },
      {
        id: 'tx-7',
        timestamp: '2026-05-18T09:00:00-07:00',
        merchant: 'Chase APY Interest',
        amount: 45.20,
        type: 'income',
        category: 'Savings',
        tag: 'Savings Interest',
        location: 'Chase Savings Account',
        notes: 'Monthly high-yield APY interest dividend credited.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'acc-savings-chase',
        icon: '📈'
      },
      {
        id: 'tx-5',
        timestamp: '2026-05-15T12:00:00-07:00',
        merchant: 'Metropolitan Rent',
        amount: 1200.00,
        type: 'expense',
        category: 'Housing',
        tag: 'Monthly Core',
        location: 'Seattle Rent Office',
        notes: 'Monthly apartment rent wire transfer.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'acc-checking',
        icon: '🏠'
      },
      {
        id: 'tx-8',
        timestamp: '2026-05-25T11:20:00-07:00',
        merchant: 'University Bookstore',
        amount: 85.00,
        type: 'expense',
        category: 'Education',
        tag: 'Textbooks',
        location: 'Campus Center',
        notes: 'Required textbooks and reference materials for spring semester.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'card-amex',
        icon: '🎓'
      },
      {
        id: 'tx-9',
        timestamp: '2026-05-23T16:45:00-07:00',
        merchant: 'Zara Apparel',
        amount: 120.50,
        type: 'expense',
        category: 'Clothing',
        tag: 'Wardrobe',
        location: 'Downtown Mall',
        notes: 'Summer clothes and business casual attire.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'card-citi',
        icon: '👕'
      },
      {
        id: 'tx-10',
        timestamp: '2026-05-19T14:10:00-07:00',
        merchant: 'Apple Electronics',
        amount: 79.00,
        type: 'expense',
        category: 'Electronics & Gadgets',
        tag: 'Tech',
        location: 'Apple Store Bellevue',
        notes: 'USB-C fast chargers and cable replacement.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'card-sapphire',
        icon: '💻'
      },
      {
        id: 'tx-11',
        timestamp: '2026-04-20T10:00:00-07:00',
        merchant: 'Coursera Education',
        amount: 49.00,
        type: 'expense',
        category: 'Education',
        tag: 'Certification',
        location: 'Online Course',
        notes: 'Cloud Computing specialization monthly access.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'card-amex',
        icon: '📚'
      },
      {
        id: 'tx-12',
        timestamp: '2026-03-15T12:00:00-07:00',
        merchant: 'Target Shopping',
        amount: 64.20,
        type: 'expense',
        category: 'Shopping',
        tag: 'Home Essentials',
        location: 'Target Northgate',
        notes: 'Desk lamp, organizers, and notebooks.',
        verified: true,
        receipt: null,
        refunds: [],
        accountId: 'card-citi',
        icon: '🛍️'
      }
    ],
    budgets: [
      { id: 'bgt-education', name: 'Education Tracker', categories: ['Education', 'Books & Courses', 'School Supplies'], total: 250.00, spent: 0, limitAlert: 80, icon: '🎓' },
      { id: 'bgt-shopping', name: 'Shopping & Clothes', categories: ['Shopping', 'Clothing', 'Electronics & Gadgets', 'Personal Care'], total: 350.00, spent: 0, limitAlert: 80, icon: '🛍️' },
      { id: 'bgt-groceries', name: 'Groceries', categories: ['Groceries'], total: 400.00, spent: 0, limitAlert: 85, icon: '🛒' },
      { id: 'bgt-dining', name: 'Food & Dining', categories: ['Food & Dining', 'Coffee & Cafes', 'Fast Food', 'Restaurants'], total: 300.00, spent: 0, limitAlert: 75, icon: '☕' },
      { id: 'bgt-entertainment', name: 'Entertainment', categories: ['Entertainment', 'Streaming & Apps', 'Vacation'], total: 200.00, spent: 0, limitAlert: 80, icon: '🍿' },
      { id: 'bgt-housing', name: 'Housing & Living', categories: ['Housing', 'Utilities', 'Internet & Phone'], total: 1300.00, spent: 0, limitAlert: 95, icon: '🏠' }
    ],
    customCategories: [],
    creditCards: [
      {
        id: 'card-sapphire',
        name: 'Chase Sapphire Preferred',
        maskedNumber: '•••• •••• •••• 8912',
        categoryBonus: 'Food & Dining (3x Points), Travel (2x)',
        rewardMultiplier: { 'Food & Dining': 3, 'Travel': 2 },
        limit: 10000,
        balance: 432.00,
        ceilingLimit: 8, // Alert if spend exceeds 8%
        dueDate: 'June 15, 2026',
        themeClass: 'card-default'
      },
      {
        id: 'card-amex',
        name: 'American Express Gold',
        maskedNumber: '•••• •••• •••• 3005',
        categoryBonus: 'Groceries (4x Points), Dining (4x)',
        rewardMultiplier: { 'Groceries': 4, 'Food & Dining': 4 },
        limit: 15000,
        balance: 1250.00,
        ceilingLimit: 15,
        dueDate: 'June 10, 2026',
        themeClass: 'card-amex'
      },
      {
        id: 'card-citi',
        name: 'Citi Double Cash',
        maskedNumber: '•••• •••• •••• 4892',
        categoryBonus: 'All purchases (2% Cash Back)',
        rewardMultiplier: { 'All': 2 },
        limit: 8000,
        balance: 210.00,
        ceilingLimit: 10,
        dueDate: 'June 18, 2026',
        themeClass: 'card-citi'
      }
    ],
    creditProfile: {
      scores: {
        transunion: 754,
        equifax: 762,
        experian: 758,
        fico: 760
      },
      hardPulls: [
        { id: 'pull-1', company: 'Premium Auto Dealership', date: '2025-11-14', expires: '2027-11-14' },
        { id: 'pull-2', company: 'Chase Bank Card Services', date: '2025-03-20', expires: '2027-03-20' }
      ],
      upcomingRemovals: '2 hard pull(s) will expire inside 18 months. Next removal scheduled for March 20, 2027.'
    },
    vacationTracker: {
      isActive: false,
      locationName: 'None',
      tripBudget: 0.00,
      spent: 0.00
    },
    notifications: [
      {
        id: 'notif-1',
        type: 'info',
        title: 'Welcome to Waterfall CashFlow',
        text: 'Smart banking aggregator synced. All records are stored client-side for maximum privacy.',
        time: '2 hours ago'
      }
    ]
  };

  // --- Available Transaction Icons (Icon Changer Tray) ---
  const TRANSACTION_ICONS = [
    '💸', '🛒', '☕', '🍔', '🍿', '🏠', '⛽', '✈️',
    '💊', '💻', '🎁', '📚', '🏋️', '🎵', '💰', '🚗',
    '🛍️', '📱', '🚕', '🍺', '⚡', '🏥', '💈', '🍕'
  ];

  // --- Application State Manager ---
  let state = {};

  // Helper: Mask account or card numbers to prevent full PII exposure
  function maskAccountNumber(rawNumber) {
    const digits = String(rawNumber || '').replace(/\D/g, '');
    const last4 = digits.slice(-4) || '0000';
    return `•••• ${last4.padStart(4, '0')}`;
  }

  // Helper: Get all groups an account belongs to as a sanitized string array
  function getAccountGroups(acc) {
    if (!acc) return [];
    if (Array.isArray(acc.groups) && acc.groups.length > 0) {
      return acc.groups.map(g => (g || '').trim()).filter(Boolean);
    }
    if (typeof acc.group === 'string' && acc.group.trim()) {
      return acc.group.split(',').map(g => g.trim()).filter(Boolean);
    }
    if (Array.isArray(acc.groupTags) && acc.groupTags.length > 0) {
      return acc.groupTags.map(g => (g || '').trim()).filter(Boolean);
    }
    if (acc.type === 'savings') return ['Savings'];
    if (acc.type === 'credit') return ['Credit Cards'];
    return ['Checking'];
  }

  // Load state from localStorage or fallback to mock data
  function loadState() {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        state = JSON.parse(local);
        let migrated = false;
        if (!state.accounts || !Array.isArray(state.accounts) || state.accounts.length === 0) {
          state.accounts = JSON.parse(JSON.stringify(initialData.accounts));
          migrated = true;
        }
        state.accounts.forEach(acc => {
          // Check if initial template has richer multiple groups
          const initAcc = (initialData.accounts || []).find(a => a.id === acc.id);
          if (initAcc && Array.isArray(initAcc.groups) && (!Array.isArray(acc.groups) || acc.groups.length <= 1)) {
            acc.groups = [...initAcc.groups];
            acc.group = acc.groups.join(', ');
            migrated = true;
          } else {
            acc.groups = getAccountGroups(acc);
            acc.group = acc.groups.join(', ');
          }
          const matchingCard = (state.creditCards || []).find(c => c.id === acc.id);
          if (matchingCard && typeof matchingCard.balance === 'number') {
            acc.balance = matchingCard.balance;
          }
        });
        if (Array.isArray(state.transactions)) {
          state.transactions.forEach(tx => {
            if (!tx.accountId) {
              if (tx.category === 'Groceries') tx.accountId = 'card-amex';
              else if (tx.category === 'Food & Dining') tx.accountId = 'card-sapphire';
              else if (tx.category === 'Entertainment') tx.accountId = 'card-citi';
              else if (tx.tag === 'Savings Interest' || tx.category === 'Savings') tx.accountId = 'acc-savings-chase';
              else tx.accountId = 'acc-checking';
              migrated = true;
            }
            if (!tx.icon) {
              tx.icon = '💸';
              migrated = true;
            }
          });
        }
        // Migrate customCategories
        if (!Array.isArray(state.customCategories)) {
          state.customCategories = [];
          migrated = true;
        }
        // Migrate Budgets to Multi-Category Trackers
        if (!Array.isArray(state.budgets) || state.budgets.length === 0) {
          state.budgets = JSON.parse(JSON.stringify(initialData.budgets));
          migrated = true;
        } else {
          state.budgets.forEach((b, idx) => {
            if (!b.id) {
              b.id = 'bgt-' + (idx + 1);
              migrated = true;
            }
            if (!Array.isArray(b.categories) || b.categories.length === 0) {
              b.categories = b.category ? [b.category] : ['Groceries'];
              migrated = true;
            }
            if (!b.name) {
              b.name = b.category || `Budget Tracker ${idx + 1}`;
              migrated = true;
            }
            if (!b.icon) {
              if (b.name.includes('Education')) b.icon = '🎓';
              else if (b.name.includes('Shop') || b.name.includes('Cloth')) b.icon = '🛍️';
              else if (b.name.includes('Grocer')) b.icon = '🛒';
              else if (b.name.includes('Food') || b.name.includes('Dining')) b.icon = '☕';
              else if (b.name.includes('House') || b.name.includes('Rent')) b.icon = '🏠';
              else if (b.name.includes('Entertain')) b.icon = '🍿';
              else b.icon = '📊';
              migrated = true;
            }
          });
          // Ensure Education tracker and Shopping tracker exist
          if (!state.budgets.some(b => b.id === 'bgt-education' || b.name.toLowerCase().includes('education') || (b.categories && b.categories.includes('Education')))) {
            state.budgets.unshift({
              id: 'bgt-education',
              name: 'Education Tracker',
              categories: ['Education', 'Books & Courses', 'School Supplies'],
              spent: 0,
              total: 250.00,
              limitAlert: 80,
              icon: '🎓'
            });
            migrated = true;
          }
          if (!state.budgets.some(b => b.id === 'bgt-shopping' || b.name.toLowerCase().includes('shopping') || (b.categories && b.categories.includes('Clothing')))) {
            state.budgets.splice(1, 0, {
              id: 'bgt-shopping',
              name: 'Shopping & Clothes',
              categories: ['Shopping', 'Clothing', 'Electronics & Gadgets', 'Personal Care'],
              spent: 0,
              total: 350.00,
              limitAlert: 80,
              icon: '🛍️'
            });
            migrated = true;
          }
        }
        if (!state.categoryColors || typeof state.categoryColors !== 'object') {
          state.categoryColors = JSON.parse(JSON.stringify(DEFAULT_CATEGORY_COLORS));
          migrated = true;
        }
        if (!state.tagColors || typeof state.tagColors !== 'object') {
          state.tagColors = JSON.parse(JSON.stringify(DEFAULT_TAG_COLORS));
          migrated = true;
        }
        if (migrated) {
          saveState();
        }
      } else {
        state = JSON.parse(JSON.stringify(initialData));
        saveState();
      }
    } catch (e) {
      console.warn('Error reading state from storage, fallback to default.');
      state = JSON.parse(JSON.stringify(initialData));
    }
  }

  // Save current state to localStorage
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Error writing state to storage.');
    }
  }

  // Reset state to defaults
  function resetState() {
    state = JSON.parse(JSON.stringify(initialData));
    saveState();
    initApp();
  }

  // --- Safe DOM Node Creation Helpers (XSS Prevention) ---
  function el(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName);
    for (const [key, val] of Object.entries(attributes)) {
      if (key === 'class') {
        element.className = val;
      } else if (key === 'id') {
        element.id = val;
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, val);
      } else if (key === 'title') {
        element.setAttribute('title', val);
      } else if (key === 'style') {
        element.setAttribute('style', val);
      } else if (key === 'type' && (tagName === 'button' || tagName === 'input' || tagName === 'select')) {
        element.type = val;
      } else if (key === 'placeholder') {
        element.placeholder = val;
      } else if (key === 'value') {
        element.value = val;
      } else if (key === 'step' || key === 'min' || key === 'max' || key === 'maxlength' || key === 'accept') {
        element.setAttribute(key, val);
      } else if (key === 'selected') {
        if (val) element.setAttribute('selected', 'selected');
      }
    }
    
    const childArray = Array.isArray(children) ? children : [children];
    for (const child of childArray) {
      if (typeof child === 'string' || typeof child === 'number') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement || child instanceof SVGElement || child instanceof DocumentFragment) {
        element.appendChild(child);
      }
    }
    return element;
  }

  // Namespace SVG Node creation
  function svgEl(tagName, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    for (const [key, val] of Object.entries(attributes)) {
      element.setAttribute(key, val);
    }
    return element;
  }

  // Clear contents of a DOM container safely
  function clearNode(node) {
    if (node) {
      node.replaceChildren();
    }
  }

  // --- Available Categories (iOS Money Flow style) ---
  const DEFAULT_CATEGORIES = [
    // Food & Dining
    { name: 'Groceries', icon: '🛒', group: 'Food & Dining' },
    { name: 'Food & Dining', icon: '☕', group: 'Food & Dining' },
    { name: 'Coffee & Cafes', icon: '☕', group: 'Food & Dining' },
    { name: 'Fast Food', icon: '🍔', group: 'Food & Dining' },
    { name: 'Restaurants', icon: '🍕', group: 'Food & Dining' },
    // Shopping
    { name: 'Shopping', icon: '🛍️', group: 'Shopping' },
    { name: 'Clothing', icon: '👕', group: 'Shopping' },
    { name: 'Electronics & Gadgets', icon: '💻', group: 'Shopping' },
    { name: 'Personal Care', icon: '💈', group: 'Shopping' },
    { name: 'Books & Stationery', icon: '📚', group: 'Shopping' },
    // Housing & Living
    { name: 'Housing', icon: '🏠', group: 'Housing & Living' },
    { name: 'Utilities', icon: '⚡', group: 'Housing & Living' },
    { name: 'Internet & Phone', icon: '📱', group: 'Housing & Living' },
    // Transportation
    { name: 'Transportation', icon: '🚗', group: 'Transportation' },
    { name: 'Fuel & Gas', icon: '⛽', group: 'Transportation' },
    { name: 'Public Transit', icon: '🚕', group: 'Transportation' },
    // Entertainment & Leisure
    { name: 'Entertainment', icon: '🍿', group: 'Entertainment & Leisure' },
    { name: 'Streaming & Apps', icon: '🎵', group: 'Entertainment & Leisure' },
    { name: 'Vacation', icon: '✈️', group: 'Entertainment & Leisure' },
    { name: 'Hobbies & Gaming', icon: '🎮', group: 'Entertainment & Leisure' },
    // Education
    { name: 'Education', icon: '🎓', group: 'Education' },
    { name: 'Books & Courses', icon: '📖', group: 'Education' },
    { name: 'School Supplies', icon: '✏️', group: 'Education' },
    // Health & Fitness
    { name: 'Healthcare', icon: '🏥', group: 'Health & Fitness' },
    { name: 'Pharmacy', icon: '💊', group: 'Health & Fitness' },
    { name: 'Fitness & Gym', icon: '🏋️', group: 'Health & Fitness' },
    // Income
    { name: 'Salary', icon: '💼', group: 'Income' },
    { name: 'Investments', icon: '📈', group: 'Income' },
    { name: 'Savings Interest', icon: '💰', group: 'Income' },
    // Other
    { name: 'Gifts & Donations', icon: '🎁', group: 'Other' },
    { name: 'Miscellaneous', icon: '💸', group: 'Other' }
  ];

  // Helper: Retrieve all unique categories (defaults + custom + existing txs)
  function getAllCategories() {
    const set = new Set();
    DEFAULT_CATEGORIES.forEach(c => set.add(c.name));
    (state.customCategories || []).forEach(c => {
      if (c) set.add(c);
    });
    (state.transactions || []).forEach(tx => {
      if (tx.category) set.add(tx.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  // Helper: Retrieve default icon for a category name
  function getCategoryIcon(catName) {
    if (!catName) return '💸';
    const found = DEFAULT_CATEGORIES.find(c => c.name.toLowerCase() === catName.toLowerCase());
    if (found) return found.icon;
    const lower = catName.toLowerCase();
    if (lower.includes('educat') || lower.includes('course') || lower.includes('school') || lower.includes('tutor')) return '🎓';
    if (lower.includes('cloth') || lower.includes('apparel') || lower.includes('wardrobe')) return '👕';
    if (lower.includes('shop') || lower.includes('mall') || lower.includes('store')) return '🛍️';
    if (lower.includes('food') || lower.includes('cafe') || lower.includes('dining') || lower.includes('coffee')) return '☕';
    if (lower.includes('grocer') || lower.includes('market')) return '🛒';
    if (lower.includes('rent') || lower.includes('house') || lower.includes('apartment')) return '🏠';
    if (lower.includes('tech') || lower.includes('electr')) return '💻';
    if (lower.includes('trans') || lower.includes('car') || lower.includes('gas')) return '🚗';
    if (lower.includes('stream') || lower.includes('movie') || lower.includes('entertain')) return '🍿';
    if (lower.includes('health') || lower.includes('med') || lower.includes('doctor')) return '🏥';
    if (lower.includes('fit') || lower.includes('gym')) return '🏋️';
    return '💸';
  }

  // Helper: Retrieve category group
  function getCategoryGroup(catName) {
    const found = DEFAULT_CATEGORIES.find(c => c.name.toLowerCase() === (catName || '').toLowerCase());
    return found ? found.group : 'Custom Categories';
  }

  // Helper: Convert hex color to rgba string
  function hexToRgba(hex, alpha = 0.14) {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return `rgba(0, 242, 254, ${alpha})`;
    let c = hex.slice(1);
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    if (isNaN(num)) return `rgba(0, 242, 254, ${alpha})`;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Helper: Get color for a category
  function getCategoryColor(catName) {
    if (!catName) return '#00f2fe';
    if (state.categoryColors && state.categoryColors[catName]) {
      return state.categoryColors[catName];
    }
    if (DEFAULT_CATEGORY_COLORS[catName]) {
      return DEFAULT_CATEGORY_COLORS[catName];
    }
    let hash = 0;
    for (let i = 0; i < catName.length; i++) {
      hash = catName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return PRESET_COLOR_SWATCHES[Math.abs(hash) % PRESET_COLOR_SWATCHES.length];
  }

  // Helper: Set and persist category color
  function setCategoryColor(catName, colorHex) {
    if (!catName || !colorHex) return;
    if (!state.categoryColors) state.categoryColors = {};
    state.categoryColors[catName] = colorHex;
    saveState();
  }

  // Helper: Get color for a tag
  function getTagColor(tagName, tx) {
    if (!tagName) return '#00f2fe';
    if (tx && tx.tagColor) return tx.tagColor;
    if (state.tagColors && state.tagColors[tagName]) {
      return state.tagColors[tagName];
    }
    if (DEFAULT_TAG_COLORS[tagName]) {
      return DEFAULT_TAG_COLORS[tagName];
    }
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return PRESET_COLOR_SWATCHES[Math.abs(hash) % PRESET_COLOR_SWATCHES.length];
  }

  // Helper: Set and persist tag color
  function setTagColor(tagName, colorHex) {
    if (!tagName || !colorHex) return;
    if (!state.tagColors) state.tagColors = {};
    state.tagColors[tagName] = colorHex;
    saveState();
  }

  // Helper: Safe interactive color picker modal
  function openColorPickerModal(titleText, currentColor, onColorSelected) {
    let modal = document.getElementById('color-picker-overlay');
    if (modal) modal.remove();

    const screen = document.getElementById('device-screen');
    modal = el('div', { class: 'account-switcher-overlay show', id: 'color-picker-overlay' });

    const card = el('div', { class: 'account-switcher-card', style: 'padding:14px;' });
    const header = el('div', { style: 'display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;' }, [
      el('h4', { style: 'font-size:13px; color:#fff;' }, [titleText]),
      el('button', { class: 'switcher-close-btn', type: 'button' }, ['×'])
    ]);

    header.querySelector('button').addEventListener('click', () => modal.remove());

    const previewRow = el('div', { style: 'display:flex; align-items:center; gap:8px; margin-bottom:10px;' }, [
      el('span', { class: 'color-indicator-circle', style: `background:${currentColor}; width:16px; height:16px; border:1px solid rgba(255,255,255,0.3);` }),
      el('span', { style: 'font-size:11px; color:var(--text-secondary);' }, [`Selected color: ${currentColor}`])
    ]);

    const swatchesContainer = el('div', { class: 'color-swatches-row' });
    PRESET_COLOR_SWATCHES.forEach(hex => {
      const btn = el('button', {
        class: `color-swatch-btn ${hex.toLowerCase() === (currentColor || '').toLowerCase() ? 'active' : ''}`,
        type: 'button',
        style: `background: ${hex};`
      });
      btn.addEventListener('click', () => {
        onColorSelected(hex);
        modal.remove();
      });
      swatchesContainer.appendChild(btn);
    });

    card.appendChild(header);
    card.appendChild(previewRow);
    card.appendChild(swatchesContainer);
    modal.appendChild(card);
    if (screen) screen.appendChild(modal);
  }

  // Helper: Open custom category creation dialog safely
  function handleAddNewCustomCategory(selectElement, onSelectCallback) {
    let modal = document.getElementById('custom-category-modal');
    if (modal) modal.remove();

    const screen = document.getElementById('device-screen');
    modal = el('div', { class: 'account-switcher-overlay show', id: 'custom-category-modal' });

    const card = el('div', { class: 'account-switcher-card' });
    const title = el('h4', { style: 'margin-bottom:8px; font-size:13px;' }, ['Add Custom Purchase Category']);
    const desc = el('p', { class: 'reports-summary-text', style: 'margin-bottom:12px;' }, ['Create a custom spending category similar to iOS Money Flow.']);
    const input = el('input', { type: 'text', placeholder: 'Category name (e.g. Books, Hobbies)', style: 'margin-bottom:12px;' });
    
    const actions = el('div', { style: 'display:flex; gap:8px; justify-content:flex-end;' }, [
      el('button', { class: 'form-btn cancel', type: 'button' }, ['Cancel']),
      el('button', { class: 'form-btn submit', type: 'button' }, ['Add Category'])
    ]);

    actions.querySelector('.cancel').addEventListener('click', () => {
      modal.remove();
      selectElement.value = selectElement.getAttribute('data-prev-val') || 'Groceries';
    });

    actions.querySelector('.submit').addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) {
        pushSystemNotification('Input Required', 'Please enter a valid category name.');
        return;
      }
      if (!state.customCategories) state.customCategories = [];
      if (!state.customCategories.includes(val)) {
        state.customCategories.push(val);
        saveState();
      }
      modal.remove();

      // Replace select options
      const newSelect = buildCategoryDropdown(val, onSelectCallback);
      selectElement.replaceWith(newSelect);
      newSelect.value = val;
      newSelect.setAttribute('data-prev-val', val);
      if (onSelectCallback) {
        onSelectCallback(val, getCategoryIcon(val));
      }
      pushSystemNotification('Category Created', `Added category: ${val}`);
    });

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(input);
    card.appendChild(actions);
    modal.appendChild(card);
    screen.appendChild(modal);
    input.focus();
  }

  // Helper: Build organized category dropdown with optgroups and icon mapping
  function buildCategoryDropdown(selectedCategory, onSelectCallback) {
    const select = el('select', { class: 'category-dropdown-select' });

    // Group default categories by group
    const groups = {};
    DEFAULT_CATEGORIES.forEach(cat => {
      if (!groups[cat.group]) groups[cat.group] = [];
      groups[cat.group].push(cat);
    });

    // Custom categories
    const customList = (state.customCategories || []).filter(c => !DEFAULT_CATEGORIES.some(dc => dc.name === c));
    if (customList.length > 0) {
      groups['Custom Categories'] = customList.map(name => ({ name, icon: getCategoryIcon(name), group: 'Custom Categories' }));
    }

    // Any extra transaction categories
    const otherTxCats = [];
    (state.transactions || []).forEach(tx => {
      if (tx.category && !DEFAULT_CATEGORIES.some(dc => dc.name === tx.category) && !customList.includes(tx.category)) {
        if (!otherTxCats.includes(tx.category)) otherTxCats.push(tx.category);
      }
    });
    if (otherTxCats.length > 0) {
      groups['Other Recorded'] = otherTxCats.map(name => ({ name, icon: getCategoryIcon(name), group: 'Other Recorded' }));
    }

    for (const [groupName, cats] of Object.entries(groups)) {
      const optgroup = document.createElement('optgroup');
      optgroup.label = groupName;
      cats.forEach(c => {
        const isSel = (c.name.toLowerCase() === (selectedCategory || '').toLowerCase());
        const opt = el('option', { value: c.name, selected: isSel }, [`${c.icon} ${c.name}`]);
        optgroup.appendChild(opt);
      });
      select.appendChild(optgroup);
    }

    // Add option to create a custom category
    const optCustom = el('option', { value: '__add_custom__' }, ['➕ Add Custom Category...']);
    select.appendChild(optCustom);

    if (selectedCategory) {
      select.value = selectedCategory;
      select.setAttribute('data-prev-val', selectedCategory);
    }

    select.addEventListener('change', () => {
      if (select.value === '__add_custom__') {
        handleAddNewCustomCategory(select, onSelectCallback);
        return;
      }
      select.setAttribute('data-prev-val', select.value);
      if (onSelectCallback) {
        onSelectCallback(select.value, getCategoryIcon(select.value));
      }
    });

    return select;
  }

  // Helper: Retrieve list of categories mapped to a budget tracker
  function getBudgetCategories(b) {
    if (!b) return [];
    if (Array.isArray(b.categories) && b.categories.length > 0) {
      return b.categories.map(c => (c || '').trim()).filter(Boolean);
    }
    if (b.category && typeof b.category === 'string') {
      return [b.category.trim()];
    }
    return [];
  }

  // Helper: Retrieve budget tracker name
  function getBudgetName(b) {
    if (!b) return 'Budget Tracker';
    return b.name || b.category || 'Budget Tracker';
  }

  // Helper: Retrieve budget tracker icon
  function getBudgetIcon(b) {
    if (!b) return '📊';
    if (b.icon) return b.icon;
    const cats = getBudgetCategories(b);
    if (cats.length > 0) return getCategoryIcon(cats[0]);
    return '📊';
  }

  // --- Active Tab & Filter Controls ---
  let currentActiveTab = 'dashboard';
  let currentSearchQuery = '';
  let currentCategoryFilter = 'All';
  let currentAccountScope = 'all'; // 'all' | 'group:<groupName>' | 'account:<accountId>'
  let isAddFormVisible = false;
  let isAddAccountFormVisible = false;
  let selectedNewTxIcon = '💸';
  let selectedReceiptFile = null;
  let editingTransactionId = null; // null = create new, string = edit existing transaction

  // --- Transactions Date Range Filter Controls (iOS Money Flow style) ---
  let currentDateFilterMode = 'all'; // 'all' (Complete History) | 'today' | 'month' | 'ytd' | 'year' | 'custom'
  let selectedFilterYear = 2026;
  let selectedFilterMonth = 4; // 0-indexed: 4 = May
  let customFilterStartDate = '2026-05-01';
  let customFilterEndDate = '2026-05-31';

  // --- Granular Modal Detail States ---
  let activeDetailTxId = null;
  let isEditingDetails = false;
  let isChangingModalIcon = false;

  // Helper: Check whether a transaction falls inside the currently selected date range
  function isTxInSelectedDateRange(tx) {
    if (!tx || !tx.timestamp) return true;
    if (currentDateFilterMode === 'all') return true;
    const txDate = new Date(tx.timestamp);
    if (isNaN(txDate.getTime())) return true;

    const txYear = txDate.getFullYear();
    const txMonth = txDate.getMonth(); // 0-11
    const txDateStr = tx.timestamp.slice(0, 10); // YYYY-MM-DD

    const realTodayStr = new Date().toISOString().slice(0, 10);
    const mockTodayStr = '2026-05-28';

    if (currentDateFilterMode === 'today') {
      return txDateStr === realTodayStr || txDateStr === mockTodayStr;
    }

    if (currentDateFilterMode === 'month') {
      return txYear === selectedFilterYear && txMonth === selectedFilterMonth;
    }

    if (currentDateFilterMode === 'ytd') {
      // From Jan 1 of active year up to today / end of current month
      return txYear === selectedFilterYear && (txDateStr <= realTodayStr || txDateStr <= mockTodayStr || txMonth <= 4);
    }

    if (currentDateFilterMode === 'year') {
      return txYear === selectedFilterYear;
    }

    if (currentDateFilterMode === 'custom') {
      if (customFilterStartDate && txDateStr < customFilterStartDate) return false;
      if (customFilterEndDate && txDateStr > customFilterEndDate) return false;
      return true;
    }

    return true;
  }

  // Helper: Calculate transaction net amount after refunds
  function getTxNetAmount(tx) {
    if (tx.type === 'income') return tx.amount;
    const refundsTotal = (tx.refunds || []).reduce((sum, r) => sum + r.amount, 0);
    return Math.max(0, tx.amount - refundsTotal);
  }

  // Helper: Get account by ID
  function getAccountById(accId) {
    return (state.accounts || []).find(a => a.id === accId) || null;
  }

  // Helper: Get all unique account groups across all accounts (e.g. 'Checking', 'Savings', 'Credit Cards')
  function getAllGroups() {
    const groupSet = new Set();
    (state.accounts || []).forEach(acc => {
      getAccountGroups(acc).forEach(g => {
        if (g) groupSet.add(g);
      });
    });
    return Array.from(groupSet);
  }

  // Helper: Get accounts matching the given scope ('all' | 'group:<name>' | 'account:<id>')
  function getAccountsForScope(scope) {
    const accounts = state.accounts || [];
    if (!scope || scope === 'all') return accounts;
    if (scope.startsWith('group:')) {
      const gName = scope.slice(6);
      return accounts.filter(acc => getAccountGroups(acc).includes(gName));
    }
    if (scope.startsWith('account:')) {
      const accId = scope.slice(8);
      return accounts.filter(acc => acc.id === accId);
    }
    return accounts;
  }

  // Helper: Get transactions matching the given account/group scope
  function getTransactionsForScope(scope) {
    const txs = state.transactions || [];
    if (!scope || scope === 'all') return txs;
    const allowedIds = new Set(getAccountsForScope(scope).map(a => a.id));
    return txs.filter(tx => allowedIds.has(tx.accountId));
  }

  // Helper: Calculate aggregate totals for ALL accounts
  function getAllAccountsAggregateTotals() {
    const accounts = state.accounts || [];
    let totalAssets = 0;
    let totalDebts = 0;
    accounts.forEach(a => {
      if (a.type === 'credit') {
        totalDebts += a.balance;
      } else {
        totalAssets += a.balance;
      }
    });
    const grossBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const netTotal = totalAssets - totalDebts;

    let totalInflow = 0;
    let totalOutflow = 0;
    (state.transactions || []).forEach(tx => {
      const net = getTxNetAmount(tx);
      if (tx.type === 'income') totalInflow += net;
      else totalOutflow += net;
    });

    return {
      accounts,
      totalAssets,
      totalDebts,
      grossBalance,
      netTotal,
      totalInflow,
      totalOutflow,
      netFlow: totalInflow - totalOutflow
    };
  }

  // Helper: Calculate aggregate totals (balance, income, expenses) for a specific group
  function getGroupAggregateTotals(groupName) {
    const accounts = (state.accounts || []).filter(a => getAccountGroups(a).includes(groupName));
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const accIdSet = new Set(accounts.map(a => a.id));
    let income = 0;
    let expenses = 0;
    let txCount = 0;
    (state.transactions || []).forEach(tx => {
      if (accIdSet.has(tx.accountId)) {
        txCount += 1;
        const net = getTxNetAmount(tx);
        if (tx.type === 'income') income += net;
        else expenses += net;
      }
    });
    return {
      groupName,
      accounts,
      totalBalance,
      income,
      expenses,
      netFlow: income - expenses,
      txCount,
      allCredit: accounts.length > 0 && accounts.every(a => a.type === 'credit')
    };
  }

  // Helper: Synchronize balance updates across both state.accounts and state.creditCards
  function applyAccountBalanceDelta(accountId, txType, amountDelta) {
    const acc = getAccountById(accountId);
    if (acc) {
      if (acc.type === 'credit') {
        const change = txType === 'expense' ? amountDelta : -amountDelta;
        acc.balance = Math.max(0, acc.balance + change);
      } else {
        const change = txType === 'income' ? amountDelta : -amountDelta;
        acc.balance = Math.max(0, acc.balance + change);
      }
    }
    const card = (state.creditCards || []).find(c => c.id === accountId);
    if (card) {
      if (acc) {
        card.balance = acc.balance;
      } else {
        const change = txType === 'expense' ? amountDelta : -amountDelta;
        card.balance = Math.max(0, card.balance + change);
      }
    }
  }

  // Helper: Synchronize and recalculate all category budget balances
  function recalculateBudgetSpent() {
    (state.budgets || []).forEach(b => {
      b.spent = 0;
      const cats = getBudgetCategories(b).map(c => c.toLowerCase().trim());
      (state.transactions || []).forEach(tx => {
        if (tx.type === 'expense') {
          const net = getTxNetAmount(tx);
          const txCat = (tx.category || '').toLowerCase().trim();
          if (cats.includes(txCat)) {
            b.spent += net;
          }
        }
      });
    });
  }

  // --- Upper-Left Account View Switcher Controller (Money Flow style) ---
  function toggleAccountSwitcherModal() {
    let overlay = document.getElementById('account-switcher-overlay');
    if (overlay && overlay.classList.contains('show')) {
      overlay.classList.remove('show');
      const btn = document.getElementById('header-account-switcher-btn');
      if (btn) btn.classList.remove('active');
      return;
    }
    showAccountSwitcherModal();
  }

  function showAccountSwitcherModal() {
    let overlay = document.getElementById('account-switcher-overlay');
    const screen = document.getElementById('device-screen') || document.body;
    if (!overlay && screen) {
      overlay = el('div', { class: 'account-switcher-overlay', id: 'account-switcher-overlay' });
      screen.appendChild(overlay);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('show');
          const btn = document.getElementById('header-account-switcher-btn');
          if (btn) btn.classList.remove('active');
        }
      });
    }

    if (!overlay) return;
    clearNode(overlay);

    const btn = document.getElementById('header-account-switcher-btn');
    if (btn) btn.classList.add('active');

    const card = el('div', { class: 'account-switcher-card' });

    // Modal Header
    const closeBtn = el('button', { class: 'switcher-close-btn', type: 'button' }, ['×']);
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('show');
      if (btn) btn.classList.remove('active');
    });

    const header = el('div', { class: 'switcher-header' }, [
      el('h4', {}, ['Switch Account View']),
      closeBtn
    ]);
    card.appendChild(header);

    // Option 1: All Accounts
    const allTotals = getAllAccountsAggregateTotals();
    const allTotal = allTotals.netTotal;
    const isAllActive = currentAccountScope === 'all';

    const allRow = el('div', {
      class: `switcher-scope-item ${isAllActive ? 'active' : ''}`
    }, [
      el('div', { class: 'switcher-scope-left' }, [
        el('span', { style: 'font-size:20px;' }, ['🌐']),
        el('div', {}, [
          el('div', { class: 'switcher-scope-name' }, ['All Accounts']),
          el('div', { style: 'font-size:12.5px; color:var(--text-secondary);' }, ['Combined Net Worth & Cash Flow'])
        ])
      ]),
      el('div', { style: 'display:flex; align-items:center; gap:8px;' }, [
        el('span', { class: 'switcher-scope-amount' }, [`$${allTotal.toFixed(2)}`]),
        isAllActive ? el('span', { class: 'switcher-check' }, ['✓']) : null
      ])
    ]);

    allRow.addEventListener('click', () => {
      currentAccountScope = 'all';
      calculateStats();
      overlay.classList.remove('show');
      if (btn) btn.classList.remove('active');
      initApp();
    });
    card.appendChild(allRow);

    // Section 2: Account Groupings (System & Custom Groups)
    const groups = getAllGroups();
    if (groups.length > 0) {
      const groupSecTitle = el('div', { class: 'switcher-section-title' }, ['ACCOUNT GROUPINGS']);
      card.appendChild(groupSecTitle);

      groups.forEach(groupName => {
        const groupTotals = getGroupAggregateTotals(groupName);
        const isGroupActive = currentAccountScope === 'group:' + groupName;

        const groupRow = el('div', {
          class: `switcher-group-header-row ${isGroupActive ? 'active' : ''}`,
          title: `Filter feed to all accounts in ${groupName}`
        }, [
          el('div', { style: 'display:flex; align-items:center; gap:10px;' }, [
            el('span', { style: 'font-size:18px;' }, [
              groupName.toLowerCase().includes('credit') ? '💳' :
              (groupName.toLowerCase().includes('sav') ? '💰' : '📁')
            ]),
            el('span', { class: 'switcher-group-title' }, [groupName]),
            el('span', { class: 'group-count-badge' }, [`${groupTotals.accounts.length} acc`])
          ]),
          el('div', { style: 'display:flex; align-items:center; gap:8px;' }, [
            el('span', { class: 'switcher-group-total' }, [`$${groupTotals.totalBalance.toFixed(2)}`]),
            isGroupActive ? el('span', { class: 'switcher-check' }, ['✓']) : null
          ])
        ]);

        groupRow.addEventListener('click', () => {
          currentAccountScope = 'group:' + groupName;
          calculateStats();
          overlay.classList.remove('show');
          if (btn) btn.classList.remove('active');
          initApp();
        });

        card.appendChild(groupRow);
      });
    }

    // Section 3: Individual Accounts (Direct selection of any account)
    const accounts = state.accounts || [];
    if (accounts.length > 0) {
      const accSecTitle = el('div', { class: 'switcher-section-title' }, ['INDIVIDUAL ACCOUNTS']);
      card.appendChild(accSecTitle);

      accounts.forEach(acc => {
        const isAccActive = currentAccountScope === 'account:' + acc.id;
        const accGroups = getAccountGroups(acc);

        const accRow = el('div', {
          class: `switcher-scope-item ${isAccActive ? 'active' : ''}`,
          title: `Filter feed strictly to ${acc.name}`
        }, [
          el('div', { class: 'switcher-scope-left' }, [
            el('span', { style: 'font-size:20px;' }, [acc.icon || '🏦']),
            el('div', {}, [
              el('div', { class: 'switcher-scope-name' }, [acc.name]),
              el('div', { style: 'font-size:12px; color:var(--text-secondary);' }, [
                acc.institution ? `${acc.institution} • ${accGroups.join(', ')}` : (accGroups.join(', ') || 'Account')
              ])
            ])
          ]),
          el('div', { style: 'display:flex; align-items:center; gap:8px;' }, [
            el('span', { class: 'switcher-scope-amount' }, [`$${acc.balance.toFixed(2)}`]),
            isAccActive ? el('span', { class: 'switcher-check' }, ['✓']) : null
          ])
        ]);

        accRow.addEventListener('click', () => {
          currentAccountScope = 'account:' + acc.id;
          calculateStats();
          overlay.classList.remove('show');
          if (btn) btn.classList.remove('active');
          initApp();
        });

        card.appendChild(accRow);
      });
    }

    // Footer actions
    const footerActions = el('div', { style: 'display:flex; flex-direction:column; gap:8px; margin-top:8px;' });

    const newGroupBtn = el('div', { class: 'switcher-manage-footer-btn' }, ['➕ Create Custom Group']);
    newGroupBtn.addEventListener('click', () => {
      overlay.classList.remove('show');
      if (btn) btn.classList.remove('active');
      openCreateGroupModal();
    });
    footerActions.appendChild(newGroupBtn);

    const manageBtn = el('div', { class: 'switcher-manage-footer-btn', style: 'border-style:solid; background:rgba(255,255,255,0.02);' }, ['⚙️ Manage All Accounts & Balances']);
    manageBtn.addEventListener('click', () => {
      overlay.classList.remove('show');
      if (btn) btn.classList.remove('active');
      currentActiveTab = 'accounts';
      initApp();
    });
    footerActions.appendChild(manageBtn);

    card.appendChild(footerActions);

    overlay.appendChild(card);
    overlay.classList.add('show');
  }

  // Helper: Open dialog to create custom group and assign accounts
  function openCreateGroupModal() {
    let overlay = document.getElementById('create-group-overlay');
    if (overlay) overlay.remove();

    const parent = document.getElementById('device-screen') || document.body;
    overlay = el('div', { class: 'account-switcher-overlay show', id: 'create-group-overlay' });

    const card = el('div', { class: 'account-switcher-card', style: 'max-height:85vh; padding:22px 20px;' });

    const closeBtn = el('button', { class: 'switcher-close-btn', type: 'button' }, ['×']);
    closeBtn.addEventListener('click', () => overlay.remove());

    const header = el('div', { class: 'switcher-header' }, [
      el('h4', {}, ['Create Custom Group']),
      closeBtn
    ]);
    card.appendChild(header);

    const desc = el('p', { class: 'reports-summary-text', style: 'margin-bottom:12px; font-size:14px; color:var(--text-secondary);' }, [
      'Create a custom group (e.g. Household, Business, Emergency Fund, Vacation) to track multiple accounts together.'
    ]);
    card.appendChild(desc);

    const nameInput = el('input', {
      type: 'text',
      placeholder: 'Group Name (e.g. Household, Investments)',
      style: 'min-height:52px; font-size:16px; padding:12px 16px; border-radius:14px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:#fff; width:100%; margin-bottom:14px;'
    });
    card.appendChild(nameInput);

    const pickTitle = el('div', { class: 'switcher-section-title' }, ['SELECT ACCOUNTS TO INCLUDE']);
    card.appendChild(pickTitle);

    const selectedAccIds = new Set();
    const accountsList = el('div', { style: 'display:flex; flex-direction:column; gap:8px; margin-bottom:16px;' });

    (state.accounts || []).forEach(acc => {
      const checkbox = el('input', { type: 'checkbox', style: 'width:22px; height:22px; accent-color:var(--accent-cyan);' });
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selectedAccIds.add(acc.id);
        else selectedAccIds.delete(acc.id);
      });

      const accRow = el('label', {
        style: 'display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:rgba(255,255,255,0.04); border-radius:14px; border:1px solid rgba(255,255,255,0.08); cursor:pointer;'
      }, [
        el('div', { style: 'display:flex; align-items:center; gap:10px;' }, [
          el('span', { style: 'font-size:20px;' }, [acc.icon || '🏦']),
          el('span', { style: 'font-size:16px; font-weight:600; color:#fff;' }, [acc.name])
        ]),
        checkbox
      ]);
      accountsList.appendChild(accRow);
    });
    card.appendChild(accountsList);

    const saveBtn = el('button', {
      class: 'tx-confirm-btn',
      type: 'button',
      style: 'width:100%; min-height:56px; font-size:17.5px; font-weight:700;'
    }, ['Save Custom Group']);

    saveBtn.addEventListener('click', () => {
      const gName = nameInput.value.trim();
      if (!gName) {
        nameInput.focus();
        return;
      }
      (state.accounts || []).forEach(acc => {
        if (!Array.isArray(acc.groups)) {
          acc.groups = getAccountGroups(acc);
        }
        if (selectedAccIds.has(acc.id)) {
          if (!acc.groups.includes(gName)) {
            acc.groups.push(gName);
          }
        }
        acc.group = acc.groups.join(', ');
      });
      saveState();
      overlay.remove();
      currentAccountScope = 'group:' + gName;
      calculateStats();
      initApp();
    });
    card.appendChild(saveBtn);

    overlay.appendChild(card);
    parent.appendChild(overlay);
  }

  // --- Core View & Stats Recalculators ---
  function calculateStats() {
    recalculateBudgetSpent();

    let periodIncome = 0.00;
    let periodExpenses = 0.00;
    const scopedTxs = getTransactionsForScope(currentAccountScope);

    scopedTxs.forEach(tx => {
      const isIncome = (tx.type === 'income');
      const val = getTxNetAmount(tx);
      if (isTxInSelectedDateRange(tx)) {
        if (isIncome) {
          periodIncome += val;
        } else {
          periodExpenses += val;
        }
      }
    });

    const netFlow = periodIncome - periodExpenses;

    // Upper-left Switcher Button update (Money Flow style)
    const elSwitcherIcon = document.getElementById('switcher-icon');
    const elSwitcherLabel = document.getElementById('switcher-label');

    // Balance Card elements
    const elPrimaryLabel = document.getElementById('summary-primary-label');
    const elNet = document.getElementById('summary-net-flow');
    const elBalanceLabel = document.getElementById('summary-balance-label');
    const elAccountBalance = document.getElementById('summary-account-balance');
    const elIncome = document.getElementById('summary-income');
    const elExpenses = document.getElementById('summary-expenses');

    // Current Balance calculation
    let currentBalanceVal = 0;
    if (currentAccountScope.startsWith('account:')) {
      const acc = getAccountById(currentAccountScope.slice(8));
      currentBalanceVal = acc ? acc.balance : 0;
    } else if (currentAccountScope.startsWith('group:')) {
      const grpTotals = getGroupAggregateTotals(currentAccountScope.slice(6));
      currentBalanceVal = grpTotals.totalBalance;
    } else {
      const allTotals = getAllAccountsAggregateTotals();
      currentBalanceVal = allTotals.netTotal;
    }

    if (currentAccountScope === 'all') {
      if (elSwitcherIcon) elSwitcherIcon.textContent = '🌐';
      if (elSwitcherLabel) elSwitcherLabel.textContent = 'All Accounts';
    } else if (currentAccountScope.startsWith('group:')) {
      const groupName = currentAccountScope.slice(6);
      if (elSwitcherIcon) {
        elSwitcherIcon.textContent = groupName.toLowerCase().includes('credit')
          ? '💳'
          : (groupName.toLowerCase().includes('sav') ? '💰' : '📁');
      }
      if (elSwitcherLabel) elSwitcherLabel.textContent = groupName;
    } else if (currentAccountScope.startsWith('account:')) {
      const acc = getAccountById(currentAccountScope.slice(8));
      if (acc) {
        if (elSwitcherIcon) elSwitcherIcon.textContent = acc.icon || '🏦';
        if (elSwitcherLabel) elSwitcherLabel.textContent = acc.name;
      }
    }

    if (elPrimaryLabel) {
      elPrimaryLabel.textContent = 'NET CASH FLOW';
    }
    if (elNet) {
      elNet.textContent = `${netFlow >= 0 ? '+' : '-'}$${Math.abs(netFlow).toFixed(2)}`;
      elNet.className = `balance-amount ${netFlow >= 0 ? 'positive' : 'negative'}`;
    }

    if (elBalanceLabel) {
      elBalanceLabel.textContent = 'CURRENT BALANCE';
    }
    if (elAccountBalance) {
      elAccountBalance.textContent = `${currentBalanceVal >= 0 ? '' : '-'}$${Math.abs(currentBalanceVal).toFixed(2)}`;
      elAccountBalance.className = `account-balance-amount ${currentBalanceVal >= 0 ? 'positive' : 'negative'}`;
    }

    if (elIncome) {
      elIncome.textContent = `+$${periodIncome.toFixed(2)}`;
    }
    if (elExpenses) {
      elExpenses.textContent = `-$${periodExpenses.toFixed(2)}`;
    }
  }

  // Proactive Advisor Engine
  function triggerProactiveAdvice() {
    const proactiveLog = document.getElementById('proactive-log');
    if (!proactiveLog) return;

    clearNode(proactiveLog);

    const items = [];

    // Groceries validation
    const groceryBudget = state.budgets.find(b => b.category === 'Groceries');
    if (groceryBudget) {
      if (groceryBudget.spent > groceryBudget.total) {
        items.push({
          type: 'warning',
          title: 'Grocery Budget Exceeded',
          text: `You are $${(groceryBudget.spent - groceryBudget.total).toFixed(2)} over your Grocery budget. Do you want to adjust your entertainment budget for this month to still meet your overall savings target?`
        });
      } else if (groceryBudget.spent > groceryBudget.total * 0.75) {
        items.push({
          type: 'info',
          title: 'Approaching Grocery Limit',
          text: `You have used ${((groceryBudget.spent / groceryBudget.total) * 100).toFixed(0)}% of your Grocery allocation. Consider buying essentials only to stay under budget.`
        });
      }
    }

    // Entertainment validation
    const funBudget = state.budgets.find(b => b.category === 'Entertainment');
    if (funBudget) {
      const remaining = funBudget.total - funBudget.spent;
      if (remaining > 0) {
        items.push({
          type: 'success',
          title: 'Fun Budget Health Check',
          text: `You can spend $${remaining.toFixed(2)} more before hitting your Fun budget. Keep purchases under this amount to continue meeting your goals.`
        });
      }
    }

    // Housing & Savings validation
    const housingBudget = state.budgets.find(b => b.category === 'Housing');
    if (housingBudget && housingBudget.spent < housingBudget.total) {
      items.push({
        type: 'info',
        title: 'Housing Budget Surplus',
        text: `You are under your housing budget for this month. Would you like to transfer the extra surplus towards paying off your credit card bills or saving for college?`
      });
    }

    // Rewards Card optimizations
    items.push({
      type: 'success',
      title: 'Rewards Optimization Alert',
      text: 'Dining at restaurants? Use your Chase Sapphire card to receive 3x dining points. Grocery shopping? Use your Amex Gold card to earn 4x reward miles!'
    });

    // Render dynamic advisor logs into simulator panel
    if (items.length === 0) {
      proactiveLog.appendChild(el('div', { class: 'empty-log' }, ['No proactive notifications generated yet.']));
    } else {
      items.forEach(item => {
        const logEntry = el('div', { class: `proactive-log-entry ${item.type}` }, [
          el('span', {}, [item.title]),
          item.text
        ]);
        proactiveLog.appendChild(logEntry);
      });
    }
  }

  // System Push Notification Banner Orchestrator
  function pushSystemNotification(title, message) {
    const banner = document.getElementById('push-banner');
    const bannerTitle = document.getElementById('push-title');
    const bannerMsg = document.getElementById('push-message');

    if (!banner || !bannerTitle || !bannerMsg) return;

    bannerTitle.textContent = title;
    bannerMsg.textContent = message;

    banner.classList.add('show');

    // Automatically disappear after 4 seconds
    setTimeout(() => {
      banner.classList.remove('show');
    }, 4500);
  }

  // --- Tab Content Renders ---

  // Helper: Open granular Period Selection window (iOS Money Flow style)
  function openPeriodSelectionModal() {
    let overlay = document.getElementById('period-modal-overlay');
    const screen = document.getElementById('device-screen') || document.body;
    if (!overlay && screen) {
      overlay = el('div', { class: 'period-modal-overlay', id: 'period-modal-overlay' });
      screen.appendChild(overlay);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('show');
        }
      });
    }

    if (!overlay) return;
    clearNode(overlay);

    const card = el('div', { class: 'period-modal-card' }, [
      el('div', { class: 'sheet-drag-bar', style: 'margin:0 auto 12px auto;' })
    ]);
    overlay.appendChild(card);

    // Header with Close
    const closeBtn = el('button', { class: 'sheet-close-btn', type: 'button' }, ['×']);
    closeBtn.addEventListener('click', () => overlay.classList.remove('show'));

    const header = el('div', { class: 'sheet-header', style: 'margin-bottom: 16px;' }, [
      el('h3', { style: 'font-size:16px; font-weight:700;' }, ['Select Time Period']),
      closeBtn
    ]);
    card.appendChild(header);

    // 1. Quick Presets Section
    const presetsTitle = el('div', { class: 'period-section-title' }, ['QUICK PRESETS']);
    const presetsRow = el('div', { class: 'period-presets-grid' }, [
      createPeriodPresetBtn('🌐 All Time', 'all'),
      createPeriodPresetBtn('⚡ Today', 'today'),
      createPeriodPresetBtn('📅 This Month', 'month_current'),
      createPeriodPresetBtn(`📈 YTD (${selectedFilterYear})`, 'ytd'),
      createPeriodPresetBtn('⏱️ Last 30 Days', 'last30')
    ]);
    card.appendChild(presetsTitle);
    card.appendChild(presetsRow);

    function createPeriodPresetBtn(label, modeId) {
      let isActive = false;
      if (modeId === 'all') isActive = currentDateFilterMode === 'all';
      else if (modeId === 'today') isActive = currentDateFilterMode === 'today';
      else if (modeId === 'ytd') isActive = currentDateFilterMode === 'ytd';
      else if (modeId === 'month_current') {
        isActive = (currentDateFilterMode === 'month' && selectedFilterMonth === 4 && selectedFilterYear === 2026);
      } else if (modeId === 'last30') {
        isActive = (currentDateFilterMode === 'custom' && customFilterStartDate === '2026-04-28');
      }

      const btn = el('button', {
        class: `date-range-pill ${isActive ? 'active' : ''}`,
        type: 'button'
      }, [label]);

      btn.addEventListener('click', () => {
        if (modeId === 'month_current') {
          currentDateFilterMode = 'month';
          selectedFilterMonth = 4; // May
          selectedFilterYear = 2026;
        } else if (modeId === 'last30') {
          currentDateFilterMode = 'custom';
          customFilterStartDate = '2026-04-28';
          customFilterEndDate = '2026-05-28';
        } else {
          currentDateFilterMode = modeId;
        }
        overlay.classList.remove('show');
        calculateStats();
        initApp();
      });
      return btn;
    }

    // 2. By Month Section
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let modalYear = selectedFilterYear || 2026;

    const monthSecTitle = el('div', { class: 'period-section-title' }, ['BY SPECIFIC MONTH']);
    card.appendChild(monthSecTitle);

    const yearTitle = el('span', { class: 'year-nav-title' }, [`${modalYear}`]);
    const btnPrevYear = el('button', { class: 'year-nav-btn', type: 'button' }, ['‹ Prev']);
    const btnNextYear = el('button', { class: 'year-nav-btn', type: 'button' }, ['Next ›']);

    function updateMonthsGrid() {
      yearTitle.textContent = `${modalYear}`;
      monthsGrid.querySelectorAll('.month-pill').forEach((mPill, idx) => {
        const isCurrentActive = (currentDateFilterMode === 'month' && selectedFilterYear === modalYear && selectedFilterMonth === idx);
        if (isCurrentActive) mPill.classList.add('active');
        else mPill.classList.remove('active');
      });
    }

    btnPrevYear.addEventListener('click', () => {
      modalYear--;
      updateMonthsGrid();
    });
    btnNextYear.addEventListener('click', () => {
      modalYear++;
      updateMonthsGrid();
    });

    const yearRow = el('div', { class: 'year-nav-row' }, [
      btnPrevYear,
      yearTitle,
      btnNextYear
    ]);
    card.appendChild(yearRow);

    const monthsGrid = el('div', { class: 'months-selector-grid' },
      monthNames.map((mName, idx) => {
        const isCurrentActive = (currentDateFilterMode === 'month' && selectedFilterYear === modalYear && selectedFilterMonth === idx);
        const mPill = el('button', {
          class: `month-pill ${isCurrentActive ? 'active' : ''}`,
          type: 'button'
        }, [mName]);
        mPill.addEventListener('click', () => {
          selectedFilterYear = modalYear;
          selectedFilterMonth = idx;
          currentDateFilterMode = 'month';
          overlay.classList.remove('show');
          calculateStats();
          initApp();
        });
        return mPill;
      })
    );
    card.appendChild(monthsGrid);

    // 3. By Year Section
    const yearSecTitle = el('div', { class: 'period-section-title' }, ['BY FULL YEAR']);
    card.appendChild(yearSecTitle);

    const yearsList = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
    const yearsRow = el('div', { class: 'years-selector-grid' },
      yearsList.map(yr => {
        const isActive = (currentDateFilterMode === 'year' && selectedFilterYear === yr);
        const yBtn = el('button', {
          class: `year-pill ${isActive ? 'active' : ''}`,
          type: 'button'
        }, [`${yr}`]);
        yBtn.addEventListener('click', () => {
          selectedFilterYear = yr;
          currentDateFilterMode = 'year';
          overlay.classList.remove('show');
          calculateStats();
          initApp();
        });
        return yBtn;
      })
    );
    card.appendChild(yearsRow);

    // 4. Custom Date Range Section
    const customSecTitle = el('div', { class: 'period-section-title' }, ['CUSTOM DATE RANGE']);
    card.appendChild(customSecTitle);

    const inputStart = el('input', { type: 'date', value: customFilterStartDate || '2026-05-01' });
    const inputEnd = el('input', { type: 'date', value: customFilterEndDate || '2026-05-31' });

    const rowStart = el('div', { class: 'custom-date-row' }, [
      el('label', {}, ['Start:']),
      inputStart
    ]);
    const rowEnd = el('div', { class: 'custom-date-row' }, [
      el('label', {}, ['End:']),
      inputEnd
    ]);

    const applyBtn = el('button', {
      class: 'form-btn submit',
      type: 'button',
      style: 'margin-top:10px; padding:12px; font-size:14px; font-weight:700; width:100%; border-radius:10px;'
    }, ['Apply Custom Range']);

    applyBtn.addEventListener('click', () => {
      if (inputStart.value) customFilterStartDate = inputStart.value;
      if (inputEnd.value) customFilterEndDate = inputEnd.value;
      currentDateFilterMode = 'custom';
      overlay.classList.remove('show');
      calculateStats();
      initApp();
    });

    const customContainer = el('div', { class: 'custom-date-container' }, [
      rowStart,
      rowEnd,
      applyBtn
    ]);
    card.appendChild(customContainer);

    // Show modal
    overlay.classList.add('show');
  }

  // Helper: Render Period Bar in App Header directly above Net Cash Flow
  function renderHeaderPeriodBar() {
    const container = document.getElementById('header-period-bar-container');
    if (!container) return;
    clearNode(container);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const periodBar = el('div', { class: 'moneyflow-period-bar' });

    // "Period >" dropdown trigger
    let periodDropdownLabel = 'Period';
    if (currentDateFilterMode === 'month') {
      periodDropdownLabel = `${monthNames[selectedFilterMonth]} ${selectedFilterYear}`;
    } else if (currentDateFilterMode === 'today') {
      periodDropdownLabel = 'Today';
    } else if (currentDateFilterMode === 'year') {
      periodDropdownLabel = `${selectedFilterYear}`;
    } else if (currentDateFilterMode === 'custom') {
      periodDropdownLabel = 'Custom Range';
    } else if (currentDateFilterMode === 'ytd') {
      periodDropdownLabel = `YTD ${selectedFilterYear}`;
    } else if (currentDateFilterMode === 'all') {
      periodDropdownLabel = 'All Time';
    }

    const periodBtn = el('button', {
      class: 'mf-period-dropdown-btn',
      type: 'button',
      title: 'Choose specific period, month, or custom range'
    }, [
      el('span', { style: 'font-size: 15px;' }, ['🗓️']),
      el('span', {}, [periodDropdownLabel]),
      el('span', { class: 'mf-period-chevron' }, ['▾'])
    ]);
    periodBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPeriodSelectionModal();
    });
    periodBar.appendChild(periodBtn);

    // Quick Period Tabs (All Time, This Month, 2026, 2025, Custom...)
    const quickTabs = [
      { id: 'all', label: 'All Time', action: () => { currentDateFilterMode = 'all'; calculateStats(); initApp(); }, isActive: () => currentDateFilterMode === 'all' },
      { id: 'month', label: `${monthNames[selectedFilterMonth]} ${selectedFilterYear}`, action: () => { currentDateFilterMode = 'month'; calculateStats(); initApp(); }, isActive: () => currentDateFilterMode === 'month' },
      { id: 'year-2026', label: '2026', action: () => { currentDateFilterMode = 'year'; selectedFilterYear = 2026; calculateStats(); initApp(); }, isActive: () => currentDateFilterMode === 'year' && selectedFilterYear === 2026 },
      { id: 'year-2025', label: '2025', action: () => { currentDateFilterMode = 'year'; selectedFilterYear = 2025; calculateStats(); initApp(); }, isActive: () => currentDateFilterMode === 'year' && selectedFilterYear === 2025 },
      { id: 'custom', label: 'Custom ⚙️', action: () => { openPeriodSelectionModal(); }, isActive: () => currentDateFilterMode === 'custom' }
    ];

    quickTabs.forEach(tab => {
      const active = tab.isActive();
      const tabBtn = el('button', {
        class: `mf-period-tab ${active ? 'active' : ''}`,
        type: 'button'
      }, [tab.label]);
      tabBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tab.action();
      });
      periodBar.appendChild(tabBtn);
    });

    container.appendChild(periodBar);
  }

  // Helper: Construct Net Cash Flow summary card for scrollable feed
  function buildMainBalanceCard() {
    return el('div', { class: 'balance-card', id: 'main-balance-card' }, [
      el('div', { class: 'balance-row main-balance' }, [
        el('div', { class: 'balance-col' }, [
          el('span', { class: 'balance-label', id: 'summary-primary-label' }, ['NET CASH FLOW']),
          el('h2', { class: 'balance-amount', id: 'summary-net-flow' }, ['$0.00'])
        ]),
        el('div', { class: 'balance-col account-total-col', id: 'summary-balance-col', title: 'Current Balance' }, [
          el('span', { class: 'balance-label', id: 'summary-balance-label' }, ['CURRENT BALANCE']),
          el('div', { class: 'account-balance-amount', id: 'summary-account-balance' }, ['$0.00'])
        ])
      ]),
      el('div', { class: 'summary-stats' }, [
        el('div', { class: 'stat-item income' }, [
          el('span', { class: 'stat-icon' }, ['↗']),
          el('div', { class: 'stat-details' }, [
            el('span', { class: 'stat-label' }, ['INCOME']),
            el('span', { class: 'stat-value', id: 'summary-income' }, ['+$0.00'])
          ])
        ]),
        el('div', { class: 'stat-item expense' }, [
          el('span', { class: 'stat-icon' }, ['↘']),
          el('div', { class: 'stat-details' }, [
            el('span', { class: 'stat-label' }, ['EXPENSES']),
            el('span', { class: 'stat-value', id: 'summary-expenses' }, ['-$0.00'])
          ])
        ])
      ])
    ]);
  }

  function updateDateRangeSummary() {
    calculateStats();
  }

  // 1. Transactions Feed & Ledger Screen
  function renderDashboardTab(container) {
    clearNode(container);

    // Render Period Bar above Net Cash Flow in header
    renderHeaderPeriodBar();

    // Net Cash Flow card (at the top of scrollable screen content so you can scroll past it)
    const balanceCard = buildMainBalanceCard();
    container.appendChild(balanceCard);
    calculateStats();

    // Transactions Section Subheading
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let periodSubheadingText = 'For the Period';
    if (currentDateFilterMode === 'all') periodSubheadingText = 'Complete History';
    else if (currentDateFilterMode === 'month') periodSubheadingText = `${monthNames[selectedFilterMonth]} ${selectedFilterYear}`;
    else if (currentDateFilterMode === 'year') periodSubheadingText = `${selectedFilterYear}`;
    else if (currentDateFilterMode === 'today') periodSubheadingText = 'Today';
    else if (currentDateFilterMode === 'custom') periodSubheadingText = 'Custom Range';

    const subheading = el('div', { class: 'mf-transactions-subheading' }, [
      el('span', { class: 'mf-subheading-title' }, ['Transactions']),
      el('span', { class: 'mf-subheading-badge' }, [`📌 ${periodSubheadingText}`])
    ]);
    container.appendChild(subheading);

    // Dynamic Search panel
    const searchInput = el('input', {
      type: 'text',
      placeholder: 'Search merchant, category or notes...',
      value: currentSearchQuery
    });
    
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      refreshTransactionFeed();
    });

    const searchContainer = el('div', { class: 'search-box' }, [
      el('span', { class: 'search-icon' }, ['🔍']),
      searchInput
    ]);
    container.appendChild(searchContainer);

    // Scrollable categories filter scroller
    const allKnownCategories = getAllCategories();
    const categoriesList = ['All', ...allKnownCategories.slice(0, 10)];
    const categoryPills = categoriesList.map(cat => {
      const pill = el('span', {
        class: `category-pill ${currentCategoryFilter === cat ? 'active' : ''}`
      }, [cat === 'All' ? 'All' : `${getCategoryIcon(cat)} ${cat}`]);
      
      pill.addEventListener('click', () => {
        currentCategoryFilter = cat;
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        refreshTransactionFeed();
      });
      return pill;
    });

    const scroller = el('div', { class: 'category-scroller' }, categoryPills);
    container.appendChild(scroller);

    // Prominent "Add New Transaction" Button (Takes user to dedicated separate page)
    const addTxBtn = el('button', {
      class: 'create-transaction-btn',
      type: 'button',
      title: 'Create a new transaction record'
    }, [
      el('span', { class: 'create-tx-icon' }, ['➕']),
      el('span', {}, ['Add New Transaction'])
    ]);
    addTxBtn.addEventListener('click', () => {
      navigateToTransactionForm(null);
    });
    container.appendChild(addTxBtn);


    // Transaction Feed Container
    const feedContainer = el('div', { class: 'transactions-list', id: 'feed-list-wrapper' });
    container.appendChild(feedContainer);
    
    refreshTransactionFeed();
  }

  // Render dynamic matching ledger transactions grouped by date (Money Flow style)
  function refreshTransactionFeed() {
    const feedWrapper = document.getElementById('feed-list-wrapper');
    if (!feedWrapper) return;

    clearNode(feedWrapper);
    updateDateRangeSummary();

    const query = currentSearchQuery.toLowerCase().trim();
    const scopedTransactions = getTransactionsForScope(currentAccountScope);

    const filtered = scopedTransactions.filter(tx => {
      // 1. Date Range filtering
      if (!isTxInSelectedDateRange(tx)) {
        return false;
      }
      // 2. Category filtering
      if (currentCategoryFilter !== 'All' && tx.category !== currentCategoryFilter) {
        return false;
      }
      // 3. Query matching
      if (query) {
        const matchMerchant = (tx.merchant || '').toLowerCase().includes(query);
        const matchCategory = (tx.category || '').toLowerCase().includes(query);
        const matchTag = (tx.tag || '').toLowerCase().includes(query);
        const matchNotes = (tx.notes || '').toLowerCase().includes(query);
        return matchMerchant || matchCategory || matchTag || matchNotes;
      }
      return true;
    });

    if (filtered.length === 0) {
      feedWrapper.appendChild(el('div', { class: 'empty-log' }, ['No transactions found for this date range.']));
      return;
    }

    // Group transactions by calendar day (YYYY-MM-DD)
    const groupsByDate = {};
    filtered.forEach(tx => {
      const dateKey = (tx.timestamp || '').slice(0, 10) || 'Unknown Date';
      if (!groupsByDate[dateKey]) {
        groupsByDate[dateKey] = [];
      }
      groupsByDate[dateKey].push(tx);
    });

    // Sort date keys descending (newest date first)
    const sortedDateKeys = Object.keys(groupsByDate).sort((a, b) => b.localeCompare(a));

    const realTodayStr = new Date().toISOString().slice(0, 10);
    const mockTodayStr = '2026-05-28';
    const realYesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const mockYesterdayStr = '2026-05-27';

    sortedDateKeys.forEach(dateKey => {
      const txList = groupsByDate[dateKey];

      // Sort transactions in day group descending by timestamp
      txList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Calculate net flow for the day
      let dayNet = 0;
      txList.forEach(tx => {
        const net = getTxNetAmount(tx);
        if (tx.type === 'income') dayNet += net;
        else dayNet -= net;
      });

      // Day Title (Money Flow format)
      const isToday = (dateKey === realTodayStr || dateKey === mockTodayStr);
      const isYesterday = (dateKey === realYesterdayStr || dateKey === mockYesterdayStr);

      const dObj = new Date(dateKey + 'T12:00:00');
      const formattedDate = !isNaN(dObj.getTime())
        ? dObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : dateKey;

      let titleStr = '';
      if (isToday) {
        titleStr = `Today • ${formattedDate}`;
      } else if (isYesterday) {
        titleStr = `Yesterday • ${formattedDate}`;
      } else {
        titleStr = formattedDate;
      }

      const groupContainer = el('div', { class: 'tx-date-group' });

      // Subtotal badge
      const subtotalText = dayNet >= 0 ? `+$${dayNet.toFixed(2)}` : `-$${Math.abs(dayNet).toFixed(2)}`;
      const subtotalClass = dayNet >= 0 ? 'tx-date-subtotal positive' : 'tx-date-subtotal negative';

      const dateHeader = el('div', { class: 'tx-date-header' }, [
        el('span', { class: `tx-date-title ${isToday ? 'is-today' : ''}` }, [titleStr]),
        el('span', { class: subtotalClass }, [subtotalText])
      ]);
      groupContainer.appendChild(dateHeader);

      const itemsContainer = el('div', { class: 'tx-date-items' });

      txList.forEach(tx => {
        const avatar = tx.icon || getCategoryIcon(tx.category);

        const merchantSpan = el('span', { class: 'transaction-merchant' }, highlightText(tx.merchant, query));
        if (tx.receipt) {
          merchantSpan.appendChild(el('span', { class: 'receipt-camera-icon', title: 'Receipt Photo Attached' }, ['📸']));
        }

        // Evaluate refund status
        const refundsList = tx.refunds || [];
        const totalRefunded = refundsList.reduce((sum, r) => sum + r.amount, 0);
        if (totalRefunded > 0) {
          const isFullyRefunded = totalRefunded >= tx.amount;
          const badgeText = isFullyRefunded ? 'Fully Refunded' : `Refunded -$${totalRefunded.toFixed(2)}`;
          const badgeClass = isFullyRefunded ? 'refund-badge' : 'refund-badge partial';
          merchantSpan.appendChild(el('span', { class: badgeClass }, [badgeText]));
        }

        const netAmount = getTxNetAmount(tx);
        const acc = tx.accountId ? getAccountById(tx.accountId) : null;

        const txTime = new Date(tx.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });

        // Category badge next to time with custom color
        const catName = tx.category || 'General';
        const catColor = getCategoryColor(catName);
        const catBadge = el('span', {
          class: 'transaction-category-badge',
          style: `background: ${hexToRgba(catColor, 0.15)}; color: ${catColor}; border: 1px solid ${hexToRgba(catColor, 0.35)};`
        }, [catName]);

        const recurringBadge = tx.isRecurring ? el('span', {
          class: 'recurring-indicator-badge',
          title: `Recurring (${tx.recurringFrequency || 'monthly'})`
        }, ['🔁']) : null;

        const metaRow = el('div', { class: 'transaction-meta' }, [
          el('span', {}, [txTime]),
          catBadge,
          recurringBadge
        ].filter(Boolean));

        // Location on a separate line with pin drop icon and plain grey text
        const locationEl = tx.location ? el('div', { class: 'transaction-location-row' }, [
          el('span', { class: 'location-pin-icon' }, ['📍']),
          el('span', { class: 'location-text' }, [tx.location])
        ]) : null;

        const notesEl = tx.notes ? el('div', { class: 'transaction-notes' }, [tx.notes]) : null;

        // Tags at the bottom of each transaction under the description
        const rawTags = (tx.tag || '').split(',').map(t => t.trim()).filter(Boolean);
        const tagElements = rawTags.map(t => {
          const tColor = getTagColor(t, tx);
          return el('span', {
            class: 'transaction-bottom-tag',
            style: `background: ${hexToRgba(tColor, 0.12)}; color: ${tColor}; border: 1px solid ${hexToRgba(tColor, 0.3)};`
          }, [`#${t}`]);
        });

        // Bottom row with tags on the left and shrunk synced indicator on the right
        let bottomRow = null;
        if (tagElements.length > 0 || tx.verified) {
          const tagsListWrapper = el('div', { class: 'transaction-tags-list' }, tagElements);
          const syncedBadge = tx.verified ? el('span', { class: 'transaction-verified-badge', title: 'Bank Ledger Verified' }, ['✔ synced']) : null;
          bottomRow = el('div', { class: 'transaction-tags-bottom-row' }, [
            tagsListWrapper,
            syncedBadge
          ]);
        }

        const detailsChildren = [
          el('div', { class: 'transaction-row-1' }, [
            merchantSpan,
            el('span', { class: `transaction-amount ${tx.type === 'income' ? 'positive' : 'negative'}` }, [
              `${tx.type === 'income' ? '+' : '-'}$${netAmount.toFixed(2)}`
            ])
          ]),
          metaRow,
          locationEl,
          notesEl,
          bottomRow
        ].filter(Boolean);

        const detailsCol = el('div', { class: 'transaction-details' }, detailsChildren);

        const txItem = el('div', { class: 'transaction-item', style: 'cursor:pointer;' }, [
          el('div', { class: 'transaction-category-avatar' }, [avatar]),
          detailsCol
        ]);

        // Bind transaction details / edit page trigger
        txItem.addEventListener('click', () => {
          navigateToTransactionForm(tx.id);
        });

        itemsContainer.appendChild(txItem);
      });

      groupContainer.appendChild(itemsContainer);
      feedWrapper.appendChild(groupContainer);
    });
  }

  // Helper: Check if state currently includes demo accounts/data
  function hasDemoData() {
    return (state.accounts || []).some(a => (a.groups || []).includes('Demo & Test') || (a.group || '').includes('Demo & Test'));
  }

  // Clear all demo data so user has a 100% clean production build
  function clearDemoData() {
    const demoAccIds = new Set(
      (state.accounts || [])
        .filter(a => (a.groups || []).includes('Demo & Test') || (a.group || '').includes('Demo & Test'))
        .map(a => a.id)
    );

    state.accounts = (state.accounts || []).filter(a => !demoAccIds.has(a.id));
    if (state.accounts.length === 0) {
      state.accounts = [{
        id: 'acc-primary',
        name: 'Primary Checking',
        institution: 'Personal Cash',
        type: 'checking',
        maskedNumber: '•••• 1001',
        balance: 0.00,
        groups: ['Primary Accounts', 'Checking'],
        group: 'Primary Accounts, Checking',
        icon: '💵'
      }];
    }

    state.transactions = (state.transactions || []).filter(tx => !demoAccIds.has(tx.accountId));
    currentAccountScope = 'all';
    saveState();
    initApp();
    pushSystemNotification('Clean Build Activated', 'All demo and test data has been removed. You now have a clean slate to add your personal accounts and transactions.');
  }

  // Restore sample demo data
  function restoreDemoData() {
    const defaultData = JSON.parse(JSON.stringify(DEMO_DATA));
    state.accounts = defaultData.accounts;
    state.transactions = defaultData.transactions;
    state.creditCards = defaultData.creditCards || [];
    state.budgets = defaultData.budgets || [];
    currentAccountScope = 'all';
    saveState();
    initApp();
    pushSystemNotification('Demo Data Loaded', 'Sample testing accounts and mock transactions have been restored under the "Demo & Test" group.');
  }

  // --- Accounts Tab (Money Flow style grouping & aggregate totals) ---
  function renderAccountsTab(container) {
    clearNode(container);

    // Header buttons
    const btnAddAccount = el('button', {
      class: 'account-action-pill-btn',
      style: 'padding: 6px 12px; font-size:11px;',
      type: 'button'
    }, [isAddAccountFormVisible ? '✕ Cancel' : '➕ Add Account']);
    btnAddAccount.addEventListener('click', () => {
      isAddAccountFormVisible = !isAddAccountFormVisible;
      renderAccountsTab(container);
    });

    const isDemoActive = hasDemoData();
    const btnDemoToggle = el('button', {
      class: 'account-action-pill-btn',
      style: isDemoActive 
        ? 'padding: 6px 12px; font-size:11px; background: rgba(239, 68, 68, 0.15); color: #f87171; border-color: rgba(239, 68, 68, 0.3);' 
        : 'padding: 6px 12px; font-size:11px; background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.3);',
      type: 'button',
      title: isDemoActive ? 'Clear Demo data for a clean build' : 'Load Demo data for testing'
    }, [isDemoActive ? '🧹 Clear Demo Data (Clean Slate)' : '🧪 Load Demo Data']);

    btnDemoToggle.addEventListener('click', () => {
      if (isDemoActive) {
        clearDemoData();
      } else {
        restoreDemoData();
      }
    });

    const header = el('div', { class: 'dashboard-header', style: 'display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;' }, [
      el('h3', {}, ['Accounts & Groups']),
      el('div', { style: 'display:flex; gap:6px; flex-wrap:wrap;' }, [btnAddAccount, btnDemoToggle])
    ]);

    container.appendChild(header);

    // Summary banner
    container.appendChild(el('p', { class: 'reports-summary-text' }, [
      'View aggregate totals across all accounts, organized into custom groups. Scroll down to browse all accounts and each individual account group.'
    ]));

    // Add Account Form if active
    if (isAddAccountFormVisible) {
      const existingGroups = getAllGroups();

      const inputName = el('input', { type: 'text', placeholder: 'e.g. High Yield Savings' });
      const inputBalance = el('input', { type: 'number', step: '0.01', placeholder: '0.00' });
      const inputAccNum = el('input', { type: 'text', placeholder: 'Last 4 digits (e.g. 5678)' });
      
      const selectType = el('select', {}, [
        el('option', { value: 'checking' }, ['Checking']),
        el('option', { value: 'savings' }, ['Savings']),
        el('option', { value: 'credit' }, ['Credit Card']),
        el('option', { value: 'investment' }, ['Investment'])
      ]);

      const inputGroups = el('input', {
        type: 'text',
        placeholder: 'e.g. Savings, Emergency Fund (comma-separated)',
        value: 'Checking'
      });

      // Quick tap pills for existing groups
      const groupPillsContainer = el('div', {
        style: 'display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;'
      });
      existingGroups.forEach(grp => {
        const pill = el('span', {
          class: 'account-group-micro-pill',
          style: 'cursor:pointer; padding:2px 7px;'
        }, [`+ ${grp}`]);
        pill.addEventListener('click', () => {
          const currentParts = inputGroups.value.split(',').map(s => s.trim()).filter(Boolean);
          if (!currentParts.includes(grp)) {
            currentParts.push(grp);
            inputGroups.value = currentParts.join(', ');
          }
        });
        groupPillsContainer.appendChild(pill);
      });

      const addCard = el('div', { class: 'manual-form-card', style: 'margin-bottom:16px;' }, [
        el('h4', {}, ['Add Bank or Card Account']),
        el('div', { class: 'form-grid' }, [
          el('div', { class: 'form-group' }, [
            el('label', {}, ['Account Name']),
            inputName
          ]),
          el('div', { class: 'form-group' }, [
            el('label', {}, ['Initial Balance ($)']),
            inputBalance
          ]),
          el('div', { class: 'form-group' }, [
            el('label', {}, ['Account Type']),
            selectType
          ]),
          el('div', { class: 'form-group' }, [
            el('label', {}, ['Account Number']),
            inputAccNum
          ]),
          el('div', { class: 'form-group full' }, [
            el('label', {}, ['Group Name(s) — An account can be in multiple groups']),
            inputGroups,
            groupPillsContainer
          ]),
          el('div', { class: 'form-actions' }, [
            el('button', { class: 'form-btn cancel', type: 'button' }, ['Cancel']),
            el('button', { class: 'form-btn submit', type: 'button' }, ['Save Account'])
          ])
        ])
      ]);

      addCard.querySelector('.cancel').addEventListener('click', () => {
        isAddAccountFormVisible = false;
        renderAccountsTab(container);
      });

      addCard.querySelector('.submit').addEventListener('click', () => {
        const name = inputName.value.trim();
        const bal = parseFloat(inputBalance.value);
        const type = selectType.value;
        const num = inputAccNum.value.trim() || '0000';
        const rawGroups = inputGroups.value.split(',').map(s => s.trim()).filter(Boolean);
        const groups = rawGroups.length > 0 ? rawGroups : (type === 'credit' ? ['Credit Cards'] : ['Checking']);

        if (!name || isNaN(bal)) {
          pushSystemNotification('Input Error', 'Please provide a valid account name and balance.');
          return;
        }

        const newAccount = {
          id: 'acc-' + Date.now(),
          name: name,
          type: type,
          groups: groups,
          group: groups.join(', '),
          balance: bal,
          accountNumber: num
        };

        state.accounts.push(newAccount);
        saveState();
        calculateStats();
        isAddAccountFormVisible = false;
        pushSystemNotification('Account Added', `Added ${name} to [${groups.join(', ')}].`);
        renderAccountsTab(container);
      });

      container.appendChild(addCard);
    }

    // Scrollable accounts container
    const scrollContainer = el('div', { class: 'accounts-scroll-view' });

    // =========================================================================
    // 1. ALL ACCOUNTS SECTION (At the very top of the scroll)
    // =========================================================================
    const allTotals = getAllAccountsAggregateTotals();
    const allAccountsSection = el('div', { class: 'account-group-section all-accounts-section' });

    const allHeaderRow = el('div', { class: 'group-section-header' }, [
      el('div', { class: 'group-title-col' }, [
        el('div', { class: 'group-title-row' }, [
          el('span', { style: 'font-size:15px;' }, ['🌐']),
          el('span', { class: 'group-name' }, ['All Accounts']),
          el('span', { class: 'group-count-badge' }, [`${allTotals.accounts.length} ${allTotals.accounts.length === 1 ? 'account' : 'accounts'}`])
        ])
      ]),
      el('div', {
        class: `group-aggregate-total ${allTotals.netTotal < 0 ? 'credit-type' : ''}`
      }, [`$${allTotals.netTotal.toFixed(2)}`])
    ]);

    const allStatsStrip = el('div', { class: 'group-stats-strip' }, [
      el('span', {}, [`Assets: +$${allTotals.totalAssets.toFixed(2)}`]),
      el('span', {}, [`Debts: -$${allTotals.totalDebts.toFixed(2)}`]),
      el('span', {}, [`Net Flow: ${allTotals.netFlow >= 0 ? '+' : '-'}$${Math.abs(allTotals.netFlow).toFixed(2)}`])
    ]);

    const allAccountsList = el('div', { class: 'group-accounts-list' });

    allTotals.accounts.forEach(acc => {
      let iconEmoji = '🏛️';
      if (acc.type === 'savings') iconEmoji = '💰';
      if (acc.type === 'credit') iconEmoji = '💳';
      if (acc.type === 'investment') iconEmoji = '📈';

      const grpBadges = getAccountGroups(acc).map(g => el('span', { class: 'account-group-micro-pill' }, [g]));

      const row = el('div', { class: 'account-row-item' }, [
        el('div', { class: 'account-info-left' }, [
          el('div', { class: 'account-icon-badge' }, [iconEmoji]),
          el('div', { class: 'account-names' }, [
            el('span', { class: 'account-name-text' }, [acc.name]),
            el('span', { class: 'account-sub-text' }, [`${maskAccountNumber(acc.accountNumber)} • ${acc.type.toUpperCase()}`]),
            el('div', { class: 'account-groups-pills' }, grpBadges)
          ])
        ]),
        el('div', { class: 'account-balance-right' }, [
          el('span', { class: `account-bal-val ${acc.type === 'credit' ? 'card-limit-exceeded' : ''}` }, [`$${acc.balance.toFixed(2)}`]),
          el('button', {
            class: 'account-action-pill-btn',
            type: 'button'
          }, ['View Ledger'])
        ])
      ]);

      row.querySelector('.account-action-pill-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        currentAccountScope = 'account:' + acc.id;
        calculateStats();
        currentActiveTab = 'dashboard';
        initApp();
      });

      allAccountsList.appendChild(row);
    });

    const allFooterActions = el('div', { class: 'group-actions-footer' }, [
      el('button', { class: 'group-footer-btn', type: 'button' }, ['👁️ View All Transactions Ledger'])
    ]);

    allFooterActions.querySelector('.group-footer-btn').addEventListener('click', () => {
      currentAccountScope = 'all';
      calculateStats();
      currentActiveTab = 'dashboard';
      initApp();
    });

    allAccountsSection.appendChild(allHeaderRow);
    allAccountsSection.appendChild(allStatsStrip);
    allAccountsSection.appendChild(allAccountsList);
    allAccountsSection.appendChild(allFooterActions);
    scrollContainer.appendChild(allAccountsSection);

    // =========================================================================
    // 2. ACCOUNT GROUPS SECTIONS (First group, second group, etc.)
    // =========================================================================
    const groups = getAllGroups();

    groups.forEach(groupName => {
      const groupTotals = getGroupAggregateTotals(groupName);
      const isCredit = groupTotals.allCredit;

      const section = el('div', { class: 'account-group-section' });

      // Group Header row
      const headerRow = el('div', { class: 'group-section-header' }, [
        el('div', { class: 'group-title-col' }, [
          el('div', { class: 'group-title-row' }, [
            el('span', { class: 'group-name' }, [groupName]),
            el('span', { class: 'group-count-badge' }, [`${groupTotals.accounts.length} ${groupTotals.accounts.length === 1 ? 'account' : 'accounts'}`])
          ])
        ]),
        el('div', {
          class: `group-aggregate-total ${isCredit ? 'credit-type' : ''}`
        }, [`$${groupTotals.totalBalance.toFixed(2)}`])
      ]);

      // Aggregate Stats Strip
      const statsStrip = el('div', { class: 'group-stats-strip' }, [
        el('span', {}, [`Net: ${groupTotals.netFlow >= 0 ? '+' : '-'}$${Math.abs(groupTotals.netFlow).toFixed(2)}`]),
        el('span', {}, [`In: +$${groupTotals.income.toFixed(2)}`]),
        el('span', {}, [`Spent: -$${groupTotals.expenses.toFixed(2)}`])
      ]);

      // Group Accounts List
      // If an account is part of multiple groups, it is displayed here under each group it belongs to!
      const accountsList = el('div', { class: 'group-accounts-list' });

      groupTotals.accounts.forEach(acc => {
        let iconEmoji = '🏛️';
        if (acc.type === 'savings') iconEmoji = '💰';
        if (acc.type === 'credit') iconEmoji = '💳';
        if (acc.type === 'investment') iconEmoji = '📈';

        const row = el('div', { class: 'account-row-item' }, [
          el('div', { class: 'account-info-left' }, [
            el('div', { class: 'account-icon-badge' }, [iconEmoji]),
            el('div', { class: 'account-names' }, [
              el('span', { class: 'account-name-text' }, [acc.name]),
              el('span', { class: 'account-sub-text' }, [`${maskAccountNumber(acc.accountNumber)} • ${acc.type.toUpperCase()}`])
            ])
          ]),
          el('div', { class: 'account-balance-right' }, [
            el('span', { class: `account-bal-val ${acc.type === 'credit' ? 'card-limit-exceeded' : ''}` }, [`$${acc.balance.toFixed(2)}`]),
            el('button', {
              class: 'account-action-pill-btn',
              type: 'button'
            }, ['View Ledger'])
          ])
        ]);

        row.querySelector('.account-action-pill-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          currentAccountScope = 'account:' + acc.id;
          calculateStats();
          currentActiveTab = 'dashboard';
          initApp();
        });

        accountsList.appendChild(row);
      });

      // Inline rename UI container
      const renameRow = el('div', {
        class: 'group-rename-row',
        style: 'display:none; padding:8px 0; gap:6px; align-items:center;'
      });
      const inputRename = el('input', {
        type: 'text',
        value: groupName,
        style: 'flex:1; padding:6px 8px; font-size:11px; border-radius:6px; border:1px solid rgba(255,255,255,0.15); background:#161922; color:#fff;'
      });
      const btnSaveRename = el('button', {
        class: 'form-btn submit',
        style: 'padding:4px 10px; font-size:10.5px;',
        type: 'button'
      }, ['Save']);
      const btnCancelRename = el('button', {
        class: 'form-btn cancel',
        style: 'padding:4px 8px; font-size:10.5px;',
        type: 'button'
      }, ['Cancel']);

      renameRow.appendChild(inputRename);
      renameRow.appendChild(btnSaveRename);
      renameRow.appendChild(btnCancelRename);

      btnSaveRename.addEventListener('click', () => {
        const updatedName = inputRename.value.trim();
        if (updatedName && updatedName !== groupName) {
          state.accounts.forEach(a => {
            const currentGrps = getAccountGroups(a);
            if (currentGrps.includes(groupName)) {
              const updatedGrps = currentGrps.map(g => g === groupName ? updatedName : g);
              a.groups = updatedGrps;
              a.group = updatedGrps.join(', ');
            }
          });
          if (currentAccountScope === 'group:' + groupName) {
            currentAccountScope = 'group:' + updatedName;
          }
          saveState();
          calculateStats();
          pushSystemNotification('Group Renamed', `Renamed group "${groupName}" to "${updatedName}".`);
          renderAccountsTab(container);
        } else {
          renameRow.style.display = 'none';
        }
      });

      btnCancelRename.addEventListener('click', () => {
        renameRow.style.display = 'none';
      });

      // Group footer actions
      const footerActions = el('div', { class: 'group-actions-footer' }, [
        el('button', { class: 'group-footer-btn', type: 'button' }, [`👁️ View All ${groupName} Activity`]),
        el('button', { class: 'group-footer-btn rename-btn', type: 'button' }, ['✏️ Rename Group'])
      ]);

      footerActions.querySelectorAll('.group-footer-btn')[0].addEventListener('click', () => {
        currentAccountScope = 'group:' + groupName;
        calculateStats();
        currentActiveTab = 'dashboard';
        initApp();
      });

      footerActions.querySelector('.rename-btn').addEventListener('click', () => {
        renameRow.style.display = (renameRow.style.display === 'none') ? 'flex' : 'none';
      });

      section.appendChild(headerRow);
      section.appendChild(statsStrip);
      section.appendChild(accountsList);
      section.appendChild(renameRow);
      section.appendChild(footerActions);

      scrollContainer.appendChild(section);
    });

    container.appendChild(scrollContainer);
  }

  // Regex helper for highlighting search results securely
  function highlightText(text, query) {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query);
    if (index === -1) return text;

    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);

    const container = document.createDocumentFragment();
    if (before) container.appendChild(document.createTextNode(before));
    
    const span = el('span', { class: 'search-match-highlight' }, [match]);
    container.appendChild(span);
    
    if (after) container.appendChild(document.createTextNode(after));
    
    return container;
  }

  // Modal controller to create or edit a budget tracker and define mapped categories
  function showBudgetTrackerModal(budgetId) {
    let overlay = document.getElementById('budget-modal-overlay');
    if (overlay) overlay.remove();

    const screen = document.getElementById('device-screen');
    overlay = el('div', { class: 'account-switcher-overlay show', id: 'budget-modal-overlay' });

    const isEditing = Boolean(budgetId);
    const targetBudget = isEditing ? state.budgets.find(b => b.id === budgetId) : null;

    let selectedIcon = targetBudget ? getBudgetIcon(targetBudget) : '📊';
    let selectedCats = targetBudget ? [...getBudgetCategories(targetBudget)] : ['Groceries'];

    const card = el('div', { class: 'account-switcher-card', style: 'max-height:85vh; overflow-y:auto;' });

    // Header
    const title = el('h4', { style: 'margin-bottom:4px; font-size:14px;' }, [
      isEditing ? `Edit: ${getBudgetName(targetBudget)}` : 'Define New Budget Tracker'
    ]);
    const desc = el('p', { class: 'reports-summary-text', style: 'margin-bottom:12px;' }, [
      'Define the tracker name, monthly budget target, and choose which categories count towards this tracker (e.g. all education expenses towards Education, all clothes expenses towards Shopping).'
    ]);

    // Name Input
    const nameInput = el('input', {
      type: 'text',
      placeholder: 'Tracker Name (e.g. Education Tracker, Shopping & Clothes)',
      value: targetBudget ? getBudgetName(targetBudget) : ''
    });

    // Total Target Input
    const totalInput = el('input', {
      type: 'number',
      placeholder: 'Monthly Limit ($) e.g. 300.00',
      step: '10',
      value: targetBudget ? targetBudget.total : ''
    });

    // Alert threshold Input
    const limitInput = el('input', {
      type: 'number',
      placeholder: 'Alert % (default 80)',
      value: targetBudget ? (targetBudget.limitAlert || 80) : 80
    });

    // Icon selector
    const iconPreview = el('span', { class: 'icon-preview-circle' }, [selectedIcon]);
    const iconTrigger = el('button', {
      class: 'icon-selector-trigger-btn',
      type: 'button',
      style: 'margin-bottom:8px;'
    }, [
      iconPreview,
      el('span', {}, ['Choose Tracker Icon']),
      el('span', { style: 'font-size:10px; color:var(--text-secondary);' }, ['▾'])
    ]);

    const trackerIcons = ['🎓', '🛍️', '🛒', '☕', '🏠', '🚗', '🍿', '💻', '👕', '🏋️', '📱', '✈️', '💊', '🍔', '💰', '📊', '⚡', '🎁'];
    const iconTray = el('div', { class: 'icon-picker-tray', style: 'display:none; margin-bottom:10px;' },
      trackerIcons.map(ic => {
        const btn = el('button', { class: `icon-picker-btn ${ic === selectedIcon ? 'active' : ''}`, type: 'button' }, [ic]);
        btn.addEventListener('click', () => {
          selectedIcon = ic;
          iconPreview.textContent = ic;
          iconTray.querySelectorAll('.icon-picker-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          iconTray.style.display = 'none';
        });
        return btn;
      })
    );

    iconTrigger.addEventListener('click', () => {
      iconTray.style.display = iconTray.style.display === 'none' ? 'flex' : 'none';
    });

    // Categories checklist
    const allAvailableCats = getAllCategories();
    const checklistContainer = el('div', { class: 'category-checklist-container' });

    function renderCategoryChecklist() {
      clearNode(checklistContainer);
      allAvailableCats.forEach(catName => {
        const isSelected = selectedCats.includes(catName);
        const item = el('div', { class: `category-check-item ${isSelected ? 'selected' : ''}` }, [
          el('span', { class: 'category-check-icon' }, [getCategoryIcon(catName)]),
          el('span', { class: 'category-check-label' }, [catName]),
          el('span', { class: 'category-check-badge' }, [isSelected ? '✔ Counted' : '+ Add'])
        ]);

        item.addEventListener('click', () => {
          if (selectedCats.includes(catName)) {
            selectedCats = selectedCats.filter(c => c !== catName);
          } else {
            selectedCats.push(catName);
          }
          renderCategoryChecklist();
        });

        checklistContainer.appendChild(item);
      });
    }
    renderCategoryChecklist();

    // Actions
    const actions = el('div', { style: 'display:flex; gap:8px; justify-content:flex-end; margin-top:14px;' }, [
      el('button', { class: 'form-btn cancel', type: 'button' }, ['Cancel']),
      el('button', { class: 'form-btn submit', type: 'button' }, ['Save Tracker'])
    ]);

    actions.querySelector('.cancel').addEventListener('click', () => {
      overlay.remove();
    });

    actions.querySelector('.submit').addEventListener('click', () => {
      const nameVal = nameInput.value.trim();
      const totalVal = parseFloat(totalInput.value);
      const limitVal = parseInt(limitInput.value, 10) || 80;

      if (!nameVal || isNaN(totalVal) || totalVal <= 0) {
        pushSystemNotification('Validation Error', 'Please provide a tracker name and positive monthly limit.');
        return;
      }

      if (selectedCats.length === 0) {
        pushSystemNotification('Selection Error', 'Select at least one category that counts towards this tracker.');
        return;
      }

      if (isEditing && targetBudget) {
        targetBudget.name = nameVal;
        targetBudget.total = totalVal;
        targetBudget.limitAlert = limitVal;
        targetBudget.icon = selectedIcon;
        targetBudget.categories = selectedCats;
      } else {
        const newTracker = {
          id: 'bgt-' + Date.now(),
          name: nameVal,
          categories: selectedCats,
          spent: 0,
          total: totalVal,
          limitAlert: limitVal,
          icon: selectedIcon
        };
        state.budgets.push(newTracker);
      }

      recalculateBudgetSpent();
      saveState();
      calculateStats();
      overlay.remove();

      const contentArea = document.getElementById('screen-content');
      if (contentArea) renderBudgetTab(contentArea);

      pushSystemNotification('Budget Tracker Saved', `Tracker "${nameVal}" updated with ${selectedCats.length} category count rule(s).`);
    });

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(el('label', { style: 'font-size:10px; color:var(--text-secondary); margin-bottom:4px;' }, ['Tracker Name']));
    card.appendChild(nameInput);
    card.appendChild(el('label', { style: 'font-size:10px; color:var(--text-secondary); margin-bottom:4px;' }, ['Monthly Limit Target ($)']));
    card.appendChild(totalInput);
    card.appendChild(el('label', { style: 'font-size:10px; color:var(--text-secondary); margin-bottom:4px;' }, ['Spending Alert Threshold (%)']));
    card.appendChild(limitInput);
    card.appendChild(el('label', { style: 'font-size:10px; color:var(--text-secondary); margin-bottom:4px;' }, ['Tracker Icon']));
    card.appendChild(iconTrigger);
    card.appendChild(iconTray);
    card.appendChild(el('label', { style: 'font-size:10px; color:var(--text-secondary); margin-bottom:4px;' }, ['Categories that Count Towards this Tracker:']));
    card.appendChild(checklistContainer);
    card.appendChild(actions);

    overlay.appendChild(card);
    screen.appendChild(overlay);
  }

  // 2. Budgets & Financial Goals screen (Money Flow category mapping)
  function renderBudgetTab(container) {
    clearNode(container);

    const header = el('div', { class: 'dashboard-header' }, [
      el('h3', {}, ['Budget Trackers']),
      el('button', {
        class: 'account-action-pill-btn',
        style: 'padding: 6px 12px; font-size:11px;',
        type: 'button'
      }, ['➕ Define New Tracker'])
    ]);

    header.querySelector('button').addEventListener('click', () => {
      showBudgetTrackerModal(null);
    });

    container.appendChild(header);
    
    // Budget summary paragraph
    container.appendChild(el('p', { class: 'reports-summary-text' }, [
      'Define budget trackers and select which categories count towards each tracker (e.g. all Education expenses count towards Education, all Clothes & Shopping expenses count towards Shopping).'
    ]));

    // Map category budgets
    state.budgets.forEach(b => {
      const cats = getBudgetCategories(b);
      const percentage = b.total > 0 ? Math.min((b.spent / b.total) * 100, 100) : 0;
      
      let fillClass = 'fill-normal';
      if (percentage >= 90) {
        fillClass = 'fill-danger';
      } else if (percentage >= (b.limitAlert || 80)) {
        fillClass = 'fill-warning';
      }

      const remaining = b.total - b.spent;
      const bName = getBudgetName(b);
      const bIcon = getBudgetIcon(b);

      const card = el('div', { class: 'budget-card' }, [
        el('div', { class: 'budget-info-row' }, [
          el('div', { class: 'budget-title-col' }, [
            el('div', { style: 'display:flex; align-items:center; gap:8px;' }, [
              el('span', { style: 'font-size:18px;' }, [bIcon]),
              el('h4', {}, [bName])
            ]),
            el('span', { class: 'budget-category-tag' }, [`Target allocation: $${b.total.toFixed(0)} / mo`])
          ]),
          el('div', { class: 'budget-math' }, [
            el('span', { class: 'budget-math-spent' }, [`$${b.spent.toFixed(2)}`]),
            el('span', { class: 'budget-math-total' }, [` / $${b.total.toFixed(0)}`]),
            el('div', { class: 'budget-card-top-actions', style: 'margin-top:4px;' }, [
              el('button', { class: 'budget-action-pill-btn edit', type: 'button' }, ['⚙️ Edit']),
              el('button', { class: 'budget-action-pill-btn delete', type: 'button' }, ['🗑️'])
            ])
          ])
        ]),
        // Mapped Categories Chips
        el('div', { class: 'budget-categories-box' }, [
          el('div', { class: 'budget-categories-label' }, ['Categories counted towards this tracker:']),
          el('div', { class: 'budget-categories-chips' },
            cats.map(c => el('span', { class: 'budget-category-chip' }, [`${getCategoryIcon(c)} ${c}`]))
          )
        ]),
        // Track Fill Bar
        el('div', { class: 'budget-track-bar' }, [
          el('div', { class: `budget-fill ${fillClass}`, style: `width: ${percentage}%` })
        ]),
        el('div', { class: 'budget-footer-row' }, [
          el('span', {}, [`Spent ${percentage.toFixed(0)}%`]),
          remaining >= 0 
            ? el('span', { class: 'budget-safe-hint' }, [`$${remaining.toFixed(2)} Left`])
            : el('span', { class: 'budget-alert-hint' }, [`$${Math.abs(remaining).toFixed(2)} Over`])
        ])
      ]);

      card.querySelector('.budget-action-pill-btn.edit').addEventListener('click', () => {
        showBudgetTrackerModal(b.id);
      });

      card.querySelector('.budget-action-pill-btn.delete').addEventListener('click', () => {
        if (state.budgets.length <= 1) {
          pushSystemNotification('Cannot Delete', 'You must maintain at least one budget tracker.');
          return;
        }
        state.budgets = state.budgets.filter(item => item.id !== b.id);
        saveState();
        calculateStats();
        renderBudgetTab(container);
        pushSystemNotification('Tracker Removed', `Removed tracker: ${bName}`);
      });

      container.appendChild(card);
    });

    // Goal Configuration Option
    const addGoal = el('button', { class: 'set-goal-btn' }, ['➕ Define New Budget Tracker']);
    addGoal.addEventListener('click', () => {
      showBudgetTrackerModal(null);
    });
    container.appendChild(addGoal);
  }

  // 3. Cards & Rewards Recommendation tab
  function renderCardsTab(container) {
    container.appendChild(el('h3', { class: 'dashboard-header' }, ['Cards & Rewards Optimizer']));

    // Rewards Recommendations Card wizard
    const wizard = el('div', { class: 'reward-wizard' }, [
      el('div', { class: 'wizard-header' }, [
        el('span', {}, ['💡']),
        el('h4', {}, ['Rewards Optimization Recommendation'])
      ]),
      el('p', {}, ['Our offline ledger matched your credit rewards accounts. Tap cards below to inspect spending ceiling parameters.']),
      el('div', { class: 'reward-recommendation' }, [
        el('span', { class: 'recommendation-merchant' }, ['🛒 Grocery purchase? Use']),
        el('span', { class: 'recommended-card-badge' }, ['Amex Gold (4x)'])
      ]),
      el('div', { class: 'reward-recommendation' }, [
        el('span', { class: 'recommendation-merchant' }, ['☕ Coffee & Dining? Use']),
        el('span', { class: 'recommended-card-badge' }, ['Sapphire Preferred (3x)'])
      ])
    ]);
    container.appendChild(wizard);

    // Render all credit cards
    state.creditCards.forEach(card => {
      const currentSpendingPercentage = (card.balance / card.limit) * 100;
      const ceilingLimitAmount = card.limit * (card.ceilingLimit / 100);
      const isCeilingExceeded = card.balance > ceilingLimitAmount;

      const ccCard = el('div', { class: `credit-card-item ${card.themeClass}` }, [
        el('div', { class: 'card-chip' }),
        el('span', { class: 'card-brand-name' }, [card.name]),
        el('div', { class: 'card-middle-row' }, [
          el('div', { class: 'card-account-number' }, [card.maskedNumber])
        ]),
        el('div', { class: 'card-footer-details' }, [
          el('div', { class: 'card-holder' }, [
            el('span', { class: 'lbl' }, ['Balance']),
            el('span', { class: 'val' }, [`$${card.balance.toFixed(2)}`])
          ]),
          el('div', { class: 'card-ceiling-limit' }, [
            el('span', { class: 'lbl' }, [`Ceiling Alert (${card.ceilingLimit}%)`]),
            el('span', { class: `val ${isCeilingExceeded ? 'card-limit-exceeded' : ''}` }, [
              `$${card.balance.toFixed(0)} / $${ceilingLimitAmount.toFixed(0)}`
            ])
          ])
        ])
      ]);

      const reminder = el('div', { class: 'card-reminder-banner' }, [
        el('span', {}, [`🗓️ Payment Due: ${card.dueDate} | Limit Ceiling Tracker: `]),
        isCeilingExceeded 
          ? el('strong', { class: 'card-limit-exceeded' }, ['CEILING EXCEEDED']) 
          : el('strong', { style: 'color:var(--accent-emerald)' }, ['SAFE'])
      ]);

      container.appendChild(ccCard);
      container.appendChild(reminder);
    });
  }

  // 4. Reports & SVG Charts
  function renderReportsTab(container) {
    container.appendChild(el('h3', { class: 'dashboard-header' }, ['Reports & Analytics']));
    
    container.appendChild(el('p', { class: 'reports-summary-text' }, [
      'Inspect visual spending splits per category and historical trends generated using secure local browser components.'
    ]));

    // Build dynamic SVG Pie Chart programmatically
    // Calculate category weights
    const categoryTotals = {};
    let totalExpense = 0.00;
    state.transactions.forEach(tx => {
      if (tx.type === 'expense') {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        totalExpense += tx.amount;
      }
    });

    // SVG Pie generation
    const svg = svgEl('svg', { viewBox: '0 0 200 200', class: 'responsive-chart-svg' });
    
    const colors = {
      'Groceries': 'var(--accent-emerald)',
      'Food & Dining': 'var(--accent-cyan)',
      'Entertainment': 'var(--accent-indigo)',
      'Housing': 'var(--accent-gold)',
      'Vacation': 'var(--accent-rose)',
      'Education': '#a855f7',
      'Clothing': '#ec4899',
      'Shopping': '#f59e0b',
      'Electronics & Gadgets': '#3b82f6',
      'Transportation': '#10b981'
    };
    const fallbackPalette = ['#6366f1', '#14b8a6', '#f43f5e', '#8b5cf6', '#06b6d4', '#eab308'];

    const categories = Object.keys(categoryTotals);
    if (categories.length === 0) {
      container.appendChild(el('div', { class: 'empty-log' }, ['No expenses recorded to graph.']));
      return;
    }

    let accumulatedAngle = 0;
    categories.forEach(cat => {
      const val = categoryTotals[cat];
      const ratio = val / totalExpense;
      const angle = ratio * 360;

      // Draw SVG path slice
      // Coordinates center 100,100 radius 80
      const r = 70;
      const cx = 100;
      const cy = 100;

      const x1 = cx + r * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
      const y1 = cy + r * Math.sin((accumulatedAngle - 90) * Math.PI / 180);

      accumulatedAngle += angle;

      const x2 = cx + r * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
      const y2 = cy + r * Math.sin((accumulatedAngle - 90) * Math.PI / 180);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = `
        M ${cx} ${cy}
        L ${x1} ${y1}
        A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}
        Z
      `;

      const slice = svgEl('path', {
        d: pathData,
        fill: colors[cat] || fallbackPalette[Math.floor(accumulatedAngle) % fallbackPalette.length],
        stroke: 'var(--bg-device)',
        'stroke-width': '1.5'
      });

      svg.appendChild(slice);
    });

    // Inner punch hole for Donut chart feel
    const innerHole = svgEl('circle', { cx: '100', cy: '100', r: '42', fill: 'var(--bg-device-alt)' });
    svg.appendChild(innerHole);

    // Center text summary
    const totalText = svgEl('text', {
      x: '100',
      y: '96',
      'text-anchor': 'middle',
      fill: 'var(--text-primary)',
      'font-family': 'var(--font-display)',
      'font-size': '12',
      'font-weight': '800'
    });
    totalText.textContent = `$${totalExpense.toFixed(0)}`;
    svg.appendChild(totalText);

    const labelText = svgEl('text', {
      x: '100',
      y: '110',
      'text-anchor': 'middle',
      fill: 'var(--text-secondary)',
      'font-family': 'var(--font-body)',
      'font-size': '8',
      'font-weight': '600'
    });
    labelText.textContent = 'TOTAL SPENT';
    svg.appendChild(labelText);

    // Construct Chart Legends
    const legendItems = categories.map(cat => {
      const countPercentage = ((categoryTotals[cat] / totalExpense) * 100).toFixed(0);
      return el('div', { class: 'legend-item' }, [
        el('div', { class: 'legend-color', style: `background-color:${colors[cat] || 'var(--text-muted)'}` }),
        el('span', {}, [`${cat}: ${countPercentage}% ($${categoryTotals[cat].toFixed(0)})`])
      ]);
    });

    const chartContainer = el('div', { class: 'chart-container' }, [
      el('h4', {}, ['Monthly Share Distribution']),
      svg,
      el('div', { class: 'chart-legends' }, legendItems)
    ]);
    container.appendChild(chartContainer);

    // Recurring Costs Suggestion
    const promo = el('div', { class: 'core-expenses-promo' }, [
      el('h4', {}, ['Recurring Bills Scraped']),
      el('p', {}, ['Our background analyzer identified recurring charges (e.g. Metropolitan Rent, Netflix subscription) appearing monthly in reports. Sync these to Core Expenses to isolate flexible spending cash.']),
      el('button', { class: 'promo-btn' }, ['Group as Core Expenses'])
    ]);

    promo.querySelector('.promo-btn').addEventListener('click', () => {
      pushSystemNotification('Core Sync', 'Recurring charges categorized under core fixed parameters.');
    });
    container.appendChild(promo);
  }

  // 5. Credit Bureau Score & Removal Timeline Tab
  function renderCreditTab(container) {
    container.appendChild(el('h3', { class: 'dashboard-header' }, ['Credit Score Center']));
    
    // Bureau Score gauges
    const overview = el('div', { class: 'credit-score-overview' }, [
      el('div', { class: 'bureau-score-card' }, [
        el('span', { class: 'bureau-logo' }, ['Experian']),
        el('span', { class: `bureau-score-val ${state.creditProfile.scores.experian < 600 ? 'bad' : ''}` }, [state.creditProfile.scores.experian]),
        el('span', { class: `bureau-grade ${state.creditProfile.scores.experian < 600 ? 'bad' : ''}` }, ['EXCELLENT'])
      ]),
      el('div', { class: 'bureau-score-card' }, [
        el('span', { class: 'bureau-logo' }, ['Equifax']),
        el('span', { class: `bureau-score-val ${state.creditProfile.scores.equifax < 600 ? 'bad' : ''}` }, [state.creditProfile.scores.equifax]),
        el('span', { class: `bureau-grade ${state.creditProfile.scores.equifax < 600 ? 'bad' : ''}` }, ['EXCELLENT'])
      ]),
      el('div', { class: 'bureau-score-card' }, [
        el('span', { class: 'bureau-logo' }, ['TransUnion']),
        el('span', { class: `bureau-score-val ${state.creditProfile.scores.transunion < 600 ? 'bad' : ''}` }, [state.creditProfile.scores.transunion]),
        el('span', { class: `bureau-grade ${state.creditProfile.scores.transunion < 600 ? 'bad' : ''}` }, ['EXCELLENT'])
      ]),
      el('div', { class: 'bureau-score-card' }, [
        el('span', { class: 'bureau-logo' }, ['FICO Score']),
        el('span', { class: `bureau-score-val ${state.creditProfile.scores.fico < 600 ? 'bad' : ''}` }, [state.creditProfile.scores.fico]),
        el('span', { class: `bureau-grade ${state.creditProfile.scores.fico < 600 ? 'bad' : ''}` }, ['EXCELLENT'])
      ])
    ]);
    container.appendChild(overview);

    // Hard pulls timeline removal logs
    const pullsList = state.creditProfile.hardPulls.map(pull => {
      return el('div', { class: 'pull-log-item' }, [
        el('div', { class: 'pull-log-title' }, [pull.company]),
        el('div', { class: 'pull-log-date' }, [`Inquired: ${pull.date} | Secure Removal: ${pull.expires}`])
      ]);
    });

    const pullAlertBanner = state.creditProfile.hardPulls.length > 2
      ? el('div', { class: 'hard-pull-warning-banner' }, [
          el('span', {}, ['🚨']),
          el('p', {}, ['Critical: Recent hard inquiries registered. Limit vehicle or card checks to prevent scoring drops.'])
        ])
      : null;

    const timelineCard = el('div', { class: 'credit-timeline-container' }, [
      el('h4', {}, ['Hard Inquiry Removal Ledger']),
      pullAlertBanner,
      el('div', { class: 'pulls-log-list' }, pullsList),
      el('p', { class: 'reports-summary-text', style: 'margin-top:12px; font-style:italic;' }, [
        state.creditProfile.upcomingRemovals
      ])
    ]);

    container.appendChild(timelineCard);
  }

  // 6. Vacation Trips Mode Tab
  function renderVacationTab(container) {
    container.appendChild(el('h3', { class: 'dashboard-header' }, ['Vacation Mode Tracker']));

    if (!state.vacationTracker.isActive) {
      container.appendChild(el('div', { class: 'empty-log', style: 'margin-top:50px' }, [
        '✈️ Vacation Mode is currently idle.',
        el('p', { style: 'font-size:11px; color:var(--text-muted); margin-top:8px;' }, [
          'Change your GPS location via the Simulator controller to activate active trip budget allocations.'
        ])
      ]));
      return;
    }

    const remaining = state.vacationTracker.tripBudget - state.vacationTracker.spent;

    const banner = el('div', { class: 'vacation-mode-banner' }, [
      el('h4', {}, [
        el('span', {}, ['🌴']),
        `Active Vacation Mode: ${state.vacationTracker.locationName}`
      ]),
      el('p', {}, ['We automatically isolated location purchases matching your vacation timeframe to separate vacation calculations.']),
      el('div', { class: 'vacation-budget-row' }, [
        el('span', {}, ['Trip Spending Allocation:']),
        el('span', { class: 'vacation-budget-spent' }, [`$${state.vacationTracker.spent.toFixed(2)} / $${state.vacationTracker.tripBudget.toFixed(0)}`])
      ]),
      el('div', { class: 'budget-track-bar' }, [
        el('div', { class: 'budget-fill fill-normal', style: `width:${(state.vacationTracker.spent / state.vacationTracker.tripBudget) * 100}%` })
      ]),
      el('div', { class: 'budget-footer-row' }, [
        el('span', {}, [`Spent ${((state.vacationTracker.spent / state.vacationTracker.tripBudget) * 100).toFixed(0)}%`]),
        el('span', { class: 'budget-safe-hint' }, [`$${remaining.toFixed(2)} Remaining`])
      ])
    ]);

    container.appendChild(banner);

    // Display isolated list of vacation expenses
    container.appendChild(el('h4', { style: 'margin: 12px 0 8px;' }, ['Isolated Trip Ledger']));
    
    const vacationTxs = state.transactions.filter(t => t.category === 'Vacation');
    if (vacationTxs.length === 0) {
      container.appendChild(el('div', { class: 'empty-log' }, ['No location transactions registered yet. Tap coffee simulator to trigger.']));
    } else {
      const feed = el('div', { class: 'transactions-list' });
      vacationTxs.forEach(tx => {
        feed.appendChild(el('div', { class: 'transaction-item' }, [
          el('div', { class: 'transaction-category-avatar' }, ['✈️']),
          el('div', { class: 'transaction-details' }, [
            el('div', { class: 'transaction-row-1' }, [
              el('span', { class: 'transaction-merchant' }, [tx.merchant]),
              el('span', { class: 'transaction-amount negative' }, [`-$${tx.amount.toFixed(2)}`])
            ]),
            el('div', { class: 'transaction-row-2' }, [
              el('div', { class: 'transaction-meta' }, [
                el('span', {}, [new Date(tx.timestamp).toLocaleDateString()]),
                el('span', { class: 'transaction-tag loc-tag' }, [tx.location])
              ])
            ])
          ])
        ]));
      });
      container.appendChild(feed);
    }
  }

  // --- Ecosystem Simulation Handlers ---

  function bindSimulatorButtons() {
    // Coffee Tap simulator
    const btnGpayCoffee = document.getElementById('btn-sim-gpay-coffee');
    if (btnGpayCoffee) {
      btnGpayCoffee.addEventListener('click', () => {
        // Construct transaction
        const amount = 8.50;
        const merchant = 'Starbucks Coffee';
        
        // Check Sapphire Dining recommendation
        const sapphireCard = state.creditCards.find(c => c.id === 'card-sapphire');
        if (sapphireCard) {
          sapphireCard.balance += amount;
        }

        // Update corresponding category budget
        const foodBudget = state.budgets.find(b => b.category === 'Food & Dining');
        if (foodBudget) foodBudget.spent += amount;

        // Verify Vacation mode context
        let category = 'Food & Dining';
        let location = 'Seattle Downtown';
        let tag = 'Coffee';
        if (state.vacationTracker.isActive) {
          category = 'Vacation';
          location = 'Starbucks Paris Louvre';
          tag = 'Vacation Food';
          state.vacationTracker.spent += amount;
        }

        const newTx = {
          id: 'tx-gpay-' + Date.now(),
          timestamp: new Date().toISOString(),
          merchant: merchant,
          amount: amount,
          type: 'expense',
          category: category,
          tag: tag,
          location: location,
          notes: 'Google Pay automated tap. Earned 3x credit card dining points matching Chase Sapphire rules.',
          verified: true,
          accountId: 'acc-sapphire',
          icon: '☕',
          receipt: null
        };

        state.transactions.unshift(newTx);
        applyAccountBalanceDelta('acc-sapphire', 'expense', amount);
        saveState();
        calculateStats();
        triggerProactiveAdvice();
        
        pushSystemNotification(
          'Google Pay: Tapped',
          `Successfully paid $${amount.toFixed(2)} to ${merchant}. Chase card selected to earn 3x dining points.`
        );
        
        initApp();
      });
    }

    // AMC Movie Tap Simulator
    const btnGpayMovie = document.getElementById('btn-sim-gpay-movie');
    if (btnGpayMovie) {
      btnGpayMovie.addEventListener('click', () => {
        const amount = 24.00;
        const merchant = 'AMC Cinema';

        const citiCard = state.creditCards.find(c => c.id === 'card-citi');
        if (citiCard) citiCard.balance += amount;

        const entBudget = state.budgets.find(b => b.category === 'Entertainment');
        if (entBudget) entBudget.spent += amount;

        const newTx = {
          id: 'tx-amc-' + Date.now(),
          timestamp: new Date().toISOString(),
          merchant: merchant,
          amount: amount,
          type: 'expense',
          category: 'Entertainment',
          tag: 'Relax',
          location: 'AMC Seattle Metro',
          notes: 'Google Pay automated online checkout. Earned 2% cash back rewards on Citi Double Cash card.',
          verified: true,
          accountId: 'acc-citi',
          icon: '🍿',
          receipt: null
        };

        state.transactions.unshift(newTx);
        applyAccountBalanceDelta('acc-citi', 'expense', amount);
        saveState();
        calculateStats();
        triggerProactiveAdvice();

        pushSystemNotification(
          'Google Pay: Tapped',
          `Paid $${amount.toFixed(2)} at ${merchant}. Card recommendation maximized 2% cash back.`
        );

        initApp();
      });
    }

    // Costco SMS Scraping simulator
    const btnSmsCostco = document.getElementById('btn-sim-sms-costco');
    if (btnSmsCostco) {
      btnSmsCostco.addEventListener('click', () => {
        const amount = 184.50;
        const merchant = 'Costco Wholesale';

        const amexCard = state.creditCards.find(c => c.id === 'card-amex');
        if (amexCard) amexCard.balance += amount;

        const groceryBudget = state.budgets.find(b => b.category === 'Groceries');
        if (groceryBudget) groceryBudget.spent += amount;

        const newTx = {
          id: 'tx-sms-cos-' + Date.now(),
          timestamp: new Date().toISOString(),
          merchant: merchant,
          amount: amount,
          type: 'expense',
          category: 'Groceries',
          tag: 'Bulk Essentials',
          location: 'Costco Wholesale #104',
          notes: 'Automated sync via bank SMS scraper: "Charge of $184.50 flagged at Costco". Card recommended: Amex Gold (4x points).',
          verified: true,
          accountId: 'acc-amex',
          icon: '🛒',
          receipt: null
        };

        state.transactions.unshift(newTx);
        applyAccountBalanceDelta('acc-amex', 'expense', amount);
        saveState();
        calculateStats();
        triggerProactiveAdvice();

        pushSystemNotification(
          'Bank Alert SMS Synced',
          `Scraped Costco spend of $${amount.toFixed(2)}. Automatically mapped under Groceries.`
        );

        initApp();
      });
    }

    // Rent SMS Simulator
    const btnSmsRent = document.getElementById('btn-sim-sms-landlord');
    if (btnSmsRent) {
      btnSmsRent.addEventListener('click', () => {
        const amount = 1200.00;
        const merchant = 'Metropolitan Living';

        // Increase housing spent
        const houseBudget = state.budgets.find(b => b.category === 'Housing');
        if (houseBudget) houseBudget.spent = amount;

        const newTx = {
          id: 'tx-sms-rent-' + Date.now(),
          timestamp: new Date().toISOString(),
          merchant: merchant,
          amount: amount,
          type: 'expense',
          category: 'Housing',
          tag: 'Rent Fixed',
          location: 'Rent Portal Wire',
          notes: 'SMS Scrape: "Metropolitan Rent Wire executed successfully". Synced read-only verification checks.',
          verified: true,
          accountId: 'acc-chase-chk',
          icon: '🏠',
          receipt: null
        };

        state.transactions.unshift(newTx);
        applyAccountBalanceDelta('acc-chase-chk', 'expense', amount);
        saveState();
        calculateStats();
        triggerProactiveAdvice();

        pushSystemNotification(
          'Rent Wire Alert',
          `Scraped Rent payout of $${amount.toFixed(2)}. Synced safely.`
        );

        initApp();
      });
    }

    // Savings Interest Payout Simulator
    const btnSimInterest = document.getElementById('btn-sim-interest');
    if (btnSimInterest) {
      btnSimInterest.addEventListener('click', () => {
        const amount = 45.20;
        const merchant = 'Chase Bank Savings Interest';

        const newTx = {
          id: 'tx-interest-' + Date.now(),
          timestamp: new Date().toISOString(),
          merchant: merchant,
          amount: amount,
          type: 'income',
          category: 'Salary',
          tag: 'Savings Interest',
          location: 'Chase Savings Account',
          notes: 'Auto-Scrape: Simulated interest payout automatically added to income records. Verified by bank ledger.',
          verified: true,
          accountId: 'acc-chase-sav',
          icon: '💰',
          receipt: null
        };

        state.transactions.unshift(newTx);
        applyAccountBalanceDelta('acc-chase-sav', 'income', amount);
        saveState();
        calculateStats();
        triggerProactiveAdvice();

        pushSystemNotification(
          'Savings Interest Credited',
          `Received +$${amount.toFixed(2)} in monthly APY savings interest from Chase Bank.`
        );

        initApp();
      });
    }

    // Location Change GPS trigger
    const btnSimLoc = document.getElementById('btn-sim-location');
    if (btnSimLoc) {
      btnSimLoc.addEventListener('click', () => {
        // Trigger active vacation banner
        state.vacationTracker.isActive = true;
        state.vacationTracker.locationName = 'Paris, France';
        state.vacationTracker.tripBudget = 1500.00;
        state.vacationTracker.spent = 0.00;

        saveState();
        triggerProactiveAdvice();

        pushSystemNotification(
          'GPS Location Changed',
          'We noticed you landed in Paris, France. Swipe bottom to open active Trip Budget Tracker.'
        );

        // Swap view tab to vacation
        currentActiveTab = 'vacation';
        initApp();
      });
    }

    // Credit Pull Inquiry Simulator
    const btnSimPull = document.getElementById('btn-sim-pull');
    if (btnSimPull) {
      btnSimPull.addEventListener('click', () => {
        // Lower scores
        state.creditProfile.scores.experian -= 6;
        state.creditProfile.scores.fico -= 5;
        state.creditProfile.scores.equifax -= 4;
        state.creditProfile.scores.transunion -= 5;

        // Add pull inquiry ledger
        state.creditProfile.hardPulls.unshift({
          id: 'pull-' + Date.now(),
          company: 'Auto Loan Finance Group',
          date: new Date().toLocaleDateString(),
          expires: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString()
        });

        state.creditProfile.upcomingRemovals = '3 hard pull(s) registered. Keep vehicle credit pulls minimal to prevent scoring drops.';

        saveState();
        triggerProactiveAdvice();

        pushSystemNotification(
          'Credit Bureau Warning',
          'Hard credit inquiry registered by Auto Loan Finance Group. Scores decreased by 5 points.'
        );

        currentActiveTab = 'credit';
        initApp();
      });
    }

    // Statement Sync Discrepancy Alert simulator
    const btnSimDiscrepancy = document.getElementById('btn-sim-discrepancy');
    if (btnSimDiscrepancy) {
      btnSimDiscrepancy.addEventListener('click', () => {
        pushSystemNotification(
          'Statement Discrepancy Detected',
          'WARNING: Netflix Subscription billed at $159.90 on card statement vs $15.99 expected. Potential fraud alert.'
        );

        // Log into notification advisor log list
        const proactiveLog = document.getElementById('proactive-log');
        if (proactiveLog) {
          const logEntry = el('div', { class: 'proactive-log-entry warning' }, [
            el('span', {}, ['Discrepancy Audit Warning']),
            'Your Netflix streaming charge billed as $159.90 on card statement differs from $15.99 in-app. Verify details to prevent credit card fraud.'
          ]);
          // Insert at top
          proactiveLog.insertBefore(logEntry, proactiveLog.firstChild);
        }
      });
    }
  }

  // --- Main Device Views Navigator Loader ---
  function initApp() {
    const contentArea = document.getElementById('screen-content');
    if (!contentArea) return;

    clearNode(contentArea);

    // Highlight active footer tab icon
    document.querySelectorAll('.nav-item').forEach(item => {
      const tab = item.getAttribute('data-tab');
      if (tab === currentActiveTab || (currentActiveTab === 'transaction-form' && tab === 'dashboard')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Show/hide header period bar: only show on 'dashboard' (Transactions) tab!
    const appHeader = document.querySelector('.app-header');
    const headerPeriodBar = document.getElementById('header-period-bar-container');
    if (headerPeriodBar) {
      if (currentActiveTab === 'dashboard') {
        headerPeriodBar.style.display = '';
        if (appHeader) appHeader.classList.remove('no-balance-card');
        renderHeaderPeriodBar();
      } else {
        headerPeriodBar.style.display = 'none';
        if (appHeader) appHeader.classList.add('no-balance-card');
      }
    }

    // Toggle Floating Action Button (FAB) visibility: only show on 'dashboard' (Transactions) tab!
    const floatingFab = document.getElementById('floating-add-tx-fab-btn');
    if (floatingFab) {
      floatingFab.style.display = (currentActiveTab === 'dashboard') ? 'flex' : 'none';
    }

    // Load responsive screen components
    if (currentActiveTab === 'dashboard') {
      renderDashboardTab(contentArea);
    } else if (currentActiveTab === 'transaction-form') {
      renderTransactionFormPage(contentArea, editingTransactionId);
    } else if (currentActiveTab === 'accounts') {
      renderAccountsTab(contentArea);
    } else if (currentActiveTab === 'budget') {
      renderBudgetTab(contentArea);
    } else if (currentActiveTab === 'cards') {
      renderCardsTab(contentArea);
    } else if (currentActiveTab === 'reports') {
      renderReportsTab(contentArea);
    } else if (currentActiveTab === 'credit') {
      renderCreditTab(contentArea);
    } else if (currentActiveTab === 'vacation') {
      renderVacationTab(contentArea);
    }
  }

  // --- Physical Power Button Screen On/Off Actions ---
  function bindHardwareControls() {
    const pwr = document.getElementById('hw-power');
    const screen = document.getElementById('device-screen');
    
    if (pwr && screen) {
      pwr.addEventListener('click', () => {
        if (screen.classList.contains('screen-off')) {
          // Wake device
          screen.classList.remove('screen-off');
          screen.classList.add('screen-locked');
        } else if (screen.classList.contains('screen-locked')) {
          // Unlock device
          screen.classList.remove('screen-locked');
        } else {
          // Lock / sleep device
          screen.classList.add('screen-off');
        }
      });
    }

    // Unlock trigger by double tapping home overlay pill
    const pill = document.getElementById('nav-pill-btn');
    const screenElem = document.getElementById('device-screen');
    if (pill && screenElem) {
      pill.addEventListener('click', () => {
        if (screenElem.classList.contains('screen-locked')) {
          screenElem.classList.remove('screen-locked');
        } else if (currentActiveTab === 'transaction-form') {
          returnToTransactionsFeed();
        }
      });
    }

    // Upper-left Account Switcher button trigger (Money Flow style)
    const switcherBtn = document.getElementById('header-account-switcher-btn');
    if (switcherBtn) {
      switcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAccountSwitcherModal();
      });
    }

    // Top Card Range Filter sync
    const topDateFilter = document.getElementById('date-filter');
    if (topDateFilter) {
      topDateFilter.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'this-month') {
          currentDateFilterMode = 'month';
          selectedFilterMonth = 4; // May
          selectedFilterYear = 2026;
        } else if (val === 'this-year') {
          currentDateFilterMode = 'year';
          selectedFilterYear = 2026;
        } else if (val === 'last-30') {
          currentDateFilterMode = 'custom';
          customFilterStartDate = '2026-04-28';
          customFilterEndDate = '2026-05-28';
        }
        calculateStats();
        initApp();
      });
    }
  }

  // --- Startup Clock Initializer ---
  function startClock() {
    const clock = document.getElementById('status-clock');
    const lockClock = document.getElementById('lock-clock');
    
    function update() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
      if (clock) clock.textContent = timeStr;
      if (lockClock) lockClock.textContent = timeStr;
    }
    update();
    setInterval(update, 1000 * 60);
  }

  // --- Bottom Nav tab bindings ---
  function bindFooterTabs() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab');
        
        // If clicking a tab while screen off, do nothing
        const screen = document.getElementById('device-screen');
        if (screen && screen.classList.contains('screen-off')) return;

        currentActiveTab = targetTab;
        initApp();
      });
    });
  }

  // --- Floating Action Button (FAB) binding ---
  function bindFloatingActionButton() {
    const fab = document.getElementById('floating-add-tx-fab-btn');
    if (fab) {
      fab.addEventListener('click', () => {
        const screen = document.getElementById('device-screen');
        if (screen && screen.classList.contains('screen-off')) return;
        navigateToTransactionForm(null);
      });
    }
  }

  // Helper: Format ISO datetime strings to YYYY-MM-DDTHH:mm for datetime-local input
  function formatISODateForInput(isoString) {
    try {
      const date = new Date(isoString);
      const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
      return localISOTime;
    } catch (e) {
      return '';
    }
  }

  // --- Navigation to Dedicated Transaction Page ---
  function navigateToTransactionForm(txId = null) {
    editingTransactionId = txId;
    currentActiveTab = 'transaction-form';
    initApp();
  }

  function returnToTransactionsFeed() {
    editingTransactionId = null;
    currentActiveTab = 'dashboard';
    initApp();
  }

  // Helper: Delete a transaction, reverse balances, and recalculate
  function deleteTransaction(txId) {
    const idx = state.transactions.findIndex(t => t.id === txId);
    if (idx === -1) return false;
    const tx = state.transactions[idx];

    // Reverse balance delta from linked account
    if (tx.accountId) {
      const netAmount = getTxNetAmount(tx);
      applyAccountBalanceDelta(tx.accountId, tx.type, -netAmount);
    }

    state.transactions.splice(idx, 1);
    recalculateBudgetSpent();
    saveState();
    calculateStats();
    triggerProactiveAdvice();
    return true;
  }

  // Helper: Duplicate a transaction with fresh ID and current timestamp
  function duplicateTransaction(txId) {
    const tx = state.transactions.find(t => t.id === txId);
    if (!tx) return null;

    const dupTx = {
      ...JSON.parse(JSON.stringify(tx)),
      id: 'tx-' + Date.now(),
      timestamp: new Date().toISOString(),
      refunds: []
    };

    if (dupTx.accountId) {
      applyAccountBalanceDelta(dupTx.accountId, dupTx.type, dupTx.amount);
    }

    state.transactions.unshift(dupTx);
    recalculateBudgetSpent();
    saveState();
    calculateStats();
    triggerProactiveAdvice();
    return dupTx;
  }

  // Backward compatibility alias for modal triggers
  function showTransactionDetailsModal(txId) {
    navigateToTransactionForm(txId);
  }

  // ==========================================================================
  // Dedicated Transaction Form / Edit Page (Mobile Vertical Phone Screen View)
  // ==========================================================================
  function renderTransactionFormPage(container, txId) {
    clearNode(container);

    const isEdit = !!txId;
    const existingTx = isEdit ? state.transactions.find(t => t.id === txId) : null;

    let selectedType = existingTx ? (existingTx.type || 'expense') : 'expense';
    let selectedIcon = existingTx ? (existingTx.icon || getCategoryIcon(existingTx.category || 'Groceries')) : getCategoryIcon('Groceries');
    let formCategory = existingTx ? (existingTx.category || 'Groceries') : 'Groceries';
    let formCategoryColor = getCategoryColor(formCategory);
    let formTagColor = existingTx ? getTagColor(existingTx.tag, existingTx) : '#00f2fe';
    let isRecurring = existingTx ? !!existingTx.isRecurring : false;
    let recurringFrequency = existingTx && existingTx.recurringFrequency ? existingTx.recurringFrequency : 'monthly';
    let currentReceipt = existingTx ? existingTx.receipt : null;

    const page = el('div', { class: 'tx-form-page' });

    // 1. Header with back button
    const backBtn = el('button', {
      class: 'tx-form-back-btn',
      type: 'button',
      title: 'Back to Transactions'
    }, [
      el('span', { class: 'back-chevron' }, ['‹']),
      el('span', {}, ['Transactions'])
    ]);
    backBtn.addEventListener('click', () => {
      returnToTransactionsFeed();
    });

    const titleGroup = el('div', { class: 'tx-form-title-group' }, [
      el('h2', { class: 'tx-form-title' }, [isEdit ? 'Edit Transaction' : 'New Transaction']),
      isEdit ? el('span', { class: 'tx-form-badge' }, [isRecurring ? `🔁 Recurring • ${recurringFrequency}` : 'Single Record']) : null
    ].filter(Boolean));

    const header = el('div', { class: 'tx-form-header' }, [
      backBtn,
      titleGroup
    ]);
    page.appendChild(header);

    // 2. Type Segmented Control (Expense / Income)
    const btnExpense = el('button', {
      type: 'button',
      class: `tx-type-tab ${selectedType === 'expense' ? 'active expense' : ''}`
    }, ['↘ Expense']);

    const btnIncome = el('button', {
      type: 'button',
      class: `tx-type-tab ${selectedType === 'income' ? 'active income' : ''}`
    }, ['↗ Income']);

    btnExpense.addEventListener('click', () => {
      selectedType = 'expense';
      btnExpense.className = 'tx-type-tab active expense';
      btnIncome.className = 'tx-type-tab';
      amountCurrency.className = 'tx-amount-currency expense';
      amountInput.className = 'tx-amount-input expense';
    });

    btnIncome.addEventListener('click', () => {
      selectedType = 'income';
      btnIncome.className = 'tx-type-tab active income';
      btnExpense.className = 'tx-type-tab';
      amountCurrency.className = 'tx-amount-currency income';
      amountInput.className = 'tx-amount-input income';
    });

    const segmented = el('div', { class: 'tx-type-segmented' }, [
      btnExpense,
      btnIncome
    ]);
    page.appendChild(segmented);

    // 3. Amount Hero Input Card
    const amountCurrency = el('span', {
      class: `tx-amount-currency ${selectedType === 'income' ? 'income' : 'expense'}`
    }, ['$']);

    const amountInput = el('input', {
      type: 'number',
      class: `tx-amount-input ${selectedType === 'income' ? 'income' : 'expense'}`,
      placeholder: '0.00',
      step: '0.01',
      value: existingTx ? existingTx.amount.toFixed(2) : '',
      id: 'tx-form-amount'
    });

    const amountHero = el('div', { class: 'tx-amount-hero-card' }, [
      el('span', { class: 'tx-amount-label' }, ['AMOUNT']),
      el('div', { class: 'tx-amount-input-row' }, [
        amountCurrency,
        amountInput
      ])
    ]);
    page.appendChild(amountHero);

    // 4. Form Fields Section (Clean vertical stack)
    const formSection = el('div', { class: 'tx-form-section' });

    // Merchant / Payee
    const inputMerchant = el('input', {
      type: 'text',
      class: 'tx-field-input',
      id: 'tx-form-merchant',
      placeholder: 'e.g. Whole Foods, Netflix, Employer...',
      value: existingTx ? existingTx.merchant : ''
    });
    formSection.appendChild(el('div', { class: 'tx-field-group' }, [
      el('label', { class: 'tx-field-label' }, ['🏪 Merchant / Payee']),
      inputMerchant
    ]));

    // Category with Auto-Icon Sync & Color customizer
    const iconPreview = el('span', { class: 'icon-preview-circle' }, [selectedIcon]);

    const categoryDropdown = buildCategoryDropdown(formCategory, (newCat, defaultIcon) => {
      formCategory = newCat;
      if (defaultIcon) {
        selectedIcon = defaultIcon;
        iconPreview.textContent = defaultIcon;
        iconPickerTray.querySelectorAll('.icon-picker-btn').forEach(b => {
          b.classList.toggle('active', b.textContent === defaultIcon);
        });
      }
      formCategoryColor = getCategoryColor(newCat);
      catColorBtn.querySelector('.color-indicator-circle').style.background = formCategoryColor;
    });

    const catColorBtn = el('button', {
      type: 'button',
      class: 'color-trigger-btn',
      title: 'Customize Category Color',
      style: 'padding: 6px 10px;'
    }, [
      el('span', { class: 'color-indicator-circle', style: `background: ${formCategoryColor};` }),
      el('span', { style: 'font-size:10px;' }, ['Color'])
    ]);
    catColorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentCat = categoryDropdown.value;
      openColorPickerModal(`Category Color: ${currentCat}`, formCategoryColor, (newHex) => {
        formCategoryColor = newHex;
        setCategoryColor(currentCat, newHex);
        catColorBtn.querySelector('.color-indicator-circle').style.background = newHex;
      });
    });

    formSection.appendChild(el('div', { class: 'tx-field-group' }, [
      el('label', { class: 'tx-field-label' }, ['🏷️ Category & Color']),
      el('div', { class: 'tx-field-row' }, [
        categoryDropdown,
        catColorBtn
      ])
    ]));

    // Account / Card selector
    const defaultAccId = existingTx
      ? existingTx.accountId
      : (currentAccountScope.startsWith('account:') ? currentAccountScope.slice(8) : (state.accounts[0]?.id || ''));

    const accountSelect = el('select', { class: 'tx-field-input', id: 'tx-form-account' },
      state.accounts.map(acc => {
        const iconPrefix = acc.type === 'credit' ? '💳 ' : '🏦 ';
        const numText = acc.maskedNumber ? ` (${acc.maskedNumber})` : '';
        const balText = ` • $${acc.balance.toFixed(2)}`;
        return el('option', { value: acc.id, selected: acc.id === defaultAccId }, [
          `${iconPrefix}${acc.name}${numText}${balText}`
        ]);
      })
    );

    formSection.appendChild(el('div', { class: 'tx-field-group' }, [
      el('label', { class: 'tx-field-label' }, ['💳 Payment Card / Account']),
      accountSelect
    ]));

    // Date & Time
    const initialIso = existingTx ? existingTx.timestamp : new Date().toISOString();
    const inputTimestamp = el('input', {
      type: 'datetime-local',
      class: 'tx-field-input',
      id: 'tx-form-timestamp',
      value: formatISODateForInput(initialIso)
    });

    formSection.appendChild(el('div', { class: 'tx-field-group' }, [
      el('label', { class: 'tx-field-label' }, ['📅 Date & Time']),
      inputTimestamp
    ]));

    // Icon Picker with preview circle & tray
    const iconPickerTrigger = el('button', {
      class: 'icon-selector-trigger-btn',
      type: 'button',
      title: 'Choose Transaction Icon',
      style: 'width:100%; justify-content:space-between; padding:8px 12px;'
    }, [
      el('div', { style: 'display:flex; align-items:center; gap:8px;' }, [
        iconPreview,
        el('span', {}, ['Custom Icon'])
      ]),
      el('span', { style: 'font-size:11px; color:var(--text-secondary);' }, ['Change ▾'])
    ]);

    const iconPickerTray = el('div', { class: 'icon-picker-tray', style: 'display:none; margin-top:8px;' },
      TRANSACTION_ICONS.map(ic => {
        const btn = el('button', {
          class: `icon-picker-btn ${ic === selectedIcon ? 'active' : ''}`,
          type: 'button'
        }, [ic]);
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedIcon = ic;
          iconPreview.textContent = ic;
          iconPickerTray.querySelectorAll('.icon-picker-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          iconPickerTray.style.display = 'none';
        });
        return btn;
      })
    );

    iconPickerTrigger.addEventListener('click', () => {
      iconPickerTray.style.display = (iconPickerTray.style.display === 'none') ? 'flex' : 'none';
    });

    formSection.appendChild(el('div', { class: 'tx-field-group' }, [
      el('label', { class: 'tx-field-label' }, ['🎨 Transaction Icon']),
      iconPickerTrigger,
      iconPickerTray
    ]));

    // Tag & Tag Color
    const inputTag = el('input', {
      type: 'text',
      class: 'tx-field-input',
      id: 'tx-form-tag',
      placeholder: 'e.g. Essentials, Vacation, College...',
      value: existingTx ? (existingTx.tag || '') : ''
    });

    const tagColorBtn = el('button', {
      type: 'button',
      class: 'color-trigger-btn',
      title: 'Customize Tag Color',
      style: 'padding: 6px 10px;'
    }, [
      el('span', { class: 'color-indicator-circle', style: `background: ${formTagColor};` }),
      el('span', { style: 'font-size:10px;' }, ['Color'])
    ]);

    tagColorBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const tagName = inputTag.value.trim() || 'Tag';
      openColorPickerModal(`Tag Color: ${tagName}`, formTagColor, (newHex) => {
        formTagColor = newHex;
        tagColorBtn.querySelector('.color-indicator-circle').style.background = newHex;
        if (inputTag.value.trim()) {
          setTagColor(inputTag.value.trim(), newHex);
        }
      });
    });

    inputTag.addEventListener('input', () => {
      const val = inputTag.value.trim();
      if (val) {
        formTagColor = getTagColor(val, existingTx);
        tagColorBtn.querySelector('.color-indicator-circle').style.background = formTagColor;
      }
    });

    formSection.appendChild(el('div', { class: 'tx-field-group' }, [
      el('label', { class: 'tx-field-label' }, ['#️⃣ Tag & Color']),
      el('div', { class: 'tx-field-row' }, [
        inputTag,
        tagColorBtn
      ])
    ]));

    // Location
    const inputLocation = el('input', {
      type: 'text',
      class: 'tx-field-input',
      id: 'tx-form-location',
      placeholder: 'e.g. Downtown Mall, Store #42...',
      value: existingTx ? (existingTx.location || '') : ''
    });

    formSection.appendChild(el('div', { class: 'tx-field-group' }, [
      el('label', { class: 'tx-field-label' }, ['📍 Location (Optional)']),
      inputLocation
    ]));

    // Notes
    const inputNotes = el('input', {
      type: 'text',
      class: 'tx-field-input',
      id: 'tx-form-notes',
      placeholder: 'Add itemized details or notes...',
      value: existingTx ? (existingTx.notes || '') : ''
    });

    formSection.appendChild(el('div', { class: 'tx-field-group' }, [
      el('label', { class: 'tx-field-label' }, ['📝 Itemized Notes']),
      inputNotes
    ]));

    // Receipt Section
    const receiptBox = el('div', { class: 'receipt-preview-area', style: 'margin-top:4px;' });
    if (currentReceipt) {
      const img = el('img', { class: 'receipt-preview-img', title: 'Receipt Snapshot' });
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60" viewBox="0 0 100 60"><rect width="100" height="60" fill="%23242a3d" rx="6"/><text x="50" y="35" font-size="8" fill="%238b949e" font-family="sans-serif" text-anchor="middle">📎 RECEIPT FILE</text></svg>';
      receiptBox.appendChild(img);
    } else {
      receiptBox.appendChild(el('span', {}, ['No receipt attached.']));
    }

    const receiptFileInput = el('input', { type: 'file', accept: 'image/*', style: 'display:none;' });
    const receiptUploadBtn = el('button', {
      type: 'button',
      class: 'form-btn',
      style: 'padding: 6px 12px; font-size: 11px; width: fit-content; background: rgba(255,255,255,0.08);'
    }, ['📸 Attach / Upload Receipt']);

    receiptUploadBtn.addEventListener('click', () => {
      receiptFileInput.click();
    });

    receiptFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        currentReceipt = 'Simulated Receipt Attachment';
        clearNode(receiptBox);
        const img = el('img', { class: 'receipt-preview-img' });
        img.src = URL.createObjectURL(file);
        receiptBox.appendChild(img);
      }
    });

    formSection.appendChild(el('div', { class: 'tx-field-group' }, [
      el('label', { class: 'tx-field-label' }, ['📸 Receipt Image']),
      el('div', { style: 'display:flex; flex-direction:column; gap:6px;' }, [
        receiptUploadBtn,
        receiptFileInput,
        receiptBox
      ])
    ]));

    page.appendChild(formSection);

    // 5. Recurring Transaction Section (Dedicated Card)
    const recurringCheckbox = el('input', {
      type: 'checkbox',
      checked: isRecurring,
      id: 'tx-recurring-check'
    });

    const frequencySelect = el('select', { class: 'tx-field-input', id: 'tx-recurring-freq' }, [
      el('option', { value: 'daily', selected: recurringFrequency === 'daily' }, ['Daily']),
      el('option', { value: 'weekly', selected: recurringFrequency === 'weekly' }, ['Weekly']),
      el('option', { value: 'bi-weekly', selected: recurringFrequency === 'bi-weekly' }, ['Bi-Weekly (Every 2 weeks)']),
      el('option', { value: 'monthly', selected: recurringFrequency === 'monthly' }, ['Monthly (Recommended)']),
      el('option', { value: 'yearly', selected: recurringFrequency === 'yearly' }, ['Yearly (Annual)'])
    ]);

    const recurringOptions = el('div', {
      class: 'tx-recurring-options',
      style: isRecurring ? 'display:flex;' : 'display:none;'
    }, [
      el('div', { class: 'tx-field-group' }, [
        el('label', { class: 'tx-field-label' }, ['Repeat Interval / Frequency']),
        frequencySelect
      ]),
      el('div', { class: 'tx-recurring-note' }, [
        '🔁 Automatically projects this transaction into future monthly cash flow forecasts.'
      ])
    ]);

    recurringCheckbox.addEventListener('change', () => {
      isRecurring = recurringCheckbox.checked;
      recurringOptions.style.display = isRecurring ? 'flex' : 'none';
    });

    const recurringCard = el('div', { class: 'tx-recurring-card' }, [
      el('div', { class: 'tx-recurring-header' }, [
        el('div', { class: 'tx-recurring-title' }, ['🔁 Recurring Transaction']),
        el('label', { class: 'tx-recurring-toggle-label', for: 'tx-recurring-check' }, [
          recurringCheckbox,
          el('span', {}, ['Repeat'])
        ])
      ]),
      recurringOptions
    ]);
    page.appendChild(recurringCard);

    // 6. Action Buttons for Existing Transactions (Duplicate / Delete)
    if (isEdit && existingTx) {
      const dangerSection = el('div', { class: 'tx-danger-actions' });

      // Duplicate Button
      const duplicateBtn = el('button', {
        type: 'button',
        class: 'tx-duplicate-btn',
        title: 'Create duplicate copy of this transaction'
      }, [
        el('span', {}, ['📋']),
        el('span', {}, ['Duplicate'])
      ]);
      duplicateBtn.addEventListener('click', () => {
        const dup = duplicateTransaction(existingTx.id);
        if (dup) {
          pushSystemNotification('Transaction Duplicated', `Created a copy of ${dup.merchant} ($${dup.amount.toFixed(2)}).`);
          returnToTransactionsFeed();
        }
      });
      dangerSection.appendChild(duplicateBtn);

      // Delete Button
      const deleteBtn = el('button', {
        type: 'button',
        class: 'tx-delete-btn',
        title: 'Permanently remove transaction'
      }, [
        el('span', {}, ['🗑️']),
        el('span', {}, ['Delete'])
      ]);
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete "${existingTx.merchant}" ($${existingTx.amount.toFixed(2)})?`)) {
          deleteTransaction(existingTx.id);
          pushSystemNotification('Transaction Deleted', `Removed transaction record for ${existingTx.merchant}.`);
          returnToTransactionsFeed();
        }
      });
      dangerSection.appendChild(deleteBtn);

      page.appendChild(dangerSection);
    }

    // 7. Prominent Confirm / Cancel Action Area (Bottom of Page)
    const confirmBtn = el('button', {
      type: 'button',
      class: 'tx-confirm-btn',
      id: 'tx-form-confirm-btn'
    }, [
      el('span', {}, ['✔']),
      el('span', {}, [isEdit ? 'Confirm & Save Changes' : 'Confirm Transaction'])
    ]);

    const cancelBtn = el('button', {
      type: 'button',
      class: 'tx-cancel-btn'
    }, ['Cancel & Return']);
    cancelBtn.addEventListener('click', () => {
      returnToTransactionsFeed();
    });

    confirmBtn.addEventListener('click', () => {
      const merchant = inputMerchant.value.trim();
      const amountVal = parseFloat(amountInput.value);
      const category = categoryDropdown.value;
      const accountId = accountSelect.value;
      const tag = inputTag.value.trim();
      const location = inputLocation.value.trim();
      const notes = inputNotes.value.trim();
      const timestampVal = inputTimestamp.value;

      if (!merchant) {
        pushSystemNotification('Input Required', 'Please enter a merchant or payee name.');
        inputMerchant.focus();
        return;
      }

      if (isNaN(amountVal) || amountVal <= 0) {
        pushSystemNotification('Invalid Amount', 'Please specify a positive transaction amount.');
        amountInput.focus();
        return;
      }

      if (isEdit && existingTx) {
        // Adjust account balance differences
        const diff = amountVal - existingTx.amount;
        if (existingTx.accountId !== accountId || existingTx.type !== selectedType) {
          if (existingTx.accountId) applyAccountBalanceDelta(existingTx.accountId, existingTx.type, -existingTx.amount);
          if (accountId) applyAccountBalanceDelta(accountId, selectedType, amountVal);
          existingTx.accountId = accountId;
        } else if (diff !== 0 && existingTx.accountId) {
          applyAccountBalanceDelta(existingTx.accountId, selectedType, diff);
        }

        existingTx.merchant = merchant;
        existingTx.amount = amountVal;
        existingTx.type = selectedType;
        existingTx.category = category;
        existingTx.tag = tag;
        existingTx.tagColor = formTagColor;
        existingTx.location = location;
        existingTx.notes = notes;
        existingTx.icon = selectedIcon;
        existingTx.isRecurring = isRecurring;
        existingTx.recurringFrequency = frequencySelect.value;
        existingTx.receipt = currentReceipt;
        if (timestampVal) {
          existingTx.timestamp = new Date(timestampVal).toISOString();
        }
        if (tag) setTagColor(tag, formTagColor);

        saveState();
        calculateStats();
        triggerProactiveAdvice();
        pushSystemNotification('Transaction Updated', `Saved modifications for ${merchant} ($${amountVal.toFixed(2)}).`);
        returnToTransactionsFeed();

      } else {
        // Create new transaction record
        const newTx = {
          id: 'tx-' + Date.now(),
          timestamp: timestampVal ? new Date(timestampVal).toISOString() : new Date().toISOString(),
          merchant: merchant,
          amount: amountVal,
          type: selectedType,
          category: category,
          tag: tag,
          tagColor: formTagColor,
          location: location,
          notes: notes,
          verified: false,
          accountId: accountId,
          icon: selectedIcon,
          isRecurring: isRecurring,
          recurringFrequency: frequencySelect.value,
          receipt: currentReceipt,
          refunds: []
        };

        if (tag) setTagColor(tag, formTagColor);

        // Apply balance delta
        if (accountId) {
          applyAccountBalanceDelta(accountId, selectedType, amountVal);
        }

        state.transactions.unshift(newTx);
        recalculateBudgetSpent();
        saveState();
        calculateStats();
        triggerProactiveAdvice();

        pushSystemNotification(
          'Transaction Confirmed',
          `Added ${selectedIcon} ${selectedType === 'income' ? '+$' : '-$'}${amountVal.toFixed(2)} for ${merchant}.`
        );
        returnToTransactionsFeed();
      }
    });

    const confirmActions = el('div', { class: 'tx-confirm-actions' }, [
      confirmBtn,
      cancelBtn
    ]);
    page.appendChild(confirmActions);

    container.appendChild(page);
  }

  // --- Startup Lifecycle Hook ---
  window.addEventListener('DOMContentLoaded', () => {
    // Screen optimization for Pixel & Android mobile devices
    if (window.innerWidth <= 1024 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.matchMedia('(display-mode: standalone)').matches || location.protocol === 'file:' || /wv|WebView/i.test(navigator.userAgent)) {
      document.documentElement.classList.add('native-mobile-app');
      document.body.classList.add('native-mobile-app');
    }

    // Load state parameters
    loadState();
    
    // Bind hardware and footer elements
    bindHardwareControls();
    bindFooterTabs();
    bindFloatingActionButton();
    
    // Bind sidebar simulators
    bindSimulatorButtons();
    
    // Startup systems
    startClock();
    calculateStats();
    triggerProactiveAdvice();
    
    // Initialize Dashboard
    initApp();

    // Register PWA service worker securely
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('Waterfall PWA Service Worker registered successfully.'))
        .catch(err => console.warn('Service Worker registration failed:', err));
    }
  });

})();

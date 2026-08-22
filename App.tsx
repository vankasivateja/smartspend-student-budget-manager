import { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  Check,
  CircleDollarSign,
  Coffee,
  Download,
  IndianRupee,
  LayoutDashboard,
  Pencil,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  TrendingUp,
  WalletCards,
  X,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Education'
  | 'Entertainment'
  | 'Bills'
  | 'Other';

type Expense = {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
};

type View = 'dashboard' | 'expenses' | 'analytics' | 'about';
type Notice = { message: string; type?: 'error' };

const categories: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Education',
  'Entertainment',
  'Bills',
  'Other',
];

const categoryColors: Record<Category, string> = {
  Food: '#e98d50',
  Transport: '#5e9db1',
  Shopping: '#c87995',
  Education: '#7b8fc9',
  Entertainment: '#c59b45',
  Bills: '#798b77',
  Other: '#9a7c68',
};

const storageKey = 'student-expense-tracker-expenses';
const budgetStorageKey = 'smartspend-monthly-budget';

const SITE_URL =
  'https://vankasivateja.github.io/smartspend-student-budget-manager/';

const DEVELOPER_NAME = 'Vanka Siva Teja';
const DEVELOPER_EMAIL = 'sivatejavanka118@gmail.com';

/*
 * IMPORTANT:
 * Replace this with your real LinkedIn profile URL.
 *
 * Example:
 * https://www.linkedin.com/in/vanka-siva-teja/
 */
const LINKEDIN_URL = 'https://www.linkedin.com/in/siva-teja-vanka-455bba33a?utm_source=share_via&utm_content=profile&utm_medium=member_android';

const GITHUB_URL = 'https://github.com/vankasivateja';

const today = () => new Date().toISOString().slice(0, 10);

function readExpenses(): Expense[] {
  try {
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) return [];

    const parsed = JSON.parse(stored) as Expense[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveExpenses(expenses: Expense[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(expenses));
  } catch {
    // The UI remains usable if browser storage is unavailable.
  }
}

function readBudget() {
  try {
    const stored = window.localStorage.getItem(budgetStorageKey);
    const parsed = Number(stored);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function saveBudget(budget: number) {
  try {
    if (budget > 0) {
      window.localStorage.setItem(budgetStorageKey, String(budget));
    } else {
      window.localStorage.removeItem(budgetStorageKey);
    }
  } catch {
    // Keep the budget controls usable when browser storage is unavailable.
  }
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}

function categoryClass(category: Category) {
  return category.toLowerCase().replace(' ', '-');
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(readExpenses);
  const [view, setView] = useState<View>('dashboard');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [expenseToDelete, setExpenseToDelete] =
    useState<Expense | null>(null);
  const [expenseToEdit, setExpenseToEdit] =
    useState<Expense | null>(null);
  const [monthlyBudget, setMonthlyBudget] = useState(readBudget);
  const [budgetInput, setBudgetInput] = useState(() =>
    String(readBudget() || ''),
  );
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] =
    useState<'All' | Category>('All');
  const [sortBy, setSortBy] =
    useState<'date' | 'amount'>('date');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] =
    useState<'' | Category>('');
  const [date, setDate] = useState(today);
  const [formErrors, setFormErrors] =
    useState<Record<string, string>>({});

  /*
   * SEO metadata
   *
   * This tells search engines what this website is about
   * and who created it.
   */
  useEffect(() => {
    document.title =
      'Vanka Siva Teja | SmartSpend Student Budget Manager';

    const setMeta = (
      name: string,
      content: string,
      attribute: 'name' | 'property' = 'name',
    ) => {
      let meta = document.head.querySelector(
        `meta[${attribute}="${name}"]`,
      ) as HTMLMetaElement | null;

      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    setMeta(
      'description',
      'SmartSpend is a student budget manager created by Vanka Siva Teja to help students track expenses, manage budgets, and develop better financial habits.',
    );

    setMeta('author', DEVELOPER_NAME);

    setMeta(
      'keywords',
      'Vanka Siva Teja, SmartSpend, Student Budget Manager, student expense tracker, personal finance, budget manager',
    );

    setMeta(
      'robots',
      'index, follow',
    );

    setMeta(
      'og:title',
      'Vanka Siva Teja | SmartSpend Student Budget Manager',
      'property',
    );

    setMeta(
      'og:description',
      'SmartSpend — Student Budget Manager created by Vanka Siva Teja.',
      'property',
    );

    setMeta(
      'og:url',
      SITE_URL,
      'property',
    );

    setMeta(
      'og:type',
      'website',
      'property',
    );

    setMeta(
      'og:site_name',
      'SmartSpend',
      'property',
    );

    setMeta(
      'twitter:card',
      'summary',
    );

    setMeta(
      'twitter:title',
      'Vanka Siva Teja | SmartSpend Student Budget Manager',
    );

    setMeta(
      'twitter:description',
      'SmartSpend — Student Budget Manager created by Vanka Siva Teja.',
    );
  }, []);

  /*
   * Person structured data
   *
   * This helps search engines understand that
   * Vanka Siva Teja is the creator/developer of SmartSpend.
   */
  useEffect(() => {
    const scriptId = 'developer-person-schema';

    let script = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';

      document.head.appendChild(script);
    }

    const sameAs: string[] = [
      GITHUB_URL,
    ];

    /*
     * Only add LinkedIn if the real URL has been provided.
     */
    if (
      LINKEDIN_URL &&
      LINKEDIN_URL !== 'YOUR_LINKEDIN_PROFILE_URL'
    ) {
      sameAs.push(LINKEDIN_URL);
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: DEVELOPER_NAME,
      email: `mailto:${DEVELOPER_EMAIL}`,
      jobTitle: 'Creator & Developer of SmartSpend',
      url: SITE_URL,
      sameAs,
      knowsAbout: [
        'Student Budget Management',
        'Personal Finance',
        'Expense Tracking',
        'Web Development',
      ],
    });

    return () => {
      script?.remove();
    };
  }, []);

  /*
   * Website structured data
   */
  useEffect(() => {
    const scriptId = 'smartspend-website-schema';

    let script = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';

      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'SmartSpend',
      alternateName: 'SmartSpend Student Budget Manager',
      url: SITE_URL,
      description:
        'A student budget manager for tracking expenses and managing monthly spending.',
      creator: {
        '@type': 'Person',
        name: DEVELOPER_NAME,
        email: `mailto:${DEVELOPER_EMAIL}`,
      },
    });

    return () => {
      script?.remove();
    };
  }, []);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveBudget(monthlyBudget);
  }, [monthlyBudget]);

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(
      () => setNotice(null),
      3200,
    );

    return () => window.clearTimeout(timeout);
  }, [notice]);

  const currentMonth = new Date()
    .toISOString()
    .slice(0, 7);

  const monthExpenses = useMemo(
    () =>
      expenses.filter(
        (expense) =>
          expense.date.slice(0, 7) === currentMonth,
      ),
    [expenses, currentMonth],
  );

  const total = useMemo(
    () =>
      expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      ),
    [expenses],
  );

  const monthTotal = useMemo(
    () =>
      monthExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      ),
    [monthExpenses],
  );

  const budgetPercent =
    monthlyBudget > 0
      ? Math.round(
          (monthTotal / monthlyBudget) * 100,
        )
      : 0;

  const budgetRemaining =
    monthlyBudget - monthTotal;

  const highestCategory = useMemo(() => {
    const totals = expenses.reduce<
      Partial<Record<Category, number>>
    >((result, expense) => {
      result[expense.category] =
        (result[expense.category] ?? 0) +
        expense.amount;

      return result;
    }, {});

    return categories.reduce<Category | null>(
      (highest, item) => {
        if (!totals[item]) return highest;

        if (
          !highest ||
          (totals[item] ?? 0) >
            (totals[highest] ?? 0)
        ) {
          return item;
        }

        return highest;
      },
      null,
    );
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...expenses]
      .filter((expense) => {
        const matchesQuery =
          !query ||
          expense.description
            .toLowerCase()
            .includes(query) ||
          expense.category
            .toLowerCase()
            .includes(query);

        return (
          matchesQuery &&
          (filterCategory === 'All' ||
            expense.category === filterCategory)
        );
      })
      .sort((a, b) =>
        sortBy === 'date'
          ? b.date.localeCompare(a.date) ||
            b.id.localeCompare(a.id)
          : b.amount - a.amount,
      );
  }, [
    expenses,
    filterCategory,
    search,
    sortBy,
  ]);

  const categoryData = useMemo(
    () =>
      categories
        .map((item) => ({
          name: item,
          value: expenses
            .filter(
              (expense) =>
                expense.category === item,
            )
            .reduce(
              (sum, expense) =>
                sum + expense.amount,
              0,
            ),
        }))
        .filter((item) => item.value > 0),
    [expenses],
  );

  const timeData = useMemo(() => {
    const grouped = expenses.reduce<
      Record<string, number>
    >((result, expense) => {
      result[expense.date] =
        (result[expense.date] ?? 0) +
        expense.amount;

      return result;
    }, {});

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) =>
        dateA.localeCompare(dateB),
      )
      .map(([dateValue, value]) => ({
        date: new Intl.DateTimeFormat(
          'en-IN',
          {
            day: 'numeric',
            month: 'short',
          },
        ).format(
          new Date(`${dateValue}T12:00:00`),
        ),
        amount: value,
      }));
  }, [expenses]);

  function goTo(nextView: View) {
    setView(nextView);

    window.setTimeout(() => {
      document
        .getElementById('app-content')
        ?.scrollIntoView({
          behavior: 'smooth',
        });
    }, 0);
  }

  function submitExpense(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const errors: Record<string, string> = {};

    if (!description.trim()) {
      errors.description =
        'Add a short description.';
    }

    if (!amount || Number(amount) <= 0) {
      errors.amount =
        'Enter an amount above ₹0.';
    }

    if (!category) {
      errors.category =
        'Choose a category.';
    }

    if (!date) {
      errors.date = 'Choose a date.';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const expenseValues = {
      description: description.trim(),
      amount: Number(amount),
      category: category as Category,
      date,
    };

    if (expenseToEdit) {
      setExpenses((current) =>
        current.map((expense) =>
          expense.id === expenseToEdit.id
            ? {
                ...expense,
                ...expenseValues,
              }
            : expense,
        ),
      );

      setExpenseToEdit(null);

      setNotice({
        message:
          'Expense updated successfully.',
      });
    } else {
      setExpenses((current) => [
        {
          id: `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`,
          ...expenseValues,
        },
        ...current,
      ]);

      setNotice({
        message:
          'Expense added. Nice work keeping track.',
      });
    }

    setDescription('');
    setAmount('');
    setCategory('');
    setDate(today());
    setFormErrors({});
  }

  function startEditing(expense: Expense) {
    setExpenseToEdit(expense);
    setDescription(expense.description);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setDate(expense.date);
    setFormErrors({});

    goTo('dashboard');

    window.setTimeout(
      () =>
        document
          .getElementById('description')
          ?.focus(),
      250,
    );
  }

  function saveBudgetFromInput(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextBudget = Number(budgetInput);

    if (!nextBudget || nextBudget <= 0) {
      setNotice({
        message:
          'Enter a monthly budget above ₹0.',
        type: 'error',
      });

      return;
    }

    setMonthlyBudget(nextBudget);
    setBudgetInput(String(nextBudget));

    setNotice({
      message: 'Monthly budget saved.',
    });
  }

  function exportCsv() {
    if (!expenses.length) {
      setNotice({
        message:
          'Add an expense before exporting.',
        type: 'error',
      });

      return;
    }

    const escapeCsv = (
      value: string | number,
    ) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const rows = [
      [
        'Description',
        'Amount',
        'Category',
        'Date',
      ],
      ...expenses.map((expense) => [
        expense.description,
        expense.amount,
        expense.category,
        expense.date,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map(escapeCsv).join(','),
      )
      .join('\n');

    const url = URL.createObjectURL(
      new Blob([csv], {
        type: 'text/csv;charset=utf-8;',
      }),
    );

    const link = document.createElement('a');

    link.href = url;
    link.download = `smartspend-expenses-${currentMonth}.csv`;

    link.click();

    URL.revokeObjectURL(url);

    setNotice({
      message: 'CSV export downloaded.',
    });
  }

  function confirmDelete() {
    if (!expenseToDelete) return;

    setExpenses((current) =>
      current.filter(
        (expense) =>
          expense.id !== expenseToDelete.id,
      ),
    );

    setExpenseToDelete(null);

    setNotice({
      message:
        'Expense removed from your tracker.',
    });
  }

  const navItems: {
    id: View;
    label: string;
    icon: typeof LayoutDashboard;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: Receipt,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'about',
      label: 'About',
      icon: Sparkles,
    },
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() =>
            goTo('dashboard')
          }
          data-testid="button-brand-home"
        >
          <span className="brand-mark">
            <IndianRupee
              size={19}
              strokeWidth={2.4}
            />
          </span>

          <span>
            <span className="brand-name">
              pocket / pause
            </span>

            <span className="brand-kicker">
              smartspend · student budget
              manager
            </span>
          </span>
        </button>

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
        >
          {navItems.map(
            ({
              id,
              label,
            }) => (
              <button
                className={`nav-button ${
                  view === id
                    ? 'active'
                    : ''
                }`}
                key={id}
                onClick={() =>
                  goTo(id)
                }
                aria-current={
                  view === id
                    ? 'page'
                    : undefined
                }
                data-testid={`nav-${id}`}
              >
                {label}
              </button>
            ),
          )}
        </nav>
      </header>

      <main
        className="main-content"
        id="app-content"
      >
        {view === 'dashboard' && (
          <section
            className="view"
            data-testid="view-dashboard"
          >
            <p className="eyebrow">
              Your money, in focus
            </p>

            <h1 className="page-heading">
              A calmer way to notice{' '}
              <em>
                the little things.
              </em>
            </h1>

            <p className="page-subtitle">
              Keep a gentle record of
              your everyday spending. No
              judgement, just a clearer
              picture of student life.
            </p>

            <div className="dashboard-grid">
              <div className="stats-grid">
                <article
                  className="stat-card primary-stat"
                  data-testid="stat-total"
                >
                  <div className="stat-label">
                    <span>
                      All-time spend
                    </span>

                    <span className="stat-icon">
                      <CircleDollarSign
                        size={16}
                      />
                    </span>
                  </div>

                  <div className="stat-value">
                    {formatMoney(total)}
                  </div>

                  <p className="stat-note">
                    Across every logged
                    expense
                  </p>
                </article>

                <article
                  className="stat-card"
                  data-testid="stat-month"
                >
                  <div className="stat-label">
                    <span>
                      This month
                    </span>

                    <span className="stat-icon">
                      <CalendarDays
                        size={16}
                      />
                    </span>
                  </div>

                  <div className="stat-value">
                    {formatMoney(
                      monthTotal,
                    )}
                  </div>

                  <p className="stat-note">
                    {monthExpenses.length}{' '}
                    {monthExpenses.length ===
                    1
                      ? 'entry'
                      : 'entries'}{' '}
                    so far
                  </p>
                </article>

                <article
                  className="stat-card"
                  data-testid="stat-count"
                >
                  <div className="stat-label">
                    <span>
                      Transactions
                    </span>

                    <span className="stat-icon">
                      <Receipt
                        size={16}
                      />
                    </span>
                  </div>

                  <div className="stat-value">
                    {expenses.length}
                  </div>

                  <p className="stat-note">
                    Small notes add up
                  </p>
                </article>

                <article
                  className="stat-card"
                  data-testid="stat-highest-category"
                >
                  <div className="stat-label">
                    <span>
                      Top category
                    </span>

                    <span className="stat-icon">
                      <TrendingUp
                        size={16}
                      />
                    </span>
                  </div>

                  <div
                    className="stat-value"
                    style={{
                      fontFamily:
                        'var(--app-font-sans)',
                      fontSize: 20,
                    }}
                  >
                    {highestCategory ??
                      '—'}
                  </div>

                  <p className="stat-note">
                    {highestCategory
                      ? 'Where most is going'
                      : 'Waiting for your first entry'}
                  </p>
                </article>
              </div>

              <section
                className="panel budget-panel"
                aria-labelledby="budget-heading"
              >
                <div className="panel-header">
                  <div>
                    <h2 id="budget-heading">
                      Monthly budget
                    </h2>

                    <p>
                      Set a gentle limit
                      for{' '}
                      {new Intl.DateTimeFormat(
                        'en-IN',
                        {
                          month:
                            'long',
                        },
                      ).format(
                        new Date(),
                      )}
                      .
                    </p>
                  </div>

                  <span className="stat-icon">
                    <WalletCards
                      size={17}
                    />
                  </span>
                </div>

                <form
                  className="budget-form"
                  onSubmit={
                    saveBudgetFromInput
                  }
                >
                  <div className="amount-wrap">
                    <span className="rupee">
                      ₹
                    </span>

                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={
                        budgetInput
                      }
                      onChange={(event) =>
                        setBudgetInput(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Set monthly budget"
                      aria-label="Monthly budget"
                      data-testid="input-budget"
                    />
                  </div>

                  <button
                    className="button"
                    type="submit"
                    data-testid="button-save-budget"
                  >
                    Save budget
                  </button>
                </form>

                <div className="budget-metrics">
                  <div>
                    <span>
                      Budget
                    </span>

                    <strong>
                      {monthlyBudget
                        ? formatMoney(
                            monthlyBudget,
                          )
                        : 'Not set'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Spent
                    </span>

                    <strong>
                      {formatMoney(
                        monthTotal,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Remaining
                    </span>

                    <strong
                      className={
                        budgetRemaining <
                        0
                          ? 'over-budget'
                          : ''
                      }
                    >
                      {monthlyBudget
                        ? formatMoney(
                            Math.abs(
                              budgetRemaining,
                            ),
                          )
                        : '—'}

                      {monthlyBudget &&
                      budgetRemaining <
                        0
                        ? ' over'
                        : ''}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Used
                    </span>

                    <strong>
                      {monthlyBudget
                        ? `${budgetPercent}%`
                        : '—'}
                    </strong>
                  </div>
                </div>

                {monthlyBudget >
                  0 && (
                  <div
                    className="budget-progress"
                    aria-label={`${budgetPercent}% of monthly budget used`}
                  >
                    <span
                      style={{
                        width: `${Math.min(
                          budgetPercent,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                )}

                {monthlyBudget >
                  0 &&
                  budgetPercent >=
                    100 && (
                    <div
                      className="budget-alert danger-alert"
                      role="alert"
                    >
                      You’re over budget
                      this month. Consider
                      pausing non-essential
                      spending.
                    </div>
                  )}

                {monthlyBudget >
                  0 &&
                  budgetPercent >=
                    80 &&
                  budgetPercent <
                    100 && (
                    <div
                      className="budget-alert warning-alert"
                      role="status"
                    >
                      You’ve used{' '}
                      {budgetPercent}% of
                      your monthly
                      budget.
                    </div>
                  )}
              </section>

              <section
                className="panel add-panel"
                aria-labelledby="add-heading"
              >
                <div className="panel-header">
                  <div>
                    <h2 id="add-heading">
                      {expenseToEdit
                        ? 'Edit expense'
                        : 'Log a purchase'}
                    </h2>

                    <p>
                      One line at a time
                      is enough.
                    </p>
                  </div>

                  <span className="stat-icon">
                    <Plus size={17} />
                  </span>
                </div>

                <form
                  className="form-grid"
                  onSubmit={
                    submitExpense
                  }
                  noValidate
                >
                  <div className="field">
                    <label htmlFor="description">
                      What was it?
                    </label>

                    <input
                      id="description"
                      className={`input ${
                        formErrors.description
                          ? 'input-error'
                          : ''
                      }`}
                      value={
                        description
                      }
                      onChange={(event) =>
                        setDescription(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Canteen lunch, metro pass..."
                      data-testid="input-description"
                    />

                    {formErrors.description && (
                      <p className="error-text">
                        {
                          formErrors.description
                        }
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="amount">
                      Amount
                    </label>

                    <div className="amount-wrap">
                      <span className="rupee">
                        ₹
                      </span>

                      <input
                        id="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        className={`input ${
                          formErrors.amount
                            ? 'input-error'
                            : ''
                        }`}
                        value={
                          amount
                        }
                        onChange={(event) =>
                          setAmount(
                            event.target
                              .value,
                          )
                        }
                        placeholder="0"
                        data-testid="input-amount"
                      />
                    </div>

                    {formErrors.amount && (
                      <p className="error-text">
                        {
                          formErrors.amount
                        }
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="category">
                      Category
                    </label>

                    <select
                      id="category"
                      className={`select ${
                        formErrors.category
                          ? 'input-error'
                          : ''
                      }`}
                      value={
                        category
                      }
                      onChange={(event) =>
                        setCategory(
                          event.target
                            .value as
                            | ''
                            | Category,
                        )
                      }
                      data-testid="select-category"
                    >
                      <option value="">
                        Choose one
                      </option>

                      {categories.map(
                        (item) => (
                          <option
                            value={item}
                            key={item}
                          >
                            {item}
                          </option>
                        ),
                      )}
                    </select>

                    {formErrors.category && (
                      <p className="error-text">
                        {
                          formErrors.category
                        }
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label htmlFor="date">
                      Date
                    </label>

                    <input
                      id="date"
                      type="date"
                      className={`input ${
                        formErrors.date
                          ? 'input-error'
                          : ''
                      }`}
                      value={date}
                      onChange={(event) =>
                        setDate(
                          event.target
                            .value,
                        )
                      }
                      data-testid="input-date"
                    />

                    {formErrors.date && (
                      <p className="error-text">
                        {
                          formErrors.date
                        }
                      </p>
                    )}
                  </div>

                  <button
                    className="button"
                    type="submit"
                    data-testid="button-add-expense"
                  >
                    <Plus size={16} />

                    {expenseToEdit
                      ? 'Save changes'
                      : 'Add expense'}
                  </button>

                  {expenseToEdit && (
                    <button
                      className="button ghost"
                      type="button"
                      onClick={() => {
                        setExpenseToEdit(
                          null,
                        );
                        setDescription(
                          '',
                        );
                        setAmount('');
                        setCategory('');
                        setDate(today());
                      }}
                    >
                      <X size={16} />
                      Cancel edit
                    </button>
                  )}
                </form>
              </section>

              <section
                className="panel activity-panel"
                aria-labelledby="activity-heading"
              >
                <div className="panel-header">
                  <div>
                    <h2 id="activity-heading">
                      Recent notes
                    </h2>

                    <p>
                      Your five latest
                      entries
                    </p>
                  </div>

                  <button
                    className="button ghost"
                    onClick={() =>
                      goTo(
                        'expenses',
                      )
                    }
                    data-testid="button-view-all"
                  >
                    View all
                  </button>
                </div>

                {expenses.length ===
                0 ? (
                  <div className="empty-mini">
                    <Coffee size={25} />

                    <div>
                      No entries yet.
                      <br />
                      Your first one
                      can be tiny.
                    </div>
                  </div>
                ) : (
                  <div className="activity-list">
                    {[
                      ...expenses,
                    ]
                      .sort((a, b) =>
                        b.date.localeCompare(
                          a.date,
                        ),
                      )
                      .slice(0, 5)
                      .map(
                        (
                          expense,
                          index,
                        ) => (
                          <div
                            className="activity-item"
                            style={{
                              animationDelay: `${
                                index *
                                55
                              }ms`,
                            }}
                            key={
                              expense.id
                            }
                            data-testid={`activity-${expense.id}`}
                          >
                            <span
                              className={`category-dot ${categoryClass(
                                expense.category,
                              )}`}
                            />

                            <div className="activity-copy">
                              <strong>
                                {
                                  expense.description
                                }
                              </strong>

                              <span>
                                {
                                  expense.category
                                }{' '}
                                ·{' '}
                                {formatDate(
                                  expense.date,
                                )}
                              </span>
                            </div>

                            <span className="money">
                              {formatMoney(
                                expense.amount,
                              )}
                            </span>
                          </div>
                        ),
                      )}
                  </div>
                )}
              </section>
            </div>
          </section>
        )}

        {view === 'expenses' && (
          <section
            className="view"
            data-testid="view-expenses"
          >
            <p className="eyebrow">
              Every rupee has a story
            </p>

            <h1 className="page-heading">
              Your{' '}
              <em>expense log.</em>
            </h1>

            <p className="page-subtitle">
              Search, sort, and make sense
              of the everyday choices behind
              your total.
            </p>

            <section
              className="panel list-view"
              aria-labelledby="list-heading"
            >
              <div className="section-heading">
                <div>
                  <h2 id="list-heading">
                    All expenses
                  </h2>

                  <p>
                    {filteredExpenses.length}{' '}
                    of {expenses.length}{' '}
                    shown
                  </p>
                </div>

                <button
                  className="button ghost"
                  onClick={exportCsv}
                  data-testid="button-export-csv"
                >
                  <Download size={15} />
                  Export CSV
                </button>
              </div>

              <div className="toolbar">
                <div className="search-wrap">
                  <Search size={15} />

                  <input
                    className="input"
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Search description or category"
                    aria-label="Search expenses"
                    data-testid="input-search"
                  />
                </div>

                <select
                  className="select"
                  value={
                    filterCategory
                  }
                  onChange={(event) =>
                    setFilterCategory(
                      event.target
                        .value as
                        | 'All'
                        | Category,
                    )
                  }
                  aria-label="Filter by category"
                  data-testid="select-filter-category"
                >
                  <option value="All">
                    All categories
                  </option>

                  {categories.map(
                    (item) => (
                      <option
                        value={item}
                        key={item}
                      >
                        {item}
                      </option>
                    ),
                  )}
                </select>

                <select
                  className="select"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target
                        .value as
                        | 'date'
                        | 'amount',
                    )
                  }
                  aria-label="Sort expenses"
                  data-testid="select-sort"
                >
                  <option value="date">
                    Newest first
                  </option>

                  <option value="amount">
                    Highest amount
                  </option>
                </select>
              </div>

              <div className="expense-table">
                {filteredExpenses.length ===
                0 ? (
                  <div
                    className="empty-state"
                    data-testid="empty-expenses"
                  >
                    <div className="empty-illustration">
                      <Receipt
                        size={27}
                      />
                    </div>

                    <h3>
                      {expenses.length ===
                      0
                        ? 'A blank page can be a good start.'
                        : 'Nothing matches that search.'}
                    </h3>

                    <p>
                      {expenses.length ===
                      0
                        ? 'No expenses yet. Add your first expense to start tracking your spending.'
                        : 'Try a different word or clear the filters to see your full log.'}
                    </p>

                    {expenses.length ===
                      0 && (
                      <button
                        className="button"
                        onClick={() =>
                          goTo(
                            'dashboard',
                          )
                        }
                        data-testid="button-empty-add"
                      >
                        <Plus
                          size={16}
                        />
                        Add your first
                        expense
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="expense-head">
                      <span>
                        Expense
                      </span>
                      <span>
                        Category
                      </span>
                      <span>
                        Date
                      </span>
                      <span>
                        Amount
                      </span>
                      <span aria-hidden="true" />
                    </div>

                    {filteredExpenses.map(
                      (
                        expense,
                        index,
                      ) => (
                        <div
                          className="expense-row"
                          style={{
                            animationDelay: `${
                              index *
                              45
                            }ms`,
                          }}
                          key={
                            expense.id
                          }
                          data-testid={`row-expense-${expense.id}`}
                        >
                          <div className="expense-description">
                            <strong>
                              {
                                expense.description
                              }
                            </strong>

                            <span>
                              Added to
                              your
                              journal
                            </span>
                          </div>

                          <span className="tag">
                            {
                              expense.category
                            }
                          </span>

                          <span className="date-copy">
                            {formatDate(
                              expense.date,
                            )}
                          </span>

                          <span className="money">
                            {formatMoney(
                              expense.amount,
                            )}
                          </span>

                          <div className="row-actions">
                            <button
                              className="row-edit"
                              onClick={() =>
                                startEditing(
                                  expense,
                                )
                              }
                              aria-label={`Edit ${expense.description}`}
                              data-testid={`button-edit-${expense.id}`}
                            >
                              <Pencil
                                size={15}
                              />
                            </button>

                            <button
                              className="row-delete"
                              onClick={() =>
                                setExpenseToDelete(
                                  expense,
                                )
                              }
                              aria-label={`Delete ${expense.description}`}
                              data-testid={`button-delete-${expense.id}`}
                            >
                              <Trash2
                                size={15}
                              />
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </>
                )}
              </div>
            </section>
          </section>
        )}

        {view === 'analytics' && (
          <section
            className="view"
            data-testid="view-analytics"
          >
            <p className="eyebrow">
              Patterns, not pressure
            </p>

            <h1 className="page-heading">
              See your spending{' '}
              <em>take shape.</em>
            </h1>

            <p className="page-subtitle">
              A visual check-in built from
              your own notes. Add or remove
              an expense and the picture
              changes with it.
            </p>

            <div className="chart-grid">
              <section
                className="panel chart-box"
                aria-labelledby="category-chart-heading"
              >
                <div className="panel-header">
                  <div>
                    <h2 id="category-chart-heading">
                      By category
                    </h2>

                    <p>
                      Where your money
                      is going
                    </p>
                  </div>

                  <span className="stat-icon">
                    <ShoppingBag
                      size={16}
                    />
                  </span>
                </div>

                {categoryData.length ===
                0 ? (
                  <div className="chart-empty">
                    Your category story
                    <br />
                    will appear here.
                  </div>
                ) : (
                  <div className="donut-layout">
                    <div className="chart-wrap">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <PieChart>
                          <Pie
                            data={
                              categoryData
                            }
                            dataKey="value"
                            nameKey="name"
                            innerRadius={
                              60
                            }
                            outerRadius={
                              88
                            }
                            paddingAngle={
                              3
                            }
                            stroke="none"
                          >
                            {categoryData.map(
                              (
                                item,
                              ) => (
                                <Cell
                                  key={
                                    item.name
                                  }
                                  fill={
                                    categoryColors[
                                      item.name as Category
                                    ]
                                  }
                                />
                              ),
                            )}
                          </Pie>

                          <Tooltip
                            formatter={(
                              value: number,
                            ) =>
                              formatMoney(
                                value,
                              )
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="legend">
                      {categoryData.map(
                        (item) => (
                          <div
                            className="legend-row"
                            key={
                              item.name
                            }
                          >
                            <span
                              className={`category-dot ${categoryClass(
                                item.name as Category,
                              )}`}
                            />

                            <span>
                              {
                                item.name
                              }
                            </span>

                            <span>
                              {formatMoney(
                                item.value,
                              )}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </section>

              <section
                className="panel chart-box"
                aria-labelledby="time-chart-heading"
              >
                <div className="panel-header">
                  <div>
                    <h2 id="time-chart-heading">
                      Over time
                    </h2>

                    <p>
                      Daily rhythm of
                      your spending
                    </p>
                  </div>

                  <span className="stat-icon">
                    <TrendingUp
                      size={16}
                    />
                  </span>
                </div>

                {timeData.length ===
                0 ? (
                  <div className="chart-empty">
                    Log a few expenses
                    to
                    <br />
                    see your rhythm.
                  </div>
                ) : (
                  <div className="chart-wrap">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={
                          timeData
                        }
                        margin={{
                          top: 8,
                          right: 4,
                          left: -19,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid
                          vertical={false}
                          stroke="#dedbd0"
                          strokeDasharray="3 3"
                        />

                        <XAxis
                          dataKey="date"
                          tick={{
                            fontSize: 10,
                            fill: '#71807d',
                          }}
                          tickLine={
                            false
                          }
                          axisLine={
                            false
                          }
                        />

                        <YAxis
                          tick={{
                            fontSize: 10,
                            fill: '#71807d',
                          }}
                          tickLine={
                            false
                          }
                          axisLine={
                            false
                          }
                          tickFormatter={(
                            value,
                          ) =>
                            `₹${value}`
                          }
                        />

                        <Tooltip
                          formatter={(
                            value: number,
                          ) =>
                            formatMoney(
                              value,
                            )
                          }
                          cursor={{
                            fill: 'rgba(28, 87, 81, .06)',
                          }}
                        />

                        <Bar
                          dataKey="amount"
                          fill="#1c5751"
                          radius={[
                            6,
                            6,
                            2,
                            2,
                          ]}
                          maxBarSize={
                            38
                          }
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>
            </div>
          </section>
        )}

        {view === 'about' && (
          <section
            className="view"
            data-testid="view-about"
          >
            <p className="eyebrow">
              A small tool with a clear
              purpose
            </p>

            <div className="about-card">
              <h2>
                Money is a tool for your{' '}
                <em>
                  next good day.
                </em>
              </h2>

              <div className="about-copy">
                <p>
                  SmartSpend is a simple
                  personal finance tool
                  designed to help students
                  understand and manage their
                  daily spending.
                </p>

                <ul className="about-points">
                  <li>
                    <Check size={15} />
                    Private by default,
                    stored only in this
                    browser
                  </li>

                  <li>
                    <Check size={15} />
                    Simple enough for a
                    busy campus day
                  </li>

                  <li>
                    <Check size={15} />
                    Visual enough to spot a
                    useful pattern
                  </li>
                </ul>

                {/* Developer information */}
                <div
                  style={{
                    marginTop: '40px',
                    paddingTop: '30px',
                    borderTop:
                      '1px solid #dedbd0',
                  }}
                >
                  <p className="eyebrow">
                    About the developer
                  </p>

                  <h2
                    style={{
                      fontFamily:
                        'var(--app-font-sans)',
                      fontSize: 28,
                      marginBottom: 10,
                    }}
                  >
                    Vanka Siva Teja
                  </h2>

                  <p>
                    Creator &amp;
                    Developer of SmartSpend
                    — Student Budget Manager.
                  </p>

                  <p>
                    SmartSpend was created
                    to help students track
                    expenses, manage budgets,
                    and develop better
                    financial habits.
                  </p>

                  <div
                    style={{
                      marginTop: '24px',
                      display: 'flex',
                      flexDirection:
                        'column',
                      gap: '12px',
                    }}
                  >
                    {/* Email */}
                    <a
                      href={`mailto:${DEVELOPER_EMAIL}`}
                      style={{
                        color:
                          'inherit',
                        textDecoration:
                          'none',
                      }}
                    >
                      📧{' '}
                      {
                        DEVELOPER_EMAIL
                      }
                    </a>

                    {/* LinkedIn */}
                    {LINKEDIN_URL !==
                      'YOUR_LINKEDIN_PROFILE_URL' && (
                      <a
                        href={
                          LINKEDIN_URL
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color:
                            'inherit',
                          textDecoration:
                            'none',
                        }}
                      >
                        🔗 LinkedIn
                      </a>
                    )}

                    {/* GitHub */}
                    <a
                      href={
                        GITHUB_URL
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color:
                          'inherit',
                        textDecoration:
                          'none',
                      }}
                    >
                      💻 GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        Built with HTML, CSS &amp; JavaScript
        {' | '}
        Student Expense Tracker
        {' | '}
        Created by Vanka Siva Teja
      </footer>

      <nav
        className="mobile-nav"
        aria-label="Mobile navigation"
      >
        {navItems.map(
          ({
            id,
            label,
            icon: Icon,
          }) => (
            <button
              className={`mobile-nav-button ${
                view === id
                  ? 'active'
                  : ''
              }`}
              key={id}
              onClick={() =>
                goTo(id)
              }
              aria-current={
                view === id
                  ? 'page'
                  : undefined
              }
              data-testid={`mobile-nav-${id}`}
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ),
        )}
      </nav>

      {notice && (
        <div
          className={`toast ${
            notice.type === 'error'
              ? 'error'
              : ''
          }`}
          role="status"
          data-testid="status-notification"
        >
          <Check size={16} />
          {notice.message}
        </div>
      )}

      {expenseToDelete && (
        <div
          className="confirm-backdrop"
          role="presentation"
        >
          <div
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            data-testid="dialog-delete-confirm"
          >
            <h2 id="delete-dialog-title">
              Remove this expense?
            </h2>

            <p>
              “
              {
                expenseToDelete.description
              }
              ” will be permanently
              removed from your local
              tracker. This cannot be undone.
            </p>

            <div className="dialog-actions">
              <button
                className="button ghost"
                onClick={() =>
                  setExpenseToDelete(
                    null,
                  )
                }
                data-testid="button-cancel-delete"
              >
                <X size={15} />
                Keep it
              </button>

              <button
                className="button danger"
                onClick={
                  confirmDelete
                }
                data-testid="button-confirm-delete"
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

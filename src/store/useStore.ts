import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  date: string;
  wallet: string;
  category: string;
  note: string;
  isRecurring: boolean;
}

export interface WalletData {
  id: string;
  name: string;
}

export interface TargetData {
  id: string;
  name: string;
  targetAmount: number;
  collectedAmount: number;
}

export interface DebtData {
  id: string;
  type: 'payable' | 'receivable';
  name: string;
  amount: number;
  installment: number;
  tenure: number;
}

export interface RecurringData {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  day: number; // Tanggal berapa dia rutin muncul (1 - 31)
  wallet: string;
  category: string;
  note: string;
  lastProcessedMonth: string; // Penanda biar nggak kecatat dobel
}

interface AppState {
  userName: string;
  transactions: Transaction[];
  wallets: WalletData[];
  targets: TargetData[];
  debts: DebtData[];
  recurrings: RecurringData[];

  // FUNGSI PENGATURAN PROFIL, RESET, & IMPORT
  setUserName: (name: string) => void;
  resetAllData: () => void;
  importData: (data: Partial<AppState> | Transaction[]) => void;

  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  addWallet: (name: string) => void;
  deleteWallet: (id: string) => void; // FITUR BARU: Hapus Dompet

  addTarget: (target: Omit<TargetData, 'id'>) => void;
  updateTarget: (id: string, target: Omit<TargetData, 'id'>) => void;
  deleteTarget: (id: string) => void;

  addDebt: (debt: Omit<DebtData, 'id'>) => void;
  updateDebt: (id: string, debt: Omit<DebtData, 'id'>) => void;
  deleteDebt: (id: string) => void;
  payDebt: (id: string, walletName: string, amount: number) => void;

  addRecurring: (rec: Omit<RecurringData, 'id' | 'lastProcessedMonth'>) => void;
  updateRecurring: (id: string, rec: Partial<RecurringData>) => void;
  deleteRecurring: (id: string) => void;
  checkAndProcessRecurring: () => void;

  getTotalBalance: () => number;
  getMonthlyIncome: () => number;
  getMonthlyExpense: () => number;
  getWalletBalance: (walletName: string) => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: "PetaUang",
      transactions: [],
      wallets: [
        { id: '1', name: 'Tunai' },
        { id: '2', name: 'BCA' },
        { id: '3', name: 'Mandiri' }
      ],
      targets: [
        { id: '1', name: 'Dana Darurat', targetAmount: 10000000, collectedAmount: 3500000 }
      ],
      debts: [],
      recurrings: [],

      setUserName: (name) =>
        set({ userName: name }),

      resetAllData: () =>
        set({
          transactions: [],
          targets: [],
          debts: [],
          recurrings: []
        }),

      importData: (data) => {
        if (Array.isArray(data)) {
          set({ transactions: data });
        } else {
          set((state) => ({
            userName: data.userName || state.userName,
            transactions: data.transactions || state.transactions,
            wallets: data.wallets || state.wallets,
            targets: data.targets || state.targets,
            debts: data.debts || state.debts,
            recurrings: data.recurrings || state.recurrings,
          }));
        }
      },

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [{ ...tx, id: Date.now().toString() }, ...state.transactions],
        })),

      updateTransaction: (id, updatedTx) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...updatedTx, id } : tx
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),

      addWallet: (name) =>
        set((state) => ({
          wallets: [...state.wallets, { id: Date.now().toString(), name }]
        })),

      deleteWallet: (id) =>
        set((state) => ({
          wallets: state.wallets.filter((w) => w.id !== id)
        })),

      addTarget: (target) =>
        set((state) => ({
          targets: [...state.targets, { ...target, id: Date.now().toString() }]
        })),

      updateTarget: (id, updatedTarget) =>
        set((state) => ({
          targets: state.targets.map((t) =>
            t.id === id ? { ...updatedTarget, id } : t
          )
        })),

      deleteTarget: (id) =>
        set((state) => ({
          targets: state.targets.filter((t) => t.id !== id)
        })),

      addDebt: (debt) =>
        set((state) => ({
          debts: [...state.debts, { ...debt, id: Date.now().toString() }]
        })),

      updateDebt: (id, updatedDebt) =>
        set((state) => ({
          debts: state.debts.map((d) =>
            d.id === id ? { ...updatedDebt, id } : d
          )
        })),

      deleteDebt: (id) =>
        set((state) => ({
          debts: state.debts.filter((d) => d.id !== id)
        })),

      payDebt: (id, walletName, amount) => set((state) => {
        const debt = state.debts.find(d => d.id === id);
        if (!debt) return state;

        const updatedDebts = state.debts.map(d => {
          if (d.id === id) {
            return {
              ...d,
              amount: Math.max(0, d.amount - amount),
              tenure: Math.max(0, d.tenure - 1)
            };
          }
          return d;
        });

        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: debt.type === 'payable' ? 'expense' : 'income',
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          wallet: walletName,
          category: 'Tagihan',
          note: `Cicilan: ${debt.name}`,
          isRecurring: false
        };

        return {
          debts: updatedDebts,
          transactions: [newTransaction, ...state.transactions]
        };
      }),

      addRecurring: (rec) =>
        set((state) => ({
          recurrings: [...state.recurrings, { ...rec, id: Date.now().toString(), lastProcessedMonth: "" }]
        })),

      updateRecurring: (id, updatedRec) =>
        set((state) => ({
          recurrings: state.recurrings.map((r) =>
            r.id === id ? { ...r, ...updatedRec } : r
          )
        })),

      deleteRecurring: (id) =>
        set((state) => ({
          recurrings: state.recurrings.filter((r) => r.id !== id)
        })),

      checkAndProcessRecurring: () => {
        const today = new Date();
        const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const currentDay = today.getDate();

        const state = get();
        let hasChanges = false;

        const newTransactions: Transaction[] = [];
        const updatedRecurrings = state.recurrings.map(r => {
          if (currentDay >= r.day && r.lastProcessedMonth !== currentMonthKey) {
            hasChanges = true;

            newTransactions.push({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
              type: r.type,
              amount: r.amount,
              date: `${currentMonthKey}-${String(r.day).padStart(2, '0')}`,
              wallet: r.wallet,
              category: r.category,
              note: `[Rutin] ${r.note}`,
              isRecurring: true
            });

            return { ...r, lastProcessedMonth: currentMonthKey };
          }
          return r;
        });

        if (hasChanges) {
          set((state) => ({
            transactions: [...newTransactions, ...state.transactions],
            recurrings: updatedRecurrings
          }));
        }
      },

      getTotalBalance: () => {
        return get().transactions.reduce((total, tx) => {
          return tx.type === 'income' ? total + tx.amount : total - tx.amount;
        }, 0);
      },

      getMonthlyIncome: () => {
        return get().transactions
          .filter((tx) => tx.type === 'income')
          .reduce((total, tx) => total + tx.amount, 0);
      },

      getMonthlyExpense: () => {
        return get().transactions
          .filter((tx) => tx.type === 'expense')
          .reduce((total, tx) => total + tx.amount, 0);
      },

      getWalletBalance: (walletName) => {
        return get().transactions
          .filter(tx => tx.wallet === walletName)
          .reduce((total, tx) => {
            return tx.type === 'income' ? total + tx.amount : total - tx.amount;
          }, 0);
      }
    }),
    {
      name: 'petauang-storage',
    }
  )
);
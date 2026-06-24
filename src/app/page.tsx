"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Receipt,
  Car,
  ShoppingBag,
  Utensils,
  Coffee,
  Plus,
  X,
  PieChart,
  Users,
  Repeat,
  LayoutGrid,
  Target,
  ArrowRightLeft,
  Briefcase,
  Gift,
  TrendingUp,
  DollarSign,
  Trash2,
  CreditCard,
  HandCoins,
  CheckCircle2,
  Banknote,
  Download,
  FileJson,
  Printer,
  CalendarCheck,
  Clock,
  AlertTriangle,
  Upload
} from "lucide-react";
import { useStore, Transaction, TargetData, DebtData, RecurringData } from "../store/useStore";

const EXPENSE_CATEGORIES = [
  { id: "makan", icon: Utensils, label: "Makan", color: "text-orange-400", bg: "bg-orange-400/20", bar: "bg-orange-500" },
  { id: "kopi", icon: Coffee, label: "Kopi", color: "text-amber-600", bg: "bg-amber-600/20", bar: "bg-amber-500" },
  { id: "transport", icon: Car, label: "Transport", color: "text-blue-400", bg: "bg-blue-400/20", bar: "bg-blue-500" },
  { id: "tagihan", icon: Receipt, label: "Tagihan", color: "text-purple-400", bg: "bg-purple-400/20", bar: "bg-purple-500" },
  { id: "belanja", icon: ShoppingBag, label: "Belanja", color: "text-pink-400", bg: "bg-pink-400/20", bar: "bg-pink-500" },
  { id: "lainnya", icon: LayoutGrid, label: "Lainnya", color: "text-zinc-400", bg: "bg-zinc-400/20", bar: "bg-zinc-500" },
];

const INCOME_CATEGORIES = [
  { id: "gaji", icon: Briefcase, label: "Gaji", color: "text-emerald-400", bg: "bg-emerald-400/20", bar: "bg-emerald-500" },
  { id: "bonus", icon: Gift, label: "Bonus", color: "text-teal-400", bg: "bg-teal-400/20", bar: "bg-teal-500" },
  { id: "investasi", icon: TrendingUp, label: "Investasi", color: "text-cyan-400", bg: "bg-cyan-400/20", bar: "bg-cyan-500" },
  { id: "lainnya", icon: DollarSign, label: "Lainnya", color: "text-green-400", bg: "bg-green-400/20", bar: "bg-green-500" },
];

const formatRupiah = (val: string | number) => {
  const rawString = String(val).replace(/\D/g, '');
  return rawString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseRupiah = (val: string) => {
  return Number(val.replace(/\./g, ''));
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Beranda");

  const [currentDate, setCurrentDate] = useState(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [txType, setTxType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [wallet, setWallet] = useState("Tunai");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Makan");

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");

  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState("");
  const [targetAmountInput, setTargetAmountInput] = useState("");
  const [collectedAmountInput, setCollectedAmountInput] = useState("");

  const [isNabungModalOpen, setIsNabungModalOpen] = useState(false);
  const [nabungAmountInput, setNabungAmountInput] = useState("");
  const [nabungTargetId, setNabungTargetId] = useState<string | null>(null);

  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [editingDebtId, setEditingDebtId] = useState<string | null>(null);
  const [debtType, setDebtType] = useState<"payable" | "receivable">("payable");
  const [debtName, setDebtName] = useState("");
  const [debtAmountInput, setDebtAmountInput] = useState("");
  const [debtInstallmentInput, setDebtInstallmentInput] = useState("");
  const [debtTenureInput, setDebtTenureInput] = useState("");

  const [isPayDebtModalOpen, setIsPayDebtModalOpen] = useState(false);
  const [payDebtId, setPayDebtId] = useState<string | null>(null);
  const [payDebtAmountInput, setPayDebtAmountInput] = useState("");
  const [payDebtWallet, setPayDebtWallet] = useState("Tunai");

  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [editingRecurringId, setEditingRecurringId] = useState<string | null>(null);
  const [recType, setRecType] = useState<"expense" | "income">("expense");
  const [recAmount, setRecAmount] = useState("");
  const [recDateOfMonth, setRecDateOfMonth] = useState("");
  const [recWallet, setRecWallet] = useState("Tunai");
  const [recNote, setRecNote] = useState("");
  const [recCategory, setRecCategory] = useState("Tagihan");

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [tempUserName, setTempUserName] = useState("");

  // ZUSTAND STORE
  const userName = useStore((state) => state.userName);
  const setUserName = useStore((state) => state.setUserName);
  const resetAllData = useStore((state) => state.resetAllData);
  const importData = useStore((state) => state.importData);
  const exportData = useStore((state) => state.exportData); // <-- INI FUNGSI BACKUP BARU LU

  const transactions = useStore((state) => state.transactions);
  const wallets = useStore((state) => state.wallets);
  const targets = useStore((state) => state.targets);
  const debts = useStore((state) => state.debts);
  const recurrings = useStore((state) => state.recurrings);

  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);
  const deleteTransaction = useStore((state) => state.deleteTransaction);

  const addWallet = useStore((state) => state.addWallet);
  const deleteWallet = useStore((state) => state.deleteWallet);

  const addTarget = useStore((state) => state.addTarget);
  const updateTarget = useStore((state) => state.updateTarget);
  const deleteTarget = useStore((state) => state.deleteTarget);

  const addDebt = useStore((state) => state.addDebt);
  const updateDebt = useStore((state) => state.updateDebt);
  const deleteDebt = useStore((state) => state.deleteDebt);
  const payDebt = useStore((state) => state.payDebt);

  const addRecurring = useStore((state) => state.addRecurring);
  const updateRecurring = useStore((state) => state.updateRecurring);
  const deleteRecurring = useStore((state) => state.deleteRecurring);
  const checkAndProcessRecurring = useStore((state) => state.checkAndProcessRecurring);

  const totalBalance = useStore((state) => state.getTotalBalance());
  const getWalletBalance = useStore((state) => state.getWalletBalance);

  useEffect(() => {
    setIsMounted(true);
    checkAndProcessRecurring();
    if (wallets.length > 0 && wallet === "Tunai" && !wallets.find(w => w.name === "Tunai")) {
      setWallet(wallets[0].name);
      setRecWallet(wallets[0].name);
    }
  }, [wallets, wallet, checkAndProcessRecurring]);

  useEffect(() => {
    if (isDebtModalOpen && !editingDebtId) {
      const inst = parseRupiah(debtInstallmentInput) || 0;
      const ten = Number(debtTenureInput) || 0;
      setDebtAmountInput(formatRupiah(inst * ten));
    }
  }, [debtInstallmentInput, debtTenureInput, isDebtModalOpen, editingDebtId]);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const displayMonth = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const currentMonthTx = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentDate.getMonth() && txDate.getFullYear() === currentDate.getFullYear();
  });

  const currentIncome = currentMonthTx.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const currentExpense = currentMonthTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        importData(parsed);
        alert("Sip mantap! Backup data berhasil dipulihkan total.");
        setIsSettingsModalOpen(false);
      } catch (err) {
        alert("Waduh, file JSON rusak atau formatnya salah bro!");
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    const headers = "Tanggal,Tipe,Kategori,Nominal,Dompet,Catatan\n";
    const rows = transactions.map(t => `${t.date},${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'},${t.category},${t.amount},${t.wallet},"${t.note}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "Laporan_PetaUang_CSV.csv"; link.click();
  };
  
  const handlePrintPDF = () => window.print();

  const handleTypeChange = (type: "expense" | "income") => { setTxType(type); setCategory(type === "expense" ? "Makan" : "Gaji"); };
  const handleEditClick = (tx: Transaction) => { setEditingId(tx.id); setTxType(tx.type); setAmount(formatRupiah(tx.amount)); setDate(tx.date); setWallet(tx.wallet); setNote(tx.note); setCategory(tx.category); setIsModalOpen(true); };
  const handleAddClick = () => { setEditingId(null); setTxType("expense"); setAmount(""); setDate(new Date().toISOString().split('T')[0]); setWallet(wallets.length > 0 ? wallets[0].name : "Tunai"); setNote(""); setCategory("Makan"); setIsModalOpen(true); };
  const handleSaveTransaction = () => {
    const numericAmount = parseRupiah(amount);
    if (!numericAmount) return alert("Nominal salah!");
    const txData = { type: txType, amount: numericAmount, date, wallet, category, note, isRecurring: false };
    if (editingId) updateTransaction(editingId, txData); else addTransaction(txData);
    setIsModalOpen(false);
  };
  const handleDelete = () => { if (editingId && window.confirm("Yakin hapus?")) { deleteTransaction(editingId); setIsModalOpen(false); } };

  const handleSaveWallet = () => { if (!newWalletName.trim()) return; addWallet(newWalletName); setNewWalletName(""); setIsWalletModalOpen(false); };

  const handleDeleteWallet = (id: string, name: string) => {
    if (window.confirm(`Yakin mau hapus dompet "${name}"? Tenang, riwayat transaksinya tetep aman kok di laporan.`)) {
      deleteWallet(id);
    }
  };

  const handleOpenAddTarget = () => { setEditingTargetId(null); setTargetName(""); setTargetAmountInput(""); setCollectedAmountInput(""); setIsTargetModalOpen(true); };
  const handleEditTargetClick = (t: TargetData) => { setEditingTargetId(t.id); setTargetName(t.name); setTargetAmountInput(formatRupiah(t.targetAmount)); setCollectedAmountInput(formatRupiah(t.collectedAmount)); setIsTargetModalOpen(true); };
  const handleSaveTarget = () => {
    const numTarget = parseRupiah(targetAmountInput); const numCollected = parseRupiah(collectedAmountInput) || 0;
    if (!targetName.trim() || !numTarget) return;
    if (editingTargetId) updateTarget(editingTargetId, { name: targetName, targetAmount: numTarget, collectedAmount: numCollected }); else addTarget({ name: targetName, targetAmount: numTarget, collectedAmount: numCollected });
    setIsTargetModalOpen(false);
  };
  const handleDeleteTarget = () => { if (editingTargetId && window.confirm("Hapus target?")) { deleteTarget(editingTargetId); setIsTargetModalOpen(false); } };
  const handleOpenNabung = (id: string) => { setNabungTargetId(id); setNabungAmountInput(""); setIsNabungModalOpen(true); };
  const handleSaveNabung = () => {
    const numNabung = parseRupiah(nabungAmountInput); if (!numNabung) return;
    const targetToUpdate = targets.find(t => t.id === nabungTargetId);
    if (targetToUpdate) updateTarget(nabungTargetId!, { ...targetToUpdate, collectedAmount: targetToUpdate.collectedAmount + numNabung });
    setIsNabungModalOpen(false);
  };
  const handleOpenAddDebt = () => { setEditingDebtId(null); setDebtType("payable"); setDebtName(""); setDebtInstallmentInput(""); setDebtTenureInput(""); setIsDebtModalOpen(true); };
  const handleEditDebtClick = (d: DebtData) => { setEditingDebtId(d.id); setDebtType(d.type); setDebtName(d.name); setDebtAmountInput(formatRupiah(d.amount)); setDebtInstallmentInput(formatRupiah(d.installment)); setDebtTenureInput(String(d.tenure)); setIsDebtModalOpen(true); };
  const handleSaveDebt = () => {
    const numAmount = parseRupiah(debtAmountInput); const numInst = parseRupiah(debtInstallmentInput) || 0; const numTenure = Number(debtTenureInput) || 0;
    if (!debtName.trim() || !numAmount) return alert("Wajib isi!");
    const debtData = { type: debtType, name: debtName, amount: numAmount, installment: numInst, tenure: numTenure };
    if (editingDebtId) updateDebt(editingDebtId, debtData); else addDebt(debtData);
    setIsDebtModalOpen(false);
  };
  const handleLunasinDebt = (id: string) => { if (window.confirm("Yakin lunas?")) { deleteDebt(id); setIsDebtModalOpen(false); } };
  const handleOpenPayDebt = (d: DebtData) => { setPayDebtId(d.id); setPayDebtAmountInput(formatRupiah(d.installment)); setPayDebtWallet(wallets.length > 0 ? wallets[0].name : "Tunai"); setIsPayDebtModalOpen(true); };
  const handleSavePayDebt = () => {
    const numAmount = parseRupiah(payDebtAmountInput); if (!numAmount) return;
    payDebt(payDebtId!, payDebtWallet, numAmount); setIsPayDebtModalOpen(false); alert("Cicilan berhasil dibayar!");
  };

  const handleRecTypeChange = (type: "expense" | "income") => { setRecType(type); setRecCategory(type === "expense" ? "Tagihan" : "Gaji"); };
  const handleOpenAddRecurring = () => {
    setEditingRecurringId(null); setRecType("expense"); setRecAmount(""); setRecDateOfMonth(""); setRecWallet(wallets.length > 0 ? wallets[0].name : "Tunai"); setRecNote(""); setRecCategory("Tagihan"); setIsRecurringModalOpen(true);
  };
  const handleEditRecurringClick = (r: RecurringData) => {
    setEditingRecurringId(r.id); setRecType(r.type); setRecAmount(formatRupiah(r.amount)); setRecDateOfMonth(String(r.day)); setRecWallet(r.wallet); setRecNote(r.note); setRecCategory(r.category); setIsRecurringModalOpen(true);
  };
  const handleSaveRecurring = () => {
    const numAmount = parseRupiah(recAmount); const dateNum = Number(recDateOfMonth);
    if (!numAmount || dateNum < 1 || dateNum > 31) return alert("Nominal & Tanggal (1-31) harus diisi bener bro!");
    const recData = { type: recType, amount: numAmount, day: dateNum, wallet: recWallet, category: recCategory, note: recNote };
    if (editingRecurringId) updateRecurring(editingRecurringId, recData); else addRecurring(recData);
    setIsRecurringModalOpen(false); alert("Template tersimpan! Sistem otomatis nyatet tiap tanggal " + dateNum);
  };
  const handleDeleteRecurring = () => { if (editingRecurringId && window.confirm("Yakin hapus template rutin ini?")) { deleteRecurring(editingRecurringId); setIsRecurringModalOpen(false); } };

  const handleOpenSettings = () => { setTempUserName(userName); setIsSettingsModalOpen(true); };
  const handleSaveSettings = () => { if (tempUserName.trim()) setUserName(tempUserName.trim()); setIsSettingsModalOpen(false); };
  const handleResetData = () => {
    if (window.confirm("PERINGATAN! Semua data Transaksi, Target, Utang, dan Rutin bakal HAPUS PERMANEN. Yakin bro?")) {
      resetAllData(); setIsSettingsModalOpen(false); alert("Semua data berhasil di-reset. Mulai lembaran baru!");
    }
  };

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const currentCategories = txType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  const currentRecCategories = recType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const payableDebts = debts.filter(d => d.type === "payable");
  const receivableDebts = debts.filter(d => d.type === "receivable");

  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => {
    const amount = currentMonthTx.filter(tx => tx.type === "expense" && tx.category === cat.label).reduce((sum, tx) => sum + tx.amount, 0);
    return { ...cat, amount };
  }).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans pb-24 selection:bg-yellow-500/30 print:bg-white print:text-black">
      <div className="max-w-md mx-auto relative min-h-screen bg-[#09090b] shadow-2xl overflow-hidden border-x border-zinc-900/50 print:border-none print:shadow-none print:bg-white">

        {/* --- HEADER --- */}
        <header className="px-5 pt-6 pb-2 sticky top-0 bg-[#09090b]/80 backdrop-blur-md z-30 print:hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 bg-zinc-900/80 px-4 py-1.5 rounded-full border border-zinc-800">
              <div className="w-5 h-5 bg-yellow-500 rounded text-black flex items-center justify-center font-bold text-xs">{userName.charAt(0).toUpperCase()}</div>
              <span className="font-semibold text-sm tracking-wide text-zinc-200 truncate max-w-[100px]">{userName}</span>
            </div>
            <div className="flex items-center gap-3 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
              <button onClick={handlePrevMonth} className="text-zinc-400 hover:text-white transition"><ChevronLeft size={16} /></button>
              <span className="text-xs font-semibold tracking-wider min-w-[75px] text-center">{displayMonth}</span>
              <button onClick={handleNextMonth} className="text-zinc-400 hover:text-white transition"><ChevronRight size={16} /></button>
            </div>
            <button onClick={handleOpenSettings} className="text-zinc-400 hover:text-white transition"><Settings size={20} /></button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {["Beranda", "Transaksi", "Laporan", "Rutin", "Dompet", "Target", "Utang"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab ? "bg-zinc-800 text-yellow-500 border border-yellow-500/20" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}>{tab}</button>
            ))}
          </div>
        </header>

        {/* --- BERANDA --- */}
        {activeTab === "Beranda" && (
          <main className="px-5 pt-4 space-y-6 print:hidden">
            <section className="bg-gradient-to-b from-zinc-800/80 to-zinc-900 rounded-3xl p-6 border border-zinc-700/50 shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-zinc-700/20"><Wallet size={100} /></div>
              <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest mb-1">Total Saldo (Semua Waktu)</p>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-6">Rp {totalBalance.toLocaleString("id-ID")}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950/40 rounded-2xl p-3 border border-zinc-800/50">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1"><ArrowDownCircle size={14} /><span className="text-[10px] font-semibold uppercase tracking-wider">Masuk ({monthNames[currentDate.getMonth()]})</span></div>
                  <p className="text-sm font-semibold text-emerald-400">Rp {currentIncome.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-zinc-950/40 rounded-2xl p-3 border border-zinc-800/50">
                  <div className="flex items-center gap-1.5 text-rose-500 mb-1"><ArrowUpCircle size={14} /><span className="text-[10px] font-semibold uppercase tracking-wider">Keluar ({monthNames[currentDate.getMonth()]})</span></div>
                  <p className="text-sm font-semibold text-rose-500">Rp {currentExpense.toLocaleString("id-ID")}</p>
                </div>
              </div>
            </section>
            <section className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveTab("Laporan")} className="flex flex-col items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl hover:bg-zinc-800 transition"><div className="text-indigo-400"><PieChart size={24} /></div><span className="text-xs font-medium text-zinc-300">Laporan</span></button>
              <button onClick={() => setActiveTab("Rutin")} className="flex flex-col items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl hover:bg-zinc-800 transition"><div className="text-emerald-400"><Repeat size={24} /></div><span className="text-xs font-medium text-zinc-300">Rutin</span></button>
            </section>
            <section>
              <div className="flex justify-between items-end mb-4 px-1"><h3 className="text-sm font-bold text-zinc-300">Pengeluaran Bulan Ini</h3></div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-5">
                {currentExpense === 0 ? <p className="text-xs text-zinc-500 text-center py-4">Belum ada pengeluaran dicatat.</p> : (
                  expenseByCategory.slice(0, 3).map((cat, idx) => {
                    const percentage = Math.round((cat.amount / currentExpense) * 100);
                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center`}><cat.icon size={14} /></div>
                            <span className="text-sm font-semibold text-zinc-200">{cat.label}</span>
                          </div>
                          <div className="text-right"><span className="text-sm font-bold text-white">Rp {cat.amount.toLocaleString("id-ID")}</span><span className="text-xs text-zinc-500 ml-2 font-medium">{percentage}%</span></div>
                        </div>
                        <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50"><div className={`h-full ${cat.bar} rounded-full transition-all`} style={{ width: `${percentage}%` }}></div></div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </main>
        )}

        {/* --- HALAMAN LAPORAN --- */}
        {activeTab === "Laporan" && (
          <main className="px-5 pt-4 space-y-6 print:px-0 print:pt-0">
            <div className="flex justify-between items-center mb-2 print:hidden"><h2 className="text-lg font-bold text-white">Laporan {displayMonth}</h2></div>
            <div className="hidden print:block mb-6 text-black">
              <h1 className="text-2xl font-bold border-b pb-2 mb-2">Laporan Keuangan: {userName}</h1><p className="text-sm text-gray-600">Periode: {displayMonth}</p>
            </div>
            <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 print:bg-white print:border-gray-200 print:shadow-sm">
              <h3 className="text-sm font-bold text-zinc-400 mb-4 print:text-gray-500 uppercase tracking-wider">Ringkasan Arus Kas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3 print:border-gray-200">
                  <div className="flex items-center gap-2"><ArrowDownCircle size={16} className="text-emerald-400" /><span className="text-sm font-semibold text-zinc-200 print:text-gray-700">Total Pemasukan</span></div>
                  <span className="text-base font-bold text-emerald-400">Rp {currentIncome.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3 print:border-gray-200">
                  <div className="flex items-center gap-2"><ArrowUpCircle size={16} className="text-rose-500" /><span className="text-sm font-semibold text-zinc-200 print:text-gray-700">Total Pengeluaran</span></div>
                  <span className="text-base font-bold text-rose-500">Rp {currentExpense.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-bold text-zinc-400 print:text-gray-500">Sisa Bersih Bulan Ini</span>
                  <span className={`text-xl font-black ${currentIncome - currentExpense >= 0 ? 'text-indigo-400' : 'text-rose-500'}`}>Rp {(currentIncome - currentExpense).toLocaleString("id-ID")}</span>
                </div>
              </div>
            </section>
            <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 print:bg-white print:border-gray-200 print:shadow-sm">
              <h3 className="text-sm font-bold text-zinc-400 mb-6 print:text-gray-500 uppercase tracking-wider">Rincian Pengeluaran Berdasarkan Kategori</h3>
              {currentExpense === 0 ? <p className="text-xs text-zinc-500">Belum ada data pengeluaran bulan ini.</p> : (
                <div className="space-y-5">
                  {expenseByCategory.map((cat, idx) => {
                    const percentage = Math.round((cat.amount / currentExpense) * 100);
                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full ${cat.bg} ${cat.color} flex items-center justify-center`}><cat.icon size={16} /></div>
                            <span className="text-sm font-bold text-zinc-200 print:text-gray-800">{cat.label}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-white print:text-black">Rp {cat.amount.toLocaleString("id-ID")}</span>
                            <span className="text-xs text-zinc-500 ml-2 font-medium bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 print:bg-gray-100">{percentage}%</span>
                          </div>
                        </div>
                        <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 print:bg-gray-200"><div className={`h-full ${cat.bar} rounded-full transition-all print:bg-gray-600`} style={{ width: `${percentage}%` }}></div></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
            <section className="print:hidden">
              <h3 className="text-sm font-bold text-zinc-300 mb-3 px-1">Export Data Laporan</h3>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={handleExportCSV} className="flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl transition"><div className="flex items-center gap-3"><div className="text-green-500 bg-green-500/10 p-2 rounded-xl"><Download size={20} /></div><div className="text-left"><p className="text-sm font-bold text-white">Export ke CSV / Excel</p><p className="text-[10px] text-zinc-500">Download data mentah spreadsheet</p></div></div><ChevronRight size={16} className="text-zinc-600" /></button>
                <button onClick={exportData} className="flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl transition"><div className="flex items-center gap-3"><div className="text-yellow-500 bg-yellow-500/10 p-2 rounded-xl"><FileJson size={20} /></div><div className="text-left"><p className="text-sm font-bold text-white">Export JSON</p><p className="text-[10px] text-zinc-500">Backup database lengkap</p></div></div><ChevronRight size={16} className="text-zinc-600" /></button>
                <button onClick={handlePrintPDF} className="flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl transition"><div className="flex items-center gap-3"><div className="text-blue-500 bg-blue-500/10 p-2 rounded-xl"><Printer size={20} /></div><div className="text-left"><p className="text-sm font-bold text-white">Cetak / Save as PDF</p><p className="text-[10px] text-zinc-500">Pilih "Save as PDF" di popup print</p></div></div><ChevronRight size={16} className="text-zinc-600" /></button>
              </div>
            </section>
          </main>
        )}

        {/* --- TRANSAKSI --- */}
        {activeTab === "Transaksi" && (
          <main className="px-5 pt-4 space-y-4 print:hidden">
            <h2 className="text-lg font-bold text-white mb-4">Riwayat {displayMonth}</h2>
            {currentMonthTx.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500"><ArrowRightLeft size={48} className="mb-4 opacity-20" /><p>Belum ada transaksi di bulan ini.</p></div>
            ) : (
              <div className="space-y-3">
                {currentMonthTx.map((tx) => {
                  const catData = allCategories.find((c) => c.label === tx.category) || allCategories[5];
                  const isIncome = tx.type === "income";
                  return (
                    <div key={tx.id} onClick={() => handleEditClick(tx)} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-2xl cursor-pointer hover:border-yellow-500/30 transition-all active:scale-[0.98]">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${catData.bg} ${catData.color} flex items-center justify-center`}><catData.icon size={20} /></div>
                        <div><p className="text-sm font-bold text-zinc-200">{tx.category}</p><p className="text-[11px] text-zinc-500 mt-0.5">{tx.note || "Tanpa catatan"} • {tx.wallet}</p></div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isIncome ? "text-emerald-400" : "text-rose-500"}`}>{isIncome ? "+" : "-"}Rp {tx.amount.toLocaleString("id-ID")}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{tx.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        )}

        {/* --- HALAMAN RUTIN --- */}
        {activeTab === "Rutin" && (
          <main className="px-5 pt-4 space-y-6 print:hidden pb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-white">Catatan Rutin</h2>
              <button onClick={handleOpenAddRecurring} className="bg-zinc-800 text-yellow-500 text-xs px-3 py-1.5 rounded-full font-semibold border border-yellow-500/20 hover:bg-zinc-700 transition">+ Template</button>
            </div>
            {recurrings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500"><Repeat size={48} className="mb-4 opacity-20" /><p className="text-center mt-4 text-sm max-w-[250px]">Tambahin tagihan bulanannya di sini. Nanti tiap tanggalnya lewat, sistem otomatis nyatet ke transaksi!</p></div>
            ) : (
              <div className="space-y-3">
                {recurrings.map(r => {
                  const catData = allCategories.find((c) => c.label === r.category) || allCategories[5];
                  const isIncome = r.type === "income";
                  const today = new Date();
                  const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
                  const isProcessed = r.lastProcessedMonth === currentMonthKey;
                  return (
                    <div key={r.id} onClick={() => handleEditRecurringClick(r)} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 relative overflow-hidden cursor-pointer hover:border-yellow-500/50 transition">
                      <div className="absolute -right-4 -top-4 text-zinc-800/50 pointer-events-none"><CalendarCheck size={100} /></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full ${catData.bg} ${catData.color} flex items-center justify-center`}><catData.icon size={14} /></div>
                              <h4 className="text-base font-bold text-white">{r.note || "Tanpa Judul"}</h4>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-2">Nominal: <span className={`font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-500'}`}>Rp {r.amount.toLocaleString("id-ID")}</span></p>
                          </div>
                          <div className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1 ${isProcessed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                            {isProcessed ? <><CheckCircle2 size={10} /> Tercatat</> : <><Clock size={10} /> Menunggu</>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-950/50 p-3 rounded-2xl border border-zinc-800">
                          <div className="flex-1"><p className="text-[10px] text-zinc-500 mb-0.5">Kategori</p><p className="text-sm font-bold text-white">{r.category}</p></div>
                          <div className="w-px h-8 bg-zinc-800"></div>
                          <div className="flex-1 text-right"><p className="text-[10px] text-zinc-500 mb-0.5">Jadwal Autopilot</p><p className="text-sm font-bold text-yellow-500">Tgl {r.day} Tiap Bulan</p></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        )}

        {/* --- DOMPET --- */}
        {activeTab === "Dompet" && (
          <main className="px-5 pt-4 space-y-4 print:hidden">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-white">Daftar Dompet</h2><button onClick={() => setIsWalletModalOpen(true)} className="bg-zinc-800 text-yellow-500 text-xs px-3 py-1.5 rounded-full font-semibold border border-yellow-500/20 hover:bg-zinc-700 transition">+ Dompet</button></div>
            <div className="space-y-3">
              {wallets.map((w) => {
                const bal = getWalletBalance(w.name);
                return (
                  <div key={w.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex justify-between items-center hover:border-zinc-700 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center border border-yellow-500/20"><CreditCard size={24} /></div>
                      <div><h3 className="text-sm font-bold text-white mb-0.5">{w.name}</h3><p className="text-[11px] text-zinc-500">Saldo aktif</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right"><p className="text-base font-bold text-white">Rp {bal.toLocaleString("id-ID")}</p></div>
                      <button onClick={() => handleDeleteWallet(w.id, w.name)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-full transition"><Trash2 size={16} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {/* --- TARGET --- */}
        {activeTab === "Target" && (
          <main className="px-5 pt-4 space-y-4 print:hidden">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-white">Semua Target</h2><button onClick={handleOpenAddTarget} className="bg-zinc-800 text-yellow-500 text-xs px-3 py-1.5 rounded-full font-semibold border border-yellow-500/20 hover:bg-zinc-700 transition">+ Target</button></div>
            {targets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500"><Target size={48} className="mb-4 opacity-20" /><p>Belum ada target.</p></div>
            ) : (
              <div className="space-y-4">
                {targets.map((t) => {
                  const percentage = Math.min(Math.round((t.collectedAmount / t.targetAmount) * 100), 100);
                  const remaining = Math.max(t.targetAmount - t.collectedAmount, 0);
                  return (
                    <div key={t.id} onClick={() => handleEditTargetClick(t)} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 relative overflow-hidden cursor-pointer hover:border-yellow-500/30 transition active:scale-[0.98]">
                      <div className="absolute -right-6 -bottom-6 text-indigo-500/10 pointer-events-none"><Target size={120} strokeWidth={1} /></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20"><Target size={20} /></div>
                            <div><h4 className="text-sm font-bold text-white">{t.name}</h4><p className="text-[11px] text-zinc-400 mt-0.5">Terkumpul <span className="text-indigo-400 font-semibold">Rp {t.collectedAmount.toLocaleString("id-ID")}</span></p></div>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleOpenNabung(t.id); }} className="bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] px-3 py-1.5 rounded-full font-bold transition z-20 relative shadow-[0_0_10px_rgba(99,102,241,0.3)]">+ Nabung</button>
                        </div>
                        <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50 relative"><div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div></div>
                        <div className="flex justify-between items-center mt-3"><span className="text-[10px] text-zinc-500 font-medium bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800/50">Sisa Rp {remaining.toLocaleString("id-ID")}</span><span className="text-[11px] font-bold text-indigo-400">{percentage}%</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        )}

        {/* --- UTANG --- */}
        {activeTab === "Utang" && (
          <main className="px-5 pt-4 space-y-6 pb-10 print:hidden">
            <div className="flex justify-between items-center mb-2"><h2 className="text-lg font-bold text-white">Daftar Utang</h2><button onClick={handleOpenAddDebt} className="bg-zinc-800 text-yellow-500 text-xs px-3 py-1.5 rounded-full font-semibold border border-yellow-500/20 hover:bg-zinc-700 transition">+ Catat</button></div>
            <section>
              <h3 className="text-sm font-bold text-rose-400 mb-3 px-1 border-b border-rose-500/20 pb-2 inline-block">Utang Saya</h3>
              {payableDebts.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center"><p className="text-xs text-zinc-500">Alhamdulillah, lagi nggak ada utang bro.</p></div>
              ) : (
                <div className="space-y-3">
                  {payableDebts.map((d) => (
                    <div key={d.id} onClick={() => handleEditDebtClick(d)} className="bg-zinc-900 border border-rose-900/30 rounded-3xl p-5 relative overflow-hidden cursor-pointer hover:border-rose-500/50 transition">
                      <div className="absolute -right-4 -top-4 text-rose-500/5 pointer-events-none"><HandCoins size={100} /></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2"><h4 className="text-base font-bold text-white">{d.name}</h4>{d.amount > 0 && (<span className="bg-rose-500 text-white text-[8px] px-1.5 py-0.5 rounded animate-pulse">Tagihan Aktif</span>)}</div>
                            <p className="text-xs text-zinc-400 mt-1">Sisa Utang: <span className="font-bold text-white">Rp {d.amount.toLocaleString("id-ID")}</span></p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); handleOpenPayDebt(d); }} className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 px-3 py-1.5 rounded-full text-[10px] font-bold transition shadow-[0_0_10px_rgba(79,70,229,0.3)] flex items-center gap-1"><Banknote size={12} /> Bayar</button>
                            <button onClick={(e) => { e.stopPropagation(); handleLunasinDebt(d.id); }} className="text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 w-8 h-8 rounded-full transition flex items-center justify-center"><CheckCircle2 size={14} /></button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-950/50 p-3 rounded-2xl border border-zinc-800">
                          <div className="flex-1"><p className="text-[10px] text-zinc-500 mb-0.5">Tagihan per bulan</p><p className="text-sm font-bold text-rose-500">Rp {d.installment.toLocaleString("id-ID")}</p></div>
                          <div className="w-px h-8 bg-zinc-800"></div>
                          <div className="flex-1 text-right"><p className="text-[10px] text-zinc-500 mb-0.5">Sisa Tenor</p><p className="text-sm font-bold text-white">{d.tenure} Bulan</p></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <section className="mt-6">
              <h3 className="text-sm font-bold text-emerald-400 mb-3 px-1 border-b border-emerald-500/20 pb-2 inline-block">Uang Di Orang</h3>
              {receivableDebts.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center"><p className="text-xs text-zinc-500">Nggak ada duit lo yang dipinjem orang.</p></div>
              ) : (
                <div className="space-y-3">
                  {receivableDebts.map((d) => (
                    <div key={d.id} onClick={() => handleEditDebtClick(d)} className="bg-zinc-900 border border-emerald-900/30 rounded-3xl p-5 relative overflow-hidden cursor-pointer hover:border-emerald-500/50 transition">
                      <div className="absolute -right-4 -top-4 text-emerald-500/5 pointer-events-none"><HandCoins size={100} /></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-base font-bold text-white">{d.name}</h4><p className="text-xs text-zinc-400 mt-1">Belum Dibayar: <span className="font-bold text-white">Rp {d.amount.toLocaleString("id-ID")}</span></p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); handleOpenPayDebt(d); }} className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50 px-3 py-1.5 rounded-full text-[10px] font-bold transition shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-1"><Banknote size={12} /> Terima</button>
                            <button onClick={(e) => { e.stopPropagation(); handleLunasinDebt(d.id); }} className="text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 w-8 h-8 rounded-full transition flex items-center justify-center"><CheckCircle2 size={14} /></button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-950/50 p-3 rounded-2xl border border-zinc-800">
                          <div className="flex-1"><p className="text-[10px] text-zinc-500 mb-0.5">Cicilan dia per bulan</p><p className="text-sm font-bold text-emerald-400">Rp {d.installment.toLocaleString("id-ID")}</p></div>
                          <div className="w-px h-8 bg-zinc-800"></div>
                          <div className="flex-1 text-right"><p className="text-[10px] text-zinc-500 mb-0.5">Sisa Tenor</p><p className="text-sm font-bold text-white">{d.tenure} Bulan</p></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        )}

        {/* --- FAB MAIN --- */}
        {activeTab !== "Dompet" && activeTab !== "Target" && activeTab !== "Utang" && activeTab !== "Laporan" && activeTab !== "Rutin" && (
          <div className="fixed bottom-6 w-full max-w-md flex justify-center z-40 pointer-events-none print:hidden">
            <button onClick={handleAddClick} className="pointer-events-auto bg-yellow-500 hover:bg-yellow-400 text-black w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(234,179,8,0.4)] flex items-center justify-center transition-transform hover:scale-105"><Plus size={28} strokeWidth={2.5} /></button>
          </div>
        )}

        {/* --- MODAL PENGATURAN --- */}
        {isSettingsModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200 print:hidden">
            <div className="bg-[#121214] w-full rounded-t-[32px] p-6 relative border-t border-zinc-800 shadow-2xl h-auto flex flex-col slide-in-from-bottom-full pb-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Pengaturan Profil</h3>
                <button onClick={() => setIsSettingsModalOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-900 rounded-full p-1.5 transition"><X size={20} /></button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Ubah Nama Profil</label>
                  <input type="text" value={tempUserName} onChange={(e) => setTempUserName(e.target.value)} placeholder="cth. Dompet Ryanhar" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-500/50 transition placeholder:text-zinc-700" />
                </div>
                <button onClick={handleSaveSettings} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3.5 rounded-2xl transition-all shadow-[0_4px_15px_rgba(234,179,8,0.2)]">
                  Simpan Perubahan
                </button>
                <div className="border-t border-zinc-800 pt-6 mt-2">
                  <h4 className="text-sm font-bold text-yellow-500 mb-2 flex items-center gap-2"><Upload size={16} /> Import Backup Data</h4>
                  <p className="text-[10px] text-zinc-500 mb-4">Pilih file backup (.json) yang pernah didownload untuk memulihkan total seluruh data finansial.</p>
                  <label className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm">
                    <Download size={16} className="rotate-180 text-yellow-500" /> Pilih File Backup JSON
                    <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
                  </label>
                </div>
                <div className="border-t border-zinc-800 pt-6 mt-2">
                  <h4 className="text-sm font-bold text-rose-500 mb-2 flex items-center gap-2"><AlertTriangle size={16} /> Zona Berbahaya</h4>
                  <p className="text-[10px] text-zinc-500 mb-4">Hapus seluruh data Transaksi, Laporan, Utang, dan Rutin secara permanen. (Dompet tidak akan terhapus).</p>
                  <button onClick={handleResetData} className="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 font-bold py-3.5 rounded-2xl transition-all">
                    Hapus Semua Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL TRANSAKSI --- */}
        {isModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200 print:hidden">
            <div className="bg-[#121214] w-full rounded-t-[32px] p-6 relative border-t border-zinc-800 shadow-2xl h-[85vh] flex flex-col slide-in-from-bottom-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">{editingId ? "Edit Transaksi" : "Catat Transaksi"}</h3>
                <div className="flex items-center gap-3">
                  {editingId && (<button onClick={handleDelete} className="text-rose-500 hover:bg-rose-500/10 rounded-full p-2 transition"><Trash2 size={20} /></button>)}
                  <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-900 rounded-full p-1.5 transition"><X size={20} /></button>
                </div>
              </div>
              <div className="flex bg-zinc-900 rounded-xl p-1 mb-6 border border-zinc-800">
                <button onClick={() => handleTypeChange("expense")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${txType === "expense" ? "bg-zinc-800 text-rose-500 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>Pengeluaran</button>
                <button onClick={() => handleTypeChange("income")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${txType === "income" ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>Pemasukan</button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pb-20">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Nominal</label>
                  <div className="flex items-center bg-zinc-900/50 rounded-2xl border border-zinc-800 px-4 py-3.5 focus-within:border-yellow-500/50 transition">
                    <span className="text-zinc-500 font-semibold mr-2">Rp</span>
                    <input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(formatRupiah(e.target.value))} placeholder="cth. 50000" className="bg-transparent w-full text-2xl font-bold text-white outline-none placeholder:text-zinc-700" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Tanggal</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-500/50 transition [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Dompet</label>
                    <select value={wallet} onChange={(e) => setWallet(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-500/50 transition appearance-none">
                      {wallets.map((w) => (<option key={w.id} value={w.name}>🏦 {w.name}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Catatan</label>
                  <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="cth. Gaji Bulanan" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-500/50 transition placeholder:text-zinc-700" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-2 font-medium">Kategori</label>
                  <div className="grid grid-cols-3 gap-3">
                    {currentCategories.map((cat, idx) => (
                      <div key={idx} onClick={() => setCategory(cat.label)} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border cursor-pointer transition ${category === cat.label ? "bg-zinc-800 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]" : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"}`}>
                        <div className={cat.color}><cat.icon size={20} /></div><span className="text-[11px] text-zinc-400 font-medium">{cat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#121214] via-[#121214] to-transparent">
                <button onClick={handleSaveTransaction} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition-all shadow-[0_4px_15px_rgba(234,179,8,0.2)]">{editingId ? "Simpan Perubahan" : "Simpan Transaksi"}</button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL RUTIN --- */}
        {isRecurringModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200 print:hidden">
            <div className="bg-[#121214] w-full rounded-t-[32px] p-6 relative border-t border-zinc-800 shadow-2xl h-[85vh] flex flex-col slide-in-from-bottom-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">{editingRecurringId ? "Edit Template Rutin" : "Bikin Template Rutin"}</h3>
                <div className="flex items-center gap-3">
                  {editingRecurringId && (<button onClick={handleDeleteRecurring} className="text-rose-500 hover:bg-rose-500/10 rounded-full p-2 transition"><Trash2 size={20} /></button>)}
                  <button onClick={() => setIsRecurringModalOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-900 rounded-full p-1.5 transition"><X size={20} /></button>
                </div>
              </div>
              <div className="flex bg-zinc-900 rounded-xl p-1 mb-6 border border-zinc-800">
                <button onClick={() => handleRecTypeChange("expense")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${recType === "expense" ? "bg-zinc-800 text-rose-500 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>Pengeluaran</button>
                <button onClick={() => handleRecTypeChange("income")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${recType === "income" ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>Pemasukan</button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 pb-20">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Nominal Rutin</label>
                  <div className="flex items-center bg-zinc-900/50 rounded-2xl border border-zinc-800 px-4 py-3.5 focus-within:border-yellow-500/50 transition">
                    <span className="text-zinc-500 font-semibold mr-2">Rp</span>
                    <input type="text" inputMode="numeric" value={recAmount} onChange={(e) => setRecAmount(formatRupiah(e.target.value))} placeholder="cth. 500000" className="bg-transparent w-full text-2xl font-bold text-white outline-none placeholder:text-zinc-700" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Tanggal Tiap Bulan</label>
                    <input type="number" min="1" max="31" value={recDateOfMonth} onChange={(e) => setRecDateOfMonth(e.target.value)} placeholder="cth. 25" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-500/50 transition" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Dompet</label>
                    <select value={recWallet} onChange={(e) => setRecWallet(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-500/50 transition appearance-none">
                      {wallets.map((w) => (<option key={w.id} value={w.name}>🏦 {w.name}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Judul Template</label>
                  <input type="text" value={recNote} onChange={(e) => setRecNote(e.target.value)} placeholder="cth. Bayar Kos / Gaji Bulanan" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-500/50 transition placeholder:text-zinc-700" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-2 font-medium">Kategori</label>
                  <div className="grid grid-cols-3 gap-3">
                    {currentRecCategories.map((cat, idx) => (
                      <div key={idx} onClick={() => setRecCategory(cat.label)} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border cursor-pointer transition ${recCategory === cat.label ? "bg-zinc-800 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]" : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"}`}>
                        <div className={cat.color}><cat.icon size={20} /></div><span className="text-[11px] text-zinc-400 font-medium">{cat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#121214] via-[#121214] to-transparent">
                <button onClick={handleSaveRecurring} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition-all shadow-[0_4px_15px_rgba(234,179,8,0.2)]">
                  {editingRecurringId ? "Simpan Perubahan" : "Buat Template"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL DOMPET --- */}
        {isWalletModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-in fade-in duration-200 print:hidden">
            <div className="bg-[#121214] w-full max-w-sm rounded-3xl p-6 relative border border-zinc-800 shadow-2xl scale-in-center">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Tambah Dompet</h3>
                <button onClick={() => setIsWalletModalOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-900 rounded-full p-1.5 transition"><X size={20} /></button>
              </div>
              <div className="mb-6">
                <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Nama Dompet / Bank</label>
                <input type="text" value={newWalletName} onChange={(e) => setNewWalletName(e.target.value)} placeholder="cth. Jago, SeaBank..." className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-500/50 transition placeholder:text-zinc-700" autoFocus />
              </div>
              <button onClick={handleSaveWallet} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3.5 rounded-2xl transition-all shadow-[0_4px_15px_rgba(234,179,8,0.2)]">Simpan Dompet</button>
            </div>
          </div>
        )}

        {/* --- MODAL TARGET --- */}
        {isTargetModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-in fade-in duration-200 print:hidden">
            <div className="bg-[#121214] w-full max-w-sm rounded-3xl p-6 relative border border-zinc-800 shadow-2xl scale-in-center">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">{editingTargetId ? "Edit Target" : "Target Baru"}</h3>
                <div className="flex items-center gap-3">
                  {editingTargetId && (<button onClick={handleDeleteTarget} className="text-rose-500 hover:bg-rose-500/10 rounded-full p-2 transition"><Trash2 size={20} /></button>)}
                  <button onClick={() => setIsTargetModalOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-900 rounded-full p-1.5 transition"><X size={20} /></button>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Nama Target</label>
                  <input type="text" value={targetName} onChange={(e) => setTargetName(e.target.value)} placeholder="cth. Beli Motor..." className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-500/50 transition placeholder:text-zinc-700" />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Total Dana Dibutuhkan</label>
                  <div className="flex items-center bg-zinc-900/50 rounded-2xl border border-zinc-800 px-4 py-3 focus-within:border-yellow-500/50 transition">
                    <span className="text-zinc-500 font-semibold mr-2 text-sm">Rp</span>
                    <input type="text" inputMode="numeric" value={targetAmountInput} onChange={(e) => setTargetAmountInput(formatRupiah(e.target.value))} placeholder="0" className="bg-transparent w-full text-base font-bold text-white outline-none placeholder:text-zinc-700" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Sudah Terkumpul</label>
                  <div className="flex items-center bg-zinc-900/50 rounded-2xl border border-zinc-800 px-4 py-3 focus-within:border-yellow-500/50 transition">
                    <span className="text-zinc-500 font-semibold mr-2 text-sm">Rp</span>
                    <input type="text" inputMode="numeric" value={collectedAmountInput} onChange={(e) => setCollectedAmountInput(formatRupiah(e.target.value))} placeholder="0" className="bg-transparent w-full text-base font-bold text-white outline-none placeholder:text-zinc-700" />
                  </div>
                </div>
              </div>
              <button onClick={handleSaveTarget} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3.5 rounded-2xl transition-all shadow-[0_4px_15px_rgba(234,179,8,0.2)]">{editingTargetId ? "Simpan Perubahan" : "Buat Target"}</button>
            </div>
          </div>
        )}

        {/* --- MODAL NABUNG TARGET --- */}
        {isNabungModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-in fade-in duration-200 print:hidden">
            <div className="bg-[#121214] w-full max-w-sm rounded-3xl p-6 relative border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] scale-in-center">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Top Up Target</h3>
                <button onClick={() => setIsNabungModalOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-900 rounded-full p-1.5 transition"><X size={20} /></button>
              </div>
              <div className="mb-6">
                <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Mau nabung berapa hari ini?</label>
                <div className="flex items-center bg-zinc-900/50 rounded-2xl border border-zinc-800 px-4 py-3.5 focus-within:border-indigo-500/50 transition">
                  <span className="text-zinc-500 font-semibold mr-2">Rp</span>
                  <input type="text" inputMode="numeric" value={nabungAmountInput} onChange={(e) => setNabungAmountInput(formatRupiah(e.target.value))} placeholder="cth. 50000" className="bg-transparent w-full text-2xl font-bold text-white outline-none placeholder:text-zinc-700" autoFocus />
                </div>
              </div>
              <button onClick={handleSaveNabung} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3.5 rounded-2xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.3)]">Simpan Tabungan</button>
            </div>
          </div>
        )}

        {/* --- MODAL UTANG --- */}
        {isDebtModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200 print:hidden">
            <div className="bg-[#121214] w-full rounded-t-[32px] p-6 relative border-t border-zinc-800 shadow-2xl h-[90vh] flex flex-col slide-in-from-bottom-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">{editingDebtId ? "Edit Catatan Utang" : "Catat Utang / Piutang"}</h3>
                <button onClick={() => setIsDebtModalOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-900 rounded-full p-1.5 transition"><X size={20} /></button>
              </div>
              <div className="flex bg-zinc-900 rounded-xl p-1 mb-6 border border-zinc-800">
                <button onClick={() => setDebtType("payable")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${debtType === "payable" ? "bg-zinc-800 text-rose-500 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>Utang Saya</button>
                <button onClick={() => setDebtType("receivable")} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${debtType === "receivable" ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>Uang Di Orang</button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5 font-medium">{debtType === "payable" ? "Nama Pinjaman (cth. KPR BCA)" : "Siapa yang ngutang? (cth. Dika)"}</label>
                  <input type="text" value={debtName} onChange={(e) => setDebtName(e.target.value)} placeholder="cth. Pinjol" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-yellow-500/50 transition placeholder:text-zinc-700" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Tagihan per Bulan</label>
                    <div className="flex items-center bg-zinc-900/50 rounded-2xl border border-zinc-800 px-4 py-3.5 focus-within:border-yellow-500/50 transition">
                      <span className="text-zinc-500 font-semibold mr-1 text-sm">Rp</span>
                      <input type="text" inputMode="numeric" value={debtInstallmentInput} onChange={(e) => setDebtInstallmentInput(formatRupiah(e.target.value))} placeholder="0" className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-zinc-700" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Tenor (Bulan)</label>
                    <div className="flex items-center bg-zinc-900/50 rounded-2xl border border-zinc-800 px-4 py-3.5 focus-within:border-yellow-500/50 transition">
                      <input type="number" value={debtTenureInput} onChange={(e) => setDebtTenureInput(e.target.value)} placeholder="0" className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-zinc-700 text-center" />
                      <span className="text-zinc-500 font-semibold ml-2 text-xs">Bulan</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Total Nominal Pinjaman <span className="text-[10px] bg-zinc-800 px-1 py-0.5 rounded text-zinc-400">Otomatis</span></label>
                  <div className="flex items-center bg-zinc-950/50 rounded-2xl border border-zinc-800 px-4 py-3.5 cursor-not-allowed">
                    <span className="text-zinc-600 font-semibold mr-2 text-lg">Rp</span>
                    <input type="text" readOnly value={debtAmountInput} placeholder="0" className="bg-transparent w-full text-xl font-bold text-zinc-400 outline-none cursor-not-allowed" />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1">Dihitung otomatis: Tagihan per Bulan × Tenor.</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#121214] via-[#121214] to-transparent">
                <button onClick={handleSaveDebt} className={`w-full text-white font-bold py-4 rounded-2xl transition-all shadow-[0_4px_15px_rgba(0,0,0,0.2)] ${debtType === "payable" ? "bg-rose-500 hover:bg-rose-400" : "bg-emerald-500 hover:bg-emerald-400"}`}>
                  {editingDebtId ? "Simpan Perubahan" : "Catat Utang"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL BAYAR UTANG --- */}
        {isPayDebtModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-in fade-in duration-200 print:hidden">
            <div className="bg-[#121214] w-full max-w-sm rounded-3xl p-6 relative border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)] scale-in-center">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Bayar Cicilan Bulan Ini</h3>
                <button onClick={() => setIsPayDebtModalOpen(false)} className="text-zinc-500 hover:text-white bg-zinc-900 rounded-full p-1.5 transition"><X size={20} /></button>
              </div>
              <div className="mb-4">
                <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Nominal Cicilan</label>
                <div className="flex items-center bg-zinc-900/50 rounded-2xl border border-zinc-800 px-4 py-3.5 focus-within:border-indigo-500/50 transition">
                  <span className="text-zinc-500 font-semibold mr-2">Rp</span>
                  <input type="text" inputMode="numeric" value={payDebtAmountInput} onChange={(e) => setPayDebtAmountInput(formatRupiah(e.target.value))} className="bg-transparent w-full text-xl font-bold text-white outline-none placeholder:text-zinc-700" autoFocus />
                </div>
              </div>
              <div className="mb-6">
                <label className="text-xs text-zinc-500 block mb-1.5 font-medium">Pilih Dompet</label>
                <select value={payDebtWallet} onChange={(e) => setPayDebtWallet(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500/50 transition appearance-none">
                  {wallets.map((w) => (<option key={w.id} value={w.name}>🏦 {w.name}</option>))}
                </select>
                <p className="text-[10px] text-zinc-500 mt-2">Saldo dompet ini akan otomatis dipotong dan masuk ke riwayat transaksi.</p>
              </div>
              <button onClick={handleSavePayDebt} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-[0_4px_15px_rgba(79,70,229,0.3)]">Konfirmasi Pembayaran</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
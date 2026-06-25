import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Download, IndianRupee, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: 'TXN-9092', date: 'Today, 02:30 PM', type: 'Consultation Fee', patient: 'Rahul Sharma', amount: 800, comm: 80, net: 720, status: 'Escrow' },
  { id: 'TXN-9091', date: 'Yesterday, 11:15 AM', type: 'Consultation Fee', patient: 'Anita Desai', amount: 1200, comm: 120, net: 1080, status: 'Settled' },
  { id: 'TXN-9090', date: '20 Jun 2026', type: 'Weekly Settlement', patient: 'Bank Transfer', amount: 45000, comm: 0, net: 45000, status: 'Settled', isTransfer: true },
  { id: 'TXN-9089', date: '19 Jun 2026', type: 'Consultation Fee', patient: 'Vikram Singh', amount: 800, comm: 80, net: 720, status: 'Settled' },
];

export default function RevenueScreen() {
  return (
    <div className="w-full animate-fade space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-teal-600" />
            Revenue & Settlements
          </h1>
          <p className="text-slate-500 font-medium mt-1">Track your earnings, platform commissions, and bank payouts.</p>
        </div>
        <button className="w-full md:w-auto btn btn-outline flex items-center justify-center gap-2 shadow-sm bg-white border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-teal-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <IndianRupee className="w-32 h-32" />
          </div>
          <p className="text-teal-200 font-bold uppercase tracking-wider text-xs mb-2 relative z-10">Total Net Earnings (MTD)</p>
          <div className="flex items-end gap-3 relative z-10">
            <h2 className="text-4xl font-black tracking-tight flex items-center">
              ₹1,20,500
            </h2>
            <span className="flex items-center gap-1 text-emerald-400 font-bold text-sm bg-emerald-400/10 px-2 py-1 rounded-lg mb-1">
              <TrendingUp className="w-4 h-4" /> +12.5%
            </span>
          </div>
          <p className="text-teal-200/60 text-xs mt-4 relative z-10 font-medium">After 10% platform commission</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Pending in Escrow</p>
              <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><Clock className="w-5 h-5" /></div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
              ₹12,400
            </h2>
          </div>
          <p className="text-slate-500 text-xs font-medium mt-4 border-t border-slate-100 pt-3">To be settled in next cycle (Every Tuesday)</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Platform Commission</p>
              <div className="p-2 bg-rose-50 text-rose-500 rounded-xl"><TrendingDown className="w-5 h-5" /></div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
              ₹13,388
            </h2>
          </div>
          <p className="text-slate-500 text-xs font-medium mt-4 border-t border-slate-100 pt-3">10% standard deduction applied</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Transactions</h3>
          <select className="bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20">
            <option>This Month</option>
            <option>Last Month</option>
            <option>All Time</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-white">
                <th className="p-4 pl-6">Transaction ID & Date</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Gross Amount</th>
                <th className="p-4 text-right">Commission</th>
                <th className="p-4 text-right">Net Amount</th>
                <th className="p-4 pr-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {MOCK_TRANSACTIONS.map(txn => (
                <tr key={txn.id} className={`hover:bg-slate-50/50 transition-colors ${txn.isTransfer ? 'bg-teal-50/30' : ''}`}>
                  <td className="p-4 pl-6">
                    <p className="font-bold text-teal-600 font-mono text-xs mb-0.5">{txn.id}</p>
                    <p className="text-xs font-semibold text-slate-500">{txn.date}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{txn.type}</p>
                    <p className="text-xs font-medium text-slate-500">{txn.patient}</p>
                  </td>
                  <td className="p-4 text-right font-medium text-slate-600">
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-rose-500 font-medium">
                    {txn.comm > 0 ? `-₹${txn.comm}` : '-'}
                  </td>
                  <td className={`p-4 text-right font-bold ${txn.isTransfer ? 'text-teal-600' : 'text-slate-800'}`}>
                    <div className="flex items-center justify-end gap-1">
                      {txn.isTransfer ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4 text-emerald-500" />}
                      ₹{txn.net.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-center">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      txn.status === 'Settled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

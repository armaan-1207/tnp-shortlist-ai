import React, { useState } from 'react';
import { PredictionResult } from '../lib/predictor';
import { sound } from '../lib/sound';
import { Search, ArrowUpDown, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Building2, ExternalLink } from 'lucide-react';

interface CompanyTableProps {
  predictions: PredictionResult[];
  selectedCompanyId: string;
  onSelectCompany: (companyId: string) => void;
}

export const CompanyTable: React.FC<CompanyTableProps> = ({
  predictions,
  selectedCompanyId,
  onSelectCompany,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'ELIGIBLE' | 'HIGH_CHANCE' | 'SUPER_DREAM'>('ALL');
  const [sortBy, setSortBy] = useState<'PROB' | 'CTC' | 'CGPA'>('PROB');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter logic
  const filtered = predictions.filter((res) => {
    const matchesSearch =
      res.company.name.toLowerCase().includes(search.toLowerCase()) ||
      res.company.role.toLowerCase().includes(search.toLowerCase()) ||
      res.company.roleType.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'ELIGIBLE') return res.isEligible;
    if (filterType === 'HIGH_CHANCE') return res.probability >= 70;
    if (filterType === 'SUPER_DREAM') return res.company.ctcLpa >= 25;
    return true;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'PROB') {
      diff = a.probability - b.probability;
    } else if (sortBy === 'CTC') {
      diff = a.company.ctcLpa - b.company.ctcLpa;
    } else if (sortBy === 'CGPA') {
      diff = a.company.minCgpa - b.company.minCgpa;
    }
    return sortAsc ? diff : -diff;
  });

  const handleSort = (field: 'PROB' | 'CTC' | 'CGPA') => {
    sound.click();
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(false);
    }
  };

  const getStatusBadge = (res: PredictionResult) => {
    if (!res.isEligible || res.status === 'DISQUALIFIED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          <span>{res.statusLabel}</span>
        </span>
      );
    }
    if (res.probability >= 72) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Strong Call ({res.probability}%)</span>
        </span>
      );
    }
    if (res.probability >= 42) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Competitive ({res.probability}%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <span>Stretch ({res.probability}%)</span>
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-colors duration-200">
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE CILP SHORTLIST SCREENER</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            ({sorted.length} / {predictions.length} Firms Active)
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium mr-1">Filter Tiers:</span>
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            filterType === 'ALL'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All ({predictions.length})
        </button>
        <button
          onClick={() => setFilterType('ELIGIBLE')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            filterType === 'ELIGIBLE'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Eligible
        </button>
        <button
          onClick={() => setFilterType('HIGH_CHANCE')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            filterType === 'HIGH_CHANCE'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          ≥70% Prob
        </button>
        <button
          onClick={() => setFilterType('SUPER_DREAM')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            filterType === 'SUPER_DREAM'
              ? 'bg-violet-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Super Dream (≥25 LPA)
        </button>
      </div>

      {/* Screener Table */}
      <div className="overflow-x-auto dense-scroll max-h-[520px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 sticky top-0 z-10 border-b border-slate-200/80 dark:border-slate-800/80 uppercase tracking-wider text-[11px] font-semibold">
            <tr>
              <th className="py-3 px-4">Company & Role</th>
              <th
                onClick={() => handleSort('CTC')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>CTC / Package</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('CGPA')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Cutoff</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3">Allowed Branches</th>
              <th
                onClick={() => handleSort('PROB')}
                className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Call Probability</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
                </div>
              </th>
              <th className="py-3 px-3">Status Gate</th>
              <th className="py-3 px-4 text-right">SHAP Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {sorted.map((res) => {
              const isSelected = res.company.id === selectedCompanyId;
              return (
                <tr
                  key={res.company.id}
                  onClick={() => {
                    sound.click();
                    onSelectCompany(res.company.id);
                  }}
                  className={`group transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-inset ring-indigo-500/40'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Company & Role */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-300 shadow-sm flex-shrink-0">
                        {res.company.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {res.company.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                            {res.company.roleType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {res.company.role}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* CTC */}
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                      {res.company.ctc}
                    </div>
                    {res.company.stipend && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        {res.company.stipend}
                      </div>
                    )}
                  </td>

                  {/* Cutoff */}
                  <td className="py-3.5 px-3 font-mono">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {res.company.minCgpa.toFixed(1)}
                    </span>
                  </td>

                  {/* Allowed Branches */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1 max-w-[140px]">
                      {res.company.allowedBranches.slice(0, 3).map((branch) => (
                        <span
                          key={branch}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                        >
                          {branch}
                        </span>
                      ))}
                      {res.company.allowedBranches.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          +{res.company.allowedBranches.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Probability */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs w-8">
                        {res.probability}%
                      </span>
                      <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex-shrink-0">
                        <div
                          className={`h-full rounded-full ${
                            res.probability >= 72
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : res.probability >= 42
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                              : 'bg-gradient-to-r from-rose-500 to-orange-400'
                          }`}
                          style={{ width: `${res.probability}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-3">
                    {getStatusBadge(res)}
                  </td>

                  {/* Inspect CTA */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCompany(res.company.id);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>Explain</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

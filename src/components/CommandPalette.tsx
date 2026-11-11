import React, { useState, useEffect, useRef } from 'react';
import { TIET_COMPANIES, Company } from '../data/companies';
import { PRESET_PROFILES, StudentProfile } from '../lib/predictor';
import { sound } from '../lib/sound';
import { 
  Search, 
  Building2, 
  Sparkles, 
  FileText, 
  SlidersHorizontal, 
  ShieldCheck, 
  Sun, 
  Moon, 
  X, 
  ArrowRight,
  Command,
  BookOpen
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany: (companyId: string) => void;
  onSelectArchetype: (profile: StudentProfile) => void;
  onSwitchTab: (tab: 'SCREENER' | 'WHAT_IF' | 'SKILL_BADGE') => void;
  onOpenCutoffs: () => void;
  onOpenReport: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCompany,
  onSelectArchetype,
  onSwitchTab,
  onOpenCutoffs,
  onOpenReport,
  onToggleTheme,
  isDark,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      sound.click();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open handled by parent
        }
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const cleanQ = query.toLowerCase().trim();

  const filteredCompanies = TIET_COMPANIES.filter(
    (c) =>
      c.name.toLowerCase().includes(cleanQ) ||
      c.role.toLowerCase().includes(cleanQ) ||
      c.roleType.toLowerCase().includes(cleanQ)
  );

  const filteredArchetypes = PRESET_PROFILES.filter(
    (p) =>
      p.label.toLowerCase().includes(cleanQ) ||
      p.profile.branch.toLowerCase().includes(cleanQ)
  );

  interface ActionItem {
    id: string;
    label: string;
    category: string;
    icon: React.ReactNode;
    handler: () => void;
  }

  const actions: ActionItem[] = [
    {
      id: 'tab-screener',
      label: 'Switch to Shortlist Screener & SHAP Inspector',
      category: 'Navigation',
      icon: <Building2 className="w-4 h-4 text-indigo-500" />,
      handler: () => {
        onSwitchTab('SCREENER');
        onClose();
      },
    },
    {
      id: 'tab-whatif',
      label: 'Open What-If Simulator Workbench',
      category: 'Navigation',
      icon: <SlidersHorizontal className="w-4 h-4 text-violet-500" />,
      handler: () => {
        onSwitchTab('WHAT_IF');
        onClose();
      },
    },
    {
      id: 'tab-badge',
      label: 'Open Mock OA Proctor & Skill Badge',
      category: 'Navigation',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      handler: () => {
        onSwitchTab('SKILL_BADGE');
        onClose();
      },
    },
    {
      id: 'action-report',
      label: 'Export Official CILP Placement Executive Report',
      category: 'Report',
      icon: <FileText className="w-4 h-4 text-amber-500" />,
      handler: () => {
        onClose();
        onOpenReport();
      },
    },
    {
      id: 'action-cutoffs',
      label: 'Browse Historical CILP Cutoffs Dossier (2022-2024)',
      category: 'Dossier',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      handler: () => {
        onClose();
        onOpenCutoffs();
      },
    },
    {
      id: 'action-theme',
      label: `Switch to ${isDark ? 'Light' : 'Dark'} Mode`,
      category: 'Preferences',
      icon: isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />,
      handler: () => {
        onToggleTheme();
        onClose();
      },
    },
  ].filter((a) => a.label.toLowerCase().includes(cleanQ));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search companies, archetypes, shortcuts (e.g. Google, What-If, Report)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          
          {/* Companies Section */}
          {filteredCompanies.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
                <span>Recruiting Companies ({filteredCompanies.length})</span>
                <span className="text-[10px] text-slate-400 lowercase">jump to SHAP breakdown</span>
              </div>
              <div className="space-y-1">
                {filteredCompanies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      sound.click();
                      onSelectCompany(c.id);
                      onSwitchTab('SCREENER');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                        {c.logo}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {c.role} • <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{c.ctc}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        Cutoff: {c.minCgpa}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Archetypes Section */}
          {filteredArchetypes.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
                <span>Benchmarked Candidate Archetypes ({filteredArchetypes.length})</span>
                <span className="text-[10px] text-slate-400 lowercase">load profile</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredArchetypes.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      sound.success();
                      onSelectArchetype(p.profile);
                      onClose();
                    }}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {p.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {p.profile.branch} • {p.profile.cgpa.toFixed(2)} CGPA
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {actions.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                Quick Actions & Navigation
              </div>
              <div className="space-y-1">
                {actions.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => {
                      sound.click();
                      act.handler();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {act.icon}
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                        {act.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {act.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredCompanies.length === 0 && filteredArchetypes.length === 0 && actions.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for a company name, role, or action</p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Command className="w-3 h-3 text-indigo-500" />
              <span>TIET CILP Spotlight</span>
            </span>
            <span>•</span>
            <span>100% Client-Side Search</span>
          </div>
          <span className="hidden sm:inline font-mono text-[10px]">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};

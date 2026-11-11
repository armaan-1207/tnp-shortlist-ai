import React, { useState, useEffect } from 'react';
import { Company, TIET_COMPANIES } from '../data/companies';
import { sound } from '../lib/sound';
import { 
  StudentProfile, 
  evaluateShortlist, 
  computeOptimalTarget, 
  PredictionResult 
} from '../lib/predictor';
import { 
  SlidersHorizontal, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Wand2, 
  CheckCircle2,
  Building2,
  TrendingUp
} from 'lucide-react';

interface WhatIfSimulatorProps {
  currentProfile: StudentProfile;
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  onApplySimulatedToProfile: (simulated: StudentProfile) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentProfile,
  selectedCompanyId,
  onSelectCompany,
  onApplySimulatedToProfile,
}) => {
  // Simulated state starts with currentProfile values
  const [simCgpa, setSimCgpa] = useState(currentProfile.cgpa);
  const [simLeetCode, setSimLeetCode] = useState(currentProfile.leetcodeSolved);
  const [simCodeforces, setSimCodeforces] = useState(currentProfile.codeforcesRating);
  const [simInternships, setSimInternships] = useState(currentProfile.priorInternships);
  const [simHackathons, setSimHackathons] = useState(currentProfile.hackathonsWon);

  // Sync when currentProfile changes
  useEffect(() => {
    setSimCgpa(currentProfile.cgpa);
    setSimLeetCode(currentProfile.leetcodeSolved);
    setSimCodeforces(currentProfile.codeforcesRating);
    setSimInternships(currentProfile.priorInternships);
    setSimHackathons(currentProfile.hackathonsWon);
  }, [currentProfile]);

  const targetCompany =
    TIET_COMPANIES.find((c) => c.id === selectedCompanyId) || TIET_COMPANIES[0];

  // Base prediction with actual profile
  const basePrediction: PredictionResult = evaluateShortlist(currentProfile, targetCompany);

  // Simulated profile
  const simulatedProfile: StudentProfile = {
    ...currentProfile,
    cgpa: simCgpa,
    leetcodeSolved: simLeetCode,
    codeforcesRating: simCodeforces,
    priorInternships: simInternships,
    hackathonsWon: simHackathons,
  };

  // Simulated prediction
  const simPrediction: PredictionResult = evaluateShortlist(simulatedProfile, targetCompany);

  // Probability Delta
  const probDelta = simPrediction.probability - basePrediction.probability;

  // Calculate Optimal Target
  const optimal = computeOptimalTarget(currentProfile, targetCompany);

  const handleApplyOptimal = () => {
    sound.success();
    setSimCgpa(optimal.requiredCgpa);
    setSimLeetCode(optimal.requiredLeetCode);
    setSimCodeforces(optimal.requiredCodeforces);
  };

  const handleResetToCurrent = () => {
    sound.click();
    setSimCgpa(currentProfile.cgpa);
    setSimLeetCode(currentProfile.leetcodeSolved);
    setSimCodeforces(currentProfile.codeforcesRating);
    setSimInternships(currentProfile.priorInternships);
    setSimHackathons(currentProfile.hackathonsWon);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-6 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Interactive "What-If" Shortlist Simulator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time parameter perturbation & effort-frontier solver for recruitment targets
            </p>
          </div>
        </div>

        {/* Company Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Target Firm:</label>
          <select
            value={targetCompany.id}
            onChange={(e) => onSelectCompany(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs font-semibold text-slate-900 dark:text-slate-100 px-3 py-1.5 rounded-lg outline-none cursor-pointer transition-all"
          >
            {TIET_COMPANIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.ctc})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison HUD: Current Reality vs Trajectory vs Projected Result */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current State */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Current Reality
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">
              {basePrediction.probability}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({basePrediction.statusLabel})
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono truncate">
            {currentProfile.cgpa.toFixed(2)} CGPA • {currentProfile.leetcodeSolved} LC • {currentProfile.codeforcesRating} CF
          </div>
        </div>

        {/* Delta Indicator */}
        <div className="flex flex-col items-center justify-center p-4 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
          <div className="text-[10px] text-indigo-700 dark:text-indigo-300 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Simulated Trajectory</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-2xl font-black font-mono ${
                probDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {probDelta >= 0 ? `+${probDelta}%` : `${probDelta}%`}
            </span>
            <ArrowRight className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            {probDelta > 0 ? 'Projected Shortlist Gain' : 'No net improvement'}
          </div>
        </div>

        {/* Projected State */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>Projected Probability</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded font-medium">
              {simPrediction.statusLabel}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {simPrediction.probability}%
            </span>
            <span className="text-xs text-emerald-600/80 font-mono">
              (+{probDelta}% over base)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono truncate">
            {simCgpa.toFixed(2)} CGPA • {simLeetCode} LC • {simCodeforces} CF
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Simulated CGPA */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Next Semester Target CGPA:</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 line-through text-[11px] font-mono">
                {currentProfile.cgpa.toFixed(2)}
              </span>
              <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg border border-indigo-200/80 dark:border-indigo-800/60">
                {simCgpa.toFixed(2)}
              </span>
            </div>
          </div>
          <input
            type="range"
            min="6.50"
            max="10.00"
            step="0.05"
            value={simCgpa}
            onChange={(e) => setSimCgpa(parseFloat(e.target.value))}
            className="w-full cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg mt-2"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>6.50</span>
            <span className="text-amber-500 font-medium">Cutoff: {targetCompany.minCgpa.toFixed(1)}</span>
            <span>10.00</span>
          </div>
        </div>

        {/* Simulated LeetCode */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-700 dark:text-slate-300 font-medium">LeetCode Problem Target:</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 line-through text-[11px] font-mono">
                {currentProfile.leetcodeSolved}
              </span>
              <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg border border-indigo-200/80 dark:border-indigo-800/60">
                {simLeetCode} solved
              </span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="20"
            value={simLeetCode}
            onChange={(e) => setSimLeetCode(parseInt(e.target.value, 10))}
            className="w-full cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg mt-2"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>0</span>
            <span className="text-indigo-500 font-medium">Target: {targetCompany.targetLeetCode}</span>
            <span>1000</span>
          </div>
        </div>

        {/* Simulated Codeforces */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Contest Rating (Codeforces):</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 line-through text-[11px] font-mono">
                {currentProfile.codeforcesRating}
              </span>
              <span className="font-bold font-mono text-violet-600 dark:text-violet-400 px-2 py-0.5 bg-violet-50 dark:bg-violet-950/60 rounded-lg border border-violet-200/80 dark:border-violet-800/60">
                {simCodeforces} rating
              </span>
            </div>
          </div>
          <input
            type="range"
            min="800"
            max="2300"
            step="50"
            value={simCodeforces}
            onChange={(e) => setSimCodeforces(parseInt(e.target.value, 10))}
            className="w-full cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg mt-2"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>800</span>
            <span className="text-cyan-600 font-medium">Target: {targetCompany.targetCodeforces}</span>
            <span>2300</span>
          </div>
        </div>

        {/* Simulated Internships & Hackathons */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Internships & Hackathon Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Internships</label>
              <select
                value={simInternships}
                onChange={(e) => setSimInternships(parseInt(e.target.value, 10))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 text-xs outline-none"
              >
                <option value={0}>0 Internships</option>
                <option value={1}>1 Internship</option>
                <option value={2}>2 Internships</option>
                <option value={3}>3+ Internships</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Hackathons Won</label>
              <select
                value={simHackathons}
                onChange={(e) => setSimHackathons(parseInt(e.target.value, 10))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 text-xs outline-none"
              >
                <option value={0}>0 Won</option>
                <option value={1}>1 Win</option>
                <option value={2}>2 Wins</option>
                <option value={3}>3+ Wins</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Target Solver Card & Actions */}
      <div className="p-4 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/80 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Automated Target Solver for {targetCompany.name}:</span>
              <span className="text-emerald-600 dark:text-emerald-400">Aim: ≥{optimal.estimatedProb}% Call Probability</span>
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
              Optimal Frontier: Push CGPA to <strong className="text-slate-900 dark:text-white font-mono">{optimal.requiredCgpa.toFixed(2)}</strong>, LeetCode to <strong className="text-slate-900 dark:text-white font-mono">{optimal.requiredLeetCode}</strong>, Codeforces to <strong className="text-slate-900 dark:text-white font-mono">{optimal.requiredCodeforces}</strong>.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyOptimal}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            Auto-Apply Targets
          </button>
          <button
            onClick={handleResetToCurrent}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => {
              sound.success();
              onApplySimulatedToProfile(simulatedProfile);
            }}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Save to Active Profile</span>
          </button>
        </div>
      </div>

    </div>
  );
};

import React from 'react';
import { StudentProfile, PRESET_PROFILES } from '../lib/predictor';
import { BRANCH_LIST } from '../data/companies';
import { sound } from '../lib/sound';
import { User, RefreshCw, Sparkles, GraduationCap, Code2, Briefcase, AlertCircle } from 'lucide-react';

interface StudentConfiguratorProps {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  onReset: () => void;
}

export const StudentConfigurator: React.FC<StudentConfiguratorProps> = ({
  profile,
  onChange,
  onReset,
}) => {
  const updateField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm transition-colors duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white uppercase font-sans">
              Candidate Dossier Configurator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tune your metrics to simulate realistic CILP shortlisting algorithms & OA cutoffs
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.click();
            onReset();
          }}
          title="Reset to default benchmark"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Reset Profile</span>
        </button>
      </div>

      {/* Preset Archetypes */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Quick Benchmark Archetypes:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {PRESET_PROFILES.map((preset) => {
            const isSelected =
              profile.rollNo === preset.profile.rollNo &&
              profile.branch === preset.profile.branch;
            return (
              <button
                key={preset.label}
                onClick={() => {
                  sound.success();
                  onChange({ ...preset.profile });
                }}
                className={`p-3 rounded-xl text-left border transition-all text-xs ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 dark:border-indigo-500/80 ring-2 ring-indigo-500/30 text-indigo-900 dark:text-indigo-200 shadow-sm'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold truncate">{preset.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  {preset.profile.branch} • {preset.profile.cgpa.toFixed(2)} CGPA
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Three Detailed Configuration Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Cluster 1: Academic Standing & Identity */}
        <div className="p-4 bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 rounded-xl space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>Academic Standing & Identity</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                TIET Roll Number
              </label>
              <input
                type="text"
                value={profile.rollNo}
                onChange={(e) => updateField('rollNo', e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100 font-mono outline-none transition-all"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
              Degree & Branch
            </label>
            <select
              value={profile.branch}
              onChange={(e) => updateField('branch', e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100 outline-none transition-all font-mono"
            >
              {BRANCH_LIST.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.code} — {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Cumulative CGPA</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold font-mono text-xs">
                {profile.cgpa.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="5.50"
              max="10.00"
              step="0.05"
              value={profile.cgpa}
              onChange={(e) => {
                sound.tick();
                updateField('cgpa', parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>6.00</span>
              <span className="text-amber-500 font-semibold">Cutoff: 7.50</span>
              <span className="text-indigo-500 font-semibold">Tier-1: 8.50+</span>
              <span>10.00</span>
            </div>
          </div>
        </div>

        {/* Cluster 2: Competitive Programming & DSA */}
        <div className="p-4 bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span>Competitive Programming & Problem Solving</span>
          </div>

          {/* LeetCode Slider */}
          <div className="text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-600 dark:text-slate-400 font-medium">LeetCode Problems Solved</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold font-mono text-xs">
                {profile.leetcodeSolved}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1200"
              step="25"
              value={profile.leetcodeSolved}
              onChange={(e) => {
                sound.tick();
                updateField('leetcodeSolved', parseInt(e.target.value, 10));
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0</span>
              <span className="text-slate-500">250 (Medium)</span>
              <span className="text-indigo-500 font-semibold">500+ (Google Bar)</span>
              <span>1200+</span>
            </div>
          </div>

          {/* Codeforces Slider */}
          <div className="text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Codeforces Rating</span>
              <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 font-bold font-mono text-xs">
                {profile.codeforcesRating}
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="2400"
              step="50"
              value={profile.codeforcesRating}
              onChange={(e) => {
                sound.tick();
                updateField('codeforcesRating', parseInt(e.target.value, 10));
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>800 (Newbie)</span>
              <span className="text-cyan-600 font-medium">1400 (Specialist)</span>
              <span className="text-indigo-500 font-semibold">1600+ (Expert)</span>
              <span>2400</span>
            </div>
          </div>
        </div>

        {/* Cluster 3: Practical Engineering & History */}
        <div className="p-4 bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 rounded-xl space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span>Practical Experience & Backlogs</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                GitHub Repos
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={profile.githubRepos}
                onChange={(e) => updateField('githubRepos', parseInt(e.target.value, 10) || 0)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100 font-mono outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Hackathons Won
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={profile.hackathonsWon}
                onChange={(e) => updateField('hackathonsWon', parseInt(e.target.value, 10) || 0)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100 font-mono outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                Prior Internships
              </label>
              <select
                value={profile.priorInternships}
                onChange={(e) => updateField('priorInternships', parseInt(e.target.value, 10))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100 outline-none transition-all font-mono"
              >
                <option value={0}>0 (None)</option>
                <option value={1}>1 Internship</option>
                <option value={2}>2 Internships</option>
                <option value={3}>3+ Internships</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1">
                <span>Active Backlogs</span>
                {profile.activeBacklogs > 0 && (
                  <AlertCircle className="w-3 h-3 text-rose-500" />
                )}
              </label>
              <select
                value={profile.activeBacklogs}
                onChange={(e) => updateField('activeBacklogs', parseInt(e.target.value, 10))}
                className={`w-full bg-white dark:bg-slate-900 border focus:ring-2 rounded-lg px-3 py-1.5 outline-none transition-all font-mono ${
                  profile.activeBacklogs > 0
                    ? 'border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              >
                <option value={0}>0 (Clean Record)</option>
                <option value={1}>1 Active Backlog</option>
                <option value={2}>2 Active Backlogs</option>
                <option value={3}>3+ Backlogs</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

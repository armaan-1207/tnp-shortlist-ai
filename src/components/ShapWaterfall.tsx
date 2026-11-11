import React, { useState } from 'react';
import { PredictionResult, ShapFactor } from '../lib/predictor';
import { sound } from '../lib/sound';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Lightbulb, 
  Building2, 
  ArrowRight,
  Calculator,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface ShapWaterfallProps {
  prediction: PredictionResult;
  onOpenWhatIf?: () => void;
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({
  prediction,
  onOpenWhatIf,
}) => {
  const [activeFactor, setActiveFactor] = useState<ShapFactor | null>(null);
  const { company, probability, baseRate, shapFactors, isEligible, hardGateReason } = prediction;

  // Maximum impact magnitude for relative bar width scaling
  const maxImpact = Math.max(...shapFactors.map((f) => Math.abs(f.impact)), 25);

  const posImpactTotal = shapFactors
    .filter((f) => f.impact > 0)
    .reduce((acc, f) => acc + f.impact, 0);

  const negImpactTotal = shapFactors
    .filter((f) => f.impact < 0)
    .reduce((acc, f) => acc + f.impact, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-5 transition-colors duration-200">
      
      {/* Header with Company Context */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-base text-slate-800 dark:text-white shadow-sm flex-shrink-0">
            {company.logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {company.name}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                {company.roleType}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {company.role} • OA: <span className="font-semibold text-slate-700 dark:text-slate-300">{company.oaPlatform}</span>
            </p>
          </div>
        </div>

        {/* Probability Metric Hero Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
              Predicted Call Odds
            </div>
            <div className="flex items-baseline justify-end gap-1.5">
              <span
                className={`text-2xl font-bold font-mono ${
                  probability >= 72
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : probability >= 42
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {probability}%
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (Base: {baseRate}%)
              </span>
            </div>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
              probability >= 72
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : probability >= 42
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
            }`}
          >
            {probability >= 72 ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-amber-500" />
            )}
            <span>{prediction.statusLabel}</span>
          </div>
        </div>
      </div>

      {/* Disqualification Banner */}
      {!isEligible && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-700 dark:text-rose-300">CILP Hard Gate Disqualification</div>
            <div className="mt-0.5 text-[11px] leading-relaxed">{hardGateReason}</div>
          </div>
        </div>
      )}

      {/* Mathematical Reconciliation Strip */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 rounded-xl text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Calculator className="w-3.5 h-3.5 text-indigo-500" />
            <span>SHAP Marginal Probability Attribution</span>
          </span>
          <span className="font-mono">Formula: Base + Σ(Drivers)</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            Base: +{baseRate}%
          </span>
          <span className="text-slate-400">+</span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
            Boosts: +{posImpactTotal.toFixed(1)}%
          </span>
          <span className="text-slate-400">-</span>
          <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold">
            Penalties: {Math.abs(negImpactTotal).toFixed(1)}%
          </span>
          <span className="text-slate-400">=</span>
          <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
            Final: {probability}%
          </span>
        </div>
      </div>

      {/* Waterfall Visual Bars */}
      <div className="space-y-2 pt-1">
        {/* Baseline Bar */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Campus Baseline Prior (TIET Pool)</span>
          </div>
          <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
            +{baseRate.toFixed(1)}%
          </span>
        </div>

        {/* Factors */}
        {shapFactors.map((factor, index) => {
          const isPos = factor.impact >= 0;
          const barWidthPercent = Math.min(100, Math.round((Math.abs(factor.impact) / maxImpact) * 100));

          return (
            <div
              key={index}
              onClick={() => {
                sound.click();
                setActiveFactor(activeFactor?.name === factor.name ? null : factor);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                activeFactor?.name === factor.name
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-800/30 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 truncate">
                  {isPos ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  )}
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {factor.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">
                    {factor.featureValue}
                  </span>
                </div>

                <div className="font-bold font-mono text-xs">
                  <span className={isPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                    {isPos ? `+${factor.impact.toFixed(1)}%` : `${factor.impact.toFixed(1)}%`}
                  </span>
                </div>
              </div>

              {/* Progress bar track */}
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isPos
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-rose-500 to-orange-400'
                  }`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              {/* Expanded details on click */}
              {activeFactor?.name === factor.name ? (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 animate-fade-in leading-relaxed">
                  <div className="font-semibold text-slate-800 dark:text-white mb-0.5">Factor Diagnostic:</div>
                  {factor.description}
                  <div className="mt-1 text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                    Calculated relative to 2,000+ TIET candidate placement records.
                  </div>
                </div>
              ) : (
                <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {factor.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recruiter Strategy Insight Box */}
      <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-indigo-950 dark:text-indigo-200 block mb-0.5">
              CILP Recruiter Insight:
            </strong>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {probability >= 72
                ? `Your profile is safely positioned in the top tier for ${company.name}. Focus on interview prep and system design.`
                : `A +0.3 increase in CGPA or 100 extra LeetCode problems would flip this into a high-confidence call.`}
            </p>
          </div>
        </div>

        {onOpenWhatIf && (
          <button
            onClick={() => {
              sound.click();
              onOpenWhatIf();
            }}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-1.5 flex-shrink-0 shadow-sm transition-colors"
          >
            <span>What-If</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};

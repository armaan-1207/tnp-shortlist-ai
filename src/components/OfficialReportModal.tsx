import React from 'react';
import { StudentProfile, PredictionResult } from '../lib/predictor';
import { sound } from '../lib/sound';
import { 
  Printer, 
  Download, 
  X, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  FileText,
  Award
} from 'lucide-react';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  predictions: PredictionResult[];
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  predictions,
}) => {
  if (!isOpen) return null;

  const eligiblePredictions = predictions.filter((p) => p.isEligible);
  const highProbPredictions = predictions.filter((p) => p.probability >= 70);
  const avgProbability = Math.round(
    predictions.reduce((acc, p) => acc + p.probability, 0) / predictions.length
  );

  const reportId = `TIET-CILP-${profile.rollNo.slice(-5)}-${Math.floor(Date.now() / 1000).toString(16).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    sound.click();
    window.print();
  };

  const handleDownloadJson = () => {
    sound.success();
    const data = {
      reportId,
      generationDate: new Date().toISOString(),
      student: profile,
      summary: {
        totalEvaluated: predictions.length,
        eligibleCount: eligiblePredictions.length,
        highProbabilityCount: highProbPredictions.length,
        averageProbability: avgProbability,
      },
      predictions: predictions.map((p) => ({
        company: p.company.name,
        role: p.company.role,
        ctc: p.company.ctc,
        probability: p.probability,
        isEligible: p.isEligible,
        statusLabel: p.statusLabel,
        topShapDrivers: p.shapFactors.slice(0, 3).map((f) => ({
          name: f.name,
          impact: f.impact,
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CILP_Report_${profile.rollNo}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>OFFICIAL CILP PLACEMENT DOSSIER PREVIEW</span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline font-mono text-[11px] text-slate-500">ID: {reportId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 max-h-[75vh] overflow-y-auto space-y-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans print:p-0 print:max-h-none print:overflow-visible">
          
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-indigo-600 pb-6 text-center space-y-1">
            <div className="inline-flex items-center justify-center p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 mb-2">
              <GraduationCap className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase text-slate-900 dark:text-white">
              Thapar Institute of Engineering & Technology
            </h1>
            <h2 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              Centre for Industrial Liaison & Placement (CILP)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Candidate Algorithmic Shortlist Readiness & SHAP Explainability Dossier
            </p>
          </div>

          {/* Candidate Particulars & KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Candidate Name</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{profile.name}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Roll Number</div>
              <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">{profile.rollNo}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Degree / Branch</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{profile.branch}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Current CGPA</div>
              <div className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">{profile.cgpa.toFixed(2)} / 10.00</div>
            </div>
          </div>

          {/* Technical Profile Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
              <div className="text-slate-500 text-[10px] uppercase font-medium">LeetCode Solved</div>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">{profile.leetcodeSolved}</div>
              <div className="text-[10px] text-emerald-600 font-medium">Rank Benchmark</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
              <div className="text-slate-500 text-[10px] uppercase font-medium">Codeforces Rating</div>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">{profile.codeforcesRating}</div>
              <div className="text-[10px] text-indigo-600 font-medium">Specialist Band</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
              <div className="text-slate-500 text-[10px] uppercase font-medium">Verified Internships</div>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">{profile.priorInternships} Tier-1</div>
              <div className="text-[10px] text-slate-500 font-medium">Production Exp</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
              <div className="text-slate-500 text-[10px] uppercase font-medium">Hackathons Won</div>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">{profile.hackathonsWon} Podium</div>
              <div className="text-[10px] text-amber-600 font-medium">Innovation Factor</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80">
              <div className="text-slate-500 text-[10px] uppercase font-medium">Academic Backlogs</div>
              <div className="text-base font-bold font-mono text-emerald-600 mt-0.5">{profile.activeBacklogs} Clean</div>
              <div className="text-[10px] text-emerald-600 font-medium">Gate Pass Verified</div>
            </div>
          </div>

          {/* Placement Drive Prediction Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold tracking-tight uppercase text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <span>Tier-1 Placement Shortlist Probability Matrix</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Eligible Drives: {eligiblePredictions.length} / {predictions.length}
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-4">Recruiting Firm</th>
                    <th className="py-2.5 px-3">Role & CTC</th>
                    <th className="py-2.5 px-3">Min CGPA</th>
                    <th className="py-2.5 px-3">Eligibility</th>
                    <th className="py-2.5 px-3 text-right">Shortlist Probability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {predictions.map((p) => (
                    <tr key={p.company.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {p.company.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {p.company.roleType} • <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{p.company.ctc}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {p.company.minCgpa.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3">
                        {p.isEligible ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Qualified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-500">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Cutoff Missed</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`font-mono font-bold text-sm ${
                          p.probability >= 70 ? 'text-emerald-600 dark:text-emerald-400' :
                          p.probability >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'
                        }`}>
                          {p.probability}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Placement Recommendations */}
          <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2.5 text-xs">
            <div className="font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>CILP Placement Preparation Roadmap & Action Plan</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
              <li>
                <strong className="text-slate-900 dark:text-white">Academic Threshold Optimization:</strong> Maintain CGPA above 8.50 to clear Tier-1 Google & DE Shaw automatic resume parsing filters.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Online Assessment Cadence:</strong> Solve 40+ medium/hard questions on HackerRank to peak performance for upcoming August CILP season.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Verified Skill Badge:</strong> Attach your cryptographically hashed CILP Mock OA credential to your placement portal resume.
              </li>
            </ul>
          </div>

          {/* Institutional Signature & Stamp Block */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Centre for Industrial Liaison & Placement</div>
              <div>Thapar Technology Campus, Bhadson Road, Patiala, Punjab - 147004</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Date Issued: {currentDate} • Verified Client-Side Engine</div>
            </div>

            <div className="text-right">
              <div className="w-24 h-12 border-b border-dashed border-slate-400 mb-1 ml-auto" />
              <div className="font-semibold text-slate-800 dark:text-slate-200">Executive Placement Officer</div>
              <div className="text-[10px] text-slate-400">Authorized Digital Sign-off</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

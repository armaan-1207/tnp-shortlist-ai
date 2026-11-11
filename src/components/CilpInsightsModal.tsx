import React from 'react';
import { TIET_COMPANIES } from '../data/companies';
import { X, HelpCircle, History, AlertOctagon, TrendingUp, BookOpen, ShieldAlert } from 'lucide-react';

interface CilpInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CilpInsightsModal: React.FC<CilpInsightsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono text-xs">
      <div className="bg-[#12101f] border border-purple-500/40 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl shadow-purple-950/80">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#24203a] bg-[#161327] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wide">
                TIET CILP Placement Intelligence Dossier
              </h3>
              <p className="text-[11px] text-[#8680a0]">
                De-mystifying the 2022–2024 Patiala shortlisting algorithm & hidden rejections
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#1f1b34] hover:bg-[#2c264a] flex items-center justify-center text-[#aea7cc] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Dense Scroll */}
        <div className="p-5 overflow-y-auto dense-scroll space-y-5 text-[#aea7cc] text-xs">
          {/* FAQ 1: The #1 TIET Student Complaint */}
          <div className="p-3.5 bg-[#171328] border border-purple-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>Why Did My Friend with 8.1 CGPA Get Shortlisted While My 9.2 Was Rejected?</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#aea7cc]">
              At TIET, CILP receives 2,200+ applications for every marquee software drive (Google, Microsoft, DE Shaw). Contrary to popular belief, companies do not evaluate applicants in a single giant bucket:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2 bg-[#0d0b1a] rounded border border-[#221e38]">
                <strong className="text-white block mb-0.5">1. Hidden OA Time Penalties:</strong>
                Platforms like Mercer Mettl and HackerRank log time-to-first-submission. 100/100 points in 18 minutes beats 100/100 points in 58 minutes.
              </div>
              <div className="p-2 bg-[#0d0b1a] rounded border border-[#221e38]">
                <strong className="text-white block mb-0.5">2. Branch Quota Balancing:</strong>
                Recruiters allocate slots per branch (e.g. 60% COE/COPC, 30% ENC/ECE, 10% Other). A 9.2 in a packed branch can face a higher cutoff than an 8.4 elsewhere.
              </div>
              <div className="p-2 bg-[#0d0b1a] rounded border border-[#221e38]">
                <strong className="text-white block mb-0.5">3. Plagiarism Similarity:</strong>
                Automated AST parsers flag submissions sharing similar helper functions or variable structures with zero human appeal.
              </div>
            </div>
          </div>

          {/* Historical Cutoff Evolution Table */}
          <div>
            <div className="flex items-center gap-2 mb-2 font-bold text-white text-xs uppercase tracking-wide">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Historical Campus Cutoff Shifts (2022 vs 2023 vs 2024)</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#24203a]">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-[#141124] text-[#8680a0] border-b border-[#24203a] uppercase">
                  <tr>
                    <th className="p-2">Recruiter</th>
                    <th className="p-2">2022 Cutoff (Avg)</th>
                    <th className="p-2">2023 Cutoff (Avg)</th>
                    <th className="p-2">2024 Cutoff (Avg)</th>
                    <th className="p-2">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1b30] bg-[#0d0b1a]">
                  {TIET_COMPANIES.slice(0, 6).map((c) => (
                    <tr key={c.id}>
                      <td className="p-2 font-bold text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-purple-900/60 text-[9px] flex items-center justify-center text-purple-300">
                          {c.logo}
                        </span>
                        <span>{c.name}</span>
                      </td>
                      <td className="p-2 text-[#aea7cc]">{c.historicalCutoffs[0].actualShortlistCgpa.toFixed(2)}</td>
                      <td className="p-2 text-[#aea7cc]">{c.historicalCutoffs[1].actualShortlistCgpa.toFixed(2)}</td>
                      <td className="p-2 text-emerald-400 font-bold">{c.historicalCutoffs[2].actualShortlistCgpa.toFixed(2)}</td>
                      <td className="p-2">
                        <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1 py-0.5 rounded border border-amber-800/40">
                          +{((c.historicalCutoffs[2].actualShortlistCgpa - c.historicalCutoffs[0].actualShortlistCgpa)).toFixed(2)} Inflation
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CILP Portal Rules & Gotchas */}
          <div className="p-3 bg-[#141124] border border-[#24203a] rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>CILP Golden Rules (Never Break These at Thapar):</span>
            </div>
            <ul className="space-y-1.5 text-[11px] list-disc list-inside text-[#aea7cc]">
              <li>
                <strong className="text-white">Active Backlog Zero Tolerance:</strong> Even if your CGPA is 9.8, having 1 uncleared subject from 3rd or 4th semester bars you from Tier-1 JAF registrations.
              </li>
              <li>
                <strong className="text-white">Dream vs Super-Dream Policy:</strong> Receiving an offer in Super-Dream category (&gt;20 LPA) de-registers you from all subsequent on-campus drives to preserve offers for peers.
              </li>
              <li>
                <strong className="text-white">Attendance in PPT:</strong> Failing to mark attendance in mandatory pre-placement talks can trigger an automatic 1-month CILP suspension.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#24203a] bg-[#161327] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold transition-colors shadow-glow-purple"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

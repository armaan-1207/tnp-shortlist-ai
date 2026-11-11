import { Company, TIET_COMPANIES } from '../data/companies';

export interface StudentProfile {
  name: string;
  rollNo: string;
  branch: string;
  cgpa: number;
  leetcodeSolved: number;
  codeforcesRating: number;
  githubRepos: number;
  priorInternships: number;
  hackathonsWon: number;
  activeBacklogs: number;
  oaMockScore: number; // 0 - 100%
  proctorIntegrity: number; // 0 - 100%
}

export interface ShapFactor {
  name: string;
  category: 'cgpa' | 'branch' | 'dsa' | 'cp' | 'projects' | 'internships' | 'backlogs' | 'oa';
  featureValue: string;
  impact: number; // positive or negative percentage points e.g. +18.4 or -22.1
  description: string;
  isPositive: boolean;
}

export interface PredictionResult {
  company: Company;
  probability: number; // 0 - 100
  baseRate: number;
  status: 'GUARANTEED_OA' | 'COMPETITIVE_OA' | 'STRETCH' | 'DISQUALIFIED';
  statusLabel: string;
  isEligible: boolean;
  hardGateReason?: string;
  shapFactors: ShapFactor[];
  topRecommendation: string;
  improvementTip: {
    action: string;
    gain: number;
  };
}

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Armaan Singh',
  rollNo: '102203841',
  branch: 'COE',
  cgpa: 8.42,
  leetcodeSolved: 340,
  codeforcesRating: 1480,
  githubRepos: 8,
  priorInternships: 1,
  hackathonsWon: 1,
  activeBacklogs: 0,
  oaMockScore: 84,
  proctorIntegrity: 98.4,
};

export const PRESET_PROFILES: { label: string; description: string; profile: StudentProfile }[] = [
  {
    label: 'COE Balanced SDE',
    description: 'Typical solid 3rd/4th year COE student with 8.4 CGPA, 340 LeetCode, 1 internship',
    profile: {
      name: 'Armaan Singh',
      rollNo: '102203841',
      branch: 'COE',
      cgpa: 8.42,
      leetcodeSolved: 340,
      codeforcesRating: 1480,
      githubRepos: 8,
      priorInternships: 1,
      hackathonsWon: 1,
      activeBacklogs: 0,
      oaMockScore: 84,
      proctorIntegrity: 98.4,
    },
  },
  {
    label: 'CP / Algorithmic Wizard',
    description: 'Codeforces Candidate Master (1850+), 600+ LeetCode, 8.9 CGPA, target DE Shaw & Google',
    profile: {
      name: 'Rohan Sharma',
      rollNo: '102203112',
      branch: 'COPC',
      cgpa: 8.95,
      leetcodeSolved: 620,
      codeforcesRating: 1860,
      githubRepos: 12,
      priorInternships: 2,
      hackathonsWon: 3,
      activeBacklogs: 0,
      oaMockScore: 96,
      proctorIntegrity: 99.8,
    },
  },
  {
    label: 'High CGPA Scholar (9.4+)',
    description: 'Academic topper, 9.42 CGPA, moderate DSA (210 LC), targeting high-cutoff firms',
    profile: {
      name: 'Simran Kaur',
      rollNo: '102203405',
      branch: 'ENC',
      cgpa: 9.42,
      leetcodeSolved: 210,
      codeforcesRating: 1250,
      githubRepos: 4,
      priorInternships: 0,
      hackathonsWon: 0,
      activeBacklogs: 0,
      oaMockScore: 78,
      proctorIntegrity: 99.1,
    },
  },
  {
    label: 'MECH / Non-Circuit Pivot',
    description: 'Mechanical student transitioning into Software: 7.9 CGPA, 380 LeetCode, building fullstack',
    profile: {
      name: 'Gurjot Gill',
      rollNo: '102208194',
      branch: 'MECH',
      cgpa: 7.90,
      leetcodeSolved: 380,
      codeforcesRating: 1420,
      githubRepos: 11,
      priorInternships: 1,
      hackathonsWon: 2,
      activeBacklogs: 0,
      oaMockScore: 82,
      proctorIntegrity: 97.5,
    },
  },
  {
    label: 'Borderline Cutoff Alert',
    description: 'Student with 7.48 CGPA (just under 7.5 threshold) needing strategic what-if recovery',
    profile: {
      name: 'Aditya Gupta',
      rollNo: '102203774',
      branch: 'ECE',
      cgpa: 7.48,
      leetcodeSolved: 290,
      codeforcesRating: 1320,
      githubRepos: 5,
      priorInternships: 0,
      hackathonsWon: 1,
      activeBacklogs: 0,
      oaMockScore: 72,
      proctorIntegrity: 96.0,
    },
  },
];

export function evaluateShortlist(student: StudentProfile, company: Company): PredictionResult {
  const shapFactors: ShapFactor[] = [];
  const baseRate = company.baseShortlistRate;

  // 1. HARD GATE CHECKS
  // Check branch eligibility
  const isBranchAllowed = company.allowedBranches.includes(student.branch);
  if (!isBranchAllowed) {
    shapFactors.push({
      name: 'Branch Disqualification',
      category: 'branch',
      featureValue: `${student.branch} (Not in [${company.allowedBranches.join(', ')}])`,
      impact: -100,
      description: `CILP Job Announcement Form (JAF) strictly restricts hiring to circuit/allowed branches for ${company.name}.`,
      isPositive: false,
    });

    return {
      company,
      probability: 0,
      baseRate,
      status: 'DISQUALIFIED',
      statusLabel: 'Ineligible Branch',
      isEligible: false,
      hardGateReason: `Branch ${student.branch} is not eligible per CILP criteria.`,
      shapFactors,
      topRecommendation: `Look for recruiters like Optum, Zomato, or Cisco that permit ${student.branch} candidates.`,
      improvementTip: {
        action: 'Explore off-campus referrals or open-branch CILP listings',
        gain: 0,
      },
    };
  }

  // Check backlogs
  if (student.activeBacklogs > 0) {
    shapFactors.push({
      name: 'Active Backlog Flag',
      category: 'backlogs',
      featureValue: `${student.activeBacklogs} Backlog(s)`,
      impact: -95,
      description: `CILP strictly prohibits students with active backlogs from sitting for ${company.name} OA rounds.`,
      isPositive: false,
    });

    return {
      company,
      probability: 2,
      baseRate,
      status: 'DISQUALIFIED',
      statusLabel: 'Active Backlog',
      isEligible: false,
      hardGateReason: `${student.activeBacklogs} active backlog(s) disqualify candidate from CILP drive.`,
      shapFactors,
      topRecommendation: 'Clear outstanding auxiliary/re-appear exams before semester drive commencement.',
      improvementTip: {
        action: 'Clear backlog in auxiliary exams',
        gain: 60,
      },
    };
  }

  // Check hard CGPA cutoff gate
  if (student.cgpa < company.minCgpa - 0.25) {
    const deficit = (company.minCgpa - student.cgpa).toFixed(2);
    shapFactors.push({
      name: 'Severe CGPA Shortfall',
      category: 'cgpa',
      featureValue: `${student.cgpa.toFixed(2)} (Req: ${company.minCgpa.toFixed(2)})`,
      impact: -65,
      description: `CGPA is ${deficit} points below company registration baseline. Filtered before OA shortlist.`,
      isPositive: false,
    });

    return {
      company,
      probability: 4,
      baseRate,
      status: 'DISQUALIFIED',
      statusLabel: 'Below Cutoff',
      isEligible: false,
      hardGateReason: `CGPA ${student.cgpa.toFixed(2)} is beneath mandatory ${company.minCgpa.toFixed(2)} cutoff.`,
      shapFactors,
      topRecommendation: `Raise CGPA by at least ${deficit} to cross the ${company.minCgpa} gate for this drive.`,
      improvementTip: {
        action: `Push CGPA past ${company.minCgpa.toFixed(2)}`,
        gain: 55,
      },
    };
  }

  // 2. FEATURE ATTRIBUTION (SHAP SCORING)
  let cumulativeProbability = baseRate;

  // A. CGPA Attribution
  const cgpaDiff = student.cgpa - company.minCgpa;
  let cgpaImpact = 0;
  let cgpaDesc = '';

  if (cgpaDiff >= 0.8) {
    cgpaImpact = +24.5;
    cgpaDesc = `Exceptional CGPA (+${cgpaDiff.toFixed(2)} above ${company.minCgpa} cutoff). Places candidate in top 10% academic tier.`;
  } else if (cgpaDiff >= 0.4) {
    cgpaImpact = +16.0;
    cgpaDesc = `Safe CGPA buffer (+${cgpaDiff.toFixed(2)} above cutoff). Low risk of pre-OA screening drop.`;
  } else if (cgpaDiff >= 0.0) {
    cgpaImpact = +6.5;
    cgpaDesc = `Meets minimum cutoff (${student.cgpa.toFixed(2)} >= ${company.minCgpa.toFixed(2)}), but tight buffer in tie-breakers.`;
  } else {
    // Under cutoff by 0.01 - 0.25 (might slide in if high-volume shortlisting, but heavily penalized)
    cgpaImpact = -28.0;
    cgpaDesc = `CGPA (${student.cgpa.toFixed(2)}) is marginally below ${company.minCgpa.toFixed(2)}. High probability of CILP portal rejection.`;
  }
  cumulativeProbability += cgpaImpact;
  shapFactors.push({
    name: 'CGPA Standing',
    category: 'cgpa',
    featureValue: `${student.cgpa.toFixed(2)} (Cutoff: ${company.minCgpa})`,
    impact: Math.round(cgpaImpact * 10) / 10,
    description: cgpaDesc,
    isPositive: cgpaImpact >= 0,
  });

  // B. Branch Priority Attribution
  let branchImpact = 0;
  let branchDesc = '';
  if (company.preferredBranches.includes(student.branch)) {
    branchImpact = +12.0;
    branchDesc = `${student.branch} is a priority target branch for ${company.name} recruitment team.`;
  } else if (['COE', 'COPC'].includes(student.branch)) {
    branchImpact = +8.0;
    branchDesc = `Strong circuit branch advantage (${student.branch}) with full syllabus alignment.`;
  } else if (['ENC', 'ECE'].includes(student.branch)) {
    branchImpact = +2.0;
    branchDesc = `Allowed electrical/circuit branch. Neutral to slight preference in shortlist allocations.`;
  } else {
    branchImpact = -11.0;
    branchDesc = `Non-CS branch (${student.branch}). Recruiter ATS typically demands higher OA benchmark scores to shortlist.`;
  }
  cumulativeProbability += branchImpact;
  shapFactors.push({
    name: 'Branch Syllabus Weight',
    category: 'branch',
    featureValue: student.branch,
    impact: Math.round(branchImpact * 10) / 10,
    description: branchDesc,
    isPositive: branchImpact >= 0,
  });

  // C. LeetCode / DSA Problem Solving
  const lcTarget = company.targetLeetCode;
  const lcRatio = student.leetcodeSolved / lcTarget;
  let lcImpact = 0;
  let lcDesc = '';

  if (lcRatio >= 1.3) {
    lcImpact = +21.0;
    lcDesc = `Outstanding problem count (${student.leetcodeSolved} vs ${lcTarget} benchmark). High OA clearing confidence.`;
  } else if (lcRatio >= 0.95) {
    lcImpact = +14.5;
    lcDesc = `Solid DSA foundation (${student.leetcodeSolved} solved). Sufficient for standard ${company.oaPlatform} rounds.`;
  } else if (lcRatio >= 0.65) {
    lcImpact = +4.0;
    lcDesc = `Moderate DSA volume (${student.leetcodeSolved} solved). Might struggle on harder DP/graph variations.`;
  } else {
    lcImpact = -16.0;
    lcDesc = `DSA problem count (${student.leetcodeSolved}) falls short of recommended ${lcTarget} questions.`;
  }
  cumulativeProbability += lcImpact;
  shapFactors.push({
    name: 'LeetCode Volume & Depth',
    category: 'dsa',
    featureValue: `${student.leetcodeSolved} solved (Target: ${lcTarget})`,
    impact: Math.round(lcImpact * 10) / 10,
    description: lcDesc,
    isPositive: lcImpact >= 0,
  });

  // D. Codeforces / Competitive Programming
  const cfTarget = company.targetCodeforces;
  let cfImpact = 0;
  let cfDesc = '';
  if (student.codeforcesRating >= cfTarget + 100) {
    cfImpact = company.roleType === 'Quant / Algo' ? +26.0 : +16.0;
    cfDesc = `Elite CP rating (${student.codeforcesRating} vs ${cfTarget}). Major differentiator for algorithmic screening.`;
  } else if (student.codeforcesRating >= cfTarget) {
    cfImpact = company.roleType === 'Quant / Algo' ? +18.0 : +10.0;
    cfDesc = `Comfortably meets competitive benchmark (${student.codeforcesRating}).`;
  } else if (student.codeforcesRating >= cfTarget - 200) {
    cfImpact = +2.5;
    cfDesc = `Intermediate CP rating (${student.codeforcesRating}). Adequate for moderate problem constraints.`;
  } else {
    cfImpact = company.roleType === 'Quant / Algo' ? -18.0 : -4.0;
    cfDesc = `Codeforces rating (${student.codeforcesRating}) is below ${company.name}'s ${cfTarget} target.`;
  }
  cumulativeProbability += cfImpact;
  shapFactors.push({
    name: 'Codeforces Contest Agility',
    category: 'cp',
    featureValue: `${student.codeforcesRating} (Target: ${cfTarget})`,
    impact: Math.round(cfImpact * 10) / 10,
    description: cfDesc,
    isPositive: cfImpact >= 0,
  });

  // E. Prior Internships & Industry Proof
  let internImpact = 0;
  let internDesc = '';
  if (student.priorInternships >= 2) {
    internImpact = Math.round(company.internshipBonusWeight * 36);
    internDesc = `Two or more verified internships. Proves production coding capacity and reduces onboarding risk.`;
  } else if (student.priorInternships === 1) {
    internImpact = Math.round(company.internshipBonusWeight * 22);
    internDesc = `1 verified prior internship. Solid resume signal for ${company.name} screening panels.`;
  } else {
    internImpact = -6.0;
    internDesc = `No prior formal software internship experience. Places extra pressure on OA score and GitHub repos.`;
  }
  cumulativeProbability += internImpact;
  shapFactors.push({
    name: 'Prior Industry Experience',
    category: 'internships',
    featureValue: `${student.priorInternships} Internship${student.priorInternships === 1 ? '' : 's'}`,
    impact: Math.round(internImpact * 10) / 10,
    description: internDesc,
    isPositive: internImpact >= 0,
  });

  // F. GitHub Repositories & Hackathons
  let projectImpact = 0;
  if (company.projectImportance === 'High') {
    if (student.githubRepos >= 8 && student.hackathonsWon >= 1) {
      projectImpact = +14.0;
    } else if (student.githubRepos >= 5) {
      projectImpact = +8.0;
    } else {
      projectImpact = -5.0;
    }
  } else {
    if (student.hackathonsWon >= 1) projectImpact += 4.0;
    if (student.githubRepos >= 6) projectImpact += 3.0;
  }
  cumulativeProbability += projectImpact;
  shapFactors.push({
    name: 'Projects & Hackathons',
    category: 'projects',
    featureValue: `${student.githubRepos} Repos, ${student.hackathonsWon} Hackathon Win${student.hackathonsWon === 1 ? '' : 's'}`,
    impact: Math.round(projectImpact * 10) / 10,
    description: `Demonstrated ability to architect, build, and ship complete applications beyond classroom assignments.`,
    isPositive: projectImpact >= 0,
  });

  // G. Mock OA & Proctor Score
  let oaImpact = 0;
  if (student.oaMockScore >= 90) {
    oaImpact = +12.0;
  } else if (student.oaMockScore >= 75) {
    oaImpact = +6.0;
  } else if (student.oaMockScore < 60) {
    oaImpact = -12.0;
  }
  cumulativeProbability += oaImpact;
  shapFactors.push({
    name: 'Mock OA Diagnostic',
    category: 'oa',
    featureValue: `${student.oaMockScore}% Score`,
    impact: Math.round(oaImpact * 10) / 10,
    description: `Simulated timed performance on ${company.oaPlatform} environment.`,
    isPositive: oaImpact >= 0,
  });

  // Clamp probability between 3% and 96%
  const finalProbability = Math.min(96, Math.max(3, Math.round(cumulativeProbability)));

  // Status mapping
  let status: 'GUARANTEED_OA' | 'COMPETITIVE_OA' | 'STRETCH' | 'DISQUALIFIED' = 'STRETCH';
  let statusLabel = 'Reach / Stretch';

  if (finalProbability >= 72) {
    status = 'GUARANTEED_OA';
    statusLabel = 'Strong Call (≥72%)';
  } else if (finalProbability >= 42) {
    status = 'COMPETITIVE_OA';
    statusLabel = 'Competitive (42-71%)';
  } else if (finalProbability >= 18) {
    status = 'STRETCH';
    statusLabel = 'Moderate Stretch';
  } else {
    status = 'DISQUALIFIED';
    statusLabel = 'Low Shortlist Chance';
  }

  // Generate Top Actionable Recommendation
  let topRecommendation = '';
  let improvementTip = { action: '', gain: 0 };

  if (student.cgpa < company.minCgpa + 0.3) {
    const targetCgpa = (company.minCgpa + 0.4).toFixed(2);
    topRecommendation = `Push CGPA to ${targetCgpa} to escape the razor-thin tiebreaker zone.`;
    improvementTip = {
      action: `Boost CGPA to ${targetCgpa}`,
      gain: 15,
    };
  } else if (student.leetcodeSolved < company.targetLeetCode) {
    const deficit = company.targetLeetCode - student.leetcodeSolved;
    topRecommendation = `Solve ~${deficit} more medium/hard questions to match ${company.name}'s algorithmic standard.`;
    improvementTip = {
      action: `Solve +${deficit} LeetCode problems`,
      gain: 14,
    };
  } else if (student.codeforcesRating < company.targetCodeforces && company.roleType === 'Quant / Algo') {
    const deficit = company.targetCodeforces - student.codeforcesRating;
    topRecommendation = `Improve Codeforces rating by +${deficit} points to beat the elite shortlist filter.`;
    improvementTip = {
      action: `Gain +${deficit} Codeforces rating points`,
      gain: 18,
    };
  } else if (student.priorInternships === 0) {
    topRecommendation = `Securing a recognized 2-month summer internship or open-source fellowship adds major leverage.`;
    improvementTip = {
      action: 'Add 1 production internship',
      gain: 12,
    };
  } else {
    topRecommendation = `Maintain current cadence and practice timed mock OAs under simulated tab-proctoring.`;
    improvementTip = {
      action: 'Acheive 90%+ in Mock OA',
      gain: 6,
    };
  }

  return {
    company,
    probability: finalProbability,
    baseRate,
    status,
    statusLabel,
    isEligible: true,
    shapFactors,
    topRecommendation,
    improvementTip,
  };
}

export function evaluateAllCompanies(student: StudentProfile): PredictionResult[] {
  return TIET_COMPANIES.map(company => evaluateShortlist(student, company));
}

export function computeOptimalTarget(student: StudentProfile, company: Company): {
  requiredCgpa: number;
  requiredLeetCode: number;
  requiredCodeforces: number;
  estimatedProb: number;
} {
  // Finds parameter targets that push student into >= 80% probability
  const optimalCgpa = Math.max(student.cgpa, Number((company.minCgpa + 0.5).toFixed(2)));
  const optimalLc = Math.max(student.leetcodeSolved, company.targetLeetCode + 50);
  const optimalCf = Math.max(student.codeforcesRating, company.targetCodeforces);

  const testProfile: StudentProfile = {
    ...student,
    cgpa: optimalCgpa,
    leetcodeSolved: optimalLc,
    codeforcesRating: optimalCf,
  };

  const res = evaluateShortlist(testProfile, company);
  return {
    requiredCgpa: optimalCgpa,
    requiredLeetCode: optimalLc,
    requiredCodeforces: optimalCf,
    estimatedProb: res.probability,
  };
}

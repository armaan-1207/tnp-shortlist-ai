# TnP Shortlist AI — TIET Placement Predictor & SHAP Explainer
> **"Stop Guessing. Know Which Companies Will Call You."**  
> *Built for Thapar Institute of Engineering & Technology (TIET Patiala) CILP Placement Cell.*

---

## 🎯 The Problem
At TIET, the **#1 student complaint** every placement season (CILP) is **shortlist opacity**. When 2,400+ students apply on the CILP portal for companies like Google, Microsoft, and D. E. Shaw, only 80–200 receive online assessment (OA) links. 

Students are left frustrated with mysterious outcomes: *"Why was an 8.1 CGPA candidate shortlisted while a 9.2 was rejected?"*

**TnP Shortlist AI** demystifies CILP hiring by replacing guesswork with **transparent, mathematically explainable SHAP (Shapley Additive exPlanations) attribution** and real-time What-If scenario simulations — running **100% locally in the browser with ZERO external API keys**.

---

## 🚀 Key Features

### 1. Student Profile Configurator
- Precision inputs for:
  - **CGPA** (6.00 – 10.00 with 0.01 precision)
  - **Branch** (COE, COPC, ENC, ECE, MECH, CIE, CHE, BIOTECH)
  - **LeetCode Solved Count** (0 – 1000+)
  - **Codeforces Contest Rating** (800 – 2300+)
  - **GitHub Repositories & Hackathons Won**
  - **Prior Internships & Active Backlogs**
- 5 Pre-calibrated Archetypes: *COE Balanced SDE, CP Algorithmic Wizard, Academic Scholar (9.4+), MECH Pivot, Borderline Cutoff Alert*.

### 2. Company Shortlist Probability Table (Stock Screener / Bloomberg Density)
- Real-time evaluations for marquee recruiters:
  - **D. E. Shaw & Co.** (₹55 LPA, Quant/Algo)
  - **Microsoft** (₹51.2 LPA, SDE)
  - **Google** (₹45 LPA, SWE)
  - **Arcesium** (₹36 LPA, Low-Latency Fintech)
  - **Oracle Server Tech** (₹34 LPA, Systems)
  - **Zomato** (₹32 LPA, Fullstack / Product)
  - **Morgan Stanley** (₹28.5 LPA, Fintech Analyst)
  - **Cisco Systems** (₹24.5 LPA, Cloud/Networks)
  - **Bain & Co.** (₹21 LPA, Analytics / Consulting)
  - **Optum (UHG)** (₹18 LPA, HealthTech SDE)
- Metric breakdowns: CTC, Stipend, Required CGPA, Allowed Branches, Shortlist Probability %, Status Gate (`Strong Call`, `Competitive`, `Stretch`, `Disqualified`).
- Multi-criteria filtering by Eligibility, Probability Tier, CTC range, and full-text search.

### 3. Interactive SHAP Waterfall Explanation
- Visual horizontal waterfall bar chart decomposing the marginal probability:
  $$\text{Probability} = P_{\text{baseline}} + \sum \Delta \phi_{\text{feature}}$$
- Displays green bars for positive lifts (e.g. `+24.5% CGPA Buffer`, `+14.5% LeetCode Volume`) and red bars for penalties (e.g. `-16% Non-CS Branch ATS penalty`).
- Contextual diagnostic cards:
  - **Recruiter Focal Points** (TIET specific)
  - **Highest-ROI Strategic Move** (specific advice to escape tiebreaker zones)

### 4. Interactive "What-If" Simulator
- Real-time slider workbench:
  - *"What if my CGPA goes from 8.42 to 8.85 next semester?"*
  - *"What if I solve +160 more LeetCode questions?"*
  - *"What if my Codeforces rating hits 1650?"*
- Real-time delta display: e.g. `54% → 84% (+30% Shortlist Boost)`.
- **Automated Target Solver**: 1-click solver that calculates the exact minimal effort frontier needed to cross $\ge 80\%$ probability for any chosen firm.

### 5. Mock OA Proctoring & Verified TIET Skill Badge
- **Supervised Assessment Sandbox**:
  - Live proctoring HUD monitoring tab-switch events via browser `visibilitychange` API.
  - Keystroke cadence check & webcam AI framing mockup.
  - Interactive coding environment with test case runner against typical HackerRank / Mercer Mettl testbeds.
- **Verified TIET Skill Card**:
  - Holographic Bloomberg terminal identity card.
  - Cryptographic **SHA-256 verification hash** (`BLOCK-TIET-2025`).
  - QR Code mockup & 1-click clipboard verification signature.

### 6. CILP Placement Intelligence Dossier
- Historical cutoff evolution tracking actual 2022, 2023, and 2024 shortlisting thresholds.
- Deconstructs why high CGPA students fail OAs (time penalties, AST plagiarism filters, branch quotas).

---

## 🛠️ Tech Stack & Architecture
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS with custom terminal theme (`#090812` dark navy, deep purple `#8b5cf6`, Geist font)
- **Visuals & Motion**: Lucide React + Framer Motion
- **Hosting**: Zero external server dependencies, instant client-side deployment on Vercel.

---

## ⚡ Local Setup & Execution

```powershell
# Navigate to project folder
cd 03-tnp-shortlist-ai

# Install dependencies
npm install

# Start development server
npm run dev

# Run production build
npm run build
```

---

## 📜 License
MIT License • Built for Thapar Institute of Engineering & Technology, Patiala.

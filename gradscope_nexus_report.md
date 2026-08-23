# Nexus Documentation Truth Report

## Report Metadata
- **Repository Name**: LifeCost Project (Nexus)
- **Repository URL**: /Users/vedantburgul/Desktop/LifeCost Project
- **Commit SHA**: 1a3471e2d0915a73106ec58429e34f718a9c646d
- **Analysis Run ID**: `333d47b4-19c7-42c5-9884-498b639240d5`
- **Analysis Timestamp**: 2026-08-23 06:31:34.539057
- **Total Files Scanned**: 64
- **Documentation Files Scanned**: 3
- **Analysis Status**: COMPLETED

## Verification Summary
- **Nexus Truth Score**: **75 / 100**
- **Total Claims Extracted**: 73
- **Verified Claims**: 36
- **Uncertain Claims**: 37
- **Contradicted Claims**: 0

---

## Verdict Details

### Contradicted Findings

*No contradictions were detected in this analysis.*

### Uncertain Findings
#### 1. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `README.md:3`
- **Original Text**: *"An interactive study-planning financial calculator helping international students compare Master's program tuition, scholarships, and city-level living costs in Australia."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:3`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `An interactive study-planning financial calculator helping international students compare Master's program tuition, scholarships, and city-level living costs in Australia.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:32`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **4-Step Configure Your Study Plan Wizard:** Interactive stepper guiding users to select a Course, City, University, and enter/configure an Expected Scholarship percentage. * **Dynamic Viewport Stepper Transitions:** Planner page automatically center-scrolls to the next active step upon selection to guide the user seamlessly through the flow.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:35`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **"Where Your Total Comes From" Cost Breakdown Card:** A clear comparative dashboard showing the cumulative program cost *Without Scholarship* vs. *With Scholarship*, highlighting net payable tuition and program-length savings. * **Interactive Financial Visualization Charts:**   * **Tuition vs. Living Expenses Split (Pie/Donut Chart):** Visualizes how much of the budget is allocated to study vs. living.`

#### 2. Mathematical model behavior
- **Category**: BEHAVIOR
- **Documentation Path**: `README.md:17`
- **Original Text**: *"When researching international study opportunities, students are typically presented with tuition fees in isolation. This creates significant financial blind spots:"*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:17`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `When researching international study opportunities, students are typically presented with tuition fees in isolation. This creates significant financial blind spots: * **Hidden Local Costs:** Living expenses vary greatly between capital cities (e.g., Sydney vs. Hobart).`

#### 3. Mathematical model behavior
- **Category**: BEHAVIOR
- **Documentation Path**: `README.md:19`
- **Original Text**: *"* **Varying Durations:** Different Master's programs take between 1 to 2+ years, scaling both living expenses and overall tuition requirements differently."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:19`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Hidden Local Costs:** Living expenses vary greatly between capital cities (e.g., Sydney vs. Hobart). * **Varying Durations:** Different Master's programs take between 1 to 2+ years, scaling both living expenses and overall tuition requirements differently. * **Scholarship Complexity:** Calculating the net tuition after a scholarship discount and combining it with local cost indices over the exact duration is complex and prone to errors.`

#### 4. Mathematical model behavior
- **Category**: BEHAVIOR
- **Documentation Path**: `README.md:20`
- **Original Text**: *"* **Scholarship Complexity:** Calculating the net tuition after a scholarship discount and combining it with local cost indices over the exact duration is complex and prone to errors."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:3`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `An interactive study-planning financial calculator helping international students compare Master's program tuition, scholarships, and city-level living costs in Australia.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:11`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `GradScope is a full-stack decision-support platform designed to help prospective international students plan their Master's education in Australia. By combining tuition fees, scholarship packages, program durations, and localized consumer indexes (rent, groceries, transit, utilities), the platform provides students with a single, clear estimated program-length baseline. This allows users to compare options across different cities and universities using a consistent cost baseline.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:20`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Varying Durations:** Different Master's programs take between 1 to 2+ years, scaling both living expenses and overall tuition requirements differently. * **Scholarship Complexity:** Calculating the net tuition after a scholarship discount and combining it with local cost indices over the exact duration is complex and prone to errors.`

#### 5. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `README.md:32`
- **Original Text**: *"* **4-Step Configure Your Study Plan Wizard:** Interactive stepper guiding users to select a Course, City, University, and enter/configure an Expected Scholarship percentage."*
- **Verdict Confidence**: 0.90
- **Explanation**: No evidence was found in the repository to verify this claim. The category 'FEATURE' has no matching code, tests, or configurations.

#### 6. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `README.md:33`
- **Original Text**: *"* **Dynamic Viewport Stepper Transitions:** Planner page automatically center-scrolls to the next active step upon selection to guide the user seamlessly through the flow."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:33`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **4-Step Configure Your Study Plan Wizard:** Interactive stepper guiding users to select a Course, City, University, and enter/configure an Expected Scholarship percentage. * **Dynamic Viewport Stepper Transitions:** Planner page automatically center-scrolls to the next active step upon selection to guide the user seamlessly through the flow. * **"Where Your Total Comes From" Cost Breakdown Card:** A clear comparative dashboard showing the cumulative program cost *Without Scholarship* vs. *With Scholarship*, highlighting net payable tuition and program-length savings.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:39`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Monthly Expenses Breakdown (Horizontal Bar Chart):** Breaks down the monthly living baseline into Housing, Food, Transit, and Utilities. * **Detailed Expandable Accordions:** Displays itemized grocery and utility costs dynamically mapped to the target city. * **Institutional Comparison Table:** Compares the selected course against other universities across Australia offering the same program, showing comparative tuition, living, and total costs side-by-side.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:106`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `│       ├── routes/          # API endpoint controllers (calculator, cities, universities) │       ├── database.py      # SQLAlchemy connection, dynamic SSL & scheme parsing │       ├── main.py          # FastAPI application initialization & CORS config`

#### 7. Mathematical model behavior
- **Category**: BEHAVIOR
- **Documentation Path**: `README.md:34`
- **Original Text**: *"* **"Where Your Total Comes From" Cost Breakdown Card:** A clear comparative dashboard showing the cumulative program cost *Without Scholarship* vs. *With Scholarship*, highlighting net payable tuition and program-length savings."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:34`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Dynamic Viewport Stepper Transitions:** Planner page automatically center-scrolls to the next active step upon selection to guide the user seamlessly through the flow. * **"Where Your Total Comes From" Cost Breakdown Card:** A clear comparative dashboard showing the cumulative program cost *Without Scholarship* vs. *With Scholarship*, highlighting net payable tuition and program-length savings. * **Interactive Financial Visualization Charts:**`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:47`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `1. **Step 1: Select Course:** Choose from postgraduate programs (e.g., Master of Data Science). 2. **Step 2: Select City:** Select from capital cities where the program is offered (e.g., Melbourne, Sydney, Adelaide). 3. **Step 3: Choose University:** Pick the specific university (e.g., RMIT, Monash University).`
  - **[CONTEXTUAL]** `[SOURCE_CODE]` `backend/app/routes/universities.py:33`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `)         .where(CourseCost.city == city)         .order_by(`

#### 8. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `README.md:35`
- **Original Text**: *"* **Interactive Financial Visualization Charts:**"*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:3`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `An interactive study-planning financial calculator helping international students compare Master's program tuition, scholarships, and city-level living costs in Australia.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:32`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **4-Step Configure Your Study Plan Wizard:** Interactive stepper guiding users to select a Course, City, University, and enter/configure an Expected Scholarship percentage. * **Dynamic Viewport Stepper Transitions:** Planner page automatically center-scrolls to the next active step upon selection to guide the user seamlessly through the flow.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:35`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **"Where Your Total Comes From" Cost Breakdown Card:** A clear comparative dashboard showing the cumulative program cost *Without Scholarship* vs. *With Scholarship*, highlighting net payable tuition and program-length savings. * **Interactive Financial Visualization Charts:**   * **Tuition vs. Living Expenses Split (Pie/Donut Chart):** Visualizes how much of the budget is allocated to study vs. living.`

#### 9. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `README.md:36`
- **Original Text**: *"* **Tuition vs. Living Expenses Split (Pie/Donut Chart):** Visualizes how much of the budget is allocated to study vs. living."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:3`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `An interactive study-planning financial calculator helping international students compare Master's program tuition, scholarships, and city-level living costs in Australia.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:11`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `GradScope is a full-stack decision-support platform designed to help prospective international students plan their Master's education in Australia. By combining tuition fees, scholarship packages, program durations, and localized consumer indexes (rent, groceries, transit, utilities), the platform provides students with a single, clear estimated program-length baseline. This allows users to compare options across different cities and universities using a consistent cost baseline.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:17`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `When researching international study opportunities, students are typically presented with tuition fees in isolation. This creates significant financial blind spots: * **Hidden Local Costs:** Living expenses vary greatly between capital cities (e.g., Sydney vs. Hobart).`

#### 10. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `README.md:37`
- **Original Text**: *"* **Annual Cost Ratio (Bar Chart):** Compares the tuition fee to living costs on an annual basis."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:37`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Tuition vs. Living Expenses Split (Pie/Donut Chart):** Visualizes how much of the budget is allocated to study vs. living.   * **Annual Cost Ratio (Bar Chart):** Compares the tuition fee to living costs on an annual basis.   * **Monthly Expenses Breakdown (Horizontal Bar Chart):** Breaks down the monthly living baseline into Housing, Food, Transit, and Utilities.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:58`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `$$\text{Total Tuition (Before Scholarship)} = \text{Annual Tuition Fee} \times \text{Program Duration (Years)}$$`
  - **[CONTEXTUAL]** `[SOURCE_CODE]` `frontend/src/types/index.ts:7`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `durationYears: number | null;   annualTuitionFeeAud: number | null; // Null if unavailable   feeYear: number;`

#### 11. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `README.md:39`
- **Original Text**: *"* **Detailed Expandable Accordions:** Displays itemized grocery and utility costs dynamically mapped to the target city."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:39`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Monthly Expenses Breakdown (Horizontal Bar Chart):** Breaks down the monthly living baseline into Housing, Food, Transit, and Utilities. * **Detailed Expandable Accordions:** Displays itemized grocery and utility costs dynamically mapped to the target city. * **Institutional Comparison Table:** Compares the selected course against other universities across Australia offering the same program, showing comparative tuition, living, and total costs side-by-side.`
  - **[CONTEXTUAL]** `[SOURCE_CODE]` `frontend/src/services/dataService.ts:753`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `// Calculate detailed Food monthly cost   const foodItems = Object.entries(FOOD_QUANTITIES).map(([name, quantity]) => {`

#### 12. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `README.md:40`
- **Original Text**: *"* **Institutional Comparison Table:** Compares the selected course against other universities across Australia offering the same program, showing comparative tuition, living, and total costs side-by-side."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:40`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Detailed Expandable Accordions:** Displays itemized grocery and utility costs dynamically mapped to the target city. * **Institutional Comparison Table:** Compares the selected course against other universities across Australia offering the same program, showing comparative tuition, living, and total costs side-by-side.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:96`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* `GET /api/course-cost` - Calculates and returns total cost indices for a combination (`city`, `university`, `course`, `scholarship_percent`). * `GET /api/course-comparison` - Returns other institutional records matching the queried `course` name.`

#### 13. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `README.md:50`
- **Original Text**: *"5. **Estimate:** Get the comprehensive cost breakdown and comparison charts instantly."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:11`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `GradScope is a full-stack decision-support platform designed to help prospective international students plan their Master's education in Australia. By combining tuition fees, scholarship packages, program durations, and localized consumer indexes (rent, groceries, transit, utilities), the platform provides students with a single, clear estimated program-length baseline. This allows users to compare options across different cities and universities using a consistent cost baseline.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:50`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `4. **Step 4: Configure Scholarship:** Enter your expected scholarship percentage (0% to 100%) or use quick presets. 5. **Estimate:** Get the comprehensive cost breakdown and comparison charts instantly.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:66`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `$$\text{Estimated Master's Cost} = \text{Tuition After Scholarship} + \text{Living Costs}$$`

#### 14. Mathematical model behavior
- **Category**: BEHAVIOR
- **Documentation Path**: `README.md:58`
- **Original Text**: *"$$\text{Total Tuition (Before Scholarship)} = \text{Annual Tuition Fee} \times \text{Program Duration (Years)}$$"*
- **Verdict Confidence**: 0.90
- **Explanation**: No evidence was found in the repository to verify this claim. The category 'BEHAVIOR' has no matching code, tests, or configurations.

#### 15. Mathematical model behavior
- **Category**: BEHAVIOR
- **Documentation Path**: `README.md:60`
- **Original Text**: *"$$\text{Scholarship Savings} = \text{Total Tuition (Before Scholarship)} \times \left(\frac{\text{Scholarship Percentage}}{100}\right)$$"*
- **Verdict Confidence**: 0.90
- **Explanation**: No evidence was found in the repository to verify this claim. The category 'BEHAVIOR' has no matching code, tests, or configurations.

#### 16. Mathematical model behavior
- **Category**: BEHAVIOR
- **Documentation Path**: `README.md:62`
- **Original Text**: *"$$\text{Tuition After Scholarship} = \text{Total Tuition (Before Scholarship)} - \text{Scholarship Savings}$$"*
- **Verdict Confidence**: 0.90
- **Explanation**: No evidence was found in the repository to verify this claim. The category 'BEHAVIOR' has no matching code, tests, or configurations.

#### 17. Mathematical model behavior
- **Category**: BEHAVIOR
- **Documentation Path**: `README.md:64`
- **Original Text**: *"$$\text{Living Costs} = \text{Monthly Living Cost} \times 12 \times \text{Program Duration (Years)}$$"*
- **Verdict Confidence**: 0.90
- **Explanation**: No evidence was found in the repository to verify this claim. The category 'BEHAVIOR' has no matching code, tests, or configurations.

#### 18. Mathematical model behavior
- **Category**: BEHAVIOR
- **Documentation Path**: `README.md:66`
- **Original Text**: *"$$\text{Estimated Master's Cost} = \text{Tuition After Scholarship} + \text{Living Costs}$$"*
- **Verdict Confidence**: 0.90
- **Explanation**: No evidence was found in the repository to verify this claim. The category 'BEHAVIOR' has no matching code, tests, or configurations.

#### 19. Software engineering dependency
- **Category**: DEPENDENCY
- **Documentation Path**: `README.md:75`
- **Original Text**: *"* **Data Processing & Analysis:** Pandas, Python CSV library, Jupyter Notebooks."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:75`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Database:** PostgreSQL, psycopg v3. * **Data Processing & Analysis:** Pandas, Python CSV library, Jupyter Notebooks. * **Hosting:** Netlify (Frontend), Render (FastAPI Backend + PostgreSQL Database).`

#### 20. Environment prerequisite installation
- **Category**: INSTALLATION
- **Documentation Path**: `README.md:131`
- **Original Text**: *"* Node.js (v18+) & npm"*
- **Verdict Confidence**: 0.90
- **Explanation**: No evidence was found in the repository to verify this claim. The category 'INSTALLATION' has no matching code, tests, or configurations.

#### 21. Environment prerequisite installation
- **Category**: INSTALLATION
- **Documentation Path**: `README.md:132`
- **Original Text**: *"* Python (v3.10+)"*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:73`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide React. * **Backend:** FastAPI (Python), SQLAlchemy 2.0 (ORM), Pydantic, Uvicorn. * **Database:** PostgreSQL, psycopg v3.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:75`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Database:** PostgreSQL, psycopg v3. * **Data Processing & Analysis:** Pandas, Python CSV library, Jupyter Notebooks. * **Hosting:** Netlify (Frontend), Render (FastAPI Backend + PostgreSQL Database).`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:123`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `├── scripts/                 # Data generation helper scripts └── requirements.txt         # FastAPI backend Python packages ````

#### 22. Technical prose assertion
- **Category**: OTHER
- **Documentation Path**: `README.md:161`
- **Original Text**: *"5. **Start the Backend Server:**"*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:128`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `## Getting Started`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:161`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `5. **Start the Backend Server:**    ```bash`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:165`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: ````    The backend will start running on [http://127.0.0.1:8000](http://127.0.0.1:8000).`

#### 23. Technical prose assertion
- **Category**: OTHER
- **Documentation Path**: `README.md:187`
- **Original Text**: *"4. **Run the Development Server:**"*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:187`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `4. **Run the Development Server:**    ```bash`

#### 24. Hosting deployment environment
- **Category**: DEPLOYMENT
- **Documentation Path**: `README.md:202`
- **Original Text**: *"* **Frontend:** Deployed on **Netlify** at [https://gradscope.netlify.app](https://gradscope.netlify.app)."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:202`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Frontend:** Deployed on **Netlify** at [https://gradscope.netlify.app](https://gradscope.netlify.app). * **Backend:** Deployed on **Render** at [https://gradscope-api.onrender.com](https://gradscope-api.onrender.com).`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:203`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Frontend:** Deployed on **Netlify** at [https://gradscope.netlify.app](https://gradscope.netlify.app). * **Backend:** Deployed on **Render** at [https://gradscope-api.onrender.com](https://gradscope-api.onrender.com). * **Repository Source:** Hosted on GitHub at [https://github.com/burgulvedant/gradscope](https://github.com/burgulvedant/gradscope).`

#### 25. Hosting deployment environment
- **Category**: DEPLOYMENT
- **Documentation Path**: `README.md:203`
- **Original Text**: *"* **Backend:** Deployed on **Render** at [https://gradscope-api.onrender.com](https://gradscope-api.onrender.com)."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:202`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Frontend:** Deployed on **Netlify** at [https://gradscope.netlify.app](https://gradscope.netlify.app). * **Backend:** Deployed on **Render** at [https://gradscope-api.onrender.com](https://gradscope-api.onrender.com).`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:203`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Frontend:** Deployed on **Netlify** at [https://gradscope.netlify.app](https://gradscope.netlify.app). * **Backend:** Deployed on **Render** at [https://gradscope-api.onrender.com](https://gradscope-api.onrender.com). * **Repository Source:** Hosted on GitHub at [https://github.com/burgulvedant/gradscope](https://github.com/burgulvedant/gradscope).`

#### 26. Hosting deployment environment
- **Category**: DEPLOYMENT
- **Documentation Path**: `README.md:205`
- **Original Text**: *"* **CI/CD Integration:** Builds and deploys automatically upon pushing new commits to the GitHub `main` branch."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:205`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Repository Source:** Hosted on GitHub at [https://github.com/burgulvedant/gradscope](https://github.com/burgulvedant/gradscope). * **CI/CD Integration:** Builds and deploys automatically upon pushing new commits to the GitHub `main` branch.`

#### 27. Application capability limit
- **Category**: LIMIT
- **Documentation Path**: `README.md:211`
- **Original Text**: *"* **2026 Data Horizon:** All tuition fee figures and Numbeo consumer pricing baselines correspond directly to the year 2026, without dynamic forecasting."*
- **Verdict Confidence**: 0.85
- **Explanation**: Found reference to year/baseline tokens in code datasets, but static analysis cannot verify if every tuition figure is dynamically correct or limited to 2026.
- **Retrieved Contextual Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `README.md:26`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `GradScope solves this by providing a unified, transparent decision-support calculator. Instead of manually cross-referencing university brochures, Numbeo indexes, and currency exchange tables, students can select their desired course, city, and institution, apply their expected scholarship percentage, and immediately receive a personalized cost breakdown based on the project's 2026 dataset.`
  - **[SUPPORTS]** `[SOURCE_CODE]` `README.md:83`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `The application runs on a dataset containing **68 validated course/university combinations** across Australian capital cities: * **Processed Dataset:** `data/processed/gradscope_calculator_2026.csv` (The source of truth for tuition and program duration baselines). * **Raw Cost-of-Living Dataset:** `data/raw/australia_cost_of_living_2026_v2.csv` (Compiled city-level consumer prices).`
  - **[SUPPORTS]** `[SOURCE_CODE]` `README.md:84`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `* **Processed Dataset:** `data/processed/gradscope_calculator_2026.csv` (The source of truth for tuition and program duration baselines). * **Raw Cost-of-Living Dataset:** `data/raw/australia_cost_of_living_2026_v2.csv` (Compiled city-level consumer prices). * **Data Pipelines:** Jupyter Notebooks (`notebooks/01_data_cleaning.ipynb` to `04_build_lifecost_data_model.ipynb`) clean raw metrics, merge statistics, and build relational databases. Seeding is automated via `scripts/generate_processed_data.py` and `backend/app/seed.py`.`
  - **[SUPPORTS]** `[SOURCE_CODE]` `README.md:211`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `* **2026 Data Horizon:** All tuition fee figures and Numbeo consumer pricing baselines correspond directly to the year 2026, without dynamic forecasting. * **Postgraduate Focus:** The platform currently models Master's level programs only, excluding undergraduate, diploma, or doctoral structures.`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/seed.py:15`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `/ "processed"     / "gradscope_calculator_2026.csv" )`

#### 28. Application capability limit
- **Category**: LIMIT
- **Documentation Path**: `README.md:214`
- **Original Text**: *"* **Stateless Wizard:** Configured selections in the wizard reset to Step 1 upon browser refresh."*
- **Verdict Confidence**: 0.85
- **Explanation**: Found reference to year/baseline tokens in code datasets, but static analysis cannot verify if every tuition figure is dynamically correct or limited to 2026.
- **Retrieved Contextual Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `README.md:214`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Limited Selections:** The database is limited to 68 validated course/city/university combinations. * **Stateless Wizard:** Configured selections in the wizard reset to Step 1 upon browser refresh.`

#### 29. User authentication mechanism
- **Category**: AUTHENTICATION
- **Documentation Path**: `README.md:221`
- **Original Text**: *"* **Wizard State Retention:** Integrate `localStorage` or session persistence to retain study selections upon page refresh."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:32`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **4-Step Configure Your Study Plan Wizard:** Interactive stepper guiding users to select a Course, City, University, and enter/configure an Expected Scholarship percentage. * **Dynamic Viewport Stepper Transitions:** Planner page automatically center-scrolls to the next active step upon selection to guide the user seamlessly through the flow.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:214`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Limited Selections:** The database is limited to 68 validated course/city/university combinations. * **Stateless Wizard:** Configured selections in the wizard reset to Step 1 upon browser refresh.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:221`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Extended Program Support:** Expand datasets to encompass Bachelor's (undergraduate) and PhD research study models. * **Wizard State Retention:** Integrate `localStorage` or session persistence to retain study selections upon page refresh. * **Custom Grocery Basket Adjustments:** Allow users to adjust unit quantities of individual food items in the groceries list to dynamically customize living cost indices.`

#### 30. Technical prose assertion
- **Category**: OTHER
- **Documentation Path**: `README.md:223`
- **Original Text**: *"* **Dynamic Exchange Rates:** Integrate an API to convert costs into student-specific home country currencies in real-time."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:33`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **4-Step Configure Your Study Plan Wizard:** Interactive stepper guiding users to select a Course, City, University, and enter/configure an Expected Scholarship percentage. * **Dynamic Viewport Stepper Transitions:** Planner page automatically center-scrolls to the next active step upon selection to guide the user seamlessly through the flow. * **"Where Your Total Comes From" Cost Breakdown Card:** A clear comparative dashboard showing the cumulative program cost *Without Scholarship* vs. *With Scholarship*, highlighting net payable tuition and program-length savings.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:39`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Monthly Expenses Breakdown (Horizontal Bar Chart):** Breaks down the monthly living baseline into Housing, Food, Transit, and Utilities. * **Detailed Expandable Accordions:** Displays itemized grocery and utility costs dynamically mapped to the target city. * **Institutional Comparison Table:** Compares the selected course against other universities across Australia offering the same program, showing comparative tuition, living, and total costs side-by-side.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:106`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `│       ├── routes/          # API endpoint controllers (calculator, cities, universities) │       ├── database.py      # SQLAlchemy connection, dynamic SSL & scheme parsing │       ├── main.py          # FastAPI application initialization & CORS config`

#### 31. Technical prose assertion
- **Category**: OTHER
- **Documentation Path**: `data/source_map.md:50`
- **Original Text**: *"- If a source uses weekly pricing, convert it to monthly during the Python cleaning stage."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:83`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `The application runs on a dataset containing **68 validated course/university combinations** across Australian capital cities: * **Processed Dataset:** `data/processed/gradscope_calculator_2026.csv` (The source of truth for tuition and program duration baselines). * **Raw Cost-of-Living Dataset:** `data/raw/australia_cost_of_living_2026_v2.csv` (Compiled city-level consumer prices).`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:118`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `├── data/ │   ├── raw/                 # Source Numbeo & education statistics │   ├── processed/           # Cleaned datasets loaded by database seeder`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:142`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `python3 -m venv .venv    source .venv/bin/activate  # On Windows: .venv\Scripts\activate    ````

#### 32. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `data/source_map.md:64`
- **Original Text**: *"Relevant ABS tables:"*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `data/source_map.md:64`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `Relevant ABS tables:`

#### 33. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `data/source_map.md:66`
- **Original Text**: *"- Table 10 — CPI Group, Sub-group and Expenditure Class, Index Numbers by Capital City"*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:26`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `GradScope solves this by providing a unified, transparent decision-support calculator. Instead of manually cross-referencing university brochures, Numbeo indexes, and currency exchange tables, students can select their desired course, city, and institution, apply their expected scholarship percentage, and immediately receive a personalized cost breakdown based on the project's 2026 dataset.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:40`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Detailed Expandable Accordions:** Displays itemized grocery and utility costs dynamically mapped to the target city. * **Institutional Comparison Table:** Compares the selected course against other universities across Australia offering the same program, showing comparative tuition, living, and total costs side-by-side.`
  - **[CONTEXTUAL]** `[SOURCE_CODE]` `backend/app/models.py:8`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `class CourseCost(Base):     __tablename__ = "course_costs"`

#### 34. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `data/source_map.md:67`
- **Original Text**: *"- Table 11 — Annual percentage change by Capital City"*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:26`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `GradScope solves this by providing a unified, transparent decision-support calculator. Instead of manually cross-referencing university brochures, Numbeo indexes, and currency exchange tables, students can select their desired course, city, and institution, apply their expected scholarship percentage, and immediately receive a personalized cost breakdown based on the project's 2026 dataset.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:40`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Detailed Expandable Accordions:** Displays itemized grocery and utility costs dynamically mapped to the target city. * **Institutional Comparison Table:** Compares the selected course against other universities across Australia offering the same program, showing comparative tuition, living, and total costs side-by-side.`
  - **[CONTEXTUAL]** `[SOURCE_CODE]` `backend/app/models.py:8`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `class CourseCost(Base):     __tablename__ = "course_costs"`

#### 35. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `data/source_map.md:68`
- **Original Text**: *"- Table 12 — Monthly percentage change by Capital City"*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:26`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `GradScope solves this by providing a unified, transparent decision-support calculator. Instead of manually cross-referencing university brochures, Numbeo indexes, and currency exchange tables, students can select their desired course, city, and institution, apply their expected scholarship percentage, and immediately receive a personalized cost breakdown based on the project's 2026 dataset.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:40`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Detailed Expandable Accordions:** Displays itemized grocery and utility costs dynamically mapped to the target city. * **Institutional Comparison Table:** Compares the selected course against other universities across Australia offering the same program, showing comparative tuition, living, and total costs side-by-side.`
  - **[CONTEXTUAL]** `[SOURCE_CODE]` `backend/app/models.py:8`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `class CourseCost(Base):     __tablename__ = "course_costs"`

#### 36. Application feature component
- **Category**: FEATURE
- **Documentation Path**: `data/source_map.md:69`
- **Original Text**: *"- Table 16 — Analytical Series by Capital City"*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:26`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `GradScope solves this by providing a unified, transparent decision-support calculator. Instead of manually cross-referencing university brochures, Numbeo indexes, and currency exchange tables, students can select their desired course, city, and institution, apply their expected scholarship percentage, and immediately receive a personalized cost breakdown based on the project's 2026 dataset.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `README.md:40`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Detailed Expandable Accordions:** Displays itemized grocery and utility costs dynamically mapped to the target city. * **Institutional Comparison Table:** Compares the selected course against other universities across Australia offering the same program, showing comparative tuition, living, and total costs side-by-side.`
  - **[CONTEXTUAL]** `[SOURCE_CODE]` `backend/app/models.py:8`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `class CourseCost(Base):     __tablename__ = "course_costs"`

#### 37. Mathematical model behavior
- **Category**: BEHAVIOR
- **Documentation Path**: `data/source_map.md:85`
- **Original Text**: *"- Actual prices → used for monthly cost estimates."*
- **Verdict Confidence**: 0.75
- **Explanation**: Evidence collected is insufficient or too ambiguous to confidently assert truth or contradiction.
- **Retrieved Contextual Evidence**:
  - **[CONTEXTUAL]** `[CONFIGURATION]` `data/source_map.md:85`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `- CPI data → used for trend analysis. - Actual prices → used for monthly cost estimates.`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `data/source_map.md:91`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `## Actual Cost Sources`
  - **[CONTEXTUAL]** `[CONFIGURATION]` `data/source_map.md:113`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `Every actual cost observation must record its source in lifecost_data.csv.`

### Verified Findings
#### 1. Configuration metadata specification
- **Category**: CONFIGURATION
- **Documentation Path**: `README.md:26`
- **Original Text**: *"GradScope solves this by providing a unified, transparent decision-support calculator. Instead of manually cross-referencing university brochures, Numbeo indexes, and currency exchange tables, students can select their desired course, city, and institution, apply their expected scholarship percentage, and immediately receive a personalized cost breakdown based on the project's 2026 dataset."*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at README.md:26, README.md:83, README.md:84, README.md:211, backend/app/seed.py:15.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `README.md:26`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `GradScope solves this by providing a unified, transparent decision-support calculator. Instead of manually cross-referencing university brochures, Numbeo indexes, and currency exchange tables, students can select their desired course, city, and institution, apply their expected scholarship percentage, and immediately receive a personalized cost breakdown based on the project's 2026 dataset.`
  - **[SUPPORTS]** `[SOURCE_CODE]` `README.md:83`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `The application runs on a dataset containing **68 validated course/university combinations** across Australian capital cities: * **Processed Dataset:** `data/processed/gradscope_calculator_2026.csv` (The source of truth for tuition and program duration baselines). * **Raw Cost-of-Living Dataset:** `data/raw/australia_cost_of_living_2026_v2.csv` (Compiled city-level consumer prices).`
  - **[SUPPORTS]** `[SOURCE_CODE]` `README.md:84`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `* **Processed Dataset:** `data/processed/gradscope_calculator_2026.csv` (The source of truth for tuition and program duration baselines). * **Raw Cost-of-Living Dataset:** `data/raw/australia_cost_of_living_2026_v2.csv` (Compiled city-level consumer prices). * **Data Pipelines:** Jupyter Notebooks (`notebooks/01_data_cleaning.ipynb` to `04_build_lifecost_data_model.ipynb`) clean raw metrics, merge statistics, and build relational databases. Seeding is automated via `scripts/generate_processed_data.py` and `backend/app/seed.py`.`
  - **[SUPPORTS]** `[SOURCE_CODE]` `README.md:211`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `* **2026 Data Horizon:** All tuition fee figures and Numbeo consumer pricing baselines correspond directly to the year 2026, without dynamic forecasting. * **Postgraduate Focus:** The platform currently models Master's level programs only, excluding undergraduate, diploma, or doctoral structures.`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/seed.py:15`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `/ "processed"     / "gradscope_calculator_2026.csv" )`

#### 2. Application capability limit
- **Category**: LIMIT
- **Documentation Path**: `README.md:38`
- **Original Text**: *"* **Monthly Expenses Breakdown (Horizontal Bar Chart):** Breaks down the monthly living baseline into Housing, Food, Transit, and Utilities."*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at README.md:38, README.md:64, frontend/src/types/index.ts:32.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `README.md:38`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Annual Cost Ratio (Bar Chart):** Compares the tuition fee to living costs on an annual basis.   * **Monthly Expenses Breakdown (Horizontal Bar Chart):** Breaks down the monthly living baseline into Housing, Food, Transit, and Utilities. * **Detailed Expandable Accordions:** Displays itemized grocery and utility costs dynamically mapped to the target city.`
  - **[SUPPORTS]** `[CONFIGURATION]` `README.md:64`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `$$\text{Living Costs} = \text{Monthly Living Cost} \times 12 \times \text{Program Duration (Years)}$$`
  - **[SUPPORTS]** `[SOURCE_CODE]` `frontend/src/types/index.ts:32`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `water_15l: number;   transport_monthly_pass: number;   utilities_85sqm: number;`

#### 3. System architectural style
- **Category**: ARCHITECTURE
- **Documentation Path**: `README.md:72`
- **Original Text**: *"* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide React."*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at frontend/package.json:15, frontend/package.json:17, frontend/package.json:28, frontend/package.json:7.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:15`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"react": "^19.2.8",`
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:17`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"recharts": "^3.10.1"`
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:28`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"typescript": "~6.0.2",`
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:7`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"dev": "vite",`

#### 4. System architectural style
- **Category**: ARCHITECTURE
- **Documentation Path**: `README.md:73`
- **Original Text**: *"* **Backend:** FastAPI (Python), SQLAlchemy 2.0 (ORM), Pydantic, Uvicorn."*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at requirements.txt:1, requirements.txt:2, requirements.txt:3.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:1`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `fastapi==0.141.1`
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:2`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `uvicorn==0.52.3`
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:3`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `SQLAlchemy==2.0.52`

#### 5. Database management system specification
- **Category**: DATABASE
- **Documentation Path**: `README.md:74`
- **Original Text**: *"* **Database:** PostgreSQL, psycopg v3."*
- **Verdict Confidence**: 0.85
- **Explanation**: PostgreSQL database configuration was verified by psycopg dependency declared in requirements.txt.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:4`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `psycopg==3.3.4`
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:5`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `psycopg-binary==3.3.4`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:9`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `"DATABASE_URL",     "postgresql+psycopg://vedantburgul@localhost:5432/gradscope_db" )`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:15`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `if DATABASE_URL.startswith("postgres://"):         DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:16`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:17`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`

#### 6. Database management system specification
- **Category**: DATABASE
- **Documentation Path**: `README.md:76`
- **Original Text**: *"* **Hosting:** Netlify (Frontend), Render (FastAPI Backend + PostgreSQL Database)."*
- **Verdict Confidence**: 0.85
- **Explanation**: PostgreSQL database configuration was verified by psycopg dependency declared in requirements.txt.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:4`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `psycopg==3.3.4`
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:5`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `psycopg-binary==3.3.4`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:9`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `"DATABASE_URL",     "postgresql+psycopg://vedantburgul@localhost:5432/gradscope_db" )`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:15`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `if DATABASE_URL.startswith("postgres://"):         DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:16`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:17`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`
  - **[CONTEXTUAL]** `[DEPENDENCY]` `requirements.txt:1`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `fastapi==0.141.1`

#### 7. Configuration metadata specification
- **Category**: CONFIGURATION
- **Documentation Path**: `README.md:82`
- **Original Text**: *"The application runs on a dataset containing **68 validated course/university combinations** across Australian capital cities:"*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at README.md:82, README.md:107, frontend/README.md:16.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `README.md:82`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `The application runs on a dataset containing **68 validated course/university combinations** across Australian capital cities: * **Processed Dataset:** `data/processed/gradscope_calculator_2026.csv` (The source of truth for tuition and program duration baselines).`
  - **[SUPPORTS]** `[CONFIGURATION]` `README.md:107`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `│       ├── database.py      # SQLAlchemy connection, dynamic SSL & scheme parsing │       ├── main.py          # FastAPI application initialization & CORS config │       ├── models.py        # SQLAlchemy model schemas`
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:16`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:`

#### 8. Data file reference: data/processed/gradscopecalculator2026.csv
- **Category**: CONFIGURATION
- **Documentation Path**: `README.md:83`
- **Original Text**: *"* **Processed Dataset:** `data/processed/gradscope_calculator_2026.csv` (The source of truth for tuition and program duration baselines)."*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at README.md:83, README.md:85, README.md:119.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `README.md:83`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `The application runs on a dataset containing **68 validated course/university combinations** across Australian capital cities: * **Processed Dataset:** `data/processed/gradscope_calculator_2026.csv` (The source of truth for tuition and program duration baselines). * **Raw Cost-of-Living Dataset:** `data/raw/australia_cost_of_living_2026_v2.csv` (Compiled city-level consumer prices).`
  - **[SUPPORTS]** `[CONFIGURATION]` `README.md:85`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Raw Cost-of-Living Dataset:** `data/raw/australia_cost_of_living_2026_v2.csv` (Compiled city-level consumer prices). * **Data Pipelines:** Jupyter Notebooks (`notebooks/01_data_cleaning.ipynb` to `04_build_lifecost_data_model.ipynb`) clean raw metrics, merge statistics, and build relational databases. Seeding is automated via `scripts/generate_processed_data.py` and `backend/app/seed.py`.`
  - **[SUPPORTS]** `[CONFIGURATION]` `README.md:119`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `│   ├── raw/                 # Source Numbeo & education statistics │   ├── processed/           # Cleaned datasets loaded by database seeder │   └── analysis/            # Validation spreadsheets`

#### 9. Data file reference: data/raw/australiacostofliving2026v2.csv
- **Category**: CONFIGURATION
- **Documentation Path**: `README.md:84`
- **Original Text**: *"* **Raw Cost-of-Living Dataset:** `data/raw/australia_cost_of_living_2026_v2.csv` (Compiled city-level consumer prices)."*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at frontend/src/types/index.ts:14, frontend/src/services/apiService.ts:2, frontend/src/services/apiService.ts:61.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `frontend/src/types/index.ts:14`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `export interface CityCostOfLiving {   city: string;`
  - **[SUPPORTS]** `[SOURCE_CODE]` `frontend/src/services/apiService.ts:2`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `import type { CalculationResult } from '../types'; import { getCityCostOfLiving, FOOD_QUANTITIES, FOOD_COLUMN_MAP } from './dataService';`
  - **[SUPPORTS]** `[SOURCE_CODE]` `frontend/src/services/apiService.ts:61`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `const data = await response.json();   const col = getCityCostOfLiving(data.city);`

#### 10. API Endpoint endpoint Exposure
- **Category**: API
- **Documentation Path**: `README.md:91`
- **Original Text**: *"The FastAPI backend exposes the following REST endpoints:"*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at requirements.txt:1.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:1`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `fastapi==0.141.1`

#### 11. API Endpoint /api/courses Exposure
- **Category**: API
- **Documentation Path**: `README.md:92`
- **Original Text**: *"* `GET /api/courses` - Returns available courses."*
- **Verdict Confidence**: 0.95
- **Explanation**: The route endpoint is successfully defined in the source code at backend/app/routes/calculator.py:109 matching path parameters. No contradictions were found.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/routes/calculator.py:109`
    *Discovery*: route_regex_matching (Confidence: 0.95)
    *Preview*: `@router.get(     "/courses",     response_model=list[str] )`

#### 12. API Endpoint /api/cities Exposure
- **Category**: API
- **Documentation Path**: `README.md:93`
- **Original Text**: *"* `GET /api/cities` - Returns available capital cities."*
- **Verdict Confidence**: 0.95
- **Explanation**: The route endpoint is successfully defined in the source code at backend/app/routes/cities.py:10, backend/app/routes/cities.py:23 matching path parameters. No contradictions were found.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/routes/cities.py:10`
    *Discovery*: route_regex_matching (Confidence: 0.95)
    *Preview*: `router = APIRouter(     prefix="/api/cities",     tags=["Cities"]`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/routes/cities.py:23`
    *Discovery*: route_regex_matching (Confidence: 0.95)
    *Preview*: `@router.get("") def get_cities(db: Session = Depends(get_db)):     statement = (         select(CourseCost.city)`

#### 13. API Endpoint /api/universities Exposure
- **Category**: API
- **Documentation Path**: `README.md:94`
- **Original Text**: *"* `GET /api/universities` - Returns universities, with optional `city` and `course` query parameters."*
- **Verdict Confidence**: 0.95
- **Explanation**: The route endpoint is successfully defined in the source code at backend/app/routes/universities.py:10, backend/app/routes/universities.py:23 matching path parameters. No contradictions were found.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/routes/universities.py:10`
    *Discovery*: route_regex_matching (Confidence: 0.95)
    *Preview*: `router = APIRouter(     prefix="/api/universities",     tags=["Universities"]`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/routes/universities.py:23`
    *Discovery*: route_regex_matching (Confidence: 0.95)
    *Preview*: `@router.get("") def get_universities(     city: str = Query(...),     db: Session = Depends(get_db)`

#### 14. API Endpoint /api/course-cost Exposure
- **Category**: API
- **Documentation Path**: `README.md:95`
- **Original Text**: *"* `GET /api/course-cost` - Calculates and returns total cost indices for a combination (`city`, `university`, `course`, `scholarship_percent`)."*
- **Verdict Confidence**: 0.95
- **Explanation**: The route endpoint is successfully defined in the source code at backend/app/routes/calculator.py:24 matching path parameters. No contradictions were found.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/routes/calculator.py:24`
    *Discovery*: route_regex_matching (Confidence: 0.95)
    *Preview*: `@router.get(     "/course-cost",     response_model=CourseCostResponse )`

#### 15. API Endpoint /api/course-comparison Exposure
- **Category**: API
- **Documentation Path**: `README.md:96`
- **Original Text**: *"* `GET /api/course-comparison` - Returns other institutional records matching the queried `course` name."*
- **Verdict Confidence**: 0.95
- **Explanation**: The route endpoint is successfully defined in the source code at backend/app/routes/calculator.py:90 matching path parameters. No contradictions were found.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/routes/calculator.py:90`
    *Discovery*: route_regex_matching (Confidence: 0.95)
    *Preview*: `@router.get(     "/course-comparison",     response_model=list[CourseCostResponse] )`

#### 16. Database management system specification
- **Category**: DATABASE
- **Documentation Path**: `README.md:133`
- **Original Text**: *"* PostgreSQL running locally (optional, defaults to hosted Render service if DATABASE_URL is not set)"*
- **Verdict Confidence**: 0.85
- **Explanation**: PostgreSQL database configuration was verified by psycopg dependency declared in requirements.txt.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:4`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `psycopg==3.3.4`
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:5`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `psycopg-binary==3.3.4`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:9`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `"DATABASE_URL",     "postgresql+psycopg://vedantburgul@localhost:5432/gradscope_db" )`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:15`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `if DATABASE_URL.startswith("postgres://"):         DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:16`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:17`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`

#### 17. Command line utility execution
- **Category**: COMMAND
- **Documentation Path**: `README.md:141`
- **Original Text**: *"python3 -m venv .venv"*
- **Verdict Confidence**: 0.95
- **Explanation**: The execution target command configuration or script file was verified at frontend/README.md:12, frontend/README.md:32.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:12`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).`
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:32`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.`

#### 18. Command line utility execution
- **Category**: COMMAND
- **Documentation Path**: `README.md:142`
- **Original Text**: *"source .venv/bin/activate  # On Windows: .venv\Scripts\activate"*
- **Verdict Confidence**: 0.95
- **Explanation**: The execution target command configuration or script file was verified at frontend/README.md:12, frontend/README.md:32.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:12`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).`
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:32`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.`

#### 19. Command line utility execution
- **Category**: COMMAND
- **Documentation Path**: `README.md:147`
- **Original Text**: *"pip install -r requirements.txt"*
- **Verdict Confidence**: 0.95
- **Explanation**: The execution target command configuration or script file was verified at frontend/README.md:12, frontend/README.md:32.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:12`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).`
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:32`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.`

#### 20. Database management system specification
- **Category**: DATABASE
- **Documentation Path**: `README.md:151`
- **Original Text**: *"Set `DATABASE_URL` to point to your local PostgreSQL instance (default local fallback is `postgresql+psycopg://username:password@localhost:5432/gradscope_db`):"*
- **Verdict Confidence**: 0.85
- **Explanation**: PostgreSQL database configuration was verified by psycopg dependency declared in requirements.txt.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:4`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `psycopg==3.3.4`
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:5`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `psycopg-binary==3.3.4`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:9`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `"DATABASE_URL",     "postgresql+psycopg://vedantburgul@localhost:5432/gradscope_db" )`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:15`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `if DATABASE_URL.startswith("postgres://"):         DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:16`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:17`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`

#### 21. Command line utility execution
- **Category**: COMMAND
- **Documentation Path**: `README.md:153`
- **Original Text**: *"export DATABASE_URL="postgresql+psycopg://username:password@localhost:5432/db_name""*
- **Verdict Confidence**: 0.95
- **Explanation**: The execution target command configuration or script file was verified at requirements.txt:4, requirements.txt:5, backend/app/database.py:9, backend/app/database.py:15, backend/app/database.py:16, backend/app/database.py:17.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:4`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `psycopg==3.3.4`
  - **[SUPPORTS]** `[DEPENDENCY]` `requirements.txt:5`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `psycopg-binary==3.3.4`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:9`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `"DATABASE_URL",     "postgresql+psycopg://vedantburgul@localhost:5432/gradscope_db" )`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:15`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `if DATABASE_URL.startswith("postgres://"):         DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:16`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:17`
    *Discovery*: token_keyword_match (Confidence: 0.95)
    *Preview*: `elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`

#### 22. Database management system specification
- **Category**: DATABASE
- **Documentation Path**: `README.md:156`
- **Original Text**: *"4. **Initialize & Seed the Database:**"*
- **Verdict Confidence**: 0.85
- **Explanation**: PostgreSQL database configuration was verified by psycopg dependency declared in requirements.txt.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:9`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `"DATABASE_URL",     "postgresql+psycopg://vedantburgul@localhost:5432/gradscope_db" )`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:15`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `if DATABASE_URL.startswith("postgres://"):         DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:16`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:17`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`

#### 23. Command line utility execution
- **Category**: COMMAND
- **Documentation Path**: `README.md:158`
- **Original Text**: *"python -m backend.app.seed"*
- **Verdict Confidence**: 0.95
- **Explanation**: The execution target command configuration or script file was verified at backend/app/seed.py:1.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/seed.py:1`
    *Discovery*: file_presence_check (Confidence: 0.90)
    *Preview*: `# Module backend.app.seed exists`

#### 24. Command line utility execution
- **Category**: COMMAND
- **Documentation Path**: `README.md:163`
- **Original Text**: *"uvicorn backend.app.main:app --reload"*
- **Verdict Confidence**: 0.95
- **Explanation**: The execution target command configuration or script file was verified at frontend/README.md:12, frontend/README.md:32.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:12`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).`
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:32`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.`

#### 25. Command line utility execution
- **Category**: COMMAND
- **Documentation Path**: `README.md:173`
- **Original Text**: *"cd frontend"*
- **Verdict Confidence**: 0.95
- **Explanation**: The execution target command configuration or script file was verified at frontend/README.md:12, frontend/README.md:32.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:12`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).`
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:32`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.`

#### 26. Command line utility execution
- **Category**: COMMAND
- **Documentation Path**: `README.md:178`
- **Original Text**: *"npm install"*
- **Verdict Confidence**: 0.95
- **Explanation**: The execution target command configuration or script file was verified at frontend/README.md:12, frontend/README.md:32.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:12`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).`
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/README.md:32`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.`

#### 27. Configuration metadata specification
- **Category**: CONFIGURATION
- **Documentation Path**: `README.md:182`
- **Original Text**: *"Vite automatically defaults to the production backend. If you want to connect to a local backend, create a `frontend/.env.local` file:"*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at frontend/package.json:7.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:7`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"dev": "vite",`

#### 28. Command line utility execution
- **Category**: COMMAND
- **Documentation Path**: `README.md:189`
- **Original Text**: *"npm run dev"*
- **Verdict Confidence**: 0.95
- **Explanation**: The execution target command configuration or script file was verified at frontend/package.json:7.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/package.json:7`
    *Discovery*: package_script_inspection (Confidence: 0.95)
    *Preview*: `"dev": "vite",`

#### 29. Command line utility execution
- **Category**: COMMAND
- **Documentation Path**: `README.md:195`
- **Original Text**: *"npm run build"*
- **Verdict Confidence**: 0.95
- **Explanation**: The execution target command configuration or script file was verified at frontend/package.json:8.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `frontend/package.json:8`
    *Discovery*: package_script_inspection (Confidence: 0.95)
    *Preview*: `"build": "tsc -b && vite build",`

#### 30. Database management system specification
- **Category**: DATABASE
- **Documentation Path**: `README.md:213`
- **Original Text**: *"* **Limited Selections:** The database is limited to 68 validated course/city/university combinations."*
- **Verdict Confidence**: 0.85
- **Explanation**: PostgreSQL database configuration was verified by psycopg dependency declared in requirements.txt.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:9`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `"DATABASE_URL",     "postgresql+psycopg://vedantburgul@localhost:5432/gradscope_db" )`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:15`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `if DATABASE_URL.startswith("postgres://"):         DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:16`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)     elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`
  - **[SUPPORTS]** `[SOURCE_CODE]` `backend/app/database.py:17`
    *Discovery*: token_keyword_match (Confidence: 0.85)
    *Preview*: `elif DATABASE_URL.startswith("postgresql://"):         DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)`

#### 31. Configuration metadata specification
- **Category**: CONFIGURATION
- **Documentation Path**: `README.md:220`
- **Original Text**: *"* **Extended Program Support:** Expand datasets to encompass Bachelor's (undergraduate) and PhD research study models."*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at README.md:220.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `README.md:220`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `* **Extended Program Support:** Expand datasets to encompass Bachelor's (undergraduate) and PhD research study models. * **Wizard State Retention:** Integrate `localStorage` or session persistence to retain study selections upon page refresh.`

#### 32. Software engineering dependency
- **Category**: DEPENDENCY
- **Documentation Path**: `frontend/README.md:3`
- **Original Text**: *"This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules."*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at frontend/package.json:15, frontend/package.json:9, frontend/package.json:7.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:15`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"react": "^19.2.8",`
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:9`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"lint": "oxlint",`
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:7`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"dev": "vite",`

#### 33. Technical prose assertion
- **Category**: OTHER
- **Documentation Path**: `frontend/README.md:7`
- **Original Text**: *"- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)"*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at frontend/package.json:15, frontend/package.json:25, frontend/package.json:7.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:15`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"react": "^19.2.8",`
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:25`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"@vitejs/plugin-react": "^6.0.4",`
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:7`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"dev": "vite",`

#### 34. Technical prose assertion
- **Category**: OTHER
- **Documentation Path**: `frontend/README.md:8`
- **Original Text**: *"- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)"*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at frontend/package.json:15, frontend/package.json:25, frontend/package.json:7.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:15`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"react": "^19.2.8",`
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:25`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"@vitejs/plugin-react": "^6.0.4",`
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:7`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"dev": "vite",`

#### 35. Software engineering dependency
- **Category**: DEPENDENCY
- **Documentation Path**: `frontend/README.md:12`
- **Original Text**: *"The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation)."*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at frontend/package.json:15.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[DEPENDENCY]` `frontend/package.json:15`
    *Discovery*: dependency_parsing (Confidence: 1.00)
    *Preview*: `"react": "^19.2.8",`

#### 36. Data file reference: lifecostdata.csv
- **Category**: CONFIGURATION
- **Documentation Path**: `data/source_map.md:113`
- **Original Text**: *"Every actual cost observation must record its source in lifecost_data.csv."*
- **Verdict Confidence**: 0.85
- **Explanation**: Supporting repository evidence (dependencies or tokens) was located at data/source_map.md:48, data/source_map.md:113.
- **Retrieved Code Evidence**:
  - **[SUPPORTS]** `[CONFIGURATION]` `data/source_map.md:48`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `- Year: 2026 - Every observation must have a source. - Raw source values must not be invented.`
  - **[SUPPORTS]** `[CONFIGURATION]` `data/source_map.md:113`
    *Discovery*: token_keyword_match (Confidence: 0.70)
    *Preview*: `Every actual cost observation must record its source in lifecost_data.csv.`

---

## Evidence Summary Matrix

| Source Type | Discovery Method | Supporting | Contradicting | Contextual |
| --- | --- | :---: | :---: | :---: |
| CONFIGURATION | package_script_inspection | 2 | 0 | 0 |
| CONFIGURATION | token_keyword_match | 24 | 0 | 61 |
| DEPENDENCY | dependency_parsing | 29 | 0 | 1 |
| SOURCE_CODE | file_presence_check | 1 | 0 | 0 |
| SOURCE_CODE | route_regex_matching | 7 | 0 | 0 |
| SOURCE_CODE | token_keyword_match | 42 | 0 | 7 |

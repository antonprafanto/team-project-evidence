# Devpost Submission Copy — Team Project Evidence & Rubric Assistant (Codegeist 2026 Entry 2)

## App Name
**Team Project Evidence & Rubric Assistant**

## Elevator Pitch (Tagline)
Fair, transparent university software-engineering supervision on Jira, Confluence, and the Atlassian Teamwork Graph—surfacing cross-product contribution evidence, catching free-riding early, and drafting rubric-aligned milestone feedback with lecturer-in-the-loop approval.

## Primary Category
**Apps for Specialized Industries** (Higher Education — Software Engineering & Capstone Supervision)

## Bonus Categories Targeted
1. **Best App with Teamwork Graph Integration** (`read:graph:team:atlassian`, `read:graph:user:atlassian`, `read:graph:project:jira`, `read:graph:issue:jira`, `read:graph:issue-comment:jira`, `read:graph:space:confluence`, `read:graph:page:confluence`, `read:graph:pull-request:external`)
2. **Best Rovo Agent or Skill** (`rovo:agent` + `rovo:skill` + 4 actions)
3. **Runs on Atlassian** (Verified `Eligible for the Runs on Atlassian program` via `forge eligibility` — `@forge/llm`, `@forge/kvs`, zero external network egress)

## Live Deployment & Installation Details
- **Deployed App ARI:** `ari:cloud:ecosystem::app/50f92c1f-44d9-405c-ac90-148887e3ac53`
- **Live Installed Jira & Confluence Cloud Site:** `https://one-atlas-rrth.atlassian.net`
- **Developer Console Distribution Link:** `https://developer.atlassian.com/console/myapps/50f92c1f-44d9-405c-ac90-148887e3ac53/manage/distribution`

---

## Inspiration
As a university lecturer supervising multi-team Software Engineering capstone courses, grading and mentoring student teams is one of the hardest problems in higher education:
1. **Git commit counts lie:** Students who write comprehensive system architecture specs in **Confluence**, triage **Jira** backlogs, or perform thorough **Pull Request reviews** often appear "inactive" if a lecturer only checks Git commit graphs.
2. **Free-riding and last-minute sprints are discovered too late:** Usually at Week 14 during final grading, when peer evaluations explode and it is too late for a pedagogical intervention.
3. **Opaque AI grading is harmful:** Students distrust black-box AI graders, and lecturers need structured, rubric-aligned evidence rather than automated numerical scores.

## What It Does
**Team Project Evidence & Rubric Assistant** turns Jira, Confluence, and the **Atlassian Teamwork Graph** into a transparent academic supervision cockpit:
- **Cross-Product Teamwork Graph Aggregation (`src/twgClient.js`):** Queries `atlassianTeamMembers`, `atlassianUserAssignedJiraWorkItems`, `atlassianUserPullRequests`, `jiraWorkItemComments`, and `confluencePageContributors` using Relay connections (`edges { node { ... } }`) to unify Jira work items, PR authoring/reviews, and Confluence specification edits per student.
- **Non-Code Contribution Recognition:** Explicitly highlights students whose primary contribution is Confluence architecture design and peer code review so they are never falsely flagged as inactive.
- **Early-Warning Pedagogical Detector:** Automatically flags `INACTIVE_MEMBER`, `SINGLE_STUDENT_CARRY`, and `LAST_MINUTE_BURST` patterns mid-semester so lecturers can check in during lab hours.
- **3 Non-Negotiable Pedagogical Guardrails:**
  1. **Student Self-Inspection (`get-student-evidence`):** Every student can inspect the exact same cross-product evidence summary shown to the lecturer.
  2. **Lecturer-in-the-Loop Approval:** AI rubric drafts (`@forge/llm` `claude-sonnet-5`) require explicit lecturer review and click-to-approve before being published to `@forge/kvs`.
  3. **Explicit Caveat:** Every view and AI draft reminds the lecturer that *activity counts provide context and do not equal engineering quality*, and no numerical grade is ever assigned automatically.

---

## 3-Minute Video Script (Judges Watch 0:00–3:00)

- **0:00–0:35 — The Higher-Education Problem (Why Git Commits Alone Fail Students):**
  - Introduce the university Software Engineering capstone context (`IF-304`): 4-student teams working across Jira backlogs, GitHub/Bitbucket PRs, and Confluence architecture specifications.
  - Show how traditional commit-only tracking unfairly penalizes students who lead system architecture in Confluence (`STU-02` Siti Rahma: 9 Confluence edits, 8 PR reviews, 2 PRs merged) while missing genuine mid-semester inactivity (`STU-04` Dimas Pratama: 14 days inactive) until final grading.
- **0:35–1:30 — Course Evidence & Rubric Cockpit (Jira + Confluence + Teamwork Graph):**
  - Open **Course Evidence & Rubric Cockpit** in Jira (`PLAT`) and Confluence.
  - Walk through **Team Garuda** (`2 Early Warnings`: `INACTIVE_MEMBER` + `LAST_MINUTE_BURST`) and **Team Mahakam** (`1 Early Warning`: `SINGLE_STUDENT_CARRY`).
  - Click **Student Self-Inspection View** on `STU-02` (Siti Rahma) to demonstrate the **Pedagogical Transparency Guarantee**: students see the exact same cross-product evidence and weekly cadence as the lecturer.
- **1:30–2:25 — Lecturer-in-the-Loop Rubric Feedback & Rovo Teaching Assistant:**
  - Click **Draft Milestone Rubric Feedback (Forge LLM)** on **Team Garuda** (`@forge/llm` `claude-sonnet-5`), review the 4-criterion markdown draft (which explicitly states no numerical grade is assigned), and click **Approve & Publish to Milestone Record**.
  - Open **Rovo Chat (`SE Course Teaching Assistant`)** powered by `course-evidence-rubric` (`SKILL.md`) and ask: *"Which student teams have early-warning imbalance or inactivity this week?"*
- **2:25–2:55 — Teamwork Graph Schema & Runs-on-Atlassian Architecture:**
  - Show `src/twgClient.js` (`atlassianTeamMembers`, `atlassianUserAssignedJiraWorkItems`, `atlassianUserPullRequests`, `confluencePageContributors`) and `manifest.yml` (`Eligible for the Runs on Atlassian program` — zero external egress keeps student records 100% inside Atlassian Cloud).

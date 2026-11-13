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
  - Show how traditional commit-only tracking unfairly penalizes students who lead system architecture in Confluence (`STU-02` Nadia Putri (Synthetic): 11 Confluence edits, 9 PR reviews, 2 PRs merged, 34.2% evidence share) while missing genuine mid-semester inactivity (`STU-03` Dimas Wijaya (Synthetic): 13 days inactive, 1% evidence share) until final grading.
- **0:35–1:30 — Course Evidence & Rubric Cockpit (Jira + Confluence + Teamwork Graph):**
  - Open **Course Evidence & Rubric Cockpit** in Jira (`PLAT`) and Confluence.
  - Walk through **Team Garuda** (`1 Early Warning`: `INACTIVE_MEMBER` on `STU-03` Dimas Wijaya) and **Team Mahakam** (`3 Early Warnings`: `SINGLE_STUDENT_CARRY` on `STU-05` Fajar Hidayat + `LAST_MINUTE_BURST` on `STU-05` & `STU-07` Bayu Kusuma).
  - Click **Student Self-Inspection View** on `STU-02` (Nadia Putri (Synthetic)) to demonstrate the **Pedagogical Transparency Guarantee**: students see the exact same cross-product evidence and weekly cadence as the lecturer.
- **1:30–2:25 — Lecturer-in-the-Loop Rubric Feedback & Rovo Teaching Assistant:**
  - Click **Draft Milestone Rubric Feedback (Forge LLM)** on **Team Garuda** (`@forge/llm` `claude-sonnet-5`), review the 4-criterion markdown draft (which explicitly states no numerical grade is assigned), and click **Approve & Publish to Milestone Record**.
  - Open **Rovo Chat (`SE Course Teaching Assistant`)** powered by `course-evidence-rubric` (`SKILL.md`) and ask: *"Which student teams have early-warning imbalance or inactivity this week?"*
- **2:25–2:55 — Teamwork Graph Schema & Runs-on-Atlassian Architecture:**
  - Show `src/twgClient.js` (`atlassianTeamMembers`, `atlassianUserAssignedJiraWorkItems`, `atlassianUserPullRequests`, `confluencePageContributors`) and `manifest.yml` (`Eligible for the Runs on Atlassian program` — zero external egress keeps student records 100% inside Atlassian Cloud).


---

## Devpost Copy-Paste Form Fields

### Built With
`atlassian-forge`, `jira`, `confluence`, `atlassian-teamwork-graph`, `rovo`, `atlassian-forge-llm`, `react`, `node.js`, `javascript`

### Challenges We Ran Into
- Synthesizing cross-product capstone evidence (Jira issues done, PRs merged, PR reviews given, Confluence page edits) into clear, non-punitive coaching signals while maintaining fallback behavior (`seeded-capstone-course`) when Teamwork Graph data is sparse on fresh demo sites.
- Designing strict lecturer-in-the-loop and student transparency guardrails so AI drafts rubric feedback (`@forge/llm` with deterministic fallback) only as an editable draft requiring explicit instructor approval before publishing.
- Keeping responsive UI Kit header bars, student badges, and draft feedback blocks cleanly wrapped across both Jira Project Pages and Confluence Global Pages.

### Accomplishments That We're Proud Of
- Built a unified Jira (`jira:projectPage`) + Confluence (`confluence:globalPage`) Capstone & Team Project Evidence Cockpit backed by Teamwork Graph signals, `@forge/kvs`, `@forge/llm`, `scheduledTrigger`, `rovo:skill`, and `rovo:agent`.
- Implemented **Transparent Student Self-Inspection View** alongside **Early Warning** detection and **Review & Approve Draft Feedback** workflows—verified via automated tests (`3/3` passing in `node --test`) and live Atlassian Cloud inspection.
- Maintained zero external egress (`Runs on Atlassian` eligible) so student project artifacts never leave the institution's Atlassian Cloud site.

### What We Learned
- Fair team assessment in Higher Ed engineering courses requires visibility into *how* students collaborate across Jira, code reviews, and Confluence docs—plus giving students transparent access to the exact evidence signals instructors see.
- Framing AI as a coaching & rubric-drafting assistant rather than an automated grader aligns with academic governance while saving lecturers significant review time.

### Testing Instructions for Judges
1. Install the app on your Jira / Confluence Cloud test site using the Installation Link provided on this Devpost submission (or deploy via `forge deploy` and `forge install`).
2. In Jira, open any project and navigate to **Team Project Evidence Cockpit** in the project sidebar (or open **Team Project Evidence Cockpit** under Confluence Apps).
3. Inspect the course header (`TWG Mode`), per-team **Early Warning(s)** banners, and per-member cross-product contribution breakdown (`Jira Done`, `PRs Merged`, `PR Reviews`, `Confluence Edits`).
4. Click **Student Self-Inspection View** on any team member to verify the pedagogical transparency panel (`Weekly Active Cadence`), then click **Draft Milestone Rubric Feedback (Forge LLM)** and review the human-in-the-loop approval flow before publishing.

### Project Links & Distribution (`antonprafanto`)
- **GitHub Repository URL:** `https://github.com/antonprafanto/team-project-evidence`
- **Privacy Policy URL:** `https://github.com/antonprafanto/team-project-evidence/blob/main/PRIVACY.md`
- **Support Contact Email:** `anton.prafanto@gmail.com`
- **Atlassian Forge App ID:** `50f92c1f-44d9-405c-ac90-148887e3ac53`
- **Public Installation Link (`Sharing with anyone`, Jira + Confluence):**
  `https://developer.atlassian.com/console/install/50f92c1f-44d9-405c-ac90-148887e3ac53?signature=AYABeE7kvOKsA8Ig2ygIsmIiuKYAAAADAAdhd3Mta21zAEthcm46YXdzOmttczp1cy13ZXN0LTI6NzA5NTg3ODM1MjQzOmtleS83MDVlZDY3MC1mNTdjLTQxYjUtOWY5Yi1lM2YyZGNjMTQ2ZTcAuAECAQB4CxqLTo9l4lqXuFjNim1xJM%2Bp%2F3TVP9xHS2BrU5DRRucBdBiMK58QGUJaZTwJkA9ImgAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDM7XLDZRGP5XjKaAZgIBEIA7oyE1tTVlGHMTr7DDhQ5MkzCgD%2BqN%2Br7tiNx1B77n4tVPlvjN6KFjERxsEdUlYAKpNykoUjdQg%2FUHfhQAB2F3cy1rbXMAS2Fybjphd3M6a21zOmV1LXdlc3QtMTo3MDk1ODc4MzUyNDM6a2V5LzQ2MzBjZTZiLTAwYzMtNGRlMi04NzdiLTYyN2UyMDYwZTVjYwC4AQICAHi9bVMAkme4qVQX1fQHo6ePw3H40A7cGfz7yrmSfBWMXgE4IYKx0VXbECvbBF1jlK6NAAAAfjB8BgkqhkiG9w0BBwagbzBtAgEAMGgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQME0%2BELeO24lUWaR%2FEAgEQgDu9fcwVl46skfrzn%2BQ5my1LIdxdCAUh5uAvbP37YGvHudrbCyYbi8ArKuOoh9Ai1CiogLduW6sY0pYbfQAHYXdzLWttcwBLYXJuOmF3czprbXM6dXMtZWFzdC0xOjcwOTU4NzgzNTI0MzprZXkvNmMxMjBiYTAtNGNkNS00OTg1LWI4MmUtNDBhMDQ5NTJjYzU3ALgBAgIAeDYASx0XCjkny4iLV6vz%2BKtEGSGT6kdt0QRpkn6D%2FlVEAYnAPNBWcSqT1LbrQyqiBl0AAAB%2BMHwGCSqGSIb3DQEHBqBvMG0CAQAwaAYJKoZIhvcNAQcBMB4GCWCGSAFlAwQBLjARBAwa292uTvVoW2rA84wCARCAO%2BcsnyNDjXwYU6A9jYXJ%2FsPlRRIE94DaPcJBcHQbWSK5fhyLRy49Ke%2Fe8l%2BVRVBYreEgXhFcaXfSLd4EAgAAAAAMAAAQAAAAAAAAAAAAAAAAAEblX2HXpB0MxIxpuY%2FZa67%2F%2F%2F%2F%2FAAAAAQAAAAAAAAAAAAAAAQAAADI5nw3%2BJ5Cg0I%2BAxQnsWr%2Be7MAA4NJgBBcNxv7W6Zo7MeRrA0Hh%2FVP0Sp%2FTSG328hTOvqtl2A8rkAeqJuTcXKvNeTM%3D&product=jira&product=confluence`

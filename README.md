# Team Project Evidence & Rubric Assistant for Jira & Confluence

**Cross-product Teamwork Graph contribution evidence, early-warning snapshots, and lecturer-approved rubric feedback for university software-engineering courses.**

Built for **Atlassian Codegeist 2026**:
- **Primary Category:** Apps for Specialized Industries (Higher Education — Software Engineering & Capstone Supervision) (`$15,000 / $8,000 / $5,000`)
- **Bonus Prizes Targeted:**
  1. **Best App with Teamwork Graph Integration (`$1,500`)** — Queries cross-product artifacts across Jira work items, review comments, linked pull requests, and Confluence architecture specifications (`atlassianTeamMembers`, `atlassianUserAssignedJiraWorkItems`, `atlassianUserPullRequests`, `jiraWorkItemComments`, `confluencePageContributors`).
  2. **Best Rovo Agent & Skill (`$1,500`)** — Ships **SE Course Teaching Assistant** (`teaching-assistant-agent`) and the `course-evidence-rubric` Rovo Skill (`skills/course-evidence-rubric/SKILL.md`).
  3. **Runs on Atlassian Eligible (`llm` module, Zero Egress)** — Verified `Eligible for the Runs on Atlassian program` via `forge eligibility` using Forge LLMs (`@forge/llm`, `claude-sonnet-5`) and `@forge/kvs` with zero external data egress.

---

## Pedagogical Design Rules (Non-Negotiable)
1. **Student Transparency (`get-student-evidence`):** Students see the exact same Teamwork Graph contribution summary as lecturers.
2. **Activity != Quality (No Auto-Grading):** The app never assigns numerical grades and explicitly credits non-code engineering contributions such as Confluence architecture specifications and peer PR reviews.
3. **Lecturer Approval Gate (`post-approved-feedback`):** Rubric feedback is drafted via `draft-rubric-feedback` and published only after explicit lecturer review and click-to-approve.

---

## Repository Layout

```text
team-project-evidence/
├── manifest.yml                                    # Forge manifest (jira:projectPage, confluence:globalPage, rovo:skill, rovo:agent, llm)
├── package.json
├── src/
│   ├── index.js                                    # UI resolver, weekly snapshot trigger, and 4 Rovo action handlers
│   ├── twgClient.js                                # Official Teamwork Graph GraphQL queries + early-warning detector + @forge/llm synthesis
│   ├── courseData.js                               # IF-304 Software Engineering Capstone rubric & seeded multi-team dataset
│   └── frontend/
│       └── course-cockpit.jsx                      # Native UI Kit Course Evidence & Rubric Cockpit (Jira & Confluence)
├── skills/
│   └── course-evidence-rubric/                     # Bundled Rovo Skill (rovo:skill)
│       ├── SKILL.md
│       └── references/
│           └── rubric-guide.md
└── test/
    ├── app.test.js                                 # Automated unit & pedagogical guardrail tests
    └── validate-manifest.js                        # Manifest & Rovo Skill validator
```

---

## Quick Test & Deployment Guide

### 1. Run Local Unit & Manifest Validation Tests
```bash
cd team-project-evidence
npm test
npm run lint:manifest
```

### 2. Deploy to Your Atlassian Forge Site
```bash
npm install -g @forge/cli@latest
forge login
forge register
forge deploy -e production
forge install --upgrade
```

### 3. Testing Instructions for Judges
1. **Jira Project View:** Open any Jira project (e.g. `https://one-atlas-rrth.atlassian.net/jira/software/c/projects/PLAT/boards`) and click **Course Evidence & Rubric Cockpit** in the project sidebar.
2. **Confluence Global View:** Open Confluence (`https://one-atlas-rrth.atlassian.net/wiki/apps/50f92c1f-44d9-405c-ac90-148887e3ac53/d4fd7686-8f85-4716-ac77-94985fc928fa/course-evidence-cockpit`) to inspect the same cross-product cockpit inside Confluence.
3. Click **Student Self-Inspection View** next to any student (e.g. `STU-02` Siti Rahma) to verify how non-code Confluence architecture specs and PR reviews are credited transparently.
4. Click **Draft Milestone Rubric Feedback (Forge LLM)** on **Team Garuda** or **Team Mahakam**, inspect the rubric-aligned draft, and click **Approve & Publish to Milestone Record**.
5. Open **Rovo Chat** and select **SE Course Teaching Assistant** to ask: *"Which student teams have early-warning imbalance or inactivity this week?"*

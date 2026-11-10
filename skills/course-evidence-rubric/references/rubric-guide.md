# IF-304 Software Engineering Capstone — Rubric & Teamwork Graph Evidence Guide

## 1. Course Rubric Dimensions (4 × 25% Weight)

1. **Problem Framing & Requirements (`RUBRIC-1`, 25%)**
   - **Teamwork Graph Evidence:** `atlassianUserAssignedJiraWorkItems` + `jiraWorkItemComments`.
   - **What to Look For:** Clear user stories, acceptance criteria, and active backlog grooming discussions across multiple team members.

2. **System Architecture & API Specification (`RUBRIC-2`, 25%)**
   - **Teamwork Graph Evidence:** `confluencePageContributors`.
   - **What to Look For:** Up-to-date Confluence architecture pages, sequence diagrams, and API contract tables.
   - **Pedagogical Note:** Students who lead Confluence specification authoring and peer PR reviews (`confluenceEdits >= 6`) provide critical software-engineering value and must never be flagged as inactive based solely on Git commit counts.

3. **Implementation & Code Review Hygiene (`RUBRIC-3`, 25%)**
   - **Teamwork Graph Evidence:** `atlassianUserPullRequests(roles: [AUTHOR, REVIEWER])`.
   - **What to Look For:** Incremental pull requests linked to Jira issues and substantive peer reviews rather than unreviewed direct pushes.

4. **Team Collaboration & Cadence (`RUBRIC-4`, 25%)**
   - **Teamwork Graph Evidence:** Weekly cross-product activity distribution (`weeklyActiveDays`) across Jira, PRs, and Confluence.
   - **Early-Warning Signals:**
     - `INACTIVE_MEMBER` (`high`): `>= 10` days since last recorded cross-product artifact or `<= 3` weighted units.
     - `SINGLE_STUDENT_CARRY` (`medium`): One student accounts for `>= 60%` of weighted cross-product artifacts in a team of `>= 3`.
     - `LAST_MINUTE_BURST` (`medium`): `<= 3` active days across early sprint weeks followed by `>= 4` active days concentrated in the final week.

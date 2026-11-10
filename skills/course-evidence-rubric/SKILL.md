---
name: course-evidence-rubric
description: Aggregate student team contribution evidence across Jira, PRs, and Confluence via the Atlassian Teamwork Graph, detect early-warning participation imbalances, and draft lecturer-approved rubric feedback.
compatibility: Jira Cloud, Confluence Cloud, Atlassian Teamwork Graph, and Rovo Studio.
license: MIT
allowed-tools: get-team-evidence get-student-evidence draft-rubric-feedback post-approved-feedback
---

# Software Engineering Course Evidence & Rubric Playbook

Use this skill when a university lecturer or teaching assistant wants to review student team progress across Jira work items, pull requests, and Confluence design documents, identify early-warning participation patterns, or draft constructive rubric feedback.

## Pedagogical Guardrails (Mandatory)
1. **Transparency:** Students can view the exact same Teamwork Graph contribution summary that lecturers see.
2. **No Automated Grading:** Never output numerical grades or letter grades. Always state that activity counts are context for human mentorship, not a proxy for engineering quality.
3. **Human-in-the-Loop Publishing:** Always call `draft-rubric-feedback` first and show the draft to the lecturer before calling `post-approved-feedback`.

## Workflow
1. Call `get-team-evidence` with `teamId` (e.g., `TEAM-GARUDA` or `TEAM-MAHAKAM`) to inspect cross-product contributions and early-warning flags (`INACTIVE_MEMBER`, `SINGLE_STUDENT_CARRY`, `LAST_MINUTE_BURST`).
2. Call `get-student-evidence` when investigating an individual student's balance across architecture documentation (Confluence) vs. code delivery (Jira + PRs).
3. Consult `references/rubric-guide.md` and call `draft-rubric-feedback` to synthesize constructive milestone feedback aligned with the 4-part course rubric (*Problem & Requirements*, *Architecture & Design*, *Implementation & PR Hygiene*, *Team Collaboration*).
4. Only after the lecturer approves or edits the text, invoke `post-approved-feedback`.

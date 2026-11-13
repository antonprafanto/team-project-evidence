# Privacy Policy — Team Project Evidence Cockpit

**Last updated:** 2026-11-13  
**Atlassian Forge App ID:** `50f92c1f-44d9-405c-ac90-148887e3ac53`  
**Support Contact:** Anton Prafanto (`anton.prafanto@gmail.com`)

## 1. Architecture & Data Residency (`Runs on Atlassian`)
`Team Project Evidence Cockpit` is built on the Atlassian Forge platform for Jira and Confluence with **zero external egress**:
- App logic executes exclusively on Atlassian-managed Forge compute.
- Course overview data, team milestone evidence snapshots, approved rubric feedback drafts, and student self-inspection views are stored within Atlassian-hosted Forge Key-Value Storage (`@forge/kvs`) inside your Atlassian tenant boundary.
- Milestone rubric feedback drafting uses Atlassian-hosted Forge LLM (`@forge/llm`) with a deterministic rubric synthesizer fallback, and requires explicit lecturer review/approval before publication.
- No student, lecturer, Jira, Bitbucket, or Confluence data is transmitted to external servers, third-party analytics services, or external AI endpoints.

## 2. Personal Data & Pedagogical Transparency
- **Does this app store personal data outside Atlassian?** No.
- Evidence signals stay inside the institution's Atlassian Cloud site and include a student self-inspection view so students can verify the exact cross-product artifacts used in milestone coaching.

## 3. Data Retention & Deletion
- Course staff control which milestones are drafted and published via human-in-the-loop approval.
- Uninstalling the app from your Atlassian Cloud site immediately revokes tenant access, and Forge-hosted storage is governed by Atlassian's Forge app data lifecycle policies.

## 4. Contact
For privacy questions, support, or deletion requests, email: `anton.prafanto@gmail.com`.

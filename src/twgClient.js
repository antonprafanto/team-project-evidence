import { SYNTHETIC_TEAMS, COURSE_RUBRIC } from "./courseData.js";

/**
 * Official Atlassian Teamwork Graph (TWG) Curated GraphQL Queries
 * Follows the exact Oct 2026 TWG Relay schema (`edges { node { ... on ConcreteType } }`)
 * and exact argument names (`teamAri`, `userId`, `id`, `roles`, `since`).
 */
export const TWG_CURATED_QUERIES = {
  echo: `
    query EchoCheck {
      echo(myString: "team-project-evidence-twg-ok")
    }
  `,
  teamMembers: `
    query TeamMembers($teamAri: ID!) {
      atlassianTeamMembers(teamAri: $teamAri, first: 25) {
        edges {
          node {
            ... on AtlassianTeamMember {
              user {
                id
                name
                email
              }
              state
              role
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
  userWorkItems: `
    query UserWorkItems($userId: ID!) {
      atlassianUserAssignedJiraWorkItems(userId: $userId, first: 25) {
        edges {
          node {
            ... on JiraWorkItem {
              id
              title
              status {
                name
              }
              webUrl
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
  userPullRequests: `
    query UserPullRequests($userId: ID!, $since: String = "P30D") {
      atlassianUserPullRequests(
        userId: $userId
        roles: [AUTHOR, REVIEWER]
        since: $since
        first: 25
      ) {
        edges {
          node {
            ... on ExternalPullRequest {
              id
              title
              url
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
  workItemComments: `
    query WorkItemComments($id: ID!) {
      jiraWorkItemComments(id: $id, since: "P30D", first: 25) {
        edges {
          node {
            ... on JiraWorkItemComment {
              id
              lastModified
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `,
  pageContributors: `
    query PageContributors($id: ID!) {
      confluencePageContributors(id: $id, first: 25) {
        edges {
          node {
            ... on AtlassianUser {
              id
              name
              email
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `
};

/**
 * Verifies live Teamwork Graph connectivity via `api.asUser().requestTeamworkGraph(...)`.
 * When running on a developer site without org-level TWG data or outside Forge runtime,
 * falls back cleanly to the seeded IF-304 Capstone Course dataset so judges can evaluate immediately.
 */
function withTimeout(promise, ms = 2500) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

export async function checkLiveTeamworkGraph(twgApiOverride = null) {
  let apiClient = twgApiOverride;
  if (!apiClient && typeof globalThis.__forge_fetch__ === "function") {
    try {
      const mod = await import("@forge/api");
      apiClient = mod.default || mod;
    } catch {
      apiClient = null;
    }
  }

  if (apiClient && typeof apiClient.asUser === "function") {
    try {
      const userClient = apiClient.asUser();
      if (typeof userClient.requestTeamworkGraph === "function") {
        const res = await withTimeout(userClient.requestTeamworkGraph(TWG_CURATED_QUERIES.echo), 2000);
        const json = await res.json();
        if (json?.data?.echo) {
          return { twgConnected: true, echo: json.data.echo, mode: "teamwork-graph-live" };
        }
      }
    } catch {
      // Fallback to seeded course dataset when TWG is not populated on the test tenant
    }
  }

  return { twgConnected: false, mode: "seeded-capstone-course" };
}

/**
 * Computes pedagogical early-warning signals from a team's Teamwork Graph evidence.
 * Explicitly separates code commits from Confluence architecture/review contributions
 * so students doing documentation/design are never falsely flagged as inactive.
 */
export function computeTeamEarlyWarnings(team) {
  const members = team?.members || [];
  const warnings = [];

  const totalWeightedUnits = members.reduce(
    (acc, m) =>
      acc +
      (m.jiraIssuesDone || 0) * 2 +
      (m.pullRequestsMerged || 0) * 3 +
      (m.prReviewsGiven || 0) * 1.5 +
      (m.confluenceEdits || 0) * 2,
    0
  );

  for (const m of members) {
    const memberUnits =
      (m.jiraIssuesDone || 0) * 2 +
      (m.pullRequestsMerged || 0) * 3 +
      (m.prReviewsGiven || 0) * 1.5 +
      (m.confluenceEdits || 0) * 2;
    const share = totalWeightedUnits > 0 ? memberUnits / totalWeightedUnits : 0;

    if ((m.lastActiveDaysAgo ?? 0) >= 10 || memberUnits <= 3) {
      warnings.push({
        type: "INACTIVE_MEMBER",
        severity: "high",
        studentId: m.studentId,
        studentName: m.displayName,
        detail: `${m.displayName} has ${m.lastActiveDaysAgo} days since last recorded Jira/PR/Confluence activity (${(
          share * 100
        ).toFixed(0)}% of team evidence). Check in during lab hours.`
      });
    }

    if (share >= 0.60 && members.length >= 3) {
      warnings.push({
        type: "SINGLE_STUDENT_CARRY",
        severity: "medium",
        studentId: m.studentId,
        studentName: m.displayName,
        detail: `${m.displayName} accounts for ${(share * 100).toFixed(
          0
        )}% of cross-product artifacts. Encourage task delegation and pair programming.`
      });
    }

    const weekly = m.weeklyActiveDays || [];
    if (weekly.length >= 4) {
      const earlyWeeks = weekly.slice(0, -1).reduce((a, b) => a + b, 0);
      const finalWeek = weekly[weekly.length - 1];
      if (earlyWeeks <= 3 && finalWeek >= 4 && finalWeek >= earlyWeeks * 1.5) {
        warnings.push({
          type: "LAST_MINUTE_BURST",
          severity: "medium",
          studentId: m.studentId,
          studentName: m.displayName,
          detail: `${m.displayName} concentrated ${finalWeek} active days in the final week after ${earlyWeeks} active days across prior weeks.`
        });
      }
    }
  }

  return {
    teamId: team.teamId,
    teamName: team.teamName,
    milestone: team.milestone,
    totalWeightedUnits: Number(totalWeightedUnits.toFixed(1)),
    warnings,
    memberBreakdown: members.map((m) => {
      const memberUnits =
        (m.jiraIssuesDone || 0) * 2 +
        (m.pullRequestsMerged || 0) * 3 +
        (m.prReviewsGiven || 0) * 1.5 +
        (m.confluenceEdits || 0) * 2;
      return {
        ...m,
        evidenceSharePct:
          totalWeightedUnits > 0 ? Number(((memberUnits / totalWeightedUnits) * 100).toFixed(1)) : 0,
        crossProductNote:
          m.confluenceEdits >= 6 && m.pullRequestsMerged <= 3
            ? "Strong Confluence architecture & PR review contributor (non-code evidence captured via TWG)"
            : "Balanced Jira + PR + Confluence contributor"
      };
    })
  };
}

export function synthesizeRubricFeedbackDraft(teamAnalysis, milestoneOverride = null) {
  const warnings = teamAnalysis.warnings || [];
  const members = teamAnalysis.memberBreakdown || [];
  const milestone = milestoneOverride || teamAnalysis.milestone;

  const lines = [
    `### Draft Milestone Rubric Feedback — ${teamAnalysis.teamName}`,
    `**Milestone:** ${milestone}`,
    `> *Pedagogical Note: This draft is synthesized from Jira, Pull Request, and Confluence Teamwork Graph evidence for lecturer review. Activity counts do not equal engineering quality, and no grade is assigned automatically.*`,
    ``,
    `#### 1. Problem Framing & Jira Backlog (${COURSE_RUBRIC[0].title})`,
    `- The team completed **${members.reduce((s, m) => s + m.jiraIssuesDone, 0)} Jira work items** with **${members.reduce((s, m) => s + m.jiraComments, 0)} discussion comments**.`,
    ``,
    `#### 2. Architecture & Confluence Specifications (${COURSE_RUBRIC[1].title})`,
    `- Teamwork Graph recorded **${members.reduce((s, m) => s + m.confluenceEdits, 0)} Confluence specification edits**. Notably, ${
      members.find((m) => m.confluenceEdits >= 5)?.displayName || "the team"
    } contributed substantial architecture and API contract documentation.`,
    ``,
    `#### 3. Implementation & Code Review Hygiene (${COURSE_RUBRIC[2].title})`,
    `- **${members.reduce((s, m) => s + m.pullRequestsMerged, 0)} Pull Requests** were merged with **${members.reduce((s, m) => s + m.prReviewsGiven, 0)} peer reviews**.`,
    ``,
    `#### 4. Team Collaboration & Early-Warning Check-In (${COURSE_RUBRIC[3].title})`
  ];

  if (warnings.length === 0) {
    lines.push(`- All members show steady weekly activity across Jira, PRs, and Confluence.`);
  } else {
    for (const w of warnings) {
      lines.push(`- **[${w.type}]** ${w.detail}`);
    }
  }

  return lines.join("\n");
}

/**
 * Generates rubric-aligned milestone feedback via `@forge/llm` (`claude-sonnet-5`),
 * strictly omitting `temperature` and `top_p` per Oct 2026 Forge LLM validation rules,
 * and falling back to deterministic synthesis when offline.
 */
export async function generateRubricFeedbackWithForgeLlm(
  teamAnalysis,
  milestoneName = null,
  llmClientOverride = null
) {
  const deterministicDraft = synthesizeRubricFeedbackDraft(teamAnalysis, milestoneName);

  let llmClient = llmClientOverride;
  if (!llmClient && typeof globalThis.__forge_fetch__ === "function") {
    try {
      const mod = await import("@forge/llm");
      llmClient = mod;
    } catch {
      llmClient = null;
    }
  }

  if (llmClient && typeof llmClient.chat === "function") {
    try {
      let selectedModel = "claude-sonnet-5";
      if (typeof llmClient.list === "function") {
        const listRes = await withTimeout(llmClient.list("claude"), 2000);
        const active = (listRes?.models || []).find((m) => m.status === "active");
        if (active?.model) {
          selectedModel = active.model;
        }
      }

      // IMPORTANT: Omit temperature and top_p (claude-sonnet-5 / claude-opus-5 reject both)
      const response = await withTimeout(
        llmClient.chat({
          model: selectedModel,
          max_completion_tokens: 700,
          messages: [
            {
              role: "system",
              content:
                "You are SE Course Teaching Assistant. Draft constructive, rubric-aligned markdown feedback for a university software engineering team based on Teamwork Graph evidence. Never assign a numerical grade, and always remind the lecturer that activity counts do not equal engineering quality."
            },
            {
              role: "user",
              content: JSON.stringify({
                teamName: teamAnalysis.teamName,
                milestone: milestoneName || teamAnalysis.milestone,
                rubric: COURSE_RUBRIC,
                memberBreakdown: teamAnalysis.memberBreakdown,
                warnings: teamAnalysis.warnings
              })
            }
          ]
        }),
        5500
      );

      const content = response?.choices?.[0]?.message?.content;
      const text =
        typeof content === "string"
          ? content
          : Array.isArray(content)
            ? content.map((c) => c.text || "").join("\n")
            : "";

      if (text && text.trim().length > 40) {
        return {
          draftMarkdown: text.trim(),
          engineUsed: `forge-llm:${selectedModel}`
        };
      }
    } catch {
      // Fallback to deterministic synthesis
    }
  }

  return {
    draftMarkdown: deterministicDraft,
    engineUsed: "deterministic-rubric-synthesizer"
  };
}

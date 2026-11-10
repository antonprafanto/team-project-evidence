/**
 * Synthetic Software Engineering Course Dataset (IF-304 Rekayasa Perangkat Lunak)
 * Strictly synthetic student names and artifacts for privacy-safe judge testing.
 * Mirrors the exact shape returned by the Atlassian Teamwork Graph curated queries:
 * - atlassianTeamMembers
 * - atlassianUserAssignedJiraWorkItems
 * - jiraWorkItemComments
 * - atlassianUserPullRequests
 * - confluencePageContributors
 */

export const COURSE_RUBRIC = [
  {
    criterionId: "R1",
    title: "1. Problem Framing & User Stories (Jira Backlog)",
    description: "Clear acceptance criteria, well-scoped sprint stories, and traceability from user problem to tasks."
  },
  {
    criterionId: "R2",
    title: "2. Architecture & API Contract (Confluence Specs)",
    description: "Up-to-date data model, sequence/component diagrams, and documented error handling in Confluence."
  },
  {
    criterionId: "R3",
    title: "3. Implementation & Code Review Hygiene (Linked PRs)",
    description: "Incremental pull requests linked to Jira issues with constructive peer review comments."
  },
  {
    criterionId: "R4",
    title: "4. Balanced Team Cadence (Teamwork Graph)",
    description: "Steady weekly contributions across all members rather than single-student carry or deadline-eve spikes."
  }
];

export const SYNTHETIC_TEAMS = [
  {
    teamId: "TEAM-GARUDA",
    teamName: "Team Garuda — Smart Campus Shuttle Tracker",
    projectKey: "GAR",
    confluenceSpace: "GARUDA",
    milestone: "Sprint 2: Architecture & API Prototype",
    members: [
      {
        studentId: "STU-01",
        displayName: "Raka Pratama (Synthetic)",
        role: "Backend & API",
        jiraIssuesDone: 8,
        jiraComments: 14,
        pullRequestsMerged: 7,
        prReviewsGiven: 6,
        confluenceEdits: 2,
        weeklyActiveDays: [4, 5, 5, 4],
        lastActiveDaysAgo: 1,
        recentArtifacts: ["GAR-12: GTFS realtime WebSocket consumer", "PR #19: Add Redis geo-index cache"]
      },
      {
        studentId: "STU-02",
        displayName: "Nadia Putri (Synthetic)",
        role: "System Architect & Docs",
        jiraIssuesDone: 3,
        jiraComments: 19,
        pullRequestsMerged: 2,
        prReviewsGiven: 9,
        confluenceEdits: 11,
        weeklyActiveDays: [3, 4, 4, 4],
        lastActiveDaysAgo: 1,
        recentArtifacts: ["Confluence: Shuttle API v2 Contract & Sequence Diagram", "GAR-08: Auth token rotation spec"]
      },
      {
        studentId: "STU-03",
        displayName: "Dimas Wijaya (Synthetic)",
        role: "Mobile UI",
        jiraIssuesDone: 1,
        jiraComments: 1,
        pullRequestsMerged: 0,
        prReviewsGiven: 0,
        confluenceEdits: 0,
        weeklyActiveDays: [2, 1, 0, 0],
        lastActiveDaysAgo: 13,
        recentArtifacts: ["GAR-04: Initial login wireframe"]
      },
      {
        studentId: "STU-04",
        displayName: "Sinta Maharani (Synthetic)",
        role: "QA & Integration",
        jiraIssuesDone: 5,
        jiraComments: 11,
        pullRequestsMerged: 4,
        prReviewsGiven: 5,
        confluenceEdits: 5,
        weeklyActiveDays: [3, 3, 4, 3],
        lastActiveDaysAgo: 2,
        recentArtifacts: ["GAR-15: Playwright E2E route test suite", "Confluence: Test Plan & Edge Cases"]
      }
    ]
  },
  {
    teamId: "TEAM-MAHAKAM",
    teamName: "Team Mahakam — River Water Quality IoT Dashboard",
    projectKey: "MHK",
    confluenceSpace: "MAHAKAM",
    milestone: "Sprint 2: Architecture & API Prototype",
    members: [
      {
        studentId: "STU-05",
        displayName: "Fajar Hidayat (Synthetic)",
        role: "Full-Stack Lead",
        jiraIssuesDone: 11,
        jiraComments: 8,
        pullRequestsMerged: 10,
        prReviewsGiven: 1,
        confluenceEdits: 6,
        weeklyActiveDays: [1, 1, 1, 6],
        lastActiveDaysAgo: 0,
        recentArtifacts: ["MHK-21: MQTT broker ingestion + chart UI", "PR #14: 2,400-line deadline-eve commit"]
      },
      {
        studentId: "STU-06",
        displayName: "Aulia Rahma (Synthetic)",
        role: "IoT Firmware",
        jiraIssuesDone: 2,
        jiraComments: 4,
        pullRequestsMerged: 1,
        prReviewsGiven: 2,
        confluenceEdits: 2,
        weeklyActiveDays: [0, 1, 0, 3],
        lastActiveDaysAgo: 1,
        recentArtifacts: ["MHK-09: ESP32 turbidity sensor calibration"]
      },
      {
        studentId: "STU-07",
        displayName: "Bayu Kusuma (Synthetic)",
        role: "Data & Database",
        jiraIssuesDone: 2,
        jiraComments: 3,
        pullRequestsMerged: 1,
        prReviewsGiven: 1,
        confluenceEdits: 3,
        weeklyActiveDays: [0, 0, 1, 4],
        lastActiveDaysAgo: 1,
        recentArtifacts: ["Confluence: TimescaleDB schema"]
      }
    ]
  }
];

import { COURSE_RUBRIC, SYNTHETIC_TEAMS } from "./courseData.js";
import {
  checkLiveTeamworkGraph,
  computeTeamEarlyWarnings,
  generateRubricFeedbackWithForgeLlm
} from "./twgClient.js";

const memoryStore = new Map();

function withTimeout(promise, ms = 2500) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("kvs-timeout")), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

async function getKvsAdapter() {
  let rawKvs = null;
  if (typeof globalThis.__forge_fetch__ === "function") {
    try {
      const mod = await import("@forge/kvs");
      rawKvs = mod.kvs || mod.default?.kvs || mod.default;
    } catch {
      rawKvs = null;
    }
  }
  const hasForgeRuntime = Boolean(rawKvs && typeof globalThis.__forge_fetch__ === "function");
  return {
    async get(key) {
      if (memoryStore.has(key)) {
        return memoryStore.get(key);
      }
      if (hasForgeRuntime) {
        try {
          const val = await withTimeout(rawKvs.get(key), 2500);
          if (val !== undefined) {
            memoryStore.set(key, val);
          }
          return val;
        } catch {
          return memoryStore.get(key);
        }
      }
      return memoryStore.get(key);
    },
    async set(key, value) {
      memoryStore.set(key, value);
      if (hasForgeRuntime) {
        try {
          await withTimeout(rawKvs.set(key, value), 2500);
        } catch {
          // Fallback to in-memory store
        }
      }
    }
  };
}

function findTeam(teamId = "TEAM-GARUDA") {
  const id = String(teamId || "TEAM-GARUDA").toUpperCase();
  return SYNTHETIC_TEAMS.find((t) => t.teamId === id) || SYNTHETIC_TEAMS[0];
}

export async function actGetTeamEvidence(payload = {}) {
  const team = findTeam(payload.teamId);
  const analysis = computeTeamEarlyWarnings(team);
  const [kvs, twgStatus] = await Promise.all([
    getKvsAdapter(),
    payload.twgStatusOverride
      ? Promise.resolve(payload.twgStatusOverride)
      : checkLiveTeamworkGraph(payload.twgApiOverride)
  ]);
  const approvedFeedback = (await kvs.get(`feedback:${team.teamId}`)) || null;

  return {
    ...analysis,
    twgMode: twgStatus.mode,
    twgConnected: twgStatus.twgConnected,
    approvedFeedback
  };
}

export async function actGetStudentEvidence(payload = {}) {
  const studentId = String(payload.studentId || "STU-02").toUpperCase();
  for (const team of SYNTHETIC_TEAMS) {
    const analysis = computeTeamEarlyWarnings(team);
    const member = analysis.memberBreakdown.find((m) => m.studentId === studentId);
    if (member) {
      return {
        studentId: member.studentId,
        displayName: member.displayName,
        teamId: team.teamId,
        teamName: team.teamName,
        role: member.role,
        evidenceSharePct: member.evidenceSharePct,
        crossProductNote: member.crossProductNote,
        jiraIssuesDone: member.jiraIssuesDone,
        jiraComments: member.jiraComments,
        pullRequestsMerged: member.pullRequestsMerged,
        prReviewsGiven: member.prReviewsGiven,
        confluenceEdits: member.confluenceEdits,
        weeklyActiveDays: member.weeklyActiveDays,
        recentArtifacts: member.recentArtifacts,
        transparencyNotice:
          "This student view is identical to the evidence summary shown to the course lecturer. Activity counts provide context and do not determine your grade."
      };
    }
  }
  throw new Error(`Student ${studentId} not found`);
}

export async function actDraftRubricFeedback(payload = {}) {
  const team = findTeam(payload.teamId);
  const analysis = computeTeamEarlyWarnings(team);
  const llmResult = await generateRubricFeedbackWithForgeLlm(
    analysis,
    payload.milestoneName || team.milestone,
    payload.llmClient
  );
  return {
    teamId: team.teamId,
    teamName: team.teamName,
    milestone: payload.milestoneName || team.milestone,
    requiresLecturerApproval: true,
    engineUsed: llmResult.engineUsed,
    draftMarkdown: llmResult.draftMarkdown
  };
}

export async function actPostApprovedFeedback(payload = {}) {
  const team = findTeam(payload.teamId);
  const record = {
    teamId: team.teamId,
    approvedFeedbackMarkdown: String(payload.approvedFeedbackMarkdown || "").trim(),
    approvedByLecturer: true,
    publishedAt: new Date().toISOString()
  };
  const kvs = await getKvsAdapter();
  await kvs.set(`feedback:${team.teamId}`, record);
  return {
    posted: true,
    ...record
  };
}

export async function snapshotHandler() {
  const snapshots = SYNTHETIC_TEAMS.map((t) => computeTeamEarlyWarnings(t));
  const kvs = await getKvsAdapter();
  await kvs.set("snapshot:latest", {
    capturedAt: new Date().toISOString(),
    snapshots
  });
  return {
    ok: true,
    snapshotCount: snapshots.length,
    totalWarnings: snapshots.reduce((s, item) => s + item.warnings.length, 0)
  };
}

export async function uiResolver(req) {
  const call = req?.call || {};
  const action = call.functionKey || req?.action || "getCourseOverview";
  const payload = call.payload || req?.payload || {};

  if (action === "getCourseOverview") {
    const twgStatus = await checkLiveTeamworkGraph();
    const teams = await Promise.all(
      SYNTHETIC_TEAMS.map((t) =>
        actGetTeamEvidence({ teamId: t.teamId, twgStatusOverride: twgStatus })
      )
    );
    return {
      courseTitle: "IF-304 Software Engineering Capstone (Jira + Confluence + Teamwork Graph)",
      twgMode: twgStatus.mode,
      twgConnected: twgStatus.twgConnected,
      rubric: COURSE_RUBRIC,
      teams
    };
  }
  if (action === "getStudentEvidence") {
    return await actGetStudentEvidence(payload);
  }
  if (action === "draftFeedback") {
    return await actDraftRubricFeedback(payload);
  }
  if (action === "approveFeedback") {
    return await actPostApprovedFeedback(payload);
  }
  return await actGetTeamEvidence(payload);
}

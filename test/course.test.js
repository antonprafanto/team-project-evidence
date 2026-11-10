import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  actGetTeamEvidence,
  actGetStudentEvidence,
  actDraftRubricFeedback,
  actPostApprovedFeedback,
  snapshotHandler,
  uiResolver
} from "../src/index.js";
import { TWG_CURATED_QUERIES, checkLiveTeamworkGraph } from "../src/twgClient.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");

test("1. Manifest declares Teamwork Graph scopes, Rovo Agent, Rovo Skill, Forge LLM, and valid handler paths", () => {
  const manifest = fs.readFileSync(path.join(APP_ROOT, "manifest.yml"), "utf8");
  assert.match(manifest, /read:graph:team:atlassian/);
  assert.match(manifest, /read:graph:project:jira/);
  assert.match(manifest, /read:graph:space:confluence/);
  assert.match(manifest, /read:graph:page:confluence/);
  assert.match(manifest, /read:graph:pull-request:external/);
  assert.match(manifest, /rovo:agent:/);
  assert.match(manifest, /rovo:skill:/);
  assert.match(manifest, /llm:/);
  assert.doesNotMatch(manifest, /handler:\s*src\//);
  assert.match(manifest, /handler:\s*index\.uiResolver/);

  // Verify exact Relay connection schema in TWG curated queries
  assert.match(TWG_CURATED_QUERIES.teamMembers, /atlassianTeamMembers\(teamAri: \$teamAri/);
  assert.match(TWG_CURATED_QUERIES.teamMembers, /edges\s*\{\s*node\s*\{\s*\.\.\. on AtlassianTeamMember/);
  assert.match(TWG_CURATED_QUERIES.pageContributors, /confluencePageContributors\(id: \$id/);
  assert.match(TWG_CURATED_QUERIES.userPullRequests, /atlassianUserPullRequests/);
});

test("2. Teamwork Graph evidence detects inactive members, single-student carry, and Confluence architects", async () => {
  const garuda = await actGetTeamEvidence({ teamId: "TEAM-GARUDA" });
  assert.ok(garuda.warnings.some((w) => w.type === "INACTIVE_MEMBER" && w.studentId === "STU-03"));

  // Nadia (STU-02) has 11 Confluence edits and 9 PR reviews -> recognized for non-code architecture work
  const nadia = await actGetStudentEvidence({ studentId: "STU-02" });
  assert.match(nadia.crossProductNote, /Confluence architecture/);
  assert.match(nadia.transparencyNotice, /Activity counts provide context/);

  const mahakam = await actGetTeamEvidence({ teamId: "TEAM-MAHAKAM" });
  assert.ok(mahakam.warnings.some((w) => w.type === "SINGLE_STUDENT_CARRY" && w.studentId === "STU-05"));
  assert.ok(mahakam.warnings.some((w) => w.type === "LAST_MINUTE_BURST" && w.studentId === "STU-05"));

  // Verify live TWG echo check with mock API
  const liveTwg = await checkLiveTeamworkGraph({
    asUser() {
      return {
        async requestTeamworkGraph() {
          return {
            async json() {
              return { data: { echo: "team-project-evidence-twg-ok" } };
            }
          };
        }
      };
    }
  });
  assert.equal(liveTwg.twgConnected, true);
  assert.equal(liveTwg.mode, "teamwork-graph-live");
});

test("3. Lecturer-in-the-loop rubric feedback drafting (Forge LLM + fallback) and KVS approval workflow", async () => {
  let capturedLlmPrompt = null;
  const mockLlmClient = {
    async list() {
      return { models: [{ model: "claude-sonnet-5", status: "active" }] };
    },
    async chat(prompt) {
      capturedLlmPrompt = prompt;
      return {
        choices: [
          {
            message: {
              content:
                "### Forge LLM Rubric Synthesis — Team Garuda\n> Activity counts do not equal engineering quality; no grade is assigned automatically.\n- Strong Confluence specification coverage by Nadia."
            }
          }
        ]
      };
    }
  };

  const llmDraft = await actDraftRubricFeedback({
    teamId: "TEAM-GARUDA",
    llmClient: mockLlmClient
  });
  assert.equal(capturedLlmPrompt.model, "claude-sonnet-5");
  assert.equal(capturedLlmPrompt.temperature, undefined);
  assert.equal(capturedLlmPrompt.top_p, undefined);
  assert.equal(llmDraft.engineUsed, "forge-llm:claude-sonnet-5");

  const draft = await actDraftRubricFeedback({ teamId: "TEAM-GARUDA" });
  assert.equal(draft.requiresLecturerApproval, true);
  assert.match(draft.draftMarkdown, /no grade is assigned automatically/);

  const approved = await actPostApprovedFeedback({
    teamId: "TEAM-GARUDA",
    approvedFeedbackMarkdown: draft.draftMarkdown
  });
  assert.equal(approved.posted, true);
  assert.equal(approved.approvedByLecturer, true);

  const snap = await snapshotHandler();
  assert.equal(snap.ok, true);
  assert.equal(snap.snapshotCount, 2);

  const overview = await uiResolver({ action: "getCourseOverview" });
  assert.equal(overview.teams.length, 2);
  assert.equal(overview.teams[0].approvedFeedback.approvedByLecturer, true);
});

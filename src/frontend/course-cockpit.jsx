import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Code,
  CodeBlock,
  Heading,
  Inline,
  Lozenge,
  SectionMessage,
  Stack,
  Text
} from "@forge/react";
import { invoke } from "@forge/bridge";

const CourseCockpitApp = () => {
  const [overview, setOverview] = useState(null);
  const [activeDraft, setActiveDraft] = useState(null);
  const [studentView, setStudentView] = useState(null);
  const [banner, setBanner] = useState("");

  const loadOverview = async () => {
    const data = await invoke("getCourseOverview", {});
    setOverview(data);
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleDraft = async (teamId) => {
    const draft = await invoke("draftFeedback", { teamId });
    setActiveDraft(draft);
  };

  const handleInspectStudent = async (studentId) => {
    const data = await invoke("getStudentEvidence", { studentId });
    setStudentView(data);
  };

  const handleApprove = async () => {
    if (!activeDraft) return;
    await invoke("approveFeedback", {
      teamId: activeDraft.teamId,
      approvedFeedbackMarkdown: activeDraft.draftMarkdown
    });
    setBanner(`Published lecturer-approved rubric feedback for ${activeDraft.teamName}.`);
    setActiveDraft(null);
    await loadOverview();
  };

  if (!overview) {
    return <Text>Loading Teamwork Graph Course Evidence Cockpit...</Text>;
  }

  return (
    <Stack space="space.300">
      <Stack space="space.100">
        <Heading size="large">{overview.courseTitle}</Heading>
        <Text>
          Cross-product Teamwork Graph evidence across Jira work items, linked Pull Requests, and
          Confluence specifications. Students see the exact same evidence view; no grades are
          assigned automatically.
        </Text>
      </Stack>

      {banner && (
        <SectionMessage appearance="confirmation" title="Lecturer Feedback Published">
          <Text>{banner}</Text>
        </SectionMessage>
      )}

      {(overview.teams || []).map((team) => (
        <Box key={team.teamId}>
          <Stack space="space.150">
            <Inline space="space.100" alignBlock="center" spread="space-between">
              <Heading size="medium">
                {team.teamName} — {team.milestone}
              </Heading>
              <Lozenge appearance={team.warnings.length > 0 ? "moved" : "success"}>
                {team.warnings.length} Early Warning(s)
              </Lozenge>
            </Inline>

            {(team.warnings || []).map((w, idx) => (
              <SectionMessage key={idx} appearance="warning" title={w.type}>
                <Text>{w.detail}</Text>
              </SectionMessage>
            ))}

            <Stack space="space.100">
              {(team.memberBreakdown || []).map((m) => (
                <Stack key={m.studentId} space="space.025">
                  <Inline space="space.100" alignBlock="center">
                    <Code>{m.studentId}</Code>
                    <Text>{m.displayName}</Text>
                    <Lozenge appearance="new">{m.role}</Lozenge>
                    <Badge>{m.evidenceSharePct}% share</Badge>
                    <Button appearance="subtle" onClick={() => handleInspectStudent(m.studentId)}>
                      Student Self-Inspection View
                    </Button>
                  </Inline>
                  <Text>
                    Jira Done: {m.jiraIssuesDone} | PRs Merged: {m.pullRequestsMerged} | PR Reviews:{" "}
                    {m.prReviewsGiven} | Confluence Edits: {m.confluenceEdits} — {m.crossProductNote}
                  </Text>
                </Stack>
              ))}
            </Stack>

            {team.approvedFeedback && (
              <SectionMessage
                appearance="confirmation"
                title={`Published Milestone Feedback (${team.approvedFeedback.publishedAt})`}
              >
                <Text>{team.approvedFeedback.approvedFeedbackMarkdown}</Text>
              </SectionMessage>
            )}

            <ButtonGroup>
              <Button appearance="primary" onClick={() => handleDraft(team.teamId)}>
                Draft Milestone Rubric Feedback (Forge LLM)
              </Button>
            </ButtonGroup>
          </Stack>
        </Box>
      ))}

      {studentView && (
        <Box>
          <Stack space="space.100">
            <Heading size="medium">
              Transparent Student Self-Inspection — {studentView.displayName} ({studentView.studentId})
            </Heading>
            <SectionMessage appearance="information" title="Pedagogical Transparency Guarantee">
              <Text>{studentView.transparencyNotice}</Text>
            </SectionMessage>
            <Text>
              Team: {studentView.teamName} | Role: {studentView.role} | Share:{" "}
              {studentView.evidenceSharePct}% — {studentView.crossProductNote}
            </Text>
            <Text>
              Weekly Active Cadence (Days/Week): {(studentView.weeklyActiveDays || []).join(" -> ")}
            </Text>
            <Button appearance="subtle" onClick={() => setStudentView(null)}>
              Close Student View
            </Button>
          </Stack>
        </Box>
      )}

      {activeDraft && (
        <Box>
          <Heading size="medium">Review & Approve Draft Feedback ({activeDraft.teamName})</Heading>
          <CodeBlock language="markdown" text={activeDraft.draftMarkdown} />
          <ButtonGroup>
            <Button appearance="primary" onClick={handleApprove}>
              Approve & Publish to Milestone Record
            </Button>
            <Button appearance="subtle" onClick={() => setActiveDraft(null)}>
              Cancel
            </Button>
          </ButtonGroup>
        </Box>
      )}
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <CourseCockpitApp />
  </React.StrictMode>
);

export default CourseCockpitApp;

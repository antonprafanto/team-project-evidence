import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Box,
  Button,
  ButtonGroup,
  Code,
  CodeBlock,
  Heading,
  Inline,
  Lozenge,
  ProgressBar,
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
  const [errorBanner, setErrorBanner] = useState("");
  const [busyAction, setBusyAction] = useState("Loading Teamwork Graph Course Evidence Cockpit...");

  const runAction = async (label, fn) => {
    setErrorBanner("");
    setBusyAction(label);
    try {
      return await fn();
    } catch (err) {
      setErrorBanner(String(err?.message || err));
      return null;
    } finally {
      setBusyAction("");
    }
  };

  const loadOverview = () =>
    runAction("Loading Teamwork Graph Course Evidence Cockpit...", async () => {
      const data = await invoke("getCourseOverview", {});
      setOverview(data);
    });

  useEffect(() => {
    loadOverview();
  }, []);

  const handleDraft = (teamId) =>
    runAction("Drafting rubric feedback (Forge LLM)...", async () => {
      const draft = await invoke("draftFeedback", { teamId });
      if (draft) {
        setActiveDraft(draft);
      }
    });

  const handleInspectStudent = (studentId) =>
    runAction("Loading student self-inspection view...", async () => {
      const data = await invoke("getStudentEvidence", { studentId });
      if (data) {
        setStudentView(data);
      }
    });

  const handleApprove = async () => {
    if (!activeDraft) return;
    await runAction("Publishing lecturer-approved milestone feedback...", async () => {
      await invoke("approveFeedback", {
        teamId: activeDraft.teamId,
        approvedFeedbackMarkdown: activeDraft.draftMarkdown
      });
      setBanner(`Published lecturer-approved rubric feedback for ${activeDraft.teamName}.`);
      setActiveDraft(null);
      const data = await invoke("getCourseOverview", {});
      setOverview(data);
    });
  };

  if (!overview) {
    return (
      <Stack space="space.150">
        {errorBanner ? (
          <SectionMessage appearance="error" title="Could not load Course Evidence Cockpit">
            <Text>{errorBanner}</Text>
            <Button appearance="primary" onClick={loadOverview}>
              Retry
            </Button>
          </SectionMessage>
        ) : (
          <Stack space="space.100">
            <Text>{busyAction || "Loading Teamwork Graph Course Evidence Cockpit..."}</Text>
            <ProgressBar isIndeterminate />
          </Stack>
        )}
      </Stack>
    );
  }

  return (
    <Stack space="space.300">
      <Stack space="space.100">
        <Inline space="space.100" rowSpace="space.075" alignBlock="center" spread="space-between" shouldWrap>
          <Heading size="large">{overview.courseTitle}</Heading>
          <Lozenge appearance={overview.twgConnected ? "success" : "inprogress"} maxWidth={360}>
            {overview.twgConnected ? "TWG Live" : "TWG Mode"}: {overview.twgMode || "seeded-capstone-course"}
          </Lozenge>
        </Inline>
        <Text>
          Cross-product Teamwork Graph evidence across Jira work items, linked Pull Requests, and
          Confluence specifications. Students see the exact same evidence view; no grades are
          assigned automatically.
        </Text>
      </Stack>

      {busyAction && (
        <Stack space="space.050">
          <Text>{busyAction}</Text>
          <ProgressBar isIndeterminate />
        </Stack>
      )}

      {errorBanner && (
        <SectionMessage appearance="error" title="Action Error">
          <Text>{errorBanner}</Text>
        </SectionMessage>
      )}

      {banner && (
        <SectionMessage appearance="confirmation" title="Lecturer Feedback Published">
          <Text>{banner}</Text>
        </SectionMessage>
      )}

      {(overview.teams || []).map((team) => (
        <Box key={team.teamId}>
          <Stack space="space.150">
            <Inline space="space.100" rowSpace="space.075" alignBlock="center" spread="space-between" shouldWrap>
              <Heading size="medium">
                {team.teamName} — {team.milestone}
              </Heading>
              <Lozenge appearance={team.warnings.length > 0 ? "moved" : "success"} maxWidth={260}>
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
                  <Inline space="space.100" rowSpace="space.075" alignBlock="center" shouldWrap>
                    <Code>{m.studentId}</Code>
                    <Text>{m.displayName}</Text>
                    <Lozenge appearance="new" maxWidth={280}>{m.role}</Lozenge>
                    <Lozenge appearance="default" maxWidth={200}>{`${m.evidenceSharePct}% share`}</Lozenge>
                    <Button
                      appearance="subtle"
                      isDisabled={Boolean(busyAction)}
                      onClick={() => handleInspectStudent(m.studentId)}
                    >
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
              <Button
                appearance="primary"
                isDisabled={Boolean(busyAction)}
                onClick={() => handleDraft(team.teamId)}
              >
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
          <Inline space="space.100" rowSpace="space.075" alignBlock="center" spread="space-between" shouldWrap>
            <Heading size="medium">Review & Approve Draft Feedback ({activeDraft.teamName})</Heading>
            <Lozenge appearance={String(activeDraft.engineUsed || "").startsWith("forge-llm") ? "success" : "new"} maxWidth={380}>
              Engine: {activeDraft.engineUsed || "deterministic-rubric-synthesizer"}
            </Lozenge>
          </Inline>
          <CodeBlock language="markdown" text={activeDraft.draftMarkdown} shouldWrapLongLines />
          <ButtonGroup>
            <Button appearance="primary" isDisabled={Boolean(busyAction)} onClick={handleApprove}>
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

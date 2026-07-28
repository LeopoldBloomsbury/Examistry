export type AudSkillLevel = "remembering-understanding" | "application" | "analysis" | "evaluation";
export type AudDifficulty = "introductory" | "core" | "advanced";

export interface AudBlueprintTag {
  exam: "CPA";
  section: "AUD";
  blueprintVersion: "2026";
  area: "I" | "II" | "III" | "IV";
  areaTitle: string;
  group: string;
  topic: string;
  skillLevel: AudSkillLevel;
}

export interface AudAnswerChoice {
  id: "A" | "B" | "C" | "D";
  text: string;
}

export interface AudMcq {
  id: string;
  type: "mcq";
  status: "draft";
  blueprint: AudBlueprintTag;
  difficulty: AudDifficulty;
  stem: string;
  answerChoices: AudAnswerChoice[];
  correctChoiceId: AudAnswerChoice["id"];
  explanation: string;
  distractorRationales: Record<string, string>;
}

export interface AudTbsTask {
  id: string;
  prompt: string;
  answer: string;
  explanation: string;
}

export interface AudMiniTbs {
  id: string;
  type: "mini-tbs";
  status: "draft";
  blueprint: AudBlueprintTag;
  difficulty: AudDifficulty;
  title: string;
  scenario: string;
  exhibits: Array<{ id: string; title: string; content: string }>;
  tasks: AudTbsTask[];
}

type McqSeed = {
  id: string;
  blueprint: AudBlueprintTag;
  difficulty: AudDifficulty;
  stem: string;
  correct: string;
  distractors: [string, string][];
  explanation: string;
};

const choiceIds = ["A", "B", "C", "D"] as const;

function tag(
  area: AudBlueprintTag["area"],
  areaTitle: string,
  group: string,
  topic: string,
  skillLevel: AudSkillLevel
): AudBlueprintTag {
  return {
    exam: "CPA",
    section: "AUD",
    blueprintVersion: "2026",
    area,
    areaTitle,
    group,
    topic,
    skillLevel
  };
}

function makeMcq(seed: McqSeed): AudMcq {
  const numeric = Number(seed.id.split("-").at(-1));
  const correctIndex = Number.isFinite(numeric) ? numeric % 4 : 0;
  const ordered = [...seed.distractors.map(([text]) => text)];
  ordered.splice(correctIndex, 0, seed.correct);
  const answerChoices = ordered.map((text, index) => ({
    id: choiceIds[index],
    text
  }));
  const correctChoiceId = choiceIds[correctIndex];
  const distractorRationales: Record<string, string> = {};
  seed.distractors.forEach(([text, rationale]) => {
    const choice = answerChoices.find((item) => item.text === text);
    if (choice) {
      distractorRationales[choice.id] = rationale;
    }
  });

  return {
    id: seed.id,
    type: "mcq",
    status: "draft",
    blueprint: seed.blueprint,
    difficulty: seed.difficulty,
    stem: seed.stem,
    answerChoices,
    correctChoiceId,
    explanation: seed.explanation,
    distractorRationales
  };
}

const areaI = tag(
  "I",
  "Ethics, Professional Responsibilities and General Principles",
  "Ethics and independence",
  "Independence, integrity, objectivity, and professional conduct",
  "application"
);
const areaIGeneral = tag(
  "I",
  "Ethics, Professional Responsibilities and General Principles",
  "General principles and responsibilities",
  "Engagement acceptance, terms, communications, and documentation",
  "application"
);
const areaII = tag(
  "II",
  "Assessing Risk and Developing a Planned Response",
  "Risk assessment and planning",
  "Understanding the entity, materiality, risk, and planned responses",
  "analysis"
);
const areaIIControls = tag(
  "II",
  "Assessing Risk and Developing a Planned Response",
  "Internal control and fraud risk",
  "Control environment, control activities, and fraud risk factors",
  "analysis"
);
const areaIII = tag(
  "III",
  "Performing Further Procedures and Obtaining Evidence",
  "Audit evidence and procedures",
  "Tests of controls, substantive procedures, sampling, and evidence evaluation",
  "application"
);
const areaIIIData = tag(
  "III",
  "Performing Further Procedures and Obtaining Evidence",
  "Data, estimates, and specialists",
  "Analytical procedures, estimates, service organizations, and specialist evidence",
  "analysis"
);
const areaIV = tag(
  "IV",
  "Forming Conclusions and Reporting",
  "Audit conclusions and reporting",
  "Opinion formation, report modifications, emphasis, and subsequent events",
  "evaluation"
);
const areaIVOther = tag(
  "IV",
  "Forming Conclusions and Reporting",
  "Other engagements and communications",
  "Attestation, review, compilation, preparation, and required communications",
  "application"
);

const mcqSeeds: McqSeed[] = [
  {
    id: "AUD-MCQ-001",
    blueprint: areaI,
    difficulty: "core",
    stem: "A covered member owns a small direct financial interest in an audit client through a brokerage account. Which action best preserves independence?",
    correct: "Dispose of the direct financial interest before continuing on the engagement.",
    distractors: [
      ["Disclose the investment to the audit committee and continue the work.", "Disclosure does not cure a prohibited direct financial interest."],
      ["Move the investment to a margin account held by the same broker.", "Changing account type does not remove the direct ownership interest."],
      ["Document that the investment is immaterial to the member's net worth.", "Materiality does not make a direct financial interest acceptable for a covered member."]
    ],
    explanation: "A direct financial interest in an attest client impairs independence for a covered member regardless of size."
  },
  {
    id: "AUD-MCQ-002",
    blueprint: areaI,
    difficulty: "core",
    stem: "An audit senior is offered a contingent bonus by the client if the audit is completed before month-end. What is the primary independence concern?",
    correct: "The arrangement creates a self-interest threat tied to the audit outcome or timing.",
    distractors: [
      ["The arrangement is acceptable if the fee is paid to the firm instead of the senior.", "A client-paid contingent incentive connected to audit performance still threatens independence."],
      ["The arrangement only affects objectivity if the audit opinion changes.", "The threat exists before any opinion change because compensation is linked to audit behavior."],
      ["The arrangement is a scope limitation rather than an independence issue.", "Scope limitations restrict evidence; this fact pattern concerns incentives and objectivity."]
    ],
    explanation: "Client incentives connected to audit completion or results can compromise objectivity and independence."
  },
  {
    id: "AUD-MCQ-003",
    blueprint: areaI,
    difficulty: "introductory",
    stem: "Which situation most clearly creates a management participation threat?",
    correct: "The auditor approves the client's journal entries before they are posted.",
    distractors: [
      ["The auditor recommends that management review stale user access.", "Recommendations do not become management participation if management decides and acts."],
      ["The auditor asks management to provide a signed representation letter.", "Obtaining representations is a normal audit procedure."],
      ["The auditor compares recorded depreciation to an independently developed expectation.", "Analytical comparison is an audit procedure, not management participation."]
    ],
    explanation: "Approving transactions is a management responsibility and would impair independence."
  },
  {
    id: "AUD-MCQ-004",
    blueprint: areaI,
    difficulty: "core",
    stem: "A partner's immediate family member accepts a key accounting role at an audit client. What should the firm do first?",
    correct: "Evaluate whether the family relationship impairs independence and remove the partner if necessary.",
    distractors: [
      ["Continue the audit because only the partner, not the family member, works for the firm.", "Independence rules consider close family relationships with client personnel."],
      ["Rely on partner rotation at the next required rotation date.", "Rotation timing does not resolve a current independence threat."],
      ["Ask the client to disclose the relationship in the financial statements.", "Financial statement disclosure does not cure the auditor independence issue."]
    ],
    explanation: "Close family employment in a key client role can impair independence and requires immediate evaluation."
  },
  {
    id: "AUD-MCQ-005",
    blueprint: areaI,
    difficulty: "core",
    stem: "Which nonattest service is most likely acceptable for an audit client if safeguards are met?",
    correct: "Preparing a depreciation schedule from management-approved assumptions.",
    distractors: [
      ["Authorizing cash disbursements during a staff vacancy.", "Authorizing transactions is a management function."],
      ["Selecting the accounting policy for revenue recognition.", "Choosing accounting policies is management's responsibility."],
      ["Signing the client's payroll tax return as preparer and officer.", "Acting as an officer or assuming responsibility for a filing impairs independence."]
    ],
    explanation: "Mechanical assistance can be permissible when management accepts responsibility and makes all significant judgments."
  },
  {
    id: "AUD-MCQ-006",
    blueprint: areaI,
    difficulty: "introductory",
    stem: "Before accepting a new audit engagement, which procedure directly addresses management integrity?",
    correct: "Communicate with the predecessor auditor after obtaining client permission.",
    distractors: [
      ["Recalculate prior-year depreciation expense.", "Recalculation addresses account accuracy, not management integrity."],
      ["Send confirmations to the client's major banks.", "Confirmations are audit evidence after acceptance, not client acceptance procedures."],
      ["Draft the engagement letter before discussing prior issues.", "Terms should not replace acceptance procedures."]
    ],
    explanation: "Predecessor communication can reveal disagreements, integrity concerns, and reasons for auditor changes."
  },
  {
    id: "AUD-MCQ-007",
    blueprint: areaIGeneral,
    difficulty: "core",
    stem: "Which item belongs in an audit engagement letter?",
    correct: "Management's responsibility for preparing the financial statements.",
    distractors: [
      ["The exact substantive procedures the auditor will perform.", "Detailed procedures are normally not promised in the engagement letter."],
      ["A guarantee that all fraud will be detected.", "An audit provides reasonable assurance, not a guarantee."],
      ["The auditor's commitment to issue an unmodified opinion.", "The opinion depends on evidence and circumstances."]
    ],
    explanation: "The engagement letter documents responsibilities, scope, and the reporting framework."
  },
  {
    id: "AUD-MCQ-008",
    blueprint: areaIGeneral,
    difficulty: "core",
    stem: "Which statement best describes professional skepticism?",
    correct: "A questioning mind and critical assessment of audit evidence.",
    distractors: [
      ["A presumption that management is dishonest.", "Skepticism is not a presumption of dishonesty."],
      ["A requirement to test every recorded transaction.", "Skepticism affects judgment; it does not eliminate sampling or materiality."],
      ["A reliance strategy used only for internal control audits.", "Professional skepticism applies throughout all audit engagements."]
    ],
    explanation: "Professional skepticism requires alertness to contradictory evidence and careful evidence evaluation."
  },
  {
    id: "AUD-MCQ-009",
    blueprint: areaIGeneral,
    difficulty: "introductory",
    stem: "Which documentation principle is most important for an experienced auditor reviewing the file?",
    correct: "The file should show who performed and reviewed the work and the evidence supporting conclusions.",
    distractors: [
      ["The file should include every client email received during the audit.", "Documentation must be sufficient, not a complete archive of all communications."],
      ["The file should omit contradictory evidence once resolved.", "Contradictory evidence and its resolution should be documented when significant."],
      ["The file should be assembled only after the report release date.", "Final assembly occurs after release, but documentation is prepared as work is performed."]
    ],
    explanation: "Audit documentation should allow an experienced auditor to understand work performed, evidence obtained, and conclusions reached."
  },
  {
    id: "AUD-MCQ-010",
    blueprint: areaIGeneral,
    difficulty: "core",
    stem: "When is an auditor most likely required to communicate significant difficulties encountered during the audit?",
    correct: "When management causes unreasonable delays in providing requested evidence.",
    distractors: [
      ["When the auditor changes sample sizes because risk is low.", "Routine audit strategy changes are not necessarily significant difficulties."],
      ["When the engagement team uses a specialist for valuation.", "Using a specialist is not by itself a significant difficulty."],
      ["When confirmations are returned without exceptions.", "Clean confirmations do not indicate a difficulty."]
    ],
    explanation: "Unreasonable management delays can be significant difficulties that should be communicated to those charged with governance."
  },
  {
    id: "AUD-MCQ-011",
    blueprint: areaI,
    difficulty: "advanced",
    stem: "A firm provides bookkeeping services to a private audit client. Which condition is most important for independence?",
    correct: "Management reviews, approves, and accepts responsibility for the bookkeeping results.",
    distractors: [
      ["The bookkeeping fee is smaller than the audit fee.", "Fee size does not by itself establish appropriate safeguards."],
      ["The service is performed by staff outside the audit engagement team.", "Separate staff can help, but management responsibility remains essential."],
      ["The client has no audit committee.", "Governance structure does not remove the need for management acceptance."]
    ],
    explanation: "For permissible nonattest services, management must make decisions and accept responsibility."
  },
  {
    id: "AUD-MCQ-012",
    blueprint: areaIGeneral,
    difficulty: "core",
    stem: "Which condition most directly affects whether an engagement quality review is needed?",
    correct: "The firm's policies and applicable professional standards for the engagement type.",
    distractors: [
      ["Whether management requests a review of the draft financial statements.", "Client preference does not determine engagement quality review requirements."],
      ["Whether all account balances are below tolerable misstatement.", "Audit results alone do not determine the policy requirement."],
      ["Whether the auditor expects an unmodified opinion.", "An expected clean opinion does not eliminate review requirements."]
    ],
    explanation: "Quality management policies and standards determine when engagement quality reviews apply."
  },
  {
    id: "AUD-MCQ-013",
    blueprint: areaI,
    difficulty: "core",
    stem: "Which action best demonstrates due care during an audit?",
    correct: "Assigning staff with appropriate competence and supervising their work.",
    distractors: [
      ["Accepting management explanations without corroboration to avoid delays.", "Due care requires sufficient appropriate evidence."],
      ["Eliminating review steps when prior audits were clean.", "Prior results do not remove supervision and review obligations."],
      ["Delegating final audit responsibility to the client's controller.", "The auditor cannot delegate audit responsibility to management."]
    ],
    explanation: "Due care includes planning, supervision, professional judgment, and competent performance."
  },
  {
    id: "AUD-MCQ-014",
    blueprint: areaIGeneral,
    difficulty: "introductory",
    stem: "Which statement best describes reasonable assurance in a financial statement audit?",
    correct: "A high, but not absolute, level of assurance that material misstatement is detected.",
    distractors: [
      ["A guarantee that the financial statements are free of all misstatement.", "Audits do not provide absolute assurance."],
      ["Assurance limited to whether internal control is effective.", "Financial statement audits focus on material misstatement, not only controls."],
      ["A legal certification that the client will remain a going concern.", "Auditors evaluate going concern conditions but do not certify survival."]
    ],
    explanation: "Reasonable assurance reflects inherent audit limitations and materiality."
  },
  {
    id: "AUD-MCQ-015",
    blueprint: areaI,
    difficulty: "core",
    stem: "An auditor discovers confidential client information that is not publicly available. When may the auditor disclose it without client consent?",
    correct: "When responding to a validly issued subpoena.",
    distractors: [
      ["When another audit client would benefit from the information.", "Confidentiality is not overridden by usefulness to another client."],
      ["When the information would improve a training presentation.", "Training use still requires appropriate anonymization or consent."],
      ["When the auditor personally disagrees with management's strategy.", "Disagreement with strategy does not permit disclosure."]
    ],
    explanation: "Confidential client information may be disclosed when required by law or professional obligations."
  },
  {
    id: "AUD-MCQ-016",
    blueprint: areaIGeneral,
    difficulty: "core",
    stem: "Which matter is most likely included in communication with those charged with governance?",
    correct: "Significant qualitative aspects of accounting policies and estimates.",
    distractors: [
      ["Every correcting journal entry below trivial misstatement.", "Trivial items are not normally communicated individually."],
      ["The auditor's private staff scheduling conflicts.", "Internal staffing logistics are not governance communications."],
      ["The client's daily cash receipts listing.", "Routine support schedules are not governance-level matters."]
    ],
    explanation: "Auditors communicate significant accounting practices, estimates, difficulties, corrected and uncorrected misstatements, and independence matters when applicable."
  },
  {
    id: "AUD-MCQ-017",
    blueprint: areaI,
    difficulty: "advanced",
    stem: "Which situation most likely creates a familiarity threat?",
    correct: "A senior audit manager has served the same client for many years and socializes frequently with the controller.",
    distractors: [
      ["The auditor lacks experience auditing complex derivatives.", "This is a competence issue, not familiarity."],
      ["The client refuses to provide inventory records.", "That is an evidence limitation."],
      ["The firm charges a fixed audit fee.", "A fixed fee is common and not by itself familiarity."]
    ],
    explanation: "Long association and close relationships can reduce objectivity through familiarity."
  },
  {
    id: "AUD-MCQ-018",
    blueprint: areaIGeneral,
    difficulty: "core",
    stem: "What is the auditor's responsibility when management refuses to sign the engagement letter?",
    correct: "Consider declining or withdrawing because the terms and responsibilities are not acknowledged.",
    distractors: [
      ["Proceed and document verbal agreement as sufficient in all cases.", "Written acknowledgment is a key protection and may be required."],
      ["Issue a qualified opinion immediately.", "No audit evidence has been obtained; reporting is not the immediate issue."],
      ["Replace the engagement letter with the representation letter.", "Representation letters serve a different purpose near the end of the audit."]
    ],
    explanation: "Unacknowledged engagement terms create a serious acceptance/continuance problem."
  },
  {
    id: "AUD-MCQ-019",
    blueprint: areaI,
    difficulty: "introductory",
    stem: "Which item is a conceptual element of independence?",
    correct: "Independence in appearance.",
    distractors: [
      ["Materiality in performance.", "Materiality is a planning and evaluation concept, not an independence element."],
      ["Detection risk in sampling.", "Detection risk relates to audit risk."],
      ["Control reliance in planning.", "Control reliance relates to audit strategy."]
    ],
    explanation: "Independence includes both independence of mind and independence in appearance."
  },
  {
    id: "AUD-MCQ-020",
    blueprint: areaIGeneral,
    difficulty: "core",
    stem: "Which factor most directly affects whether to continue an existing audit engagement?",
    correct: "New information indicating management may lack integrity.",
    distractors: [
      ["A lower planned materiality than prior year.", "Materiality changes affect planning, not necessarily continuance."],
      ["A new audit software template.", "Tooling changes do not determine client continuance."],
      ["A larger number of bank accounts.", "More accounts may affect effort but not automatically continuance."]
    ],
    explanation: "Client continuance decisions consider integrity, competence, independence, and ability to perform the engagement."
  },
  {
    id: "AUD-MCQ-021",
    blueprint: areaI,
    difficulty: "core",
    stem: "Which client request would most likely impair independence for an audit client?",
    correct: "The auditor should hire and supervise the client's temporary accounting staff.",
    distractors: [
      ["The auditor should explain new lease disclosure requirements.", "Education about standards can be permissible."],
      ["The auditor should provide a sample financial statement format.", "Providing examples can be permissible if management decides."],
      ["The auditor should discuss control deficiencies with management.", "Communicating deficiencies is part of the audit."]
    ],
    explanation: "Hiring and supervising client employees assumes management responsibilities."
  },
  {
    id: "AUD-MCQ-022",
    blueprint: areaIGeneral,
    difficulty: "core",
    stem: "Why does the auditor obtain a management representation letter?",
    correct: "To confirm management's oral representations and responsibilities in writing.",
    distractors: [
      ["To replace substantive procedures for material accounts.", "Representations complement but do not replace necessary audit evidence."],
      ["To guarantee that no fraud occurred.", "Management cannot guarantee absence of fraud through the letter."],
      ["To establish the initial terms of the engagement.", "Engagement terms are established in the engagement letter."]
    ],
    explanation: "Written representations document management assertions and responsibilities near the conclusion of the audit."
  },
  {
    id: "AUD-MCQ-023",
    blueprint: areaI,
    difficulty: "advanced",
    stem: "A firm audits a client and also designs the client's new revenue system. Which safeguard is most critical if design assistance is permitted?",
    correct: "Management makes all design decisions and accepts responsibility for the system.",
    distractors: [
      ["The audit team tests fewer revenue transactions.", "Reducing testing does not address independence."],
      ["The firm bills the design work separately.", "Separate billing does not eliminate management participation threats."],
      ["The system goes live after year-end.", "Timing alone does not resolve responsibility for design decisions."]
    ],
    explanation: "System design assistance can threaten independence unless management retains decision-making responsibility."
  },
  {
    id: "AUD-MCQ-024",
    blueprint: areaIGeneral,
    difficulty: "core",
    stem: "Which documentation change is appropriate after the audit documentation completion date?",
    correct: "Adding a note explaining why a superseded draft was removed without deleting evidence of work performed.",
    distractors: [
      ["Backdating a review signoff to the report date.", "Backdating review evidence is inappropriate."],
      ["Deleting contradictory evidence because the conclusion was unchanged.", "Contradictory evidence should not be hidden."],
      ["Creating new procedures and dating them as if performed before report release.", "Procedures should be dated when actually performed."]
    ],
    explanation: "Post-completion changes should preserve integrity of the record and document when and why changes were made."
  },
  {
    id: "AUD-MCQ-025",
    blueprint: areaI,
    difficulty: "introductory",
    stem: "Which statement best describes the auditor's ethical responsibility when facing pressure from client management?",
    correct: "Maintain objectivity and avoid subordinating judgment to client preferences.",
    distractors: [
      ["Accept management's position if the client is important to the firm.", "Client importance does not override professional responsibilities."],
      ["Avoid documenting the disagreement to preserve the relationship.", "Significant disagreements should be documented and resolved."],
      ["Treat the pressure as acceptable if no misstatement has been quantified.", "Pressure can threaten integrity and objectivity before quantification."]
    ],
    explanation: "Professional conduct requires integrity, objectivity, and independent judgment despite client pressure."
  },
  {
    id: "AUD-MCQ-026",
    blueprint: areaII,
    difficulty: "core",
    stem: "Which procedure best helps the auditor understand the entity and its environment?",
    correct: "Inquire about business risks and read board minutes and key contracts.",
    distractors: [
      ["Confirm all accounts receivable balances before planning.", "Confirmations are further procedures, not the broad initial understanding."],
      ["Issue the audit report before completing risk assessment.", "Risk assessment must precede reporting."],
      ["Eliminate analytical procedures until fieldwork is complete.", "Preliminary analytics are useful for planning and risk assessment."]
    ],
    explanation: "Understanding the entity includes inquiries, analytics, observation, inspection, and reading relevant documents."
  },
  {
    id: "AUD-MCQ-027",
    blueprint: areaII,
    difficulty: "core",
    stem: "If inherent risk for revenue recognition is high, what is the most appropriate planning response?",
    correct: "Design more persuasive procedures targeted to revenue assertions.",
    distractors: [
      ["Increase detection risk without changing procedures.", "Higher inherent risk generally requires lower detection risk."],
      ["Ignore revenue if prior-year testing found no misstatement.", "Current risk assessment cannot be ignored because prior results were clean."],
      ["Reduce substantive procedures because controls may exist.", "Controls must be understood and, if relied on, tested."]
    ],
    explanation: "Higher assessed risk requires audit responses that obtain sufficient appropriate evidence."
  },
  {
    id: "AUD-MCQ-028",
    blueprint: areaII,
    difficulty: "introductory",
    stem: "What is performance materiality primarily used for?",
    correct: "Reducing to an appropriately low level the probability that aggregate uncorrected misstatements exceed materiality.",
    distractors: [
      ["Setting the maximum fee the auditor may charge.", "Fees are unrelated to performance materiality."],
      ["Determining whether independence exists.", "Independence is evaluated separately."],
      ["Eliminating the need to evaluate qualitative misstatements.", "Qualitative factors still matter."]
    ],
    explanation: "Performance materiality is set below overall materiality to address aggregation risk."
  },
  {
    id: "AUD-MCQ-029",
    blueprint: areaIIControls,
    difficulty: "core",
    stem: "Which condition is a fraud risk factor related to opportunity?",
    correct: "Management can override journal entry controls without independent review.",
    distractors: [
      ["Management's bonus depends on earnings.", "That is an incentive or pressure."],
      ["The controller believes aggressive reporting is justified.", "That is rationalization or attitude."],
      ["The company operates in a stable industry.", "Stability generally does not create fraud opportunity."]
    ],
    explanation: "Weak controls and management override create opportunities for fraud."
  },
  {
    id: "AUD-MCQ-030",
    blueprint: areaII,
    difficulty: "core",
    stem: "Which analytical procedure is most useful during planning?",
    correct: "Compare current gross margin by product line to prior periods and expectations.",
    distractors: [
      ["Agree every sales invoice to a shipping document.", "That is detailed substantive testing."],
      ["Reperform every bank reconciliation.", "That is a detailed procedure, not planning analytics."],
      ["Send legal letters to external counsel.", "Legal letters address contingencies later in the audit."]
    ],
    explanation: "Planning analytics identify unusual relationships and areas of potential misstatement."
  },
  {
    id: "AUD-MCQ-031",
    blueprint: areaIIControls,
    difficulty: "core",
    stem: "A client's controller both creates vendors and approves vendor payments. Which risk is most directly increased?",
    correct: "Unauthorized or fictitious disbursements.",
    distractors: [
      ["Understatement of depreciation expense.", "Depreciation is not directly tied to vendor setup and payment approval."],
      ["Improper classification of leases.", "Lease classification is unrelated to vendor master controls."],
      ["Failure to disclose subsequent events.", "Subsequent event disclosure is not the direct risk from this segregation issue."]
    ],
    explanation: "Combining vendor creation and payment approval weakens segregation and increases disbursement fraud risk."
  },
  {
    id: "AUD-MCQ-032",
    blueprint: areaII,
    difficulty: "advanced",
    stem: "Which factor would most likely cause the auditor to lower tolerable misstatement for inventory?",
    correct: "Inventory has high estimation uncertainty and prior misstatements.",
    distractors: [
      ["Inventory turnover increased and controls improved.", "Those facts may reduce, not increase, the need for lower tolerable misstatement."],
      ["The account balance is immaterial.", "Immaterial accounts may need less testing."],
      ["The client uses a perpetual system.", "A perpetual system alone does not require lower tolerable misstatement."]
    ],
    explanation: "Higher risk and misstatement history support more precise testing thresholds."
  },
  {
    id: "AUD-MCQ-033",
    blueprint: areaIIControls,
    difficulty: "core",
    stem: "What is the main purpose of obtaining an understanding of internal control in a financial statement audit?",
    correct: "To identify and assess risks of material misstatement and design further procedures.",
    distractors: [
      ["To express an opinion on controls in every audit.", "A control opinion is not provided in every financial statement audit."],
      ["To eliminate substantive testing if controls appear strong.", "Controls must be tested before reliance, and substantive procedures are still required."],
      ["To prepare management's control documentation.", "Management is responsible for its control documentation."]
    ],
    explanation: "The understanding supports risk assessment and audit planning."
  },
  {
    id: "AUD-MCQ-034",
    blueprint: areaII,
    difficulty: "core",
    stem: "Which risk is usually a presumed significant risk in a financial statement audit?",
    correct: "Improper revenue recognition.",
    distractors: [
      ["Low petty cash balances.", "Petty cash is not normally presumed significant."],
      ["Routine depreciation on fully automated assets.", "Routine estimates may be lower risk depending on facts."],
      ["Straight-line rent expense in an immaterial lease.", "This is not usually presumed significant."]
    ],
    explanation: "Auditors ordinarily presume a fraud risk in revenue recognition unless rebutted."
  },
  {
    id: "AUD-MCQ-035",
    blueprint: areaIIControls,
    difficulty: "introductory",
    stem: "Which component is part of the control environment?",
    correct: "Management's commitment to integrity and ethical values.",
    distractors: [
      ["Bank confirmation response rates.", "Confirmations are audit evidence, not a control environment component."],
      ["The auditor's planned sample size.", "Sample size is an audit planning decision."],
      ["The final audit opinion.", "The opinion is the reporting outcome."]
    ],
    explanation: "The control environment includes tone at the top, integrity, oversight, authority, and accountability."
  },
  {
    id: "AUD-MCQ-036",
    blueprint: areaII,
    difficulty: "advanced",
    stem: "Which response is most appropriate when the auditor identifies a significant risk?",
    correct: "Obtain an understanding of related controls and perform procedures responsive to the risk.",
    distractors: [
      ["Rely only on inquiry of management.", "Inquiry alone is insufficient for significant risks."],
      ["Decrease supervision because risk is isolated.", "Significant risks usually require more experienced attention."],
      ["Exclude the risk from the audit plan if no misstatement is known.", "Risk assessment is based on susceptibility, not only known misstatement."]
    ],
    explanation: "Significant risks require targeted responses and understanding of relevant controls."
  },
  {
    id: "AUD-MCQ-037",
    blueprint: areaIIControls,
    difficulty: "core",
    stem: "Which condition suggests a deficiency in the design of a control?",
    correct: "No control exists to review changes to vendor bank account information.",
    distractors: [
      ["A reviewer missed one exception while performing a well-designed control.", "That may indicate operating effectiveness, not necessarily design."],
      ["A control operates monthly instead of daily by design and matches the risk.", "Frequency can be appropriate depending on risk."],
      ["A control is documented in a flowchart.", "Documentation does not itself indicate design deficiency."]
    ],
    explanation: "Design deficiency exists when a necessary control is missing or not designed to prevent or detect misstatement."
  },
  {
    id: "AUD-MCQ-038",
    blueprint: areaII,
    difficulty: "core",
    stem: "Which procedure best addresses the risk that management omitted related-party transactions?",
    correct: "Inquire of management and inspect minutes, conflict disclosures, and unusual transactions.",
    distractors: [
      ["Test only cash disbursements below the posting threshold.", "Small disbursements alone do not address related-party completeness."],
      ["Rely exclusively on management's representation letter.", "Representations alone are not sufficient."],
      ["Ignore relationships not disclosed in the financial statements.", "The audit should search for undisclosed relationships and transactions."]
    ],
    explanation: "Related-party risk assessment combines inquiry with inspection of documents and unusual transactions."
  },
  {
    id: "AUD-MCQ-039",
    blueprint: areaIIControls,
    difficulty: "core",
    stem: "Which IT general control weakness most directly affects application control reliance?",
    correct: "Developers can migrate code changes to production without approval.",
    distractors: [
      ["The payroll clerk takes vacation in July.", "Vacation timing is not an IT general control weakness."],
      ["The auditor uses data extraction software.", "Auditor tool use does not weaken client IT controls."],
      ["The company has multiple product lines.", "Business complexity is not an IT general control."]
    ],
    explanation: "Weak change management can undermine automated application controls."
  },
  {
    id: "AUD-MCQ-040",
    blueprint: areaII,
    difficulty: "introductory",
    stem: "Which assertion is most directly addressed by tracing shipping documents to recorded sales?",
    correct: "Completeness of revenue.",
    distractors: [
      ["Existence of revenue.", "Existence is more directly tested by vouching recorded sales to support."],
      ["Valuation of inventory.", "Inventory valuation requires cost and lower-of-cost-or-net-realizable-value evidence."],
      ["Presentation of debt.", "Debt presentation is unrelated to shipping documents."]
    ],
    explanation: "Tracing from source documents to accounting records tests whether shipments were recorded."
  },
  {
    id: "AUD-MCQ-041",
    blueprint: areaII,
    difficulty: "core",
    stem: "Which planning factor increases the need for experienced audit staff?",
    correct: "Complex revenue contracts with variable consideration.",
    distractors: [
      ["A small petty cash account.", "Petty cash generally does not drive staffing complexity."],
      ["A stable utility expense trend.", "Stable routine expenses usually require less specialized judgment."],
      ["A management request for fewer meetings.", "Meeting preference alone does not determine staffing expertise."]
    ],
    explanation: "Complex estimates and contracts require more experienced judgment and supervision."
  },
  {
    id: "AUD-MCQ-042",
    blueprint: areaIIControls,
    difficulty: "advanced",
    stem: "Which evidence best supports operating effectiveness of a manual review control?",
    correct: "Inspection of review signoffs plus reperformance showing the reviewer investigated exceptions.",
    distractors: [
      ["Inquiry that the reviewer usually looks at the report.", "Inquiry alone is weak evidence for operating effectiveness."],
      ["A blank copy of the report template.", "A template shows design but not operation."],
      ["Management's statement that no errors occurred.", "No-error claims do not prove the control operated."]
    ],
    explanation: "Operating effectiveness evidence should show the control was performed, by whom, when, and how exceptions were handled."
  },
  {
    id: "AUD-MCQ-043",
    blueprint: areaII,
    difficulty: "core",
    stem: "What is the audit risk model relationship?",
    correct: "Audit risk is a function of risk of material misstatement and detection risk.",
    distractors: [
      ["Audit risk equals materiality divided by sample size.", "That is not the audit risk model."],
      ["Audit risk is eliminated when controls are effective.", "Audit risk can be reduced but not eliminated."],
      ["Audit risk only applies to fraud engagements.", "Audit risk applies to financial statement audits generally."]
    ],
    explanation: "Risk of material misstatement includes inherent and control risk; detection risk is managed through procedures."
  },
  {
    id: "AUD-MCQ-044",
    blueprint: areaII,
    difficulty: "advanced",
    stem: "Which circumstance would most likely make analytical procedures less effective as substantive evidence?",
    correct: "The account is affected by numerous nonrecurring transactions with weak data reliability.",
    distractors: [
      ["Relationships are predictable and data is independently generated.", "Predictable relationships and reliable data improve analytics."],
      ["The auditor can develop a precise expectation.", "Precision improves analytical procedure effectiveness."],
      ["The account has stable historical trends.", "Stable trends may make analytics more useful."]
    ],
    explanation: "Substantive analytics depend on predictable relationships, reliable data, and precise expectations."
  },
  {
    id: "AUD-MCQ-045",
    blueprint: areaIIControls,
    difficulty: "core",
    stem: "Which fraud response addresses management override?",
    correct: "Test journal entries and review accounting estimates for bias.",
    distractors: [
      ["Decrease unpredictability in audit procedures.", "Unpredictability is often increased, not decreased."],
      ["Rely only on controls performed by senior management.", "Management override can bypass controls."],
      ["Avoid retrospective review of estimates.", "Retrospective review helps identify possible bias."]
    ],
    explanation: "Journal entry testing, estimate bias review, and significant unusual transaction evaluation address override risk."
  },
  {
    id: "AUD-MCQ-046",
    blueprint: areaII,
    difficulty: "core",
    stem: "Which item most directly affects preliminary materiality?",
    correct: "The needs of reasonable financial statement users.",
    distractors: [
      ["The number of pages in the audit file.", "File size does not drive materiality."],
      ["The client's preferred audit fee.", "Fee pressure should not determine materiality."],
      ["The audit software license cost.", "Software cost is irrelevant to materiality."]
    ],
    explanation: "Materiality is judged from the perspective of reasonable users and the nature and size of misstatements."
  },
  {
    id: "AUD-MCQ-047",
    blueprint: areaIIControls,
    difficulty: "introductory",
    stem: "Which control best addresses completeness of cash receipts?",
    correct: "Independently reconcile the daily cash listing to deposits and recorded receipts.",
    distractors: [
      ["Approve new customer credit limits.", "Credit approval addresses collectibility and authorization, not receipt completeness."],
      ["Review depreciation schedules quarterly.", "Depreciation is unrelated to cash receipts."],
      ["Restrict access to blank check stock.", "Blank checks affect disbursements, not receipts."]
    ],
    explanation: "Reconciling receipt listings, deposits, and records helps ensure all cash receipts are recorded."
  },
  {
    id: "AUD-MCQ-048",
    blueprint: areaII,
    difficulty: "advanced",
    stem: "Which situation most likely indicates a risk of material misstatement due to cutoff?",
    correct: "Sales spike in the final two days while shipping documents show shipment after year-end.",
    distractors: [
      ["Cash payroll is paid every other Friday.", "Regular payroll timing does not directly indicate revenue cutoff risk."],
      ["Inventory count tags are prenumbered.", "Prenumbered tags generally strengthen count control."],
      ["Board minutes approve a normal dividend.", "Dividend approval is not revenue cutoff."]
    ],
    explanation: "Recorded sales before shipment may indicate improper period recognition."
  },
  {
    id: "AUD-MCQ-049",
    blueprint: areaIIControls,
    difficulty: "core",
    stem: "Which statement about control risk is correct?",
    correct: "If the auditor plans to rely on controls, operating effectiveness must be tested.",
    distractors: [
      ["Control risk can be assessed below maximum based only on inquiry.", "Inquiry alone is insufficient to support control reliance."],
      ["Control risk is unrelated to substantive testing.", "Control risk affects detection risk and substantive procedure design."],
      ["Control risk is eliminated by strong inherent risk assessment.", "Inherent risk and control risk are separate components."]
    ],
    explanation: "Control reliance requires evidence that controls operated effectively."
  },
  {
    id: "AUD-MCQ-050",
    blueprint: areaII,
    difficulty: "core",
    stem: "Which risk assessment procedure best addresses going concern planning considerations?",
    correct: "Evaluate debt covenant compliance, forecasts, and plans for funding shortfalls.",
    distractors: [
      ["Confirm only petty cash balances.", "Petty cash does not address going concern."],
      ["Compare office supply expense to prior year.", "Office supplies rarely drive going concern assessment."],
      ["Limit procedures to management's representation letter.", "Representations are not sufficient by themselves."]
    ],
    explanation: "Going concern risk assessment considers conditions, events, plans, financing, and forecast feasibility."
  },
  {
    id: "AUD-MCQ-051",
    blueprint: areaIII,
    difficulty: "introductory",
    stem: "Which procedure most directly tests existence of accounts receivable?",
    correct: "Send positive confirmations to selected customers.",
    distractors: [
      ["Trace shipping documents to the sales journal.", "Tracing supports completeness of revenue."],
      ["Recalculate depreciation expense.", "Depreciation is unrelated to receivable existence."],
      ["Inspect board minutes for debt approvals.", "Debt approvals do not prove receivable existence."]
    ],
    explanation: "Customer confirmations provide external evidence that recorded receivables exist."
  },
  {
    id: "AUD-MCQ-052",
    blueprint: areaIII,
    difficulty: "core",
    stem: "When are negative confirmations most appropriate?",
    correct: "Many small homogeneous receivables, low assessed risk, and expected attention from recipients.",
    distractors: [
      ["Few large balances with high risk of dispute.", "Positive confirmations are generally more appropriate for higher-risk large balances."],
      ["Recipients are unlikely to review requests.", "Negative confirmations rely on recipient attention."],
      ["Internal control over receivables is weak.", "Weak controls make negative confirmations less persuasive."]
    ],
    explanation: "Negative confirmations are weaker and fit low-risk, many-small-balance populations."
  },
  {
    id: "AUD-MCQ-053",
    blueprint: areaIII,
    difficulty: "core",
    stem: "Which procedure best tests inventory existence?",
    correct: "Observe the physical inventory count and perform test counts from records to floor.",
    distractors: [
      ["Trace receiving reports to vendor invoices.", "That addresses purchases, not physical existence."],
      ["Inspect subsequent cash receipts.", "Subsequent receipts help receivables valuation or existence."],
      ["Review legal letters.", "Legal letters address contingencies."]
    ],
    explanation: "Observation and test counts provide evidence that recorded inventory exists."
  },
  {
    id: "AUD-MCQ-054",
    blueprint: areaIII,
    difficulty: "advanced",
    stem: "Which audit response is best when confirmation requests are not returned?",
    correct: "Perform alternative procedures such as examining subsequent cash receipts and shipping documents.",
    distractors: [
      ["Assume the balance is misstated.", "Nonresponse alone does not prove misstatement."],
      ["Delete the item from the sample.", "Removing nonresponses biases the sample."],
      ["Accept management's explanation without support.", "Inquiry alone is insufficient."]
    ],
    explanation: "Alternative procedures can provide evidence for nonresponses, especially for receivables."
  },
  {
    id: "AUD-MCQ-055",
    blueprint: areaIII,
    difficulty: "core",
    stem: "Which evidence is generally most reliable?",
    correct: "A bank confirmation received directly by the auditor.",
    distractors: [
      ["A photocopy of a bank statement provided by management.", "Client-provided copies are less reliable than direct external evidence."],
      ["An oral statement from the accounts payable clerk.", "Inquiry is less persuasive than direct external confirmation."],
      ["A spreadsheet prepared by the client's sales manager.", "Internally generated evidence is less reliable without controls or corroboration."]
    ],
    explanation: "Evidence from independent external sources received directly by the auditor is generally highly reliable."
  },
  {
    id: "AUD-MCQ-056",
    blueprint: areaIII,
    difficulty: "core",
    stem: "Which substantive procedure best addresses completeness of accounts payable?",
    correct: "Search subsequent cash disbursements and unmatched receiving reports.",
    distractors: [
      ["Confirm accounts receivable balances.", "Receivable confirmations do not address payable completeness."],
      ["Vouch recorded payables to vendor invoices only.", "Vouching recorded items tests existence, not omitted liabilities."],
      ["Inspect fixed asset additions.", "Fixed asset additions may not address unrecorded trade payables broadly."]
    ],
    explanation: "Completeness testing starts from evidence of obligations not yet recorded."
  },
  {
    id: "AUD-MCQ-057",
    blueprint: areaIII,
    difficulty: "introductory",
    stem: "What does reperformance provide evidence about?",
    correct: "Whether a control or calculation operates as described.",
    distractors: [
      ["Management's intent to commit fraud.", "Reperformance does not establish intent."],
      ["Future market value of inventory.", "Reperformance does not forecast market value."],
      ["The legal enforceability of all contracts.", "Legal enforceability may require legal evidence."]
    ],
    explanation: "Reperformance independently executes a control or calculation to test accuracy or operation."
  },
  {
    id: "AUD-MCQ-058",
    blueprint: areaIIIData,
    difficulty: "advanced",
    stem: "Which factor makes an auditor's specialist most necessary?",
    correct: "A material asset valuation uses complex actuarial assumptions outside the auditor's expertise.",
    distractors: [
      ["Cash is reconciled monthly.", "Routine cash reconciliation does not require a specialist."],
      ["Office supplies expense is stable.", "Stable routine expenses do not require specialized expertise."],
      ["The client uses prenumbered invoices.", "Invoice numbering is a control matter, not specialist work."]
    ],
    explanation: "Specialists help when evidence requires expertise in a field other than accounting or auditing."
  },
  {
    id: "AUD-MCQ-059",
    blueprint: areaIII,
    difficulty: "core",
    stem: "In attribute sampling, what does the tolerable deviation rate represent?",
    correct: "The maximum control deviation rate the auditor is willing to accept.",
    distractors: [
      ["The expected dollar misstatement in the account.", "Dollar misstatement relates to variables sampling."],
      ["The client's maximum sales return rate.", "Sales returns are not the attribute sampling threshold."],
      ["The final audit materiality for all statements.", "Materiality is a financial reporting threshold, not control deviation rate."]
    ],
    explanation: "Attribute sampling evaluates control deviations against a tolerable deviation rate."
  },
  {
    id: "AUD-MCQ-060",
    blueprint: areaIII,
    difficulty: "advanced",
    stem: "What is the effect of increasing expected deviation rate in an attribute sample?",
    correct: "It generally increases required sample size.",
    distractors: [
      ["It eliminates the need for sampling.", "Higher expected deviations do not eliminate sampling."],
      ["It decreases required sample size.", "More expected deviations require more evidence."],
      ["It changes the account balance automatically.", "Sampling parameters do not directly change recorded balances."]
    ],
    explanation: "Higher expected deviation rates require larger samples to evaluate control effectiveness."
  },
  {
    id: "AUD-MCQ-061",
    blueprint: areaIII,
    difficulty: "core",
    stem: "Which procedure best tests valuation of obsolete inventory?",
    correct: "Compare inventory cost to subsequent sales prices and aging reports.",
    distractors: [
      ["Observe inventory tags during the count only.", "Observation supports existence but not full valuation."],
      ["Confirm inventory quantities with customers.", "Customers usually cannot confirm the client's inventory valuation."],
      ["Inspect loan agreements.", "Loan agreements do not value inventory."]
    ],
    explanation: "Valuation evidence considers net realizable value, aging, sales, and obsolescence."
  },
  {
    id: "AUD-MCQ-062",
    blueprint: areaIIIData,
    difficulty: "core",
    stem: "Which evidence is most relevant to the reasonableness of an accounting estimate?",
    correct: "Management's method, significant assumptions, source data, and subsequent events when applicable.",
    distractors: [
      ["Only the prior-year audit fee.", "The audit fee does not support estimate reasonableness."],
      ["Only the number of employees in accounting.", "Staff count does not prove assumptions are reasonable."],
      ["Only a signed engagement letter.", "The engagement letter does not support estimate measurement."]
    ],
    explanation: "Estimate testing evaluates method, assumptions, data, bias, and later evidence."
  },
  {
    id: "AUD-MCQ-063",
    blueprint: areaIII,
    difficulty: "core",
    stem: "Which test best addresses payroll occurrence?",
    correct: "Vouch recorded payroll to approved time records and employee master files.",
    distractors: [
      ["Trace unrecorded time cards to the payroll register.", "Tracing supports completeness."],
      ["Review inventory turnover.", "Inventory turnover is unrelated to payroll occurrence."],
      ["Confirm debt with lenders.", "Debt confirmation does not test payroll."]
    ],
    explanation: "Vouching recorded payroll to valid employees and approved time supports occurrence."
  },
  {
    id: "AUD-MCQ-064",
    blueprint: areaIIIData,
    difficulty: "advanced",
    stem: "A service organization processes the client's payroll. What evidence may help the auditor understand relevant controls at the service organization?",
    correct: "A service auditor's SOC report covering payroll processing controls.",
    distractors: [
      ["The client's sales tax return.", "Sales tax filings do not describe service organization controls."],
      ["A bank confirmation from the client's lender.", "Bank confirmations do not address payroll service controls."],
      ["A representation letter from the client's warehouse manager.", "Warehouse representation does not address outsourced payroll controls."]
    ],
    explanation: "SOC reports can provide evidence about service organization controls relevant to user entities."
  },
  {
    id: "AUD-MCQ-065",
    blueprint: areaIII,
    difficulty: "core",
    stem: "Which procedure best addresses the completeness of recorded sales returns after year-end?",
    correct: "Review credit memos issued after year-end for returns related to pre-year-end sales.",
    distractors: [
      ["Confirm fixed asset additions.", "Fixed assets do not address sales returns."],
      ["Recalculate interest expense.", "Interest expense is unrelated to returns."],
      ["Inspect payroll tax filings.", "Payroll filings do not address sales returns."]
    ],
    explanation: "Subsequent credit memos can reveal returns or allowances that should affect year-end revenue or receivables."
  },
  {
    id: "AUD-MCQ-066",
    blueprint: areaIII,
    difficulty: "introductory",
    stem: "What assertion is addressed by inspecting title documents for owned equipment?",
    correct: "Rights and obligations.",
    distractors: [
      ["Completeness of revenue.", "Equipment title does not test revenue completeness."],
      ["Occurrence of payroll.", "Title documents are unrelated to payroll."],
      ["Classification of cash flows.", "Equipment title does not classify cash flows."]
    ],
    explanation: "Title documents support the entity's rights to recorded assets."
  },
  {
    id: "AUD-MCQ-067",
    blueprint: areaIII,
    difficulty: "advanced",
    stem: "Which action is appropriate when projected misstatement exceeds tolerable misstatement?",
    correct: "Request adjustment or perform additional procedures and evaluate the effect on the audit.",
    distractors: [
      ["Ignore the projection if the known misstatement is small.", "Projected misstatement matters in sample evaluation."],
      ["Conclude controls are effective without further work.", "Substantive sample results do not support that conclusion."],
      ["Reduce the sample size retroactively.", "Sample size cannot be reduced after unfavorable results to avoid a conclusion."]
    ],
    explanation: "Projected misstatement above tolerable levels requires further audit response and evaluation."
  },
  {
    id: "AUD-MCQ-068",
    blueprint: areaIIIData,
    difficulty: "core",
    stem: "Which factor improves reliability of data used in substantive analytics?",
    correct: "Data is generated from a system with effective controls over completeness and accuracy.",
    distractors: [
      ["Data is manually retyped by the auditor from screenshots.", "Manual retyping can introduce error."],
      ["Data excludes the highest-risk transactions.", "Excluding risky data undermines reliability."],
      ["Data is provided only as an unexplained total.", "Unexplained totals limit precision and reliability."]
    ],
    explanation: "Reliable underlying data is essential for meaningful substantive analytical procedures."
  },
  {
    id: "AUD-MCQ-069",
    blueprint: areaIII,
    difficulty: "core",
    stem: "Which procedure best tests cutoff for inventory purchases?",
    correct: "Compare receiving reports around year-end to purchase journal entries.",
    distractors: [
      ["Confirm accounts receivable balances.", "Receivable confirmations do not test purchase cutoff."],
      ["Recalculate stock compensation.", "Stock compensation is unrelated to inventory purchase cutoff."],
      ["Inspect the audit engagement letter.", "Engagement terms do not test cutoff."]
    ],
    explanation: "Receiving reports around year-end indicate when goods were received and should be recorded."
  },
  {
    id: "AUD-MCQ-070",
    blueprint: areaIII,
    difficulty: "core",
    stem: "Which evidence best supports legal contingencies?",
    correct: "A letter from external legal counsel obtained by the auditor.",
    distractors: [
      ["A verbal statement from the accounts payable clerk.", "The clerk may not know legal exposure."],
      ["A sales forecast prepared by marketing.", "Sales forecasts do not support litigation outcomes."],
      ["A copy of the prior-year tax return.", "Tax returns do not address current legal contingencies."]
    ],
    explanation: "Attorney letters provide evidence about asserted and unasserted claims when requested appropriately."
  },
  {
    id: "AUD-MCQ-071",
    blueprint: areaIIIData,
    difficulty: "advanced",
    stem: "When evaluating management's fair value estimate, which auditor response is strongest?",
    correct: "Develop an independent expectation or test management's model, assumptions, and data.",
    distractors: [
      ["Accept the estimate because it is below materiality for revenue.", "The relevant account and risk must be considered."],
      ["Use only management's representation as evidence.", "Representations alone are insufficient."],
      ["Avoid evaluating assumptions if a model is complex.", "Complexity increases the need for careful evaluation or specialist use."]
    ],
    explanation: "Fair value estimates require evidence about models, assumptions, data, and potential bias."
  },
  {
    id: "AUD-MCQ-072",
    blueprint: areaIII,
    difficulty: "introductory",
    stem: "Which procedure is an example of inspection?",
    correct: "Examining a signed lease agreement.",
    distractors: [
      ["Watching employees count inventory.", "Watching is observation."],
      ["Asking the controller about controls.", "Asking is inquiry."],
      ["Recalculating interest expense.", "Recalculation is mathematical verification."]
    ],
    explanation: "Inspection involves examining records, documents, or tangible assets."
  },
  {
    id: "AUD-MCQ-073",
    blueprint: areaIII,
    difficulty: "core",
    stem: "Which evidence best addresses the accuracy of interest expense?",
    correct: "Recalculate interest using confirmed debt terms and outstanding principal.",
    distractors: [
      ["Trace sales invoices to shipping records.", "Sales invoices do not test interest expense."],
      ["Observe inventory counts.", "Inventory observation does not test interest."],
      ["Read customer complaint logs.", "Complaint logs do not test interest calculation."]
    ],
    explanation: "Recalculation using confirmed terms provides evidence about interest accuracy."
  },
  {
    id: "AUD-MCQ-074",
    blueprint: areaIII,
    difficulty: "core",
    stem: "Which condition makes external confirmations less reliable?",
    correct: "Responses are returned to the client, who forwards them to the auditor.",
    distractors: [
      ["Responses are sent directly to the auditor.", "Direct receipt improves reliability."],
      ["The confirming party is independent of the client.", "Independence improves reliability."],
      ["The auditor controls mailing and follow-up.", "Auditor control improves reliability."]
    ],
    explanation: "The auditor should maintain control over confirmation requests and responses."
  },
  {
    id: "AUD-MCQ-075",
    blueprint: areaIII,
    difficulty: "advanced",
    stem: "Which result most likely indicates a need to revise the audit plan?",
    correct: "Substantive testing finds a pattern of cutoff errors in a high-risk revenue stream.",
    distractors: [
      ["A low-risk account agrees exactly to the lead schedule.", "Agreement does not necessarily require plan revision."],
      ["A confirmation response is received without exception.", "A clean response supports the existing plan."],
      ["A control walkthrough matches the documented flow.", "A matching walkthrough alone does not indicate plan revision."]
    ],
    explanation: "A pattern of errors in a high-risk area can change risk assessment and require more work."
  },
  {
    id: "AUD-MCQ-076",
    blueprint: areaIV,
    difficulty: "core",
    stem: "Which circumstance generally leads to a qualified opinion due to a GAAP departure?",
    correct: "A material but not pervasive misstatement remains uncorrected.",
    distractors: [
      ["A material and pervasive GAAP departure remains uncorrected.", "That generally leads to an adverse opinion."],
      ["The auditor cannot obtain evidence and the possible effects are pervasive.", "That generally leads to a disclaimer."],
      ["The financial statements are fairly presented in all material respects.", "That supports an unmodified opinion."]
    ],
    explanation: "Qualified opinions are used for material but not pervasive misstatements or scope limitations."
  },
  {
    id: "AUD-MCQ-077",
    blueprint: areaIV,
    difficulty: "core",
    stem: "When is an adverse opinion appropriate?",
    correct: "Misstatements are material and pervasive.",
    distractors: [
      ["The auditor lacks independence.", "Lack of independence precludes issuing an audit opinion."],
      ["A scope limitation is material and pervasive.", "That generally leads to a disclaimer, not adverse."],
      ["An uncertainty is adequately disclosed.", "Adequately disclosed uncertainty may call for emphasis, not adverse."]
    ],
    explanation: "Adverse opinions communicate that the financial statements are not presented fairly due to pervasive misstatement."
  },
  {
    id: "AUD-MCQ-078",
    blueprint: areaIV,
    difficulty: "core",
    stem: "When is a disclaimer of opinion generally appropriate?",
    correct: "The auditor cannot obtain sufficient appropriate evidence and possible effects are material and pervasive.",
    distractors: [
      ["A material but not pervasive misstatement is identified.", "That generally leads to a qualified opinion."],
      ["The auditor wants to emphasize a disclosed uncertainty.", "Emphasis does not require disclaimer when evidence is sufficient."],
      ["All significant risks were addressed with persuasive evidence.", "That supports forming an opinion."]
    ],
    explanation: "A pervasive scope limitation can prevent the auditor from forming an opinion."
  },
  {
    id: "AUD-MCQ-079",
    blueprint: areaIV,
    difficulty: "introductory",
    stem: "What is the purpose of an emphasis-of-matter paragraph?",
    correct: "To draw attention to a matter appropriately presented or disclosed that is fundamental to users' understanding.",
    distractors: [
      ["To correct a material misstatement.", "Emphasis does not correct misstatement."],
      ["To replace management's note disclosure.", "The paragraph refers to disclosure; it does not replace it."],
      ["To disclaim responsibility for the audit.", "The auditor remains responsible for the opinion."]
    ],
    explanation: "Emphasis paragraphs highlight important appropriately disclosed matters without modifying the opinion."
  },
  {
    id: "AUD-MCQ-080",
    blueprint: areaIV,
    difficulty: "core",
    stem: "Which event is a recognized subsequent event?",
    correct: "A customer bankruptcy after year-end confirms the customer's poor financial condition at year-end.",
    distractors: [
      ["A fire after year-end destroys a new warehouse with no year-end condition.", "That is generally nonrecognized but may require disclosure."],
      ["A stock split approved after year-end changes future shares only.", "This may require disclosure or retroactive presentation depending on framework, but not because it confirms a year-end loss."],
      ["A new contract is signed after report release.", "A new contract usually does not recognize a year-end condition."]
    ],
    explanation: "Recognized subsequent events provide evidence about conditions existing at the balance sheet date."
  },
  {
    id: "AUD-MCQ-081",
    blueprint: areaIV,
    difficulty: "advanced",
    stem: "Management refuses to correct a material inventory overstatement that is not pervasive. What report is most likely?",
    correct: "Qualified opinion due to material misstatement.",
    distractors: [
      ["Unmodified opinion with no additional paragraph.", "A material uncorrected misstatement prevents an unmodified opinion."],
      ["Adverse opinion.", "Adverse is generally for material and pervasive misstatement."],
      ["Disclaimer of opinion.", "Disclaimer is for inability to obtain evidence, not known nonpervasive misstatement."]
    ],
    explanation: "Known material but nonpervasive misstatement generally results in a qualified opinion."
  },
  {
    id: "AUD-MCQ-082",
    blueprint: areaIV,
    difficulty: "core",
    stem: "Which matter most likely requires an other-matter paragraph?",
    correct: "The auditor is reporting on prior-period financial statements audited by a predecessor auditor.",
    distractors: [
      ["A material misstatement in current revenue.", "Misstatement affects the opinion, not simply other matter."],
      ["A disclosed going concern uncertainty.", "Going concern may require a separate going concern section or emphasis depending on standards."],
      ["An uncorrected pervasive GAAP departure.", "That generally leads to adverse opinion."]
    ],
    explanation: "Other-matter paragraphs refer to matters other than those presented or disclosed in the financial statements."
  },
  {
    id: "AUD-MCQ-083",
    blueprint: areaIV,
    difficulty: "core",
    stem: "What is the auditor's responsibility for other information included with audited financial statements?",
    correct: "Read it and consider whether it is materially inconsistent with the audited financial statements or auditor's knowledge.",
    distractors: [
      ["Audit it to the same level as the financial statements.", "Other information is not audited unless separately engaged."],
      ["Ignore it because it is outside the financial statements.", "Auditors have reading and consistency responsibilities."],
      ["Automatically modify the opinion whenever other information exists.", "Existence alone does not require modification."]
    ],
    explanation: "The auditor reads other information for material inconsistencies or apparent material misstatements."
  },
  {
    id: "AUD-MCQ-084",
    blueprint: areaIV,
    difficulty: "introductory",
    stem: "Which condition most directly affects going concern reporting?",
    correct: "Substantial doubt exists and management's disclosures are adequate.",
    distractors: [
      ["All ratios improved and no doubt exists.", "No substantial doubt generally does not require special going concern reporting."],
      ["A minor misclassification was corrected.", "Corrected minor classification does not drive going concern."],
      ["The auditor used confirmations.", "Procedure type does not by itself affect going concern reporting."]
    ],
    explanation: "Going concern reporting depends on substantial doubt, management plans, and adequacy of disclosure."
  },
  {
    id: "AUD-MCQ-085",
    blueprint: areaIV,
    difficulty: "advanced",
    stem: "After report release, the auditor learns of facts that existed at the report date and may have affected the opinion. What should the auditor do first?",
    correct: "Discuss the matter with management and determine whether the financial statements need revision.",
    distractors: [
      ["Automatically reissue the report without investigation.", "The auditor must evaluate the facts first."],
      ["Ignore the facts because the report was already released.", "Later-discovered facts can require action."],
      ["Destroy prior audit documentation.", "Documentation must be preserved."]
    ],
    explanation: "Subsequently discovered facts require discussion, evaluation, and possible steps to prevent reliance."
  },
  {
    id: "AUD-MCQ-086",
    blueprint: areaIVOther,
    difficulty: "core",
    stem: "In a review engagement, what level of assurance is provided?",
    correct: "Limited assurance.",
    distractors: [
      ["Reasonable assurance.", "Reasonable assurance is associated with audits and examinations."],
      ["Absolute assurance.", "Professional services do not provide absolute assurance."],
      ["No assurance with required independence.", "Compilations may provide no assurance; reviews provide limited assurance."]
    ],
    explanation: "Review engagements provide limited assurance primarily through inquiry and analytical procedures."
  },
  {
    id: "AUD-MCQ-087",
    blueprint: areaIVOther,
    difficulty: "core",
    stem: "Which engagement provides reasonable assurance on subject matter other than historical financial statements?",
    correct: "Examination engagement.",
    distractors: [
      ["Review engagement.", "A review provides limited assurance."],
      ["Compilation engagement.", "A compilation provides no assurance."],
      ["Preparation engagement.", "Preparation provides no assurance."]
    ],
    explanation: "Examinations provide reasonable assurance under attestation standards."
  },
  {
    id: "AUD-MCQ-088",
    blueprint: areaIVOther,
    difficulty: "introductory",
    stem: "What assurance is provided in a compilation engagement?",
    correct: "No assurance.",
    distractors: [
      ["Reasonable assurance.", "Reasonable assurance is audit or examination level."],
      ["Limited assurance.", "Limited assurance is review level."],
      ["Absolute assurance.", "Absolute assurance is not provided."]
    ],
    explanation: "A compilation assists with presenting financial information but does not provide assurance."
  },
  {
    id: "AUD-MCQ-089",
    blueprint: areaIVOther,
    difficulty: "core",
    stem: "Which procedure is ordinarily central to a review engagement?",
    correct: "Inquiry and analytical procedures.",
    distractors: [
      ["Observation of inventory and confirmations as required procedures.", "Those are audit-type procedures, not ordinarily central to reviews."],
      ["Testing internal controls for operating effectiveness.", "Control testing is not ordinarily required in a review."],
      ["Issuing an opinion on fair presentation.", "Reviews provide a conclusion, not an audit opinion."]
    ],
    explanation: "Reviews primarily use inquiry and analytical procedures to provide limited assurance."
  },
  {
    id: "AUD-MCQ-090",
    blueprint: areaIV,
    difficulty: "core",
    stem: "Which misstatement is pervasive?",
    correct: "One that is not confined to specific elements or represents a substantial proportion of the statements.",
    distractors: [
      ["Any misstatement above trivial threshold.", "Above trivial is not automatically pervasive."],
      ["Only a misstatement caused by fraud.", "Fraud can be pervasive, but pervasiveness is about financial statement effects."],
      ["Any corrected misstatement.", "Corrected misstatements do not drive opinion modification."]
    ],
    explanation: "Pervasiveness relates to breadth and importance of effects on the financial statements."
  },
  {
    id: "AUD-MCQ-091",
    blueprint: areaIV,
    difficulty: "advanced",
    stem: "Which report effect is most likely when management's disclosures about substantial doubt are inadequate?",
    correct: "Modify the opinion for a material misstatement.",
    distractors: [
      ["Issue an unmodified opinion with no mention.", "Inadequate disclosure can be a material misstatement."],
      ["Disclaim automatically in all cases.", "Inadequate disclosure is not automatically a scope limitation."],
      ["Omit the auditor's responsibilities section.", "Report sections are not omitted to address disclosure problems."]
    ],
    explanation: "Inadequate going concern disclosure is treated as a misstatement and may modify the opinion."
  },
  {
    id: "AUD-MCQ-092",
    blueprint: areaIVOther,
    difficulty: "core",
    stem: "Which statement about preparation engagements is correct?",
    correct: "The accountant prepares financial statements and provides no assurance.",
    distractors: [
      ["The accountant must issue an audit opinion.", "Preparation is not an audit."],
      ["The accountant provides limited assurance.", "Limited assurance applies to reviews."],
      ["The accountant must verify all account balances.", "Verification is not required for preparation."]
    ],
    explanation: "Preparation engagements involve preparing financial statements without assurance."
  },
  {
    id: "AUD-MCQ-093",
    blueprint: areaIV,
    difficulty: "core",
    stem: "When should the auditor evaluate uncorrected misstatements?",
    correct: "At or near the conclusion of the audit, individually and in aggregate.",
    distractors: [
      ["Only before planning begins.", "Misstatements are accumulated and evaluated throughout and near conclusion."],
      ["Only after the report is released.", "Evaluation must occur before the report is issued."],
      ["Only if management asks for a schedule.", "The auditor has responsibility regardless of management request."]
    ],
    explanation: "Uncorrected misstatements are evaluated individually and collectively against materiality and qualitative factors."
  },
  {
    id: "AUD-MCQ-094",
    blueprint: areaIV,
    difficulty: "advanced",
    stem: "Which subsequent event procedure is appropriate near the report date?",
    correct: "Read interim financial statements and inquire about events after year-end.",
    distractors: [
      ["Test only opening cash balances.", "Opening cash does not address subsequent events."],
      ["Skip minutes after year-end.", "Post-year-end minutes can reveal subsequent events."],
      ["Rely only on prior-year procedures.", "Current subsequent events require current procedures."]
    ],
    explanation: "Subsequent event procedures include inquiry, reading minutes, reading interim statements, and obtaining representations."
  },
  {
    id: "AUD-MCQ-095",
    blueprint: areaIVOther,
    difficulty: "core",
    stem: "Which engagement requires the practitioner to be independent?",
    correct: "Review of financial statements.",
    distractors: [
      ["Preparation of financial statements under SSARS.", "Preparation does not require independence, though disclosure may be needed."],
      ["Bookkeeping with no assurance report.", "Bookkeeping alone does not require attest independence."],
      ["Tax return preparation.", "Tax return preparation is not an attest engagement."]
    ],
    explanation: "Reviews require independence because they provide assurance."
  },
  {
    id: "AUD-MCQ-096",
    blueprint: areaIV,
    difficulty: "core",
    stem: "Which condition supports an unmodified opinion?",
    correct: "Sufficient appropriate evidence is obtained and statements are fairly presented in all material respects.",
    distractors: [
      ["A pervasive scope limitation exists.", "A pervasive scope limitation prevents an unmodified opinion."],
      ["A material GAAP departure is uncorrected.", "Uncorrected material departures require modification."],
      ["The auditor lacks independence.", "Independence is required to issue an audit opinion."]
    ],
    explanation: "An unmodified opinion requires sufficient evidence and fair presentation in all material respects."
  },
  {
    id: "AUD-MCQ-097",
    blueprint: areaIVOther,
    difficulty: "advanced",
    stem: "In an attestation review, what form of conclusion is generally expressed?",
    correct: "A conclusion in negative form providing limited assurance.",
    distractors: [
      ["An opinion in positive form providing reasonable assurance.", "That describes examination-level assurance."],
      ["No conclusion of any kind.", "A review provides a limited assurance conclusion."],
      ["A guarantee that criteria are perfectly met.", "No attestation engagement provides a guarantee."]
    ],
    explanation: "Attestation reviews provide limited assurance, often expressed in negative form."
  },
  {
    id: "AUD-MCQ-098",
    blueprint: areaIV,
    difficulty: "core",
    stem: "Which matter is most likely communicated as a significant deficiency or material weakness?",
    correct: "A control deficiency important enough to merit attention by those charged with governance.",
    distractors: [
      ["Any corrected posting error below trivial threshold.", "Trivial corrected errors are not necessarily control deficiencies."],
      ["Every routine audit adjustment.", "Routine adjustments are evaluated but not automatically deficiencies."],
      ["Every question asked by the audit committee.", "Questions are not deficiencies by themselves."]
    ],
    explanation: "Significant deficiencies and material weaknesses are communicated to management and those charged with governance."
  },
  {
    id: "AUD-MCQ-099",
    blueprint: areaIV,
    difficulty: "advanced",
    stem: "Which report is most appropriate when the auditor is not independent but is associated with financial statements?",
    correct: "A disclaimer stating the auditor is not independent.",
    distractors: [
      ["An unmodified audit opinion.", "Independence is required for an audit opinion."],
      ["A qualified opinion due to GAAP departure.", "The issue is independence, not a GAAP departure."],
      ["An adverse opinion due to pervasiveness.", "Adverse opinions address pervasive misstatement, not independence."]
    ],
    explanation: "An accountant not independent cannot express an audit opinion and should disclaim as required when associated."
  },
  {
    id: "AUD-MCQ-100",
    blueprint: areaIV,
    difficulty: "core",
    stem: "What is the auditor's final responsibility for the audit opinion?",
    correct: "Evaluate whether sufficient appropriate evidence supports the opinion on the financial statements.",
    distractors: [
      ["Certify that the client is profitable.", "Profitability is not certified by the audit opinion."],
      ["Approve management's business strategy.", "Business strategy remains management's responsibility."],
      ["Guarantee that future fraud will not occur.", "Audits do not guarantee future outcomes."]
    ],
    explanation: "The auditor forms an opinion based on evidence obtained and conclusions reached."
  }
];

type SupplementalTopic = {
  blueprint: AudBlueprintTag;
  difficulty: AudDifficulty;
  subject: string;
  scenario: string;
  concern: string;
  bestAction: string;
  evidence: string;
  principle: string;
  conclusion: string;
  documentation: string;
};

const supplementalAreaITopics: SupplementalTopic[] = [
  {
    blueprint: areaI,
    difficulty: "core",
    subject: "bookkeeping assistance for an audit client",
    scenario: "Management asks the audit team to record recurring lease entries and then audit the lease liability.",
    concern: "a management participation or self-review threat",
    bestAction: "Require management to approve all entries and accept responsibility before the firm performs any permissible assistance.",
    evidence: "Management's documented approval of assumptions, journal entries, and responsibility for the financial statements.",
    principle: "The auditor may provide limited assistance only when management makes significant judgments and accepts responsibility.",
    conclusion: "Independence is impaired if the auditor authorizes or approves the client's entries.",
    documentation: "Document management's responsibility, the safeguards applied, and the specific tasks the auditor declined to perform."
  },
  {
    blueprint: areaI,
    difficulty: "introductory",
    subject: "client gifts during an audit",
    scenario: "The controller sends each engagement team member a high-value electronics item during final fieldwork.",
    concern: "an undue influence or self-interest threat to objectivity",
    bestAction: "Return the gift and remind the client that only clearly insignificant hospitality is acceptable.",
    evidence: "The firm's independence consultation record and the engagement team's confirmation that the gift was returned.",
    principle: "Gifts from an attest client must be evaluated for significance and effect on objectivity.",
    conclusion: "The team should not keep a valuable client gift while performing the audit.",
    documentation: "Document the gift, the independence evaluation, the action taken, and any required firm consultation."
  },
  {
    blueprint: areaI,
    difficulty: "core",
    subject: "long-outstanding audit fees",
    scenario: "An issuer audit client has not paid prior-year audit fees, and the new audit is about to begin.",
    concern: "the unpaid fees may resemble a loan from the auditor to the client",
    bestAction: "Resolve the unpaid fee independence issue before accepting or continuing the new audit.",
    evidence: "Billing records, payment status, and the firm's independence conclusion before engagement acceptance.",
    principle: "Independence can be impaired when prior-year fees remain unpaid for an extended period.",
    conclusion: "The firm should not ignore unpaid fees when deciding whether it can continue the audit.",
    documentation: "Document the fee status, consultation, and acceptance or continuance decision."
  },
  {
    blueprint: areaI,
    difficulty: "core",
    subject: "referral compensation from an audit client",
    scenario: "A partner expects a referral fee from the audit client for recommending the client's payroll service to another company.",
    concern: "a financial self-interest threat connected to the client relationship",
    bestAction: "Decline the referral fee or remove the independence threat before continuing the attest engagement.",
    evidence: "The referral arrangement, compensation terms, and firm independence consultation.",
    principle: "Compensation arrangements with an attest client can impair independence when they create financial dependence or bias.",
    conclusion: "The partner should not accept undisclosed client referral compensation while serving the audit client.",
    documentation: "Document the compensation arrangement, safeguards, and final independence conclusion."
  },
  {
    blueprint: areaI,
    difficulty: "advanced",
    subject: "employment negotiations with an audit client",
    scenario: "The engagement manager begins discussing a controller role with the audit client before audit procedures are complete.",
    concern: "a familiarity or self-interest threat affecting audit judgments",
    bestAction: "Remove the manager from the engagement until the employment matter is resolved and independence is evaluated.",
    evidence: "Communication records about the prospective employment and the firm's reassignment decision.",
    principle: "Employment negotiations with an attest client require safeguards because they can compromise objectivity.",
    conclusion: "The manager should not continue making audit judgments while negotiating employment with the client.",
    documentation: "Document the timing of negotiations, the affected work, safeguards, and review of prior judgments."
  },
  {
    blueprint: areaIGeneral,
    difficulty: "core",
    subject: "client pressure to accelerate report release",
    scenario: "Management threatens to replace the audit firm unless the opinion is released before inventory count issues are resolved.",
    concern: "an intimidation threat and potential scope pressure",
    bestAction: "Escalate the matter within the firm and with those charged with governance before deciding whether to continue.",
    evidence: "Written communications describing management's pressure and the unresolved inventory evidence.",
    principle: "Due care and professional skepticism require sufficient appropriate evidence before issuing the report.",
    conclusion: "The auditor should not release the report solely to satisfy management's deadline.",
    documentation: "Document the pressure, unresolved procedures, consultations, and communications with governance."
  },
  {
    blueprint: areaIGeneral,
    difficulty: "introductory",
    subject: "engagement terms",
    scenario: "A first-year audit begins before the client has acknowledged the objective, scope, and management responsibilities.",
    concern: "unclear responsibilities and possible misunderstanding about the engagement",
    bestAction: "Obtain an agreed engagement letter before substantive audit work proceeds.",
    evidence: "A signed engagement letter describing scope, responsibilities, reporting, and inherent limitations.",
    principle: "The auditor should establish a mutual understanding of engagement terms with management or governance.",
    conclusion: "Beginning significant work without agreed terms creates avoidable engagement risk.",
    documentation: "Retain the executed engagement letter and any changes to the agreed terms."
  },
  {
    blueprint: areaIGeneral,
    difficulty: "core",
    subject: "predecessor auditor communications",
    scenario: "A prospective audit client refuses to allow communication with the predecessor auditor.",
    concern: "management may be concealing disputes, integrity issues, or audit problems",
    bestAction: "Consider the refusal in deciding whether to accept the engagement.",
    evidence: "The client's refusal, requested communications, and any alternative acceptance information obtained.",
    principle: "Predecessor communication is an important acceptance procedure for a change in auditors.",
    conclusion: "The refusal is a significant acceptance risk and should not be treated as routine.",
    documentation: "Document the request, refusal, acceptance conclusion, and basis for any decision to proceed."
  },
  {
    blueprint: areaIGeneral,
    difficulty: "advanced",
    subject: "consultation on a difficult audit judgment",
    scenario: "The team disagrees about whether a material lease error is pervasive to the financial statements.",
    concern: "an unresolved complex judgment affecting the audit report",
    bestAction: "Consult with the firm's technical resources and resolve the matter before report release.",
    evidence: "The technical consultation memo and conclusion about materiality and pervasiveness.",
    principle: "Quality management policies require appropriate consultation and resolution of difficult matters.",
    conclusion: "The team should not issue the report while a significant reporting disagreement remains unresolved.",
    documentation: "Document the consultation request, advice received, resolution, and engagement partner approval."
  },
  {
    blueprint: areaIGeneral,
    difficulty: "core",
    subject: "audit documentation retention",
    scenario: "After report release, a senior wants to delete notes about a resolved inventory exception to make the file cleaner.",
    concern: "improper alteration of audit documentation after assembly",
    bestAction: "Retain the documentation and add a dated explanation only if a permitted post-release change is necessary.",
    evidence: "The original workpaper, review notes, and dated explanation for any permitted file change.",
    principle: "Audit documentation should preserve the record of work performed, evidence obtained, and conclusions reached.",
    conclusion: "Deleting relevant audit evidence after report release is inappropriate.",
    documentation: "Document who made any post-release addition, when it was made, and why it was necessary."
  },
  {
    blueprint: areaI,
    difficulty: "core",
    subject: "confidential client information",
    scenario: "A lender asks the auditor for detailed audit workpapers without client consent or legal compulsion.",
    concern: "improper disclosure of confidential client information",
    bestAction: "Decline to provide workpapers unless the client consents or disclosure is otherwise required.",
    evidence: "Client authorization, subpoena, peer review request, or other basis permitting disclosure.",
    principle: "Confidential client information generally cannot be disclosed without proper authorization.",
    conclusion: "The auditor should not send workpapers to the lender merely because the lender requests them.",
    documentation: "Document the request, the confidentiality analysis, client consent if obtained, and materials provided."
  },
  {
    blueprint: areaIGeneral,
    difficulty: "introductory",
    subject: "competence for a specialized client",
    scenario: "The firm is asked to audit a crypto custody platform but has no staff with relevant custody or IT expertise.",
    concern: "whether the firm can perform the engagement with professional competence",
    bestAction: "Accept only if the firm can obtain sufficient expertise and supervision for the engagement.",
    evidence: "The staffing plan, specialist involvement, training plan, and engagement quality review decision.",
    principle: "Due care requires the auditor to possess or obtain the competence needed for the engagement.",
    conclusion: "The firm should not accept a specialized audit without a credible competence plan.",
    documentation: "Document the competence assessment, specialist plan, and acceptance conclusion."
  },
  {
    blueprint: areaIGeneral,
    difficulty: "core",
    subject: "professional skepticism",
    scenario: "Management explains an unusual margin increase but refuses to provide customer-level support.",
    concern: "risk that management's explanation is biased or incomplete",
    bestAction: "Corroborate management's explanation with independent or detailed audit evidence.",
    evidence: "Customer invoices, contracts, shipping records, and margin analysis by product or customer.",
    principle: "Professional skepticism requires a questioning mind and critical assessment of audit evidence.",
    conclusion: "Management's plausible explanation does not eliminate the need for corroboration.",
    documentation: "Document contradictory evidence considered, procedures performed, and the basis for the conclusion."
  },
  {
    blueprint: areaIGeneral,
    difficulty: "core",
    subject: "communications with those charged with governance",
    scenario: "The audit team identifies significant deficiencies in revenue controls during interim testing.",
    concern: "timely governance awareness of important control matters",
    bestAction: "Communicate significant deficiencies to those charged with governance in writing.",
    evidence: "The control deficiency evaluation and the written governance communication.",
    principle: "Significant deficiencies and material weaknesses should be communicated to governance.",
    conclusion: "The team should not wait until the next year's planning meeting to communicate significant deficiencies.",
    documentation: "Document the deficiency, severity assessment, communication date, and recipients."
  },
  {
    blueprint: areaIGeneral,
    difficulty: "core",
    subject: "management responsibilities in an audit",
    scenario: "The CEO says the auditor is responsible for designing controls that prevent all financial statement fraud.",
    concern: "misunderstanding of management's responsibility for financial statements and internal control",
    bestAction: "Clarify management's responsibilities in the engagement terms and representation process.",
    evidence: "The engagement letter and management representation letter acknowledging responsibilities.",
    principle: "Management is responsible for the financial statements, internal control, and preventing and detecting fraud.",
    conclusion: "The auditor does not assume management's responsibility for internal control.",
    documentation: "Retain acknowledgments of management responsibility and communications resolving the misunderstanding."
  }
];

const supplementalAreaIITopics: SupplementalTopic[] = [
  {
    blueprint: areaII,
    difficulty: "advanced",
    subject: "manual revenue invoices near year-end",
    scenario: "Revenue increased sharply in December, and several large invoices were manually entered after shipping system downtime.",
    concern: "improper revenue cutoff or fictitious sales",
    bestAction: "Increase cutoff and occurrence testing for manual December invoices and related January returns.",
    evidence: "Shipping documents, customer orders, invoices, cash receipts, and credit memos around year-end.",
    principle: "Risks of material misstatement should drive the nature, timing, and extent of planned procedures.",
    conclusion: "Manual year-end revenue entries create a significant risk that requires a specific audit response.",
    documentation: "Document the identified revenue risk, related assertions, and planned response."
  },
  {
    blueprint: areaII,
    difficulty: "core",
    subject: "obsolete inventory indicators",
    scenario: "Inventory quantities rose while sales declined and warehouse reports show slow-moving product lines.",
    concern: "overstatement of inventory valuation",
    bestAction: "Plan procedures to evaluate net realizable value and obsolete inventory reserves.",
    evidence: "Inventory aging, post-year-end sales, write-down history, and product margin data.",
    principle: "Risk assessment should consider business conditions that affect relevant assertions.",
    conclusion: "The decline in sales and aging inventory increase valuation risk.",
    documentation: "Document valuation risk factors, affected assertions, and planned reserve testing."
  },
  {
    blueprint: areaII,
    difficulty: "advanced",
    subject: "going concern covenant pressure",
    scenario: "The client forecasts a covenant violation within eight months unless a refinancing closes.",
    concern: "substantial doubt about the entity's ability to continue as a going concern",
    bestAction: "Evaluate management's going concern plans and plan procedures over forecast assumptions.",
    evidence: "Cash flow forecasts, debt agreements, lender correspondence, and refinancing evidence.",
    principle: "The auditor must evaluate conditions and events that raise substantial doubt for a reasonable period.",
    conclusion: "The covenant pressure is a going concern risk that affects audit planning.",
    documentation: "Document the going concern conditions, management plans, and planned audit response."
  },
  {
    blueprint: areaII,
    difficulty: "core",
    subject: "related-party transactions",
    scenario: "The procurement director approved purchases from a new vendor owned by a close family member.",
    concern: "undisclosed related-party transactions and possible non-arm's-length terms",
    bestAction: "Plan procedures to identify, understand, and test the related-party arrangement.",
    evidence: "Vendor ownership records, board minutes, contracts, payment history, and management inquiries.",
    principle: "Related-party relationships can create risks that require targeted audit attention.",
    conclusion: "The vendor relationship should be treated as a related-party risk indicator.",
    documentation: "Document identified relationships, transaction terms, and planned procedures."
  },
  {
    blueprint: areaII,
    difficulty: "core",
    subject: "use of a payroll service organization",
    scenario: "Payroll processing is outsourced, and the client relies on the service organization for payroll calculations.",
    concern: "whether controls at the service organization affect payroll assertions",
    bestAction: "Determine whether a relevant SOC report is available and evaluate complementary user controls.",
    evidence: "The SOC report, bridge letter if needed, user control descriptions, and payroll reconciliations.",
    principle: "The auditor should understand services and controls relevant to the user entity's financial reporting.",
    conclusion: "Outsourced payroll does not eliminate the need to understand relevant controls.",
    documentation: "Document the service organization reliance, SOC report evaluation, and user-control testing plan."
  },
  {
    blueprint: areaIIControls,
    difficulty: "advanced",
    subject: "privileged system access",
    scenario: "Database administrators can change pricing tables in production without independent approval.",
    concern: "unauthorized changes to revenue processing",
    bestAction: "Assess IT general control risk and plan direct testing of pricing changes and invoices.",
    evidence: "User access listings, change logs, approval records, and recalculated invoice prices.",
    principle: "Weak IT general controls can undermine reliance on automated application controls.",
    conclusion: "Unrestricted production access increases risk in automated revenue calculations.",
    documentation: "Document the access weakness, affected application controls, and revised audit response."
  },
  {
    blueprint: areaII,
    difficulty: "advanced",
    subject: "management's fair value estimate",
    scenario: "The CFO changed discount-rate assumptions for a material private investment without support.",
    concern: "management bias in a significant accounting estimate",
    bestAction: "Plan estimate procedures focused on assumptions, source data, and contradictory evidence.",
    evidence: "Valuation model support, market data, historical forecasts, and specialist analysis.",
    principle: "Estimates with high estimation uncertainty require more persuasive audit evidence.",
    conclusion: "Unsupported assumption changes increase risk of material misstatement.",
    documentation: "Document the estimate risk, significant assumptions, and planned testing approach."
  },
  {
    blueprint: areaIIControls,
    difficulty: "core",
    subject: "fraud incentives in bonus calculations",
    scenario: "Executive bonuses are triggered if fourth-quarter revenue exceeds a target by two percent.",
    concern: "incentive or pressure to overstate revenue",
    bestAction: "Identify fraud risks related to revenue recognition and design responsive procedures.",
    evidence: "Bonus plans, revenue trends, manual journal entries, contracts, and cutoff testing results.",
    principle: "Fraud risk assessment considers incentives, opportunities, and rationalizations.",
    conclusion: "The bonus target creates a fraud risk factor that should affect planning.",
    documentation: "Document the fraud brainstorming, risk factors, and planned audit response."
  },
  {
    blueprint: areaII,
    difficulty: "introductory",
    subject: "materiality in planning",
    scenario: "The client has stable income but a new loan covenant based on current ratio.",
    concern: "whether benchmark selection and performance materiality address covenant sensitivity",
    bestAction: "Set planning materiality and performance materiality considering users and covenant risk.",
    evidence: "Financial statement benchmarks, covenant terms, users' needs, and prior misstatement history.",
    principle: "Materiality is based on what could influence users' economic decisions.",
    conclusion: "Covenant sensitivity may affect planning judgments even if income is stable.",
    documentation: "Document benchmark selection, qualitative factors, and performance materiality rationale."
  },
  {
    blueprint: areaII,
    difficulty: "advanced",
    subject: "group audit component risk",
    scenario: "A foreign component holds most inventory and uses a local accounting system not used elsewhere.",
    concern: "component-specific risks affecting group financial statements",
    bestAction: "Determine component materiality and instruct component auditors on targeted risk procedures.",
    evidence: "Component financial data, inventory controls, component auditor communications, and consolidation entries.",
    principle: "Group audit planning should address significant components and risks of material misstatement.",
    conclusion: "The foreign component requires more than routine consolidation analytics.",
    documentation: "Document component scoping, instructions, materiality, and review of component work."
  },
  {
    blueprint: areaII,
    difficulty: "core",
    subject: "sampling design for control testing",
    scenario: "The auditor plans to rely on purchase approval controls that operate hundreds of times per month.",
    concern: "whether the sample design supports reliance on the control",
    bestAction: "Define the population, control deviation, tolerable deviation rate, and sample selection method.",
    evidence: "The complete purchase population, approval evidence, and selected sample items.",
    principle: "Audit sampling should be designed to provide a reasonable basis for conclusions about the population.",
    conclusion: "A vague sample plan would not support reliance on the purchase approval control.",
    documentation: "Document the population, sampling parameters, selected items, deviations, and conclusion."
  },
  {
    blueprint: areaIIControls,
    difficulty: "advanced",
    subject: "management override of controls",
    scenario: "The CFO posts consolidation entries directly after the accounting close without review.",
    concern: "management override through journal entries",
    bestAction: "Plan journal entry testing focused on unusual, late, and senior-management entries.",
    evidence: "Journal entry populations, user access data, approval logs, and supporting documentation.",
    principle: "Management override is a fraud risk that requires specific audit procedures.",
    conclusion: "Senior-management close entries are a direct planning risk.",
    documentation: "Document journal entry risk criteria, selected entries, and planned testing."
  },
  {
    blueprint: areaII,
    difficulty: "core",
    subject: "planning analytical procedures",
    scenario: "Gross margin increased from 28 percent to 41 percent while sales volume stayed flat.",
    concern: "unusual relationships indicating possible misstatement",
    bestAction: "Investigate the unexpected relationship and adjust planned procedures for affected accounts.",
    evidence: "Disaggregated sales and cost data, price changes, product mix reports, and margin explanations.",
    principle: "Planning analytics help identify areas that may represent risks of material misstatement.",
    conclusion: "The margin change should not be dismissed without corroboration.",
    documentation: "Document expected relationships, thresholds, differences, and planned responses."
  },
  {
    blueprint: areaII,
    difficulty: "core",
    subject: "noncompliance with laws and regulations",
    scenario: "The client received a regulator warning about improper revenue-sharing contracts.",
    concern: "possible illegal acts affecting amounts or disclosures",
    bestAction: "Understand the matter, assess financial statement effects, and consider legal specialist involvement.",
    evidence: "Regulatory correspondence, contracts, legal letters, board minutes, and management responses.",
    principle: "The auditor considers laws and regulations that may materially affect the financial statements.",
    conclusion: "The warning letter is relevant to risk assessment and disclosure planning.",
    documentation: "Document the identified noncompliance risk, inquiries, evidence, and planned response."
  },
  {
    blueprint: areaIIControls,
    difficulty: "core",
    subject: "segregation of duties in cash receipts",
    scenario: "One clerk opens mail, records receipts, and prepares the daily bank deposit.",
    concern: "misappropriation of cash receipts before recording or deposit",
    bestAction: "Assess control deficiency severity and plan procedures over cash receipt completeness.",
    evidence: "Cash receipt logs, bank deposit records, remittance advices, and reconciliation reviews.",
    principle: "Segregation of custody, recording, and authorization reduces opportunity for misappropriation.",
    conclusion: "The combined duties create a control deficiency relevant to planning.",
    documentation: "Document the control deficiency, severity evaluation, and planned substantive response."
  }
];

const supplementalAreaIIITopics: SupplementalTopic[] = [
  {
    blueprint: areaIII,
    difficulty: "core",
    subject: "accounts receivable confirmation nonresponses",
    scenario: "Several large positive confirmations did not receive replies after a second request.",
    concern: "whether receivables exist and are collectible",
    bestAction: "Perform alternative procedures for each nonresponse rather than treating it as evidence.",
    evidence: "Subsequent cash receipts, shipping documents, invoices, and customer correspondence.",
    principle: "A nonresponse to a positive confirmation does not provide audit evidence about the assertion.",
    conclusion: "The auditor needs alternative evidence before concluding on the nonresponding balances.",
    documentation: "Document follow-up requests, alternative procedures performed, and conclusions for each item."
  },
  {
    blueprint: areaIII,
    difficulty: "core",
    subject: "inventory observation",
    scenario: "The client counts inventory at a remote warehouse that holds a material balance.",
    concern: "existence and condition of inventory",
    bestAction: "Attend the count or perform appropriate alternative procedures if attendance is impracticable.",
    evidence: "Count sheets, auditor test counts, condition observations, roll-forward records, and shipping logs.",
    principle: "Physical observation provides evidence about existence and condition when inventory is material.",
    conclusion: "The remote location cannot be excluded merely because it is inconvenient.",
    documentation: "Document locations attended, test counts, count instructions, exceptions, and roll-forward work."
  },
  {
    blueprint: areaIII,
    difficulty: "core",
    subject: "search for unrecorded liabilities",
    scenario: "January disbursements include payments for goods received before year-end.",
    concern: "completeness of accounts payable and accrued expenses",
    bestAction: "Trace subsequent disbursements and unmatched receiving reports to year-end liabilities.",
    evidence: "Subsequent cash disbursement records, receiving reports, vendor invoices, and payable listings.",
    principle: "Completeness testing often starts from source evidence outside the recorded account balance.",
    conclusion: "Payments after year-end can reveal liabilities omitted at year-end.",
    documentation: "Document the search period, items selected, tracing results, and proposed adjustments."
  },
  {
    blueprint: areaIII,
    difficulty: "core",
    subject: "cash bank reconciliations",
    scenario: "The year-end bank reconciliation includes old reconciling items and a large deposit in transit.",
    concern: "cash existence, cutoff, and possible misappropriation",
    bestAction: "Test reconciling items to bank statements and supporting cash receipt or disbursement records.",
    evidence: "Bank confirmations, cutoff bank statements, deposit support, outstanding checks, and reconciliations.",
    principle: "External bank evidence and cutoff procedures provide persuasive evidence for cash.",
    conclusion: "Old or unusual reconciling items require follow-up rather than acceptance.",
    documentation: "Document reconciling item testing, bank confirmation results, and unresolved differences."
  },
  {
    blueprint: areaIII,
    difficulty: "core",
    subject: "sales cutoff testing",
    scenario: "Large shipments occurred on the last two days of the year and the first two days after year-end.",
    concern: "revenue recorded in the wrong period",
    bestAction: "Compare shipping terms, shipment dates, invoices, and revenue entries around year-end.",
    evidence: "Bills of lading, sales invoices, customer terms, revenue entries, and credit memos.",
    principle: "Cutoff procedures test whether transactions are recorded in the proper accounting period.",
    conclusion: "Year-end sales activity requires transaction-level evidence about transfer timing.",
    documentation: "Document cutoff population, selected transactions, evidence inspected, and misstatements found."
  },
  {
    blueprint: areaIIIData,
    difficulty: "advanced",
    subject: "use of an auditor's valuation specialist",
    scenario: "The audit team lacks expertise to evaluate a complex derivative valuation.",
    concern: "whether sufficient appropriate evidence can be obtained for a complex estimate",
    bestAction: "Use a qualified valuation specialist and evaluate the specialist's work and conclusions.",
    evidence: "Specialist qualifications, valuation method, assumptions, source data, and final report.",
    principle: "The auditor remains responsible for evaluating specialist work used as audit evidence.",
    conclusion: "Using a specialist does not transfer the audit conclusion to the specialist.",
    documentation: "Document specialist competence, objectivity, scope, work reviewed, and audit conclusion."
  },
  {
    blueprint: areaIIIData,
    difficulty: "advanced",
    subject: "reliability of client-produced data",
    scenario: "The auditor uses a system-generated sales report to select transactions for testing.",
    concern: "whether the report is complete and accurate",
    bestAction: "Test the report's completeness and accuracy before relying on it as audit evidence.",
    evidence: "Report parameters, reconciliation to the general ledger, IT controls, and selected source records.",
    principle: "Audit evidence produced by the entity must be evaluated for reliability.",
    conclusion: "A report generated by the client system is not automatically reliable.",
    documentation: "Document report source, parameters, reliability procedures, and reconciliation results."
  },
  {
    blueprint: areaIII,
    difficulty: "advanced",
    subject: "control sample deviations",
    scenario: "A sample of purchase approvals includes several items approved after the purchase order date.",
    concern: "whether the control operated effectively throughout the period",
    bestAction: "Evaluate the nature and cause of deviations and determine the effect on planned reliance.",
    evidence: "Approval timestamps, purchase orders, exception explanations, and expanded testing if needed.",
    principle: "Control deviations must be evaluated for severity and impact on control reliance.",
    conclusion: "Late approvals may indicate the control did not prevent unauthorized purchases.",
    documentation: "Document deviations, cause analysis, revised control reliance, and effect on substantive testing."
  },
  {
    blueprint: areaIII,
    difficulty: "core",
    subject: "reperformance of a control",
    scenario: "The client states that three-way matching prevents payment for unmatched vendor invoices.",
    concern: "whether the control operates as designed",
    bestAction: "Reperform the matching control for selected transactions using purchase orders, receiving reports, and invoices.",
    evidence: "Purchase orders, receiving reports, vendor invoices, match exceptions, and approval records.",
    principle: "Reperformance can provide direct evidence about the operating effectiveness of a control.",
    conclusion: "Inquiry alone is not enough to support reliance on the three-way match.",
    documentation: "Document selected items, reperformance steps, exceptions, and control conclusion."
  },
  {
    blueprint: areaIIIData,
    difficulty: "advanced",
    subject: "complementary user controls for a service organization",
    scenario: "The SOC report says payroll controls assume the user entity reviews payroll change reports.",
    concern: "whether required user controls are implemented by the client",
    bestAction: "Test the client's review of payroll change reports before relying on the SOC report control objectives.",
    evidence: "Payroll change reports, reviewer sign-offs, exception follow-up, and SOC report control descriptions.",
    principle: "Complementary user controls must operate at the user entity for service organization controls to be effective.",
    conclusion: "A clean SOC report may not support reliance if required user controls are absent.",
    documentation: "Document the SOC report period, complementary user controls, testing, and reliance conclusion."
  },
  {
    blueprint: areaIII,
    difficulty: "core",
    subject: "subsequent cash receipts",
    scenario: "A material receivable was collected in full two weeks after year-end.",
    concern: "existence and valuation of the receivable",
    bestAction: "Inspect the subsequent cash receipt and link it to the year-end receivable balance.",
    evidence: "Bank statement deposit, remittance advice, customer account detail, and invoice records.",
    principle: "Subsequent cash receipts can provide evidence about receivable existence and collectibility.",
    conclusion: "The collection supports the balance only if it is traced to the year-end invoice.",
    documentation: "Document the receipt date, amount, invoice link, and any remaining balance."
  },
  {
    blueprint: areaIII,
    difficulty: "core",
    subject: "legal letter evidence",
    scenario: "Management discloses pending litigation that could result in a material loss.",
    concern: "completeness and evaluation of litigation contingencies",
    bestAction: "Request a legal letter from external counsel and evaluate management's accounting and disclosure.",
    evidence: "Attorney responses, board minutes, management assessment, and financial statement disclosures.",
    principle: "External legal responses help corroborate management's litigation assertions.",
    conclusion: "Management inquiry alone is weak evidence for material litigation contingencies.",
    documentation: "Document legal letter requests, responses, unresolved matters, and disclosure conclusions."
  },
  {
    blueprint: areaIIIData,
    difficulty: "advanced",
    subject: "retrospective review of estimates",
    scenario: "Prior-year warranty reserves were consistently lower than actual claims paid.",
    concern: "possible management bias in current-year warranty estimates",
    bestAction: "Compare prior estimates with actual outcomes and consider bias in current assumptions.",
    evidence: "Prior reserve calculations, actual claims data, current assumptions, and trend analysis.",
    principle: "Retrospective review helps identify possible bias in accounting estimates.",
    conclusion: "Prior underestimation is relevant to evaluating the current reserve.",
    documentation: "Document the lookback analysis, bias indicators, and effect on current estimate testing."
  },
  {
    blueprint: areaIII,
    difficulty: "core",
    subject: "confirmation exceptions",
    scenario: "A customer confirmation says the balance is lower because goods were returned before year-end.",
    concern: "existence, cutoff, and valuation of receivables and revenue",
    bestAction: "Investigate the exception by tracing returns, credit memos, and shipping records.",
    evidence: "Customer response, return authorization, receiving records, credit memo, and invoice detail.",
    principle: "Confirmation exceptions require evaluation to determine whether they indicate misstatement.",
    conclusion: "The exception should not be dismissed as a timing difference without support.",
    documentation: "Document the exception, follow-up evidence, conclusion, and any adjustment proposed."
  },
  {
    blueprint: areaIII,
    difficulty: "introductory",
    subject: "persuasiveness of audit evidence",
    scenario: "The auditor has a choice between client-prepared schedules and direct third-party evidence.",
    concern: "selecting evidence with sufficient reliability",
    bestAction: "Place greater weight on independent external evidence when it is relevant and reliable.",
    evidence: "Direct confirmations, bank statements, and third-party documents received by the auditor.",
    principle: "Evidence from independent external sources is generally more reliable than internally generated evidence.",
    conclusion: "Client-prepared schedules usually require corroboration for significant assertions.",
    documentation: "Document the evidence source, reliability considerations, and corroborating procedures."
  }
];

const supplementalAreaIVTopics: SupplementalTopic[] = [
  {
    blueprint: areaIV,
    difficulty: "advanced",
    subject: "known material inventory misstatement",
    scenario: "Management refuses to record an inventory write-down that is material but limited to one product line.",
    concern: "a material but not pervasive misstatement",
    bestAction: "Propose the adjustment and modify the opinion if management refuses to correct the misstatement.",
    evidence: "Inventory aging, post-year-end sales, valuation analysis, and the summary of uncorrected misstatements.",
    principle: "A material nonpervasive misstatement generally results in a qualified opinion.",
    conclusion: "A qualified opinion is likely if the write-down remains uncorrected and is not pervasive.",
    documentation: "Document the misstatement, management's refusal, pervasiveness assessment, and reporting conclusion."
  },
  {
    blueprint: areaIV,
    difficulty: "advanced",
    subject: "scope limitation on receivables",
    scenario: "Management will not allow confirmation or alternative procedures for a material receivable balance.",
    concern: "inability to obtain sufficient appropriate evidence",
    bestAction: "Evaluate whether the scope limitation is material and pervasive to determine the reporting effect.",
    evidence: "Management's restriction, unavailable procedures, attempted alternatives, and receivable materiality.",
    principle: "Scope limitations affect the opinion based on materiality and pervasiveness.",
    conclusion: "A disclaimer may be required if the possible effects are material and pervasive.",
    documentation: "Document the restriction, procedures attempted, evidence unavailable, and opinion decision."
  },
  {
    blueprint: areaIV,
    difficulty: "advanced",
    subject: "going concern disclosure",
    scenario: "Substantial doubt exists, and management's disclosures adequately describe the conditions and plans.",
    concern: "appropriate reporting when substantial doubt remains adequately disclosed",
    bestAction: "Include the required going concern explanatory language while otherwise expressing the appropriate opinion.",
    evidence: "Forecasts, debt agreements, management plans, disclosure text, and audit conclusions.",
    principle: "Adequate disclosure of substantial doubt affects report wording but does not automatically require a modified opinion.",
    conclusion: "An unmodified opinion with going concern emphasis may be appropriate when disclosures are adequate.",
    documentation: "Document conditions, management plans, disclosure evaluation, and report wording."
  },
  {
    blueprint: areaIV,
    difficulty: "core",
    subject: "emphasis-of-matter paragraph",
    scenario: "The financial statements appropriately disclose a major subsequent-event lawsuit settlement.",
    concern: "whether to draw users' attention to a properly disclosed matter",
    bestAction: "Consider an emphasis-of-matter paragraph if the matter is fundamental to users' understanding.",
    evidence: "The disclosed note, settlement agreement, materiality analysis, and reporting consultation.",
    principle: "An emphasis-of-matter paragraph refers to a matter appropriately presented or disclosed.",
    conclusion: "An emphasis paragraph does not substitute for a required modification when statements are misstated.",
    documentation: "Document why the matter is fundamental and how the report paragraph is worded."
  },
  {
    blueprint: areaIV,
    difficulty: "core",
    subject: "other information in an annual report",
    scenario: "The annual report includes a CEO letter with revenue growth claims inconsistent with audited revenue.",
    concern: "material inconsistency between other information and audited financial statements",
    bestAction: "Discuss the inconsistency with management and request revision of the other information.",
    evidence: "The annual report draft, audited revenue support, management responses, and revised wording.",
    principle: "The auditor reads other information for material inconsistencies with audited financial statements.",
    conclusion: "The auditor cannot ignore a material inconsistency in other information.",
    documentation: "Document the inconsistency, discussions, revisions requested, and reporting implications."
  },
  {
    blueprint: areaIV,
    difficulty: "core",
    subject: "subsequent event discovered before report release",
    scenario: "A major customer bankruptcy occurs after year-end and reveals poor financial condition at year-end.",
    concern: "a recognized subsequent event affecting year-end valuation",
    bestAction: "Require adjustment or disclosure as appropriate before dating and releasing the report.",
    evidence: "Bankruptcy filing, year-end aging, subsequent cash history, and allowance analysis.",
    principle: "Events providing evidence about conditions existing at the balance sheet date may require recognition.",
    conclusion: "The bankruptcy is relevant to the year-end receivable valuation.",
    documentation: "Document subsequent event procedures, evidence, required adjustment, and report-date considerations."
  },
  {
    blueprint: areaIV,
    difficulty: "advanced",
    subject: "refusal to provide written representations",
    scenario: "Management refuses to sign representations about fraud and completeness of information.",
    concern: "a scope limitation and doubt about management integrity",
    bestAction: "Evaluate the effect on the audit and consider disclaiming an opinion or withdrawing.",
    evidence: "Representation requests, management refusal, governance communications, and legal consultation if needed.",
    principle: "Written representations are required audit evidence and cannot be replaced entirely by other procedures.",
    conclusion: "Refusal to provide required representations is a serious reporting matter.",
    documentation: "Document requested representations, refusal, communications, and reporting or withdrawal conclusion."
  },
  {
    blueprint: areaIV,
    difficulty: "advanced",
    subject: "critical audit matter communication",
    scenario: "For an issuer, a complex goodwill impairment estimate required especially challenging auditor judgment.",
    concern: "whether the matter should be communicated as a critical audit matter",
    bestAction: "Evaluate whether the matter was communicated to the audit committee and involved especially challenging judgment.",
    evidence: "Audit committee communications, goodwill workpapers, specialist reports, and judgment documentation.",
    principle: "Critical audit matters arise from audit committee communications and relate to material accounts or disclosures.",
    conclusion: "The goodwill estimate may be a critical audit matter if it meets the reporting criteria.",
    documentation: "Document CAM determination, principal considerations, audit response, and report wording."
  },
  {
    blueprint: areaIVOther,
    difficulty: "core",
    subject: "review engagement assurance",
    scenario: "A nonissuer asks the accountant to describe reviewed statements as audited.",
    concern: "misstating the level of assurance provided",
    bestAction: "Use review report language that provides limited assurance and does not imply an audit.",
    evidence: "Review procedures performed, analytical results, inquiries, and the draft review report.",
    principle: "A review provides limited assurance through primarily inquiry and analytical procedures.",
    conclusion: "The accountant should not use audit opinion wording for a review engagement.",
    documentation: "Document review procedures, significant findings, management representations, and report wording."
  },
  {
    blueprint: areaIVOther,
    difficulty: "introductory",
    subject: "compilation engagement assurance",
    scenario: "A client requests compiled financial statements for a lender and asks for assurance on accuracy.",
    concern: "users may misunderstand a compilation's assurance level",
    bestAction: "Issue a compilation report stating that no assurance is provided.",
    evidence: "The engagement letter, compiled financial statements, and accountant's report.",
    principle: "A compilation assists management in presenting financial information without providing assurance.",
    conclusion: "Compilation procedures do not support an audit or review conclusion.",
    documentation: "Document engagement terms, financial statements compiled, and the no-assurance report."
  },
  {
    blueprint: areaIVOther,
    difficulty: "advanced",
    subject: "attestation examination report",
    scenario: "A company requests reasonable assurance on management's sustainability metrics assertion.",
    concern: "reporting appropriately on subject matter other than historical financial statements",
    bestAction: "Perform an examination and express an opinion if sufficient appropriate evidence is obtained.",
    evidence: "Management's assertion, criteria, evidence over metrics, and attestation workpapers.",
    principle: "An attestation examination provides reasonable assurance on subject matter or an assertion using suitable criteria.",
    conclusion: "An examination report can express an opinion when criteria are suitable and evidence is sufficient.",
    documentation: "Document criteria suitability, procedures, evidence, findings, and opinion wording."
  },
  {
    blueprint: areaIVOther,
    difficulty: "core",
    subject: "agreed-upon procedures restrictions",
    scenario: "A lender asks the accountant to perform specified procedures on covenant calculations.",
    concern: "the accountant should not provide an opinion or conclusion beyond the procedures performed",
    bestAction: "Report the procedures performed and findings without expressing assurance.",
    evidence: "The agreed procedures, responsible party acknowledgment, calculations tested, and factual findings.",
    principle: "Agreed-upon procedures engagements report findings from specified procedures rather than assurance.",
    conclusion: "The accountant should not state that the covenant calculation is fairly presented overall.",
    documentation: "Document agreed procedures, performance of each procedure, exceptions, and report findings."
  },
  {
    blueprint: areaIV,
    difficulty: "core",
    subject: "dual dating the auditor's report",
    scenario: "After fieldwork ended, a disclosed subsequent event occurred before report issuance.",
    concern: "limiting responsibility for events after the original report date",
    bestAction: "Dual date the report for the subsequent event if responsibility is limited to that event.",
    evidence: "The event support, disclosure note, original report date work, and report wording.",
    principle: "Dual dating limits the auditor's responsibility for subsequent events to the specific later event.",
    conclusion: "Dual dating may be preferable to extending all subsequent event procedures through the later date.",
    documentation: "Document the subsequent event, disclosure evaluation, dual-date wording, and procedures performed."
  },
  {
    blueprint: areaIV,
    difficulty: "advanced",
    subject: "subsequently discovered facts after report release",
    scenario: "After report release, the auditor learns that audited statements omitted a material related-party liability.",
    concern: "previously issued financial statements may be materially misstated",
    bestAction: "Discuss the matter with management and governance and determine whether revised statements or disclosure are needed.",
    evidence: "The newly discovered facts, prior workpapers, management response, and user notification plan.",
    principle: "Subsequently discovered facts require action when they existed at the report date and would have affected the report.",
    conclusion: "The auditor should not ignore material facts discovered after report release.",
    documentation: "Document facts discovered, discussions, conclusions, and steps taken to prevent reliance if needed."
  },
  {
    blueprint: areaIV,
    difficulty: "core",
    subject: "required governance communications at audit completion",
    scenario: "The audit is complete and includes corrected misstatements and significant accounting estimate judgments.",
    concern: "governance needs information about significant audit findings",
    bestAction: "Communicate significant findings, corrected and uncorrected misstatements, and qualitative accounting matters.",
    evidence: "Summary of misstatements, estimate memos, significant findings, and governance communication.",
    principle: "The auditor communicates significant findings from the audit to those charged with governance.",
    conclusion: "Completion communications should include more than the final opinion type.",
    documentation: "Document matters communicated, timing, recipients, and any governance responses."
  }
];

function makeSupplementalPatterns(topic: SupplementalTopic): Array<Omit<McqSeed, "id" | "blueprint" | "difficulty">> {
  return [
    {
      stem: `${topic.scenario} Which response best addresses ${topic.subject}?`,
      correct: topic.bestAction,
      distractors: [
        ["Accept management's explanation and perform no further work.", `This does not address ${topic.concern} or obtain persuasive evidence.`],
        ["Perform only a high-level comparison to the prior year.", `A high-level comparison alone is not targeted enough for ${topic.subject}.`],
        ["Delay consideration of the matter until after the report is released.", `Report release should not occur before resolving a matter involving ${topic.concern}.`]
      ],
      explanation: `${topic.bestAction} This response directly addresses ${topic.concern}.`
    },
    {
      stem: `${topic.scenario} Which evidence would most directly support the auditor's work on ${topic.subject}?`,
      correct: topic.evidence,
      distractors: [
        ["Management's oral explanation without corroborating records.", `Oral explanation alone is not sufficiently persuasive for ${topic.subject}.`],
        ["A prior-year workpaper that was not updated for current conditions.", `Prior-year evidence does not by itself address current-year facts involving ${topic.concern}.`],
        ["A generic industry article that does not relate to the client's records.", `General background information does not directly test the client's assertion or condition.`]
      ],
      explanation: `${topic.evidence} This evidence is tied to the current-year facts and the relevant assertion or reporting issue.`
    },
    {
      stem: `${topic.scenario} Which principle best explains the auditor's responsibility for ${topic.subject}?`,
      correct: topic.principle,
      distractors: [
        ["The auditor may rely on management whenever the account is below net income materiality.", `Materiality does not eliminate the need to address ${topic.concern}.`],
        ["The auditor's responsibility ends when the client signs the engagement letter.", `Engagement terms do not remove the auditor's responsibility to perform the engagement properly.`],
        ["The auditor should prioritize client preference when evidence is costly to obtain.", `Client preference does not override professional standards or evidential requirements.`]
      ],
      explanation: `${topic.principle} The principle applies because the scenario involves ${topic.concern}.`
    },
    {
      stem: `${topic.scenario} What conclusion is most appropriate about ${topic.subject}?`,
      correct: topic.conclusion,
      distractors: [
        ["No audit consequence exists because the issue was identified internally.", `Identifying the issue internally does not resolve ${topic.concern}.`],
        ["The matter is automatically pervasive to the financial statements.", `Pervasiveness depends on the facts and cannot be assumed from this scenario alone.`],
        ["The auditor should replace management's accounting records with auditor-prepared records.", `The auditor does not take over management's recordkeeping responsibilities.`]
      ],
      explanation: `${topic.conclusion} This conclusion follows from the facts indicating ${topic.concern}.`
    },
    {
      stem: `${topic.scenario} What should the auditor document for ${topic.subject}?`,
      correct: topic.documentation,
      distractors: [
        ["Only the final answer choice selected in the audit program.", `The file should show the work performed and reasoning, not merely a final selection.`],
        ["Nothing, if the engagement partner verbally approved the conclusion.", `Verbal approval does not replace audit documentation requirements.`],
        ["Only management's preferred treatment, without the auditor's evaluation.", `Documentation should include the auditor's evaluation and conclusion.`]
      ],
      explanation: `${topic.documentation} Audit documentation should support the procedures performed, evidence obtained, and conclusions reached.`
    }
  ];
}

function buildSupplementalMcqSeeds(): McqSeed[] {
  const supplementalTopics = [
    ...supplementalAreaITopics,
    ...supplementalAreaIITopics,
    ...supplementalAreaIIITopics,
    ...supplementalAreaIVTopics
  ];
  const seeds: McqSeed[] = [];
  let nextId = 101;

  for (const topic of supplementalTopics) {
    for (const pattern of makeSupplementalPatterns(topic)) {
      seeds.push({
        id: `AUD-MCQ-${String(nextId).padStart(3, "0")}`,
        blueprint: topic.blueprint,
        difficulty: topic.difficulty,
        ...pattern
      });
      nextId += 1;
    }
  }

  return seeds;
}

export const audMcqs: AudMcq[] = [...mcqSeeds, ...buildSupplementalMcqSeeds()].map(makeMcq);

export const audMiniTbsScenarios: AudMiniTbs[] = [
  {
    id: "AUD-TBS-001",
    type: "mini-tbs",
    status: "draft",
    blueprint: areaII,
    difficulty: "core",
    title: "Planning Analytics for a New Audit",
    scenario: "A regional distributor reports a 22% revenue increase while units shipped increased 4%. Management says price increases explain the difference.",
    exhibits: [
      { id: "E1", title: "Trend summary", content: "Gross margin increased from 31% to 39%; sales returns doubled in the last month of the year." },
      { id: "E2", title: "Management note", content: "The controller says several large December invoices were manually entered after system downtime." }
    ],
    tasks: [
      { id: "T1", prompt: "Identify the most relevant risk.", answer: "Revenue recognition cutoff or occurrence risk.", explanation: "The year-end spike, manual invoices, and returns indicate possible improper revenue timing or validity." },
      { id: "T2", prompt: "Select a planned response.", answer: "Test December and January shipments against invoices and returns.", explanation: "Cutoff testing directly addresses whether recorded sales belong in the proper period." },
      { id: "T3", prompt: "State why analytics alone are insufficient.", answer: "The relationships are unusual and require corroborating detail testing.", explanation: "Planning analytics identify risk; they do not resolve high-risk revenue assertions by themselves." }
    ]
  },
  {
    id: "AUD-TBS-002",
    type: "mini-tbs",
    status: "draft",
    blueprint: areaIIControls,
    difficulty: "core",
    title: "Vendor Master File Control",
    scenario: "The accounts payable manager can add vendors, update bank information, and approve payments up to $25,000.",
    exhibits: [
      { id: "E1", title: "Control matrix", content: "Vendor changes are logged but not independently reviewed." },
      { id: "E2", title: "Payment report", content: "Four new vendors received round-dollar payments just below approval limits." }
    ],
    tasks: [
      { id: "T1", prompt: "Identify the control deficiency.", answer: "Inadequate segregation over vendor setup, bank changes, and payment approval.", explanation: "One person can create and pay fictitious vendors without independent review." },
      { id: "T2", prompt: "Identify the fraud risk.", answer: "Unauthorized or fictitious disbursements.", explanation: "The access combination creates opportunity for fraudulent payments." },
      { id: "T3", prompt: "Name a responsive audit procedure.", answer: "Test new vendors and bank changes, then vouch selected payments to support.", explanation: "Targeted testing addresses the specific unauthorized vendor/payment risk." }
    ]
  },
  {
    id: "AUD-TBS-003",
    type: "mini-tbs",
    status: "draft",
    blueprint: areaIII,
    difficulty: "core",
    title: "Receivable Confirmation Follow-Up",
    scenario: "Positive confirmations were sent for large receivable balances. Several customers did not respond after a second request.",
    exhibits: [
      { id: "E1", title: "Aging detail", content: "Nonresponses include two balances over 120 days past due." },
      { id: "E2", title: "Subsequent cash", content: "One customer paid 80% after year-end; another has no payment history after year-end." }
    ],
    tasks: [
      { id: "T1", prompt: "What procedure should be performed for nonresponses?", answer: "Alternative procedures.", explanation: "The auditor should not ignore or remove nonresponses from the sample." },
      { id: "T2", prompt: "Name relevant alternative evidence.", answer: "Subsequent cash receipts, shipping documents, invoices, and customer correspondence.", explanation: "These documents can support existence and valuation when confirmations are unavailable." },
      { id: "T3", prompt: "What additional concern exists for old unpaid balances?", answer: "Collectibility or valuation.", explanation: "Aged balances without subsequent payment may require allowance evaluation." }
    ]
  },
  {
    id: "AUD-TBS-004",
    type: "mini-tbs",
    status: "draft",
    blueprint: areaIIIData,
    difficulty: "advanced",
    title: "Fair Value Estimate Review",
    scenario: "Management values a private investment using a model with projected cash flows and a discount rate selected by the CFO.",
    exhibits: [
      { id: "E1", title: "Model note", content: "Projected revenue growth is 18%, while the investee's actual growth has been 4% to 6%." },
      { id: "E2", title: "Specialist note", content: "The audit team lacks valuation expertise for similar private investments." }
    ],
    tasks: [
      { id: "T1", prompt: "Identify the main audit risk.", answer: "Management bias or unreasonable assumptions in a material estimate.", explanation: "The growth assumption is materially higher than historical performance." },
      { id: "T2", prompt: "Select a strong audit response.", answer: "Use a valuation specialist or develop an independent expectation.", explanation: "Complex valuation assumptions may require expertise beyond the audit team." },
      { id: "T3", prompt: "What evidence should be evaluated?", answer: "Model method, assumptions, source data, and contradictory evidence.", explanation: "Estimate testing requires more than agreeing model arithmetic." }
    ]
  },
  {
    id: "AUD-TBS-005",
    type: "mini-tbs",
    status: "draft",
    blueprint: areaIII,
    difficulty: "core",
    title: "Search for Unrecorded Liabilities",
    scenario: "The client has tight debt covenants and reported unusually low accounts payable at year-end.",
    exhibits: [
      { id: "E1", title: "Subsequent disbursements", content: "Several January payments relate to December receiving reports." },
      { id: "E2", title: "Receiving log", content: "Unmatched receiving reports increased in the final week of December." }
    ],
    tasks: [
      { id: "T1", prompt: "Identify the assertion at risk.", answer: "Completeness of liabilities.", explanation: "The concern is omitted payables for goods or services received before year-end." },
      { id: "T2", prompt: "Select a procedure.", answer: "Trace subsequent disbursements and unmatched receiving reports to recorded payables.", explanation: "Starting from evidence outside the payable listing helps detect omissions." },
      { id: "T3", prompt: "Why are debt covenants relevant?", answer: "They create pressure to understate liabilities.", explanation: "Covenant pressure can increase risk of intentional omission." }
    ]
  },
  {
    id: "AUD-TBS-006",
    type: "mini-tbs",
    status: "draft",
    blueprint: areaIV,
    difficulty: "advanced",
    title: "Evaluate Opinion Modification",
    scenario: "Management refuses to write down obsolete inventory. The misstatement is material but isolated to one product line.",
    exhibits: [
      { id: "E1", title: "Inventory aging", content: "The product line has had no sales for nine months." },
      { id: "E2", title: "Materiality memo", content: "The proposed adjustment exceeds performance materiality but is not pervasive to the statements." }
    ],
    tasks: [
      { id: "T1", prompt: "Identify the reporting issue.", answer: "Material misstatement due to inventory valuation.", explanation: "The auditor has evidence that inventory is overstated." },
      { id: "T2", prompt: "Select the likely opinion.", answer: "Qualified opinion.", explanation: "The misstatement is material but not pervasive." },
      { id: "T3", prompt: "Why is disclaimer inappropriate?", answer: "The auditor has evidence; the issue is a known misstatement, not inability to obtain evidence.", explanation: "Disclaimer is generally for pervasive scope limitations." }
    ]
  },
  {
    id: "AUD-TBS-007",
    type: "mini-tbs",
    status: "draft",
    blueprint: areaIV,
    difficulty: "core",
    title: "Subsequent Event Classification",
    scenario: "Two events occurred after year-end: a customer filed bankruptcy related to poor year-end financial condition, and a warehouse was damaged by a storm in February.",
    exhibits: [
      { id: "E1", title: "Customer aging", content: "The customer balance was 180 days past due at year-end." },
      { id: "E2", title: "Insurance report", content: "The storm occurred six weeks after year-end and did not exist at the balance sheet date." }
    ],
    tasks: [
      { id: "T1", prompt: "Classify the customer bankruptcy.", answer: "Recognized subsequent event.", explanation: "It provides evidence about collectibility conditions existing at year-end." },
      { id: "T2", prompt: "Classify the storm damage.", answer: "Nonrecognized subsequent event that may require disclosure.", explanation: "The condition arose after year-end." },
      { id: "T3", prompt: "Identify an audit procedure.", answer: "Read subsequent cash receipts, minutes, and management disclosures.", explanation: "Subsequent event procedures look for events requiring recognition or disclosure." }
    ]
  },
  {
    id: "AUD-TBS-008",
    type: "mini-tbs",
    status: "draft",
    blueprint: areaI,
    difficulty: "core",
    title: "Independence Threat Assessment",
    scenario: "An audit firm is asked to prepare monthly bank reconciliations and approve correcting entries for a private audit client.",
    exhibits: [
      { id: "E1", title: "Client staffing note", content: "The client has no employee assigned to review the reconciliations." },
      { id: "E2", title: "Service request", content: "Management asks the firm to decide which entries should be posted." }
    ],
    tasks: [
      { id: "T1", prompt: "Identify the threat.", answer: "Management participation threat.", explanation: "Approving entries and deciding postings are management responsibilities." },
      { id: "T2", prompt: "State a safeguard.", answer: "Management must review, approve, and accept responsibility for the work.", explanation: "Permissible assistance requires management decision-making and responsibility." },
      { id: "T3", prompt: "What service element should be refused?", answer: "Approving correcting journal entries.", explanation: "Approval is a management function and would impair independence." }
    ]
  },
  {
    id: "AUD-TBS-009",
    type: "mini-tbs",
    status: "draft",
    blueprint: areaIIControls,
    difficulty: "advanced",
    title: "IT Change Management",
    scenario: "The revenue application calculates invoice prices automatically. Developers can migrate pricing-table changes to production without approval.",
    exhibits: [
      { id: "E1", title: "Application control", content: "Invoices use the current production pricing table." },
      { id: "E2", title: "Change log", content: "Three pricing-table changes were made in December without documented review." }
    ],
    tasks: [
      { id: "T1", prompt: "Identify the IT general control weakness.", answer: "Ineffective change management over production pricing changes.", explanation: "Unauthorized production changes can undermine automated pricing controls." },
      { id: "T2", prompt: "State the audit effect.", answer: "Reduced ability to rely on the automated application control.", explanation: "Weak ITGCs can make application controls unreliable." },
      { id: "T3", prompt: "Select a responsive procedure.", answer: "Test December pricing changes and recalculate invoice prices for selected transactions.", explanation: "The response targets unauthorized or incorrect pricing." }
    ]
  },
  {
    id: "AUD-TBS-010",
    type: "mini-tbs",
    status: "draft",
    blueprint: areaIVOther,
    difficulty: "core",
    title: "Review Engagement Conclusion",
    scenario: "A nonissuer client requests a review of interim financial statements. The accountant performs inquiry and analytical procedures and finds no material modifications needed.",
    exhibits: [
      { id: "E1", title: "Procedure summary", content: "No confirmations, control tests, or inventory observation were performed." },
      { id: "E2", title: "Draft report", content: "Management asks the accountant to state that the statements are audited." }
    ],
    tasks: [
      { id: "T1", prompt: "Identify the assurance level.", answer: "Limited assurance.", explanation: "Reviews provide limited assurance using primarily inquiry and analytics." },
      { id: "T2", prompt: "State the conclusion form.", answer: "Negative assurance conclusion.", explanation: "Review reports generally state that the accountant is not aware of material modifications needed." },
      { id: "T3", prompt: "Explain why audit wording is inappropriate.", answer: "Audit wording implies reasonable assurance and procedures not performed.", explanation: "A review is not an audit and should not be described as one." }
    ]
  }
];

export const audQuestionCorpus = {
  source: {
    name: "AICPA CPA Exam Blueprints effective January 1, 2026",
    url: "https://www.aicpa-cima.com/resources/article/learn-what-is-tested-on-the-cpa-exam",
    accessedAt: "2026-07-23"
  },
  mcqs: audMcqs,
  miniTbsScenarios: audMiniTbsScenarios
};

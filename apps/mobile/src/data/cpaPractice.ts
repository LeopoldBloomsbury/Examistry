export type CpaDomainId = "ethics" | "risk" | "evidence" | "reporting";
export type QuestionDifficulty = "foundation" | "exam" | "advanced";

export interface CpaDomain {
  id: CpaDomainId;
  area: "I" | "II" | "III" | "IV";
  title: string;
  shortTitle: string;
  weight: string;
  focus: string;
  color: string;
}

export interface PracticeQuestion {
  id: string;
  domainId: CpaDomainId;
  difficulty: QuestionDifficulty;
  stem: string;
  choices: Array<{ id: "A" | "B" | "C" | "D"; text: string }>;
  correctChoiceId: "A" | "B" | "C" | "D";
  explanation: string;
  rationales: Record<string, string>;
  takeaway: string;
}

export interface Flashcard {
  id: string;
  domainId: CpaDomainId;
  front: string;
  back: string;
  cue: string;
}

export interface TutorAnswer {
  keywords: string[];
  title: string;
  answer: string;
  drill: string;
}

export const cpaDomains: CpaDomain[] = [
  {
    id: "ethics",
    area: "I",
    title: "Ethics, Responsibilities and General Principles",
    shortTitle: "Ethics",
    weight: "15-25%",
    focus: "Independence, engagement terms, documentation, skepticism, and governance communication.",
    color: "#0f766e"
  },
  {
    id: "risk",
    area: "II",
    title: "Assessing Risk and Developing a Planned Response",
    shortTitle: "Risk",
    weight: "25-35%",
    focus: "Materiality, fraud risk, internal control, IT controls, estimates, and audit strategy.",
    color: "#2563eb"
  },
  {
    id: "evidence",
    area: "III",
    title: "Performing Further Procedures and Obtaining Evidence",
    shortTitle: "Evidence",
    weight: "30-40%",
    focus: "Substantive procedures, control testing, confirmations, sampling, estimates, and evidence quality.",
    color: "#7c3aed"
  },
  {
    id: "reporting",
    area: "IV",
    title: "Forming Conclusions and Reporting",
    shortTitle: "Reporting",
    weight: "10-20%",
    focus: "Opinion modifications, subsequent events, going concern, review, compilation, and attestation reports.",
    color: "#c2410c"
  }
];

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: "AUD-APP-001",
    domainId: "ethics",
    difficulty: "exam",
    stem: "A covered member owns a small direct financial interest in an audit client. Which action best preserves independence?",
    choices: [
      { id: "A", text: "Disclose the investment to the audit committee." },
      { id: "B", text: "Dispose of the direct financial interest." },
      { id: "C", text: "Document that the amount is immaterial." },
      { id: "D", text: "Transfer the investment to a different brokerage account." }
    ],
    correctChoiceId: "B",
    explanation: "A direct financial interest in an attest client impairs independence for a covered member regardless of size.",
    rationales: {
      A: "Disclosure does not cure a prohibited direct financial interest.",
      C: "Materiality does not make a covered member's direct interest acceptable.",
      D: "Changing brokers does not remove ownership."
    },
    takeaway: "Direct financial interests are prohibited for covered members."
  },
  {
    id: "AUD-APP-002",
    domainId: "ethics",
    difficulty: "foundation",
    stem: "Which situation most clearly creates a management participation threat?",
    choices: [
      { id: "A", text: "The auditor recommends that management review stale user access." },
      { id: "B", text: "The auditor compares depreciation to an independent expectation." },
      { id: "C", text: "The auditor approves the client's journal entries before posting." },
      { id: "D", text: "The auditor requests a signed representation letter." }
    ],
    correctChoiceId: "C",
    explanation: "Approving transactions is a management responsibility and would impair independence.",
    rationales: {
      A: "Recommendations are acceptable when management decides and acts.",
      B: "Independent comparison is an audit procedure.",
      D: "Representations are normal audit evidence."
    },
    takeaway: "The auditor can advise; management must decide, approve, and own the records."
  },
  {
    id: "AUD-APP-003",
    domainId: "ethics",
    difficulty: "advanced",
    stem: "After report release, a senior wants to delete notes about a resolved inventory exception to make the file cleaner. What should happen?",
    choices: [
      { id: "A", text: "Delete the notes because the exception was resolved." },
      { id: "B", text: "Retain the documentation and add a dated explanation only if a permitted change is necessary." },
      { id: "C", text: "Replace the original notes with a summary approved by management." },
      { id: "D", text: "Move the notes outside the audit file." }
    ],
    correctChoiceId: "B",
    explanation: "Audit documentation should preserve the record of work performed, evidence obtained, and conclusions reached.",
    rationales: {
      A: "Deleting relevant evidence after release is inappropriate.",
      C: "Management approval does not govern audit documentation changes.",
      D: "Moving notes out of the file undermines the documentation record."
    },
    takeaway: "Post-release documentation changes must be transparent, dated, and justified."
  },
  {
    id: "AUD-APP-004",
    domainId: "risk",
    difficulty: "exam",
    stem: "Revenue rose 22% while units shipped rose 4%, and several December invoices were entered manually. Which risk is most relevant?",
    choices: [
      { id: "A", text: "Inventory existence is understated." },
      { id: "B", text: "Revenue cutoff or occurrence may be misstated." },
      { id: "C", text: "Payroll completeness is misstated." },
      { id: "D", text: "Presentation of debt is misstated." }
    ],
    correctChoiceId: "B",
    explanation: "Manual year-end revenue entries and an unusual revenue-volume relationship point to cutoff or occurrence risk.",
    rationales: {
      A: "The facts point to revenue, not inventory existence.",
      C: "Payroll is unrelated to the described indicators.",
      D: "Debt presentation is not implicated by manual invoices."
    },
    takeaway: "Planning analytics identify assertions that need targeted procedures."
  },
  {
    id: "AUD-APP-005",
    domainId: "risk",
    difficulty: "advanced",
    stem: "Developers can migrate pricing-table changes to production without approval. How should this affect the audit?",
    choices: [
      { id: "A", text: "The auditor should rely more heavily on automated invoice pricing." },
      { id: "B", text: "The auditor should reduce attention to revenue because pricing is automated." },
      { id: "C", text: "The auditor should assess ITGC risk and test pricing changes and invoices directly." },
      { id: "D", text: "The auditor should classify the issue as only a financial statement disclosure matter." }
    ],
    correctChoiceId: "C",
    explanation: "Weak change management can undermine automated controls and requires a revised response.",
    rationales: {
      A: "Automation is less reliable when production changes are not controlled.",
      B: "Automation does not eliminate risk.",
      D: "The issue affects processing reliability, not only disclosure."
    },
    takeaway: "Weak ITGCs can break reliance on application controls."
  },
  {
    id: "AUD-APP-006",
    domainId: "risk",
    difficulty: "foundation",
    stem: "Executive bonuses trigger if fourth-quarter revenue exceeds a target by 2%. What does this create?",
    choices: [
      { id: "A", text: "A fraud risk factor related to revenue recognition." },
      { id: "B", text: "A reason to skip journal-entry testing." },
      { id: "C", text: "A control that prevents revenue overstatement." },
      { id: "D", text: "A scope limitation imposed by governance." }
    ],
    correctChoiceId: "A",
    explanation: "The bonus target creates incentive or pressure to overstate revenue.",
    rationales: {
      B: "Management override and journal entries remain relevant.",
      C: "A bonus target is an incentive, not a control.",
      D: "No evidence shows governance restricted procedures."
    },
    takeaway: "Fraud risk assessment looks for incentive, opportunity, and rationalization."
  },
  {
    id: "AUD-APP-007",
    domainId: "evidence",
    difficulty: "exam",
    stem: "Several large positive confirmations did not receive replies after a second request. What should the auditor do?",
    choices: [
      { id: "A", text: "Treat nonresponses as evidence the balances are valid." },
      { id: "B", text: "Remove the nonresponses from the sample." },
      { id: "C", text: "Perform alternative procedures for each nonresponse." },
      { id: "D", text: "Conclude the receivables are misstated." }
    ],
    correctChoiceId: "C",
    explanation: "A nonresponse to a positive confirmation does not provide audit evidence; alternatives are required.",
    rationales: {
      A: "Silence is not confirmation evidence.",
      B: "Removing items biases the sample.",
      D: "Nonresponse alone does not prove misstatement."
    },
    takeaway: "Positive confirmation nonresponses need alternative evidence."
  },
  {
    id: "AUD-APP-008",
    domainId: "evidence",
    difficulty: "foundation",
    stem: "Which procedure best tests completeness of accounts payable?",
    choices: [
      { id: "A", text: "Trace subsequent disbursements and unmatched receiving reports to recorded payables." },
      { id: "B", text: "Vouch recorded payables to vendor invoices." },
      { id: "C", text: "Scan the fixed asset ledger for additions." },
      { id: "D", text: "Confirm cash balances with the bank." }
    ],
    correctChoiceId: "A",
    explanation: "Completeness testing starts from evidence outside the recorded payable population to detect omissions.",
    rationales: {
      B: "Vouching recorded items addresses existence more than completeness.",
      C: "Fixed assets are not the payable completeness population.",
      D: "Bank confirmation supports cash, not unrecorded liabilities."
    },
    takeaway: "For completeness, start outside the ledger and trace in."
  },
  {
    id: "AUD-APP-009",
    domainId: "evidence",
    difficulty: "advanced",
    stem: "The auditor uses a system-generated sales report to select transactions. What must be addressed before relying on it?",
    choices: [
      { id: "A", text: "Whether the report is complete and accurate." },
      { id: "B", text: "Whether management likes the report format." },
      { id: "C", text: "Whether the report was printed before fieldwork." },
      { id: "D", text: "Whether the report contains only round-dollar items." }
    ],
    correctChoiceId: "A",
    explanation: "Client-produced information used as audit evidence must be evaluated for reliability.",
    rationales: {
      B: "Management preference does not establish reliability.",
      C: "Printing timing does not prove completeness or accuracy.",
      D: "Round-dollar amounts are not the core reliability criterion."
    },
    takeaway: "Test completeness and accuracy of reports used as audit evidence."
  },
  {
    id: "AUD-APP-010",
    domainId: "reporting",
    difficulty: "exam",
    stem: "Management refuses to write down inventory. The misstatement is material but limited to one product line. Which opinion is likely?",
    choices: [
      { id: "A", text: "Unmodified opinion." },
      { id: "B", text: "Qualified opinion." },
      { id: "C", text: "Disclaimer of opinion." },
      { id: "D", text: "Adverse opinion." }
    ],
    correctChoiceId: "B",
    explanation: "A material but nonpervasive known misstatement generally leads to a qualified opinion.",
    rationales: {
      A: "The statements contain a material uncorrected misstatement.",
      C: "The auditor has evidence; this is not a scope limitation.",
      D: "Adverse is for material and pervasive misstatement."
    },
    takeaway: "Known misstatement: qualified if material, adverse if material and pervasive."
  },
  {
    id: "AUD-APP-011",
    domainId: "reporting",
    difficulty: "advanced",
    stem: "Substantial doubt exists, and management's going concern disclosures are adequate. What reporting is generally appropriate?",
    choices: [
      { id: "A", text: "Automatically issue an adverse opinion." },
      { id: "B", text: "Express an unmodified opinion with required going concern language." },
      { id: "C", text: "Omit going concern language because disclosures are adequate." },
      { id: "D", text: "Withdraw from every engagement." }
    ],
    correctChoiceId: "B",
    explanation: "Adequate disclosure of substantial doubt affects report wording but does not automatically modify the opinion.",
    rationales: {
      A: "Adequate disclosure does not automatically mean the statements are misstated.",
      C: "Substantial doubt still requires report language.",
      D: "Withdrawal is not automatic."
    },
    takeaway: "Adequate going concern disclosure usually means unmodified plus explanatory language."
  },
  {
    id: "AUD-APP-012",
    domainId: "reporting",
    difficulty: "foundation",
    stem: "A review engagement of interim financial statements provides what level of assurance?",
    choices: [
      { id: "A", text: "Absolute assurance." },
      { id: "B", text: "Reasonable assurance." },
      { id: "C", text: "Limited assurance." },
      { id: "D", text: "No assurance." }
    ],
    correctChoiceId: "C",
    explanation: "A review provides limited assurance using primarily inquiry and analytical procedures.",
    rationales: {
      A: "No CPA service provides absolute assurance.",
      B: "Audits provide reasonable assurance.",
      D: "Compilations provide no assurance."
    },
    takeaway: "Review equals limited assurance; compilation equals no assurance."
  }
];

export const flashcards: Flashcard[] = [
  {
    id: "AUD-FC-001",
    domainId: "ethics",
    front: "Covered member direct financial interest",
    back: "Independence is impaired regardless of materiality.",
    cue: "Direct means prohibited."
  },
  {
    id: "AUD-FC-002",
    domainId: "ethics",
    front: "Management participation threat",
    back: "The auditor cannot authorize, approve, or own management decisions.",
    cue: "Advise is okay. Decide is not."
  },
  {
    id: "AUD-FC-003",
    domainId: "risk",
    front: "Fraud triangle",
    back: "Incentive or pressure, opportunity, and rationalization.",
    cue: "Why, how, and permission."
  },
  {
    id: "AUD-FC-004",
    domainId: "risk",
    front: "Weak ITGC effect",
    back: "Weak IT general controls can undermine automated application controls.",
    cue: "Bad change control weakens automation."
  },
  {
    id: "AUD-FC-005",
    domainId: "evidence",
    front: "Positive confirmation nonresponse",
    back: "It is not evidence. Perform alternative procedures.",
    cue: "Silence does not confirm."
  },
  {
    id: "AUD-FC-006",
    domainId: "evidence",
    front: "Completeness direction",
    back: "Start outside the ledger and trace into recorded accounts.",
    cue: "Completeness traces in."
  },
  {
    id: "AUD-FC-007",
    domainId: "reporting",
    front: "Material, nonpervasive misstatement",
    back: "Qualified opinion.",
    cue: "Qualified means material but contained."
  },
  {
    id: "AUD-FC-008",
    domainId: "reporting",
    front: "Review assurance",
    back: "Limited assurance, generally expressed through negative assurance wording.",
    cue: "Review is less than audit."
  }
];

export const tutorAnswers: TutorAnswer[] = [
  {
    keywords: ["independence", "covered", "financial", "interest", "ethics"],
    title: "Independence",
    answer:
      "For AUD, treat independence questions as rule-first. A covered member with a direct financial interest in an attest client is impaired even when the amount is small. Safeguards help only when the underlying service or relationship is permitted.",
    drill: "Ask: Is the auditor making a management decision, auditing their own work, or holding a prohibited financial interest?"
  },
  {
    keywords: ["risk", "fraud", "revenue", "cutoff", "planning"],
    title: "Revenue Risk",
    answer:
      "Revenue risk questions usually ask you to connect a fact pattern to assertions. Year-end spikes, manual invoices, bonuses, returns after year-end, or unusual margin changes point to occurrence, cutoff, or accuracy risk.",
    drill: "Pair the risk with a response: inspect contracts, test cutoff, scan manual entries, and compare shipping to invoices."
  },
  {
    keywords: ["confirmation", "receivable", "evidence", "nonresponse"],
    title: "Confirmations",
    answer:
      "A positive confirmation nonresponse is not evidence. The auditor should send follow-ups and then perform alternatives such as subsequent cash receipts, shipping documents, invoices, and customer correspondence.",
    drill: "Remember: positive nonresponse means do more work; negative nonresponse can be evidence only when risk is low."
  },
  {
    keywords: ["opinion", "qualified", "adverse", "disclaimer", "report"],
    title: "Opinion Modifications",
    answer:
      "Separate known misstatements from scope limitations. Known misstatement: qualified if material, adverse if material and pervasive. Scope limitation: qualified if material, disclaimer if material and pervasive.",
    drill: "Classify the problem first: bad accounting or missing evidence."
  },
  {
    keywords: ["going", "concern", "substantial", "doubt"],
    title: "Going Concern",
    answer:
      "If substantial doubt exists and disclosure is adequate, the opinion can still be unmodified, but the report includes required going concern language. If disclosure is inadequate, the issue becomes a GAAP disclosure misstatement.",
    drill: "Two-step: does substantial doubt remain, and are the disclosures adequate?"
  }
];

export function getDomain(domainId: CpaDomainId) {
  return cpaDomains.find((domain) => domain.id === domainId) ?? cpaDomains[0];
}

export function pickTutorAnswer(prompt: string) {
  const normalized = prompt.toLowerCase();
  const scored = tutorAnswers
    .map((answer) => ({
      answer,
      score: answer.keywords.filter((keyword) => normalized.includes(keyword)).length
    }))
    .sort((a, b) => b.score - a.score);

  if (scored[0]?.score) {
    return scored[0].answer;
  }

  return {
    title: "AUD Approach",
    answer:
      "Start by naming the AUD area, then the assertion or reporting issue, then the procedure or conclusion. Most wrong answers fail because they skip that sequence or choose a procedure that tests the wrong direction.",
    drill: "Use this pattern: risk, assertion, evidence, conclusion."
  };
}

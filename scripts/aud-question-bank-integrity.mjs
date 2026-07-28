import { audQuestionCorpus } from "../content/cpa-aud-question-bank.ts";

const checks = [];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateBlueprint(item, label) {
  const blueprint = item.blueprint;
  assert(blueprint, `${label} is missing blueprint tag`);
  assert(blueprint.exam === "CPA", `${label} must be tagged to CPA`);
  assert(blueprint.section === "AUD", `${label} must be tagged to AUD`);
  assert(blueprint.blueprintVersion === "2026", `${label} must use 2026 blueprint version`);
  assert(["I", "II", "III", "IV"].includes(blueprint.area), `${label} has invalid blueprint area`);
  assert(nonEmptyString(blueprint.areaTitle), `${label} is missing area title`);
  assert(nonEmptyString(blueprint.group), `${label} is missing group`);
  assert(nonEmptyString(blueprint.topic), `${label} is missing topic`);
  assert(nonEmptyString(blueprint.skillLevel), `${label} is missing skill level`);
}

assert(audQuestionCorpus.source.url.includes("aicpa-cima.com"), "Corpus must cite the AICPA blueprint source URL.");
checks.push("source metadata");

assert(audQuestionCorpus.mcqs.length === 400, `Expected 400 AUD MCQs, found ${audQuestionCorpus.mcqs.length}.`);
assert(
  audQuestionCorpus.miniTbsScenarios.length === 10,
  `Expected 10 AUD mini-TBS scenarios, found ${audQuestionCorpus.miniTbsScenarios.length}.`
);
checks.push("required counts");

const ids = new Set();
const stems = new Set();
for (const mcq of audQuestionCorpus.mcqs) {
  assert(!ids.has(mcq.id), `Duplicate item id ${mcq.id}.`);
  ids.add(mcq.id);
  assert(mcq.type === "mcq", `${mcq.id} must be type mcq.`);
  validateBlueprint(mcq, mcq.id);
  assert(nonEmptyString(mcq.stem), `${mcq.id} is missing stem.`);
  assert(!stems.has(mcq.stem), `${mcq.id} duplicates an MCQ stem.`);
  stems.add(mcq.stem);
  assert(mcq.answerChoices.length === 4, `${mcq.id} must have four choices.`);
  assert(
    new Set(mcq.answerChoices.map((choice) => choice.id)).size === 4,
    `${mcq.id} must have unique choice ids.`
  );
  assert(
    mcq.answerChoices.some((choice) => choice.id === mcq.correctChoiceId),
    `${mcq.id} correct choice id must exist in choices.`
  );
  assert(nonEmptyString(mcq.explanation), `${mcq.id} is missing explanation.`);

  const distractorIds = mcq.answerChoices
    .map((choice) => choice.id)
    .filter((choiceId) => choiceId !== mcq.correctChoiceId);
  for (const choiceId of distractorIds) {
    assert(nonEmptyString(mcq.distractorRationales[choiceId]), `${mcq.id} is missing rationale for ${choiceId}.`);
  }
}
checks.push("mcq structure");

for (const scenario of audQuestionCorpus.miniTbsScenarios) {
  assert(!ids.has(scenario.id), `Duplicate item id ${scenario.id}.`);
  ids.add(scenario.id);
  assert(scenario.type === "mini-tbs", `${scenario.id} must be type mini-tbs.`);
  validateBlueprint(scenario, scenario.id);
  assert(nonEmptyString(scenario.title), `${scenario.id} is missing title.`);
  assert(nonEmptyString(scenario.scenario), `${scenario.id} is missing scenario.`);
  assert(scenario.exhibits.length >= 2, `${scenario.id} must have at least two exhibits.`);
  assert(scenario.tasks.length >= 3, `${scenario.id} must have at least three tasks.`);
  for (const task of scenario.tasks) {
    assert(nonEmptyString(task.prompt), `${scenario.id}/${task.id} is missing prompt.`);
    assert(nonEmptyString(task.answer), `${scenario.id}/${task.id} is missing answer.`);
    assert(nonEmptyString(task.explanation), `${scenario.id}/${task.id} is missing explanation.`);
  }
}
checks.push("mini-tbs structure");

const areaCounts = audQuestionCorpus.mcqs.reduce((counts, mcq) => {
  counts[mcq.blueprint.area] = (counts[mcq.blueprint.area] ?? 0) + 1;
  return counts;
}, {});

for (const area of ["I", "II", "III", "IV"]) {
  assert(areaCounts[area] === 100, `Expected 100 MCQs in AUD area ${area}, found ${areaCounts[area] ?? 0}.`);
}
checks.push("blueprint area balance");

console.log(`AUD question bank integrity checks passed (${checks.length}):`);
for (const check of checks) {
  console.log(`- ${check}`);
}

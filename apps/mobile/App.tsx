import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  cpaDomains,
  flashcards,
  getDomain,
  pickTutorAnswer,
  practiceQuestions,
  type CpaDomainId,
  type Flashcard,
  type PracticeQuestion
} from "./src/data/cpaPractice";
import {
  getLatestQuestionAttempt,
  getPracticeSnapshot,
  initializePracticeStore,
  listTutorMessages,
  recordFlashcardReview,
  recordPracticeAttempt,
  saveTutorMessage,
  type PracticeSnapshot,
  type TutorMessage
} from "./src/db/practiceStore";

type TabName = "today" | "domains" | "practice" | "tutor" | "cards";

type AnswerState = {
  questionId: string;
  selectedChoiceId: string;
  correct: boolean;
} | null;

const initialSnapshot: PracticeSnapshot = {
  totalAttempts: 0,
  correctAttempts: 0,
  accuracy: 0,
  weakDomainId: "risk",
  dueCards: flashcards.length,
  tutorThreads: 0,
  domainPerformance: cpaDomains.map((domain) => ({
    domainId: domain.id,
    attempts: 0,
    correct: 0,
    accuracy: 0
  }))
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>("today");
  const [selectedDomainId, setSelectedDomainId] = useState<CpaDomainId | "all">("all");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [snapshot, setSnapshot] = useState<PracticeSnapshot>(initialSnapshot);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [tutorPrompt, setTutorPrompt] = useState("");
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([]);

  const refresh = useCallback(async () => {
    const [nextSnapshot, nextMessages] = await Promise.all([
      getPracticeSnapshot(),
      listTutorMessages()
    ]);
    setSnapshot(nextSnapshot);
    setTutorMessages(nextMessages);
  }, []);

  useEffect(() => {
    let active = true;

    initializePracticeStore()
      .then(refresh)
      .finally(() => {
        if (active) {
          setReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, [refresh]);

  const filteredQuestions = useMemo(
    () =>
      selectedDomainId === "all"
        ? practiceQuestions
        : practiceQuestions.filter((question) => question.domainId === selectedDomainId),
    [selectedDomainId]
  );
  const activeQuestion = filteredQuestions[questionIndex % filteredQuestions.length] ?? practiceQuestions[0];
  const activeCard = flashcards[activeCardIndex % flashcards.length];

  const chooseDomain = useCallback((domainId: CpaDomainId | "all") => {
    setSelectedDomainId(domainId);
    setQuestionIndex(0);
    setAnswerState(null);
    setActiveTab("practice");
  }, []);

  const answerQuestion = useCallback(
    async (question: PracticeQuestion, choiceId: string) => {
      const correct = choiceId === question.correctChoiceId;
      setAnswerState({ questionId: question.id, selectedChoiceId: choiceId, correct });
      await recordPracticeAttempt(question.id, choiceId, correct);
      await refresh();
    },
    [refresh]
  );

  const nextQuestion = useCallback(() => {
    setAnswerState(null);
    setQuestionIndex((current) => current + 1);
  }, []);

  const askTutor = useCallback(async () => {
    const trimmed = tutorPrompt.trim();

    if (!trimmed) {
      return;
    }

    const response = pickTutorAnswer(trimmed);
    const answer = `${response.title}\n\n${response.answer}\n\nDrill: ${response.drill}`;
    setTutorPrompt("");
    await saveTutorMessage(trimmed, answer);
    await refresh();
  }, [refresh, tutorPrompt]);

  const gradeCard = useCallback(
    async (card: Flashcard, confidence: number) => {
      await recordFlashcardReview(card.id, confidence);
      setCardRevealed(false);
      setActiveCardIndex((current) => current + 1);
      await refresh();
    },
    [refresh]
  );

  if (!ready) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.loading}>
          <ActivityIndicator color={palette.teal} size="large" />
          <Text style={styles.loadingText}>Preparing CPA practice</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.app}
      >
        {activeTab === "today" ? (
          <TodayScreen snapshot={snapshot} onStart={() => chooseDomain("all")} onChooseDomain={chooseDomain} />
        ) : null}
        {activeTab === "domains" ? (
          <DomainsScreen snapshot={snapshot} onChooseDomain={chooseDomain} />
        ) : null}
        {activeTab === "practice" ? (
          <PracticeScreen
            activeQuestion={activeQuestion}
            answerState={answerState}
            selectedDomainId={selectedDomainId}
            snapshot={snapshot}
            onAnswer={answerQuestion}
            onNext={nextQuestion}
            onSelectDomain={chooseDomain}
          />
        ) : null}
        {activeTab === "tutor" ? (
          <TutorScreen
            messages={tutorMessages}
            prompt={tutorPrompt}
            onAsk={askTutor}
            onPromptChange={setTutorPrompt}
          />
        ) : null}
        {activeTab === "cards" ? (
          <CardsScreen
            card={activeCard}
            revealed={cardRevealed}
            snapshot={snapshot}
            onGrade={gradeCard}
            onReveal={() => setCardRevealed(true)}
          />
        ) : null}
        <BottomNav activeTab={activeTab} onSelect={setActiveTab} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function TodayScreen({
  snapshot,
  onStart,
  onChooseDomain
}: {
  snapshot: PracticeSnapshot;
  onStart: () => void;
  onChooseDomain: (domainId: CpaDomainId | "all") => void;
}) {
  const weakDomain = getDomain(snapshot.weakDomainId);
  const totalQuestionCount = practiceQuestions.length;

  return (
    <ScreenShell eyebrow="CPA AUD" title="Practice command" subtitle="Questions, weak areas, flashcards, and CPA answers stay ready on this device.">
      <View style={styles.hero}>
        <View style={styles.heroTopline}>
          <View style={styles.pill}>
            <Ionicons name="radio-button-on" size={13} color={palette.teal} />
            <Text style={styles.pillText}>Offline bank active</Text>
          </View>
          <Text style={styles.heroMeta}>{totalQuestionCount} questions loaded</Text>
        </View>
        <Text style={styles.heroNumber}>{snapshot.accuracy || "--"}%</Text>
        <Text style={styles.heroLabel}>current accuracy</Text>
        <View style={styles.heroActions}>
          <ActionButton icon="play" label="Start" onPress={onStart} />
          <ActionButton icon="flash" label={weakDomain.shortTitle} variant="secondary" onPress={() => onChooseDomain(weakDomain.id)} />
        </View>
      </View>

      <View style={styles.metricGrid}>
        <Metric label="Attempts" value={String(snapshot.totalAttempts)} icon="create-outline" />
        <Metric label="Correct" value={String(snapshot.correctAttempts)} icon="checkmark-done-outline" />
        <Metric label="Cards due" value={String(snapshot.dueCards)} icon="albums-outline" />
        <Metric label="Tutor" value={String(snapshot.tutorThreads)} icon="chatbubble-ellipses-outline" />
      </View>

      <Text style={styles.sectionLabel}>Domain readiness</Text>
      {snapshot.domainPerformance.map((item) => {
        const domain = getDomain(item.domainId);

        return (
          <DomainRow
            key={domain.id}
            domainId={domain.id}
            title={domain.shortTitle}
            area={domain.area}
            accuracy={item.accuracy}
            attempts={item.attempts}
            color={domain.color}
            onPress={() => onChooseDomain(domain.id)}
          />
        );
      })}
    </ScreenShell>
  );
}

function DomainsScreen({
  snapshot,
  onChooseDomain
}: {
  snapshot: PracticeSnapshot;
  onChooseDomain: (domainId: CpaDomainId | "all") => void;
}) {
  return (
    <ScreenShell eyebrow="Blueprint" title="AUD domains" subtitle="Pick a domain to drill questions with explanations and performance tracking.">
      {cpaDomains.map((domain) => {
        const performance = snapshot.domainPerformance.find((item) => item.domainId === domain.id);
        const count = practiceQuestions.filter((question) => question.domainId === domain.id).length;

        return (
          <Pressable key={domain.id} style={styles.domainCard} onPress={() => onChooseDomain(domain.id)}>
            <View style={[styles.domainAccent, { backgroundColor: domain.color }]} />
            <View style={styles.domainCardBody}>
              <View style={styles.domainHeader}>
                <Text style={styles.domainArea}>Area {domain.area}</Text>
                <Text style={styles.domainWeight}>{domain.weight}</Text>
              </View>
              <Text style={styles.domainTitle}>{domain.title}</Text>
              <Text style={styles.domainFocus}>{domain.focus}</Text>
              <View style={styles.domainStats}>
                <Text style={styles.domainStat}>{count} questions</Text>
                <Text style={styles.domainStat}>{performance?.attempts ?? 0} attempts</Text>
                <Text style={styles.domainStat}>{performance?.accuracy ?? 0}% accuracy</Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScreenShell>
  );
}

function PracticeScreen({
  activeQuestion,
  answerState,
  selectedDomainId,
  snapshot,
  onAnswer,
  onNext,
  onSelectDomain
}: {
  activeQuestion: PracticeQuestion;
  answerState: AnswerState;
  selectedDomainId: CpaDomainId | "all";
  snapshot: PracticeSnapshot;
  onAnswer: (question: PracticeQuestion, choiceId: string) => void;
  onNext: () => void;
  onSelectDomain: (domainId: CpaDomainId | "all") => void;
}) {
  const domain = getDomain(activeQuestion.domainId);
  const performance = snapshot.domainPerformance.find((item) => item.domainId === activeQuestion.domainId);
  const answered = answerState?.questionId === activeQuestion.id;

  return (
    <ScreenShell eyebrow="Question bank" title="Practice" subtitle="Answer, review the rationale, then keep moving.">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.domainChips}>
        <Chip active={selectedDomainId === "all"} label="All" onPress={() => onSelectDomain("all")} />
        {cpaDomains.map((item) => (
          <Chip
            key={item.id}
            active={selectedDomainId === item.id}
            label={item.shortTitle}
            onPress={() => onSelectDomain(item.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View>
            <Text style={styles.domainArea}>Area {domain.area}</Text>
            <Text style={styles.questionDomain}>{domain.shortTitle}</Text>
          </View>
          <View style={styles.difficultyPill}>
            <Text style={styles.difficultyText}>{activeQuestion.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.questionStem}>{activeQuestion.stem}</Text>
        <View style={styles.choiceStack}>
          {activeQuestion.choices.map((choice) => {
            const selected = answerState?.selectedChoiceId === choice.id;
            const correct = activeQuestion.correctChoiceId === choice.id;
            const showCorrect = answered && correct;
            const showWrong = answered && selected && !correct;

            return (
              <Pressable
                key={choice.id}
                disabled={answered}
                style={[
                  styles.choice,
                  showCorrect ? styles.choiceCorrect : null,
                  showWrong ? styles.choiceWrong : null
                ]}
                onPress={() => onAnswer(activeQuestion, choice.id)}
              >
                <View style={styles.choiceId}>
                  <Text style={styles.choiceIdText}>{choice.id}</Text>
                </View>
                <Text style={styles.choiceText}>{choice.text}</Text>
                {showCorrect ? <Ionicons name="checkmark-circle" size={22} color={palette.green} /> : null}
                {showWrong ? <Ionicons name="close-circle" size={22} color={palette.red} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      {answered ? (
        <View style={styles.explanationCard}>
          <Text style={styles.resultLabel}>{answerState.correct ? "Correct" : "Review"}</Text>
          <Text style={styles.explanation}>{activeQuestion.explanation}</Text>
          {!answerState.correct ? (
            <Text style={styles.rationale}>
              {activeQuestion.rationales[answerState.selectedChoiceId] ?? "This choice does not address the strongest audit issue."}
            </Text>
          ) : null}
          <Text style={styles.takeaway}>{activeQuestion.takeaway}</Text>
          <ActionButton icon="arrow-forward" label="Next question" onPress={onNext} />
        </View>
      ) : null}

      <View style={styles.performanceStrip}>
        <Text style={styles.performanceText}>{domain.shortTitle} accuracy</Text>
        <Text style={styles.performanceValue}>{performance?.accuracy ?? 0}%</Text>
      </View>
    </ScreenShell>
  );
}

function TutorScreen({
  messages,
  prompt,
  onAsk,
  onPromptChange
}: {
  messages: TutorMessage[];
  prompt: string;
  onAsk: () => void;
  onPromptChange: (value: string) => void;
}) {
  return (
    <ScreenShell eyebrow="CPA tutor" title="Ask AUD" subtitle="Ask about a rule, assertion, procedure, or report decision.">
      <View style={styles.askBox}>
        <TextInput
          multiline
          placeholder="Why is a positive confirmation nonresponse not evidence?"
          placeholderTextColor={palette.muted}
          style={styles.askInput}
          value={prompt}
          onChangeText={onPromptChange}
        />
        <ActionButton icon="send" label="Ask" onPress={onAsk} />
      </View>

      {messages.length ? (
        messages.map((message) => (
          <View key={message.id} style={styles.messageCard}>
            <Text style={styles.messageQuestion}>{message.question}</Text>
            <Text style={styles.messageAnswer}>{message.answer}</Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubble-ellipses-outline" size={26} color={palette.teal} />
          <Text style={styles.emptyTitle}>No tutor threads yet</Text>
          <Text style={styles.emptyCopy}>Try: “When do I qualify versus disclaim?”</Text>
        </View>
      )}
    </ScreenShell>
  );
}

function CardsScreen({
  card,
  revealed,
  snapshot,
  onGrade,
  onReveal
}: {
  card: Flashcard;
  revealed: boolean;
  snapshot: PracticeSnapshot;
  onGrade: (card: Flashcard, confidence: number) => void;
  onReveal: () => void;
}) {
  const domain = getDomain(card.domainId);

  return (
    <ScreenShell eyebrow="Flashcards" title="Recall" subtitle={`${snapshot.dueCards} cards due across AUD.`}>
      <Pressable style={styles.flashcard} onPress={revealed ? undefined : onReveal}>
        <View style={styles.flashcardHeader}>
          <Text style={styles.domainArea}>Area {domain.area}</Text>
          <Text style={[styles.flashcardDomain, { color: domain.color }]}>{domain.shortTitle}</Text>
        </View>
        <Text style={styles.flashcardPrompt}>{card.front}</Text>
        {revealed ? (
          <>
            <Text style={styles.flashcardAnswer}>{card.back}</Text>
            <Text style={styles.flashcardCue}>{card.cue}</Text>
          </>
        ) : (
          <View style={styles.revealHint}>
            <Ionicons name="eye-outline" size={20} color={palette.muted} />
            <Text style={styles.revealText}>Tap to reveal</Text>
          </View>
        )}
      </Pressable>

      {revealed ? (
        <View style={styles.cardGrades}>
          <GradeButton label="Again" tone="red" onPress={() => onGrade(card, 1)} />
          <GradeButton label="Hard" tone="orange" onPress={() => onGrade(card, 2)} />
          <GradeButton label="Know" tone="green" onPress={() => onGrade(card, 3)} />
        </View>
      ) : null}
    </ScreenShell>
  );
}

function ScreenShell({
  eyebrow,
  title,
  subtitle,
  children
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false} contentContainerStyle={styles.screenContent}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.metric}>
      <Ionicons name={icon} size={19} color={palette.teal} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function DomainRow({
  domainId,
  title,
  area,
  accuracy,
  attempts,
  color,
  onPress
}: {
  domainId: CpaDomainId;
  title: string;
  area: string;
  accuracy: number;
  attempts: number;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.domainRow} onPress={onPress}>
      <View style={[styles.domainDot, { backgroundColor: color }]} />
      <View style={styles.domainRowText}>
        <Text style={styles.domainRowTitle}>{title}</Text>
        <Text style={styles.domainRowMeta}>Area {area} · {attempts} attempts</Text>
      </View>
      <Text style={styles.domainRowScore}>{accuracy}%</Text>
      <Ionicons name="chevron-forward" size={18} color={palette.muted} />
    </Pressable>
  );
}

function Chip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, active ? styles.chipActive : null]} onPress={onPress}>
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

function ActionButton({
  icon,
  label,
  variant = "primary",
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  variant?: "primary" | "secondary";
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.actionButton, variant === "secondary" ? styles.secondaryButton : null]} onPress={onPress}>
      <Ionicons name={icon} size={18} color={variant === "secondary" ? palette.ink : "#ffffff"} />
      <Text style={[styles.actionButtonText, variant === "secondary" ? styles.secondaryButtonText : null]}>{label}</Text>
    </Pressable>
  );
}

function GradeButton({
  label,
  tone,
  onPress
}: {
  label: string;
  tone: "red" | "orange" | "green";
  onPress: () => void;
}) {
  const color = tone === "red" ? palette.red : tone === "orange" ? palette.orange : palette.green;

  return (
    <Pressable style={[styles.gradeButton, { borderColor: color }]} onPress={onPress}>
      <Text style={[styles.gradeText, { color }]}>{label}</Text>
    </Pressable>
  );
}

function BottomNav({ activeTab, onSelect }: { activeTab: TabName; onSelect: (tab: TabName) => void }) {
  const items: Array<{ name: TabName; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { name: "today", label: "Today", icon: "speedometer-outline" },
    { name: "domains", label: "Domains", icon: "grid-outline" },
    { name: "practice", label: "Practice", icon: "create-outline" },
    { name: "tutor", label: "Ask", icon: "chatbubble-ellipses-outline" },
    { name: "cards", label: "Cards", icon: "albums-outline" }
  ];

  return (
    <View style={styles.nav}>
      {items.map((item) => {
        const active = item.name === activeTab;

        return (
          <Pressable key={item.name} style={[styles.navItem, active ? styles.navItemActive : null]} onPress={() => onSelect(item.name)}>
            <Ionicons name={item.icon} size={21} color={active ? palette.teal : palette.muted} />
            <Text style={[styles.navText, active ? styles.navTextActive : null]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const palette = {
  ink: "#111827",
  muted: "#6b7280",
  line: "#d7dde5",
  canvas: "#f4f7f8",
  card: "#ffffff",
  teal: "#0f766e",
  tealSoft: "#d9f5ef",
  blue: "#2563eb",
  purple: "#7c3aed",
  orange: "#c2410c",
  green: "#15803d",
  greenSoft: "#dcfce7",
  red: "#b91c1c",
  redSoft: "#fee2e2",
  amberSoft: "#fef3c7"
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.canvas,
    flex: 1
  },
  app: {
    flex: 1
  },
  loading: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  loadingText: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12
  },
  screen: {
    flex: 1
  },
  screenContent: {
    paddingBottom: 112,
    paddingHorizontal: 18
  },
  header: {
    paddingBottom: 16,
    paddingTop: 24
  },
  eyebrow: {
    color: palette.teal,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: palette.ink,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: 7
  },
  subtitle: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8
  },
  hero: {
    backgroundColor: palette.ink,
    borderRadius: 8,
    padding: 18
  },
  heroTopline: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  pill: {
    alignItems: "center",
    backgroundColor: "#ecfeff",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  pillText: {
    color: palette.teal,
    fontSize: 11,
    fontWeight: "900"
  },
  heroMeta: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800"
  },
  heroNumber: {
    color: "#ffffff",
    fontSize: 60,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: 22
  },
  heroLabel: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "800"
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: palette.teal,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 16
  },
  secondaryButton: {
    backgroundColor: "#eef2f7"
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900"
  },
  secondaryButtonText: {
    color: palette.ink
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14
  },
  metric: {
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 108,
    padding: 14
  },
  metricValue: {
    color: palette.ink,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10
  },
  metricLabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
    textTransform: "uppercase"
  },
  sectionLabel: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 22
  },
  domainRow: {
    alignItems: "center",
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
    padding: 14
  },
  domainDot: {
    borderRadius: 999,
    height: 12,
    width: 12
  },
  domainRowText: {
    flex: 1
  },
  domainRowTitle: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  domainRowMeta: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3
  },
  domainRowScore: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  domainCard: {
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    marginBottom: 12,
    overflow: "hidden"
  },
  domainAccent: {
    width: 6
  },
  domainCardBody: {
    flex: 1,
    padding: 15
  },
  domainHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  domainArea: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  domainWeight: {
    color: palette.teal,
    fontSize: 12,
    fontWeight: "900"
  },
  domainTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23,
    marginTop: 8
  },
  domainFocus: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8
  },
  domainStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  domainStat: {
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    color: palette.ink,
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  domainChips: {
    gap: 8,
    paddingBottom: 12
  },
  chip: {
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  chipActive: {
    backgroundColor: palette.teal,
    borderColor: palette.teal
  },
  chipText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "900"
  },
  chipTextActive: {
    color: "#ffffff"
  },
  questionCard: {
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16
  },
  questionHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  questionDomain: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 3
  },
  difficultyPill: {
    backgroundColor: palette.amberSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  difficultyText: {
    color: palette.orange,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  questionStem: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 18
  },
  choiceStack: {
    gap: 10,
    marginTop: 18
  },
  choice: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 58,
    padding: 12
  },
  choiceCorrect: {
    backgroundColor: palette.greenSoft,
    borderColor: palette.green
  },
  choiceWrong: {
    backgroundColor: palette.redSoft,
    borderColor: palette.red
  },
  choiceId: {
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  choiceIdText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "900"
  },
  choiceText: {
    color: palette.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21
  },
  explanationCard: {
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 11,
    marginTop: 12,
    padding: 16
  },
  resultLabel: {
    color: palette.teal,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  explanation: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22
  },
  rationale: {
    color: palette.red,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21
  },
  takeaway: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    color: palette.ink,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    padding: 12
  },
  performanceStrip: {
    alignItems: "center",
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    padding: 14
  },
  performanceText: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  performanceValue: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  askBox: {
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    padding: 12
  },
  askInput: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    minHeight: 110,
    textAlignVertical: "top"
  },
  messageCard: {
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 12,
    padding: 15
  },
  messageQuestion: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21
  },
  messageAnswer: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
    marginTop: 10
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 12,
    padding: 24
  },
  emptyTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 10
  },
  emptyCopy: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
    textAlign: "center"
  },
  flashcard: {
    backgroundColor: palette.ink,
    borderRadius: 8,
    minHeight: 430,
    padding: 20
  },
  flashcardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  flashcardDomain: {
    fontSize: 13,
    fontWeight: "900"
  },
  flashcardPrompt: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 38,
    marginTop: 52
  },
  flashcardAnswer: {
    color: "#e5e7eb",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 29,
    marginTop: 28
  },
  flashcardCue: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
    marginTop: 24,
    padding: 13
  },
  revealHint: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 34
  },
  revealText: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: "800"
  },
  cardGrades: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14
  },
  gradeButton: {
    alignItems: "center",
    backgroundColor: palette.card,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 48,
    justifyContent: "center"
  },
  gradeText: {
    fontSize: 14,
    fontWeight: "900"
  },
  nav: {
    alignSelf: "center",
    backgroundColor: palette.card,
    borderColor: palette.line,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 14,
    flexDirection: "row",
    gap: 2,
    left: 12,
    padding: 7,
    position: "absolute",
    right: 12
  },
  navItem: {
    alignItems: "center",
    borderRadius: 11,
    flex: 1,
    gap: 3,
    minHeight: 50,
    justifyContent: "center"
  },
  navItemActive: {
    backgroundColor: palette.tealSoft
  },
  navText: {
    color: palette.muted,
    fontSize: 10,
    fontWeight: "900"
  },
  navTextActive: {
    color: palette.teal
  }
});

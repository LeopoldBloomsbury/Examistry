import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { MobileLesson, PackDetail } from "../types";
import { Badge, Button, Panel, Row, Screen, textStyles } from "../ui/components";
import { colors } from "../ui/theme";
import { markdownBlocks } from "../utils/format";

export function LessonScreen({
  pack,
  lesson,
  onBack,
  onToggleCompleted,
  onToggleSaved
}: {
  pack: PackDetail;
  lesson: MobileLesson;
  onBack: () => void;
  onToggleCompleted: () => void;
  onToggleSaved: () => void;
}) {
  return (
    <Screen title={lesson.title} subtitle={lesson.summary}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Button variant="ghost" onPress={onBack}>
          Back to {pack.badge}
        </Button>

        <Panel>
          <Row>
            <Badge tone="accent">{lesson.lessonType}</Badge>
            <Text style={styles.meta}>{lesson.estimatedMinutes} min</Text>
          </Row>
          <View style={styles.actions}>
            <Button variant={lesson.completed ? "primary" : "secondary"} onPress={onToggleCompleted}>
              {lesson.completed ? "Completed" : "Mark complete"}
            </Button>
            <Button variant="secondary" onPress={onToggleSaved}>
              {lesson.saved ? "Saved" : "Save"}
            </Button>
          </View>
        </Panel>

        <Panel>
          {markdownBlocks(lesson.contentMarkdown).map((block, index) => {
            if (block.type === "heading") {
              return (
                <Text key={`${block.type}-${index}`} style={styles.heading}>
                  {block.text}
                </Text>
              );
            }

            if (block.type === "bullet") {
              return (
                <View key={`${block.type}-${index}`} style={styles.bulletRow}>
                  <Text style={styles.bulletMark}>•</Text>
                  <Text style={styles.paragraph}>{block.text}</Text>
                </View>
              );
            }

            return (
              <Text key={`${block.type}-${index}`} style={styles.paragraph}>
                {block.text}
              </Text>
            );
          })}
        </Panel>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 120
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16
  },
  heading: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
    marginBottom: 14
  },
  paragraph: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 27,
    marginBottom: 14
  },
  bulletRow: {
    flexDirection: "row",
    gap: 10
  },
  bulletMark: {
    color: colors.accent,
    fontSize: 18,
    lineHeight: 27
  }
});

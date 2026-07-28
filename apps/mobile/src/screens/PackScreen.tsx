import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { PackDetail } from "../types";
import { Badge, Button, Panel, ProgressBar, Row, Screen, textStyles } from "../ui/components";
import { colors } from "../ui/theme";
import { pluralize } from "../utils/format";

export function PackScreen({
  pack,
  onBack,
  onOpenLesson,
  onDownloadPack
}: {
  pack: PackDetail;
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
  onDownloadPack: () => void;
}) {
  return (
    <Screen title={pack.title} subtitle={pack.subtitle}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Button variant="ghost" onPress={onBack}>
          Back
        </Button>

        <Panel>
          <Row>
            <Badge tone={pack.downloadedAt ? "accent" : "warning"}>
              {pack.downloadedAt ? "Available offline" : "Not downloaded"}
            </Badge>
            <Text style={styles.meta}>{pluralize(pack.totalLessons, "lesson")}</Text>
          </Row>
          <Text style={[textStyles.body, styles.description]}>{pack.description}</Text>
          <View style={styles.progress}>
            <Row>
              <Text style={textStyles.label}>Progress</Text>
              <Text style={styles.percent}>{pack.progressPercent}%</Text>
            </Row>
            <ProgressBar percent={pack.progressPercent} />
          </View>
          <Button onPress={onDownloadPack}>
            {pack.downloadedAt ? "Refresh offline pack" : "Download for offline"}
          </Button>
        </Panel>

        {pack.modules.map((module) => (
          <Panel key={module.id}>
            <Text style={textStyles.h2}>{module.title}</Text>
            <Text style={[textStyles.body, styles.moduleDescription]}>{module.description}</Text>
            {module.lessons.map((lesson) => {
              const locked = !pack.downloadedAt && !lesson.isPreview;

              return (
                <View key={lesson.id} style={styles.lessonRow}>
                  <View style={styles.lessonText}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonMeta}>
                      {lesson.estimatedMinutes} min · {lesson.lessonType}
                      {lesson.completed ? " · complete" : ""}
                    </Text>
                  </View>
                  <Button
                    variant={locked ? "ghost" : "secondary"}
                    onPress={() => {
                      if (!locked) {
                        onOpenLesson(lesson.id);
                      }
                    }}
                  >
                    {locked ? "Locked" : "Open"}
                  </Button>
                </View>
              );
            })}
          </Panel>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 120
  },
  description: {
    marginTop: 14
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  progress: {
    gap: 10,
    marginVertical: 18
  },
  percent: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800"
  },
  moduleDescription: {
    marginTop: 6
  },
  lessonRow: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 14
  },
  lessonText: {
    flex: 1
  },
  lessonTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800"
  },
  lessonMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4
  }
});

import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { PackSummary } from "../types";
import { Badge, Button, Panel, ProgressBar, Row, Screen, textStyles } from "../ui/components";
import { colors } from "../ui/theme";
import { formatDateTime } from "../utils/format";

export function LibraryScreen({
  packs,
  onOpenPack,
  onDownloadPack
}: {
  packs: PackSummary[];
  onOpenPack: (packId: string) => void;
  onDownloadPack: (packId: string) => void;
}) {
  return (
    <Screen title="Library" subtitle="Choose which packs live on this device. Downloaded content remains readable offline.">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {packs.map((pack) => (
          <Panel key={pack.id}>
            <Row>
              <Badge tone={pack.downloadedAt ? "accent" : "neutral"}>
                {pack.downloadedAt ? "Downloaded" : pack.badge}
              </Badge>
              <Text style={styles.hours}>{pack.estimatedHours} hrs</Text>
            </Row>
            <Text style={[textStyles.h2, styles.title]}>{pack.title}</Text>
            <Text style={textStyles.body}>{pack.subtitle}</Text>
            <View style={styles.progress}>
              <Row>
                <Text style={textStyles.label}>Progress</Text>
                <Text style={styles.meta}>{pack.progressPercent}%</Text>
              </Row>
              <ProgressBar percent={pack.progressPercent} />
            </View>
            <Text style={styles.downloadedAt}>{formatDateTime(pack.downloadedAt)}</Text>
            <View style={styles.actions}>
              <Button variant="secondary" onPress={() => onOpenPack(pack.id)}>
                Details
              </Button>
              <Button onPress={() => onDownloadPack(pack.id)}>
                {pack.downloadedAt ? "Refresh offline copy" : "Download"}
              </Button>
            </View>
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
  title: {
    marginTop: 14
  },
  hours: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  progress: {
    gap: 10,
    marginTop: 18
  },
  meta: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800"
  },
  downloadedAt: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 12
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16
  }
});

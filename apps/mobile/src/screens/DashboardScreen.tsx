import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PackSummary } from "../types";
import { Badge, Button, Panel, ProgressBar, Row, Screen, textStyles } from "../ui/components";
import { colors } from "../ui/theme";
import { pluralize } from "../utils/format";

export function DashboardScreen({
  packs,
  stats,
  onOpenPack,
  onOpenLibrary,
  onOpenSync
}: {
  packs: PackSummary[];
  stats: {
    downloadedPacks: number;
    completedLessons: number;
    savedLessons: number;
    pendingSync: number;
  };
  onOpenPack: (packId: string) => void;
  onOpenLibrary: () => void;
  onOpenSync: () => void;
}) {
  const continuePack = packs.find((pack) => pack.downloadedAt && pack.progressPercent < 100) ?? packs.find((pack) => pack.downloadedAt);

  return (
    <Screen
      title="Offline study"
      subtitle="Downloaded packs stay readable without a connection. Progress is queued locally until sync."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          <Stat label="Downloaded" value={String(stats.downloadedPacks)} />
          <Stat label="Completed" value={String(stats.completedLessons)} />
          <Stat label="Saved" value={String(stats.savedLessons)} />
          <Stat label="Pending" value={String(stats.pendingSync)} tone={stats.pendingSync ? "warning" : "neutral"} />
        </View>

        <Panel>
          <Row>
            <Badge tone="accent">Ready offline</Badge>
            <Ionicons name="cloud-offline-outline" size={22} color={colors.accent} />
          </Row>
          <Text style={[textStyles.h2, styles.sectionTitle]}>
            {continuePack?.title ?? "Download a pack to begin"}
          </Text>
          <Text style={textStyles.body}>
            {continuePack?.subtitle ?? "Keep lessons, assets, progress, and saved state available on the device."}
          </Text>
          {continuePack ? (
            <>
              <View style={styles.progressWrap}>
                <Row>
                  <Text style={textStyles.label}>Progress</Text>
                  <Text style={styles.percent}>{continuePack.progressPercent}%</Text>
                </Row>
                <ProgressBar percent={continuePack.progressPercent} />
              </View>
              <Button onPress={() => onOpenPack(continuePack.id)}>Open pack</Button>
            </>
          ) : (
            <Button onPress={onOpenLibrary}>Open library</Button>
          )}
        </Panel>

        <Panel>
          <Text style={textStyles.h2}>Downloaded library</Text>
          <Text style={[textStyles.body, styles.copy]}>
            {pluralize(packs.filter((pack) => pack.downloadedAt).length, "pack")} on this device.
          </Text>
          {packs
            .filter((pack) => pack.downloadedAt)
            .map((pack) => (
              <View key={pack.id} style={styles.packRow}>
                <View style={styles.packText}>
                  <Text style={styles.packTitle}>{pack.title}</Text>
                  <Text style={styles.packMeta}>
                    {pack.completedLessons} / {pack.totalLessons} lessons
                  </Text>
                </View>
                <Button variant="secondary" onPress={() => onOpenPack(pack.id)}>
                  Open
                </Button>
              </View>
            ))}
        </Panel>

        <Panel>
          <Row>
            <View style={styles.packText}>
              <Text style={textStyles.h2}>Sync queue</Text>
              <Text style={textStyles.body}>Review local changes waiting to push.</Text>
            </View>
            <Button variant="secondary" onPress={onOpenSync}>
              Sync
            </Button>
          </Row>
        </Panel>
      </ScrollView>
    </Screen>
  );
}

function Stat({
  label,
  value,
  tone = "neutral"
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <Panel style={styles.stat}>
      <Text style={textStyles.label}>{label}</Text>
      <Text style={[styles.statValue, tone === "warning" ? styles.warning : null]}>{value}</Text>
    </Panel>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingBottom: 120
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  stat: {
    flexBasis: "47%",
    flexGrow: 1
  },
  statValue: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6
  },
  warning: {
    color: colors.warning
  },
  sectionTitle: {
    marginTop: 14
  },
  progressWrap: {
    gap: 10,
    marginVertical: 18
  },
  percent: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800"
  },
  copy: {
    marginTop: 6
  },
  packRow: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 14
  },
  packText: {
    flex: 1
  },
  packTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "800"
  },
  packMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4
  }
});

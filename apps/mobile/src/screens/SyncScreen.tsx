import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { SyncQueueItem } from "../types";
import { Badge, Button, Panel, Row, Screen, textStyles } from "../ui/components";
import { colors } from "../ui/theme";
import { formatDateTime, pluralize } from "../utils/format";

export function SyncScreen({
  items,
  isSyncing,
  lastMessage,
  onSync
}: {
  items: SyncQueueItem[];
  isSyncing: boolean;
  lastMessage: string;
  onSync: () => void;
}) {
  return (
    <Screen title="Sync" subtitle="Local-first changes queue here while the app is offline or between sync attempts.">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Panel>
          <Row>
            <View style={styles.summaryText}>
              <Text style={textStyles.h2}>{pluralize(items.length, "pending change")}</Text>
              <Text style={[textStyles.body, styles.summaryCopy]}>
                Demo sync drains the local queue. Server sync can use `/api/mobile/sync`.
              </Text>
            </View>
            <Button onPress={onSync}>{isSyncing ? "Syncing" : "Sync now"}</Button>
          </Row>
          {lastMessage ? <Text style={styles.message}>{lastMessage}</Text> : null}
        </Panel>

        {items.map((item) => (
          <Panel key={item.id}>
            <Badge tone="warning">{item.operation.replace("_", " ")}</Badge>
            <Text style={styles.record}>{item.recordId}</Text>
            <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
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
  summaryText: {
    flex: 1,
    paddingRight: 12
  },
  summaryCopy: {
    marginTop: 6
  },
  message: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 14
  },
  record: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 12
  },
  date: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 6
  }
});

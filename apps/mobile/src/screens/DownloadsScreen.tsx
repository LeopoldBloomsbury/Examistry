import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { PackDetail } from "../types";
import { Badge, Panel, Screen, textStyles } from "../ui/components";
import { colors } from "../ui/theme";

export function DownloadsScreen({ packs }: { packs: PackDetail[] }) {
  const assets = packs.flatMap((pack) =>
    pack.assets.map((asset) => ({
      ...asset,
      packTitle: pack.title
    }))
  );

  return (
    <Screen title="Downloads" subtitle="Offline assets attached to downloaded packs.">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {assets.length ? (
          assets.map((asset) => (
            <Panel key={asset.id}>
              <Badge tone={asset.availableOffline ? "accent" : "warning"}>
                {asset.availableOffline ? "Offline" : "Online only"}
              </Badge>
              <Text style={[textStyles.h2, styles.title]}>{asset.title}</Text>
              <Text style={textStyles.body}>{asset.description}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{asset.packTitle}</Text>
                <Text style={styles.meta}>{asset.fileType.toUpperCase()}</Text>
              </View>
            </Panel>
          ))
        ) : (
          <Panel>
            <Text style={textStyles.h2}>No offline assets yet</Text>
            <Text style={[textStyles.body, styles.empty]}>
              Download a pack from the library to make its study assets available here.
            </Text>
          </Panel>
        )}
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
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  empty: {
    marginTop: 8
  }
});

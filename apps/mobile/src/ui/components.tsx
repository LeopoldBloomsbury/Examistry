import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from "react-native";
import { colors, spacing } from "./theme";

export function Screen({
  children,
  title,
  subtitle
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CPA StudyPilot</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export function Panel({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function Row({
  children,
  style
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "warning" }) {
  return (
    <View
      style={[
        styles.badge,
        tone === "accent" ? styles.badgeAccent : null,
        tone === "warning" ? styles.badgeWarning : null
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          tone === "accent" ? styles.badgeTextAccent : null,
          tone === "warning" ? styles.badgeTextWarning : null
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

export function Button({
  children,
  variant = "primary",
  style,
  ...props
}: PressableProps & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <Pressable
      {...props}
      style={({ pressed }: { pressed: boolean }) => [
        styles.button,
        variant === "secondary" ? styles.buttonSecondary : null,
        variant === "ghost" ? styles.buttonGhost : null,
        pressed ? styles.pressed : null,
        typeof style === "function" ? style({ pressed }) : style
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" || variant === "ghost" ? styles.buttonTextSecondary : null
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, percent))}%` }]} />
    </View>
  );
}

export const textStyles = StyleSheet.create({
  h2: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700"
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase"
  }
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.screen
  },
  header: {
    paddingTop: 18,
    paddingBottom: 18
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8
  },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: spacing.radius,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.soft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  badgeAccent: {
    backgroundColor: colors.accentSoft
  },
  badgeWarning: {
    backgroundColor: "#fef3c7"
  },
  badgeText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  badgeTextAccent: {
    color: colors.accent
  },
  badgeTextWarning: {
    color: colors.warning
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  buttonSecondary: {
    backgroundColor: colors.soft
  },
  buttonGhost: {
    backgroundColor: "transparent"
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800"
  },
  buttonTextSecondary: {
    color: colors.ink
  },
  pressed: {
    opacity: 0.72
  },
  progressTrack: {
    backgroundColor: colors.soft,
    borderRadius: 999,
    height: 8,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: colors.accent,
    height: 8
  }
});

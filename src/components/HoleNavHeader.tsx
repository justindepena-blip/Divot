import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  title: string;
  subtitle: string;
  onPrev: () => void;
  onNext: () => void;
};

export function HoleNavHeader({ title, subtitle, onPrev, onNext }: Props) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onPrev} style={styles.chevron} hitSlop={8}>
        <Text style={styles.chevronText}>‹</Text>
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Pressable onPress={onNext} style={styles.chevron} hitSlop={8}>
        <Text style={styles.chevronText}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chevron: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontFamily: fonts.mono500,
    fontSize: 15,
    color: colors.muteStrong,
  },
  center: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontFamily: fonts.grotesk600,
    fontSize: 15,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.mute,
  },
});

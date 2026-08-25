import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ACCENT, colors, fonts } from '../theme';

type Props = {
  value: string;
  label: string;
  accent?: boolean;
  style?: any;
};

export function StatTile({ value, label, accent, style }: Props) {
  return (
    <View style={[styles.tile, style]}>
      <Text style={[styles.value, accent && { color: ACCENT }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 7,
  },
  value: {
    fontFamily: fonts.mono700,
    fontSize: 19,
    color: colors.text,
  },
  label: {
    fontFamily: fonts.mono400,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.mute,
  },
});

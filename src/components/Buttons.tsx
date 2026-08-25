import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ACCENT, colors, fonts } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  style?: any;
};

export function PrimaryButton({ label, onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.primary, style]}>
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function OutlineButton({ label, onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.outline, style]}>
      <Text style={styles.outlineLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontFamily: fonts.grotesk600,
    fontSize: 14,
    color: colors.accentOnBg,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineLabel: {
    fontFamily: fonts.grotesk600,
    fontSize: 13,
    color: colors.text,
  },
});

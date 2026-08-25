import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ACCENT, colors, fonts } from '../theme';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: [Option<T>, Option<T>];
  value: T;
  onChange: (v: T) => void;
};

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.track}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 7,
  },
  segmentActive: {
    backgroundColor: ACCENT,
  },
  label: {
    fontFamily: fonts.mono500,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.muteStrong,
  },
  labelActive: {
    color: colors.accentOnBg,
  },
});

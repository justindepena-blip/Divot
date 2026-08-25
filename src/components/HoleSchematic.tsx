import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  hole: number;
  height: number;
  children?: React.ReactNode;
};

/**
 * Stand-in hole graphic. The design ships this as a striped schematic on
 * purpose — drop real satellite tiles / course geometry in behind it later.
 */
export function HoleSchematic({ hole, height, children }: Props) {
  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.fairwayOuter, { left: '20%', bottom: 26, width: '50%', height: '70%' }]} />
      <View style={[styles.fairwayInner, { left: '26%', bottom: 40, width: '38%', height: '56%' }]} />
      <View style={styles.green} />
      <View style={[styles.bunker, { left: '34%', top: 96, width: 40, height: 22 }]} />
      <View style={[styles.bunker, { right: '16%', top: 54, width: 34, height: 20 }]} />
      <View style={[styles.rough, { left: '14%', bottom: 78, width: 26, height: 52 }]} />
      <Text style={styles.label}>SCHEMATIC · HOLE {hole} — DROP SATELLITE TILE HERE</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    backgroundColor: colors.holeBgBottom,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  fairwayOuter: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.fairway,
    transform: [{ rotate: '7deg' }],
  },
  fairwayInner: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.fairwayLight,
    transform: [{ rotate: '7deg' }],
  },
  green: {
    position: 'absolute',
    left: '46%',
    top: 26,
    width: 96,
    height: 68,
    marginLeft: -30,
    borderRadius: 999,
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  bunker: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.bunker,
  },
  rough: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.rough,
  },
  label: {
    position: 'absolute',
    top: 10,
    left: 14,
    fontFamily: fonts.mono400,
    fontSize: 8,
    letterSpacing: 1.1,
    color: '#4E5A5C',
  },
});

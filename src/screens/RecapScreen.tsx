import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OutlineButton, PrimaryButton } from '../components/Buttons';
import { StatTile } from '../components/StatTile';
import { DivotState } from '../state/useDivotState';
import { ACCENT, colors, fonts } from '../theme';

export function RecapScreen({ state }: { state: DivotState }) {
  return (
    <View style={styles.screen}>
      <View style={{ gap: 5 }}>
        <Text style={styles.title}>Round recap</Text>
        <Text style={styles.subtitle}>
          {state.courseName} · TODAY · THRU {state.thru}
        </Text>
      </View>

      <View style={styles.bigRow}>
        <Text style={styles.bigScore}>{state.totalScore ?? '–'}</Text>
        <View style={{ gap: 6, paddingBottom: 8 }}>
          <Text style={styles.delta}>{state.deltaText}</Text>
          <Text style={styles.vsPar}>VS PAR {state.parThru}</Text>
        </View>
      </View>

      <View style={{ gap: 9 }}>
        <Text style={styles.sectionLabel}>HOLE BY HOLE</Text>
        <View style={styles.barsRow}>
          {state.bars.map((b) => (
            <View key={b.n} style={styles.barCol}>
              <View style={[styles.bar, { height: b.barH, backgroundColor: b.color }]} />
            </View>
          ))}
        </View>
        <View style={styles.barLabelsRow}>
          {state.bars.map((b) => (
            <Text key={b.n} style={styles.barLabel}>
              {b.n}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.statGrid}>
        <StatTile value={String(state.birdies)} label="BIRDIES OR BETTER" accent style={styles.statTile} />
        <StatTile value={String(state.pars)} label="PARS" style={styles.statTile} />
        <StatTile value={`${state.girPct}%`} label="GREENS IN REG" style={styles.statTile} />
        <StatTile value={String(state.puttsTotal)} label="PUTTS" style={styles.statTile} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <OutlineButton label="Edit card" onPress={() => state.setScreen('card')} style={{ flex: 1 }} />
        <PrimaryButton label="Share round" onPress={() => {}} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
    gap: 20,
  },
  title: {
    fontFamily: fonts.grotesk600,
    fontSize: 17,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    color: colors.mute,
  },
  bigRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    paddingBottom: 4,
  },
  bigScore: {
    fontFamily: fonts.mono700,
    fontSize: 76,
    lineHeight: 61,
    letterSpacing: -3,
    color: colors.text,
  },
  delta: {
    fontFamily: fonts.mono600,
    fontSize: 20,
    color: ACCENT,
  },
  vsPar: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    letterSpacing: 1.2,
    color: colors.mute,
  },
  sectionLabel: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.mute,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 74,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  barLabelsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  barLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.mono400,
    fontSize: 8,
    color: colors.muteFaint,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statTile: {
    width: '48%',
  },
});

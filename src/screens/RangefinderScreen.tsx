import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HoleNavHeader } from '../components/HoleNavHeader';
import { HoleSchematic } from '../components/HoleSchematic';
import { OutlineButton } from '../components/Buttons';
import { DivotState } from '../state/useDivotState';
import { ACCENT, colors, fonts } from '../theme';

export function RangefinderScreen({ state }: { state: DivotState }) {
  return (
    <View>
      <HoleNavHeader
        title={`Hole ${state.hole}`}
        subtitle={`PAR ${state.par} · ${state.holeYds} ${state.unitLabel}`}
        onPrev={state.prevHole}
        onNext={state.nextHole}
      />

      <HoleSchematic hole={state.hole} height={296}>
        <View style={styles.pinLine} />
        <View style={styles.pinMarker} />
        <View style={styles.playerDot} />
        <View style={styles.pinCallout}>
          <Text style={styles.pinCalloutText}>
            {state.toPin} {state.unitLabel} PIN
          </Text>
        </View>
        <View style={styles.windBox}>
          <Text style={styles.captionLabel}>WIND</Text>
          <Text style={styles.captionValue}>7 mph ↘</Text>
        </View>
        <View style={[styles.windBox, { right: 14, alignItems: 'flex-end' }]}>
          <Text style={styles.captionLabel}>PLAYS LIKE</Text>
          <Text style={[styles.captionValue, { color: ACCENT }]}>
            {state.playsLike} {state.unitLabel}
          </Text>
        </View>
      </HoleSchematic>

      <View style={styles.body}>
        <View style={styles.bigRow}>
          <Text style={styles.bigNumber}>{state.toPin}</Text>
          <Text style={styles.bigUnit}>{state.unitLabel} TO PIN</Text>
        </View>

        <View style={styles.tileRow}>
          <View style={styles.tile}>
            <Text style={styles.tileValue}>{state.front}</Text>
            <Text style={styles.tileLabel}>FRONT</Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.tileValue}>{state.toPin}</Text>
            <Text style={[styles.tileLabel, { color: ACCENT }]}>PIN</Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.tileValue}>{state.back}</Text>
            <Text style={styles.tileLabel}>BACK</Text>
          </View>
        </View>

        <View style={styles.clubCard}>
          <View style={{ gap: 5 }}>
            <Text style={styles.clubCardLabel}>SUGGESTED CLUB</Text>
            <Text style={styles.clubCardValue}>{state.suggestedClub}</Text>
          </View>
          <Text style={styles.avgText}>
            your avg{'\n'}
            {state.clubAvg} {state.unitLabel}
          </Text>
        </View>

        <OutlineButton label={`Enter score for hole ${state.hole}`} onPress={() => state.setScreen('card')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pinLine: {
    position: 'absolute',
    left: '50%',
    top: 52,
    bottom: 56,
    width: 0,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(47,169,232,0.55)',
  },
  pinMarker: {
    position: 'absolute',
    left: '50%',
    top: 44,
    width: 16,
    height: 16,
    marginLeft: -8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ACCENT,
    backgroundColor: 'rgba(47,169,232,0.18)',
  },
  playerDot: {
    position: 'absolute',
    left: '50%',
    bottom: 48,
    width: 8,
    height: 8,
    marginLeft: -4,
    borderRadius: 4,
    backgroundColor: colors.text,
  },
  pinCallout: {
    position: 'absolute',
    left: '50%',
    top: 110,
    transform: [{ translateX: -46 }],
    backgroundColor: 'rgba(11,13,14,0.82)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 9,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  pinCalloutText: {
    fontFamily: fonts.mono500,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.textDim,
  },
  windBox: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    gap: 6,
  },
  captionLabel: {
    fontFamily: fonts.mono400,
    fontSize: 8,
    letterSpacing: 1.1,
    color: colors.mute,
  },
  captionValue: {
    fontFamily: fonts.mono500,
    fontSize: 12,
    color: colors.textDim,
  },
  body: {
    padding: 20,
    gap: 16,
  },
  bigRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
  },
  bigNumber: {
    fontFamily: fonts.mono700,
    fontSize: 82,
    lineHeight: 66,
    letterSpacing: -3,
    color: colors.text,
  },
  bigUnit: {
    fontFamily: fonts.mono400,
    fontSize: 11,
    letterSpacing: 1.8,
    color: colors.mute,
    paddingBottom: 8,
  },
  tileRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    gap: 5,
  },
  tileValue: {
    fontFamily: fonts.mono500,
    fontSize: 16,
    color: colors.text,
  },
  tileLabel: {
    fontFamily: fonts.mono400,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.mute,
  },
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(47,169,232,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(47,169,232,0.22)',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  clubCardLabel: {
    fontFamily: fonts.mono400,
    fontSize: 8,
    letterSpacing: 1.1,
    color: ACCENT,
  },
  clubCardValue: {
    fontFamily: fonts.grotesk600,
    fontSize: 15,
    color: colors.text,
  },
  avgText: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    lineHeight: 14,
    color: colors.muteStrong,
    textAlign: 'right',
  },
});

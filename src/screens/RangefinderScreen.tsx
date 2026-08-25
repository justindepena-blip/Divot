import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HoleNavHeader } from '../components/HoleNavHeader';
import { SatelliteMap } from '../components/SatelliteMap';
import { OutlineButton } from '../components/Buttons';
import { DivotState } from '../state/useDivotState';
import { ACCENT, colors, fonts } from '../theme';

export function RangefinderScreen({ state }: { state: DivotState }) {
  const gpsColor = state.gpsLocked ? ACCENT : '#D9A94A';

  return (
    <View>
      {/* Course bar — opens the search sheet. */}
      <Pressable style={styles.courseBar} onPress={state.openSheet}>
        <View style={{ gap: 5, flex: 1 }}>
          <Text style={styles.courseName} numberOfLines={1}>
            {state.courseName}
          </Text>
          <Text style={styles.courseMeta}>
            {state.teeName} TEES · PAR {state.coursePar} · {state.courseLength} {state.unitLabel}
          </Text>
        </View>
        <Text style={styles.change}>CHANGE</Text>
      </Pressable>

      {/* Live GPS status. */}
      <View
        style={[
          styles.gpsStrip,
          {
            backgroundColor: state.gpsLocked ? 'rgba(47,169,232,0.07)' : 'rgba(217,169,74,0.07)',
            borderColor: state.gpsLocked ? 'rgba(47,169,232,0.22)' : 'rgba(217,169,74,0.24)',
          },
        ]}
      >
        <View style={styles.gpsLeft}>
          <View style={[styles.dot, { backgroundColor: gpsColor }]} />
          <Text style={[styles.gpsLabel, { color: gpsColor }]} numberOfLines={1}>
            {state.gpsLabel}
          </Text>
        </View>
        <View style={styles.gpsActions}>
          <Pressable onPress={() => state.pos && state.setPin(state.pos)} hitSlop={6}>
            <Text style={styles.captureText}>{state.pin ? 'PIN SET' : 'TAP MAP FOR PIN'}</Text>
          </Pressable>
          <Pressable onPress={state.retryGps} hitSlop={6}>
            <Text style={styles.retryText}>RETRY</Text>
          </Pressable>
        </View>
      </View>

      <HoleNavHeader
        title={`Hole ${state.hole}`}
        subtitle={`PAR ${state.par} · ${state.holeYds} ${state.unitLabel}`}
        onPrev={state.prevHole}
        onNext={state.nextHole}
      />

      <SatelliteMap
        center={state.mapCenter}
        pin={state.pin}
        pos={state.pos}
        hint={state.mapHint}
        distanceLabel={state.distanceLabel}
        onPickPin={state.setPin}
      >
        <View style={styles.playsLikeBox} pointerEvents="none">
          <Text style={styles.captionLabel}>PLAYS LIKE</Text>
          <Text style={[styles.captionValue, { color: ACCENT }]}>
            {state.playsLike} {state.unitLabel}
          </Text>
        </View>
      </SatelliteMap>

      <View style={styles.body}>
        <View style={styles.bigRow}>
          <Text style={styles.bigNumber}>{state.toPin}</Text>
          <View style={styles.bigSide}>
            <Text style={styles.bigUnit}>{state.unitLabel} TO PIN</Text>
            <Text style={[styles.pinSource, { color: state.pinSourceColor }]}>
              {state.pinSource}
            </Text>
          </View>
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
            avg {state.clubAvg} {state.unitLabel}
            {'\n'}
            <Text style={{ color: colors.mute }}>{state.clubDelta}</Text>
          </Text>
        </View>

        <OutlineButton
          label={`Enter score for hole ${state.hole}`}
          onPress={() => state.setScreen('card')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  courseBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  courseName: {
    fontFamily: fonts.grotesk500,
    fontSize: 13,
    color: colors.text,
  },
  courseMeta: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    letterSpacing: 0.9,
    color: colors.mute,
  },
  change: {
    fontFamily: fonts.mono400,
    fontSize: 11,
    color: ACCENT,
  },
  gpsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 11,
    borderWidth: 1,
  },
  gpsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flexShrink: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  gpsLabel: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    letterSpacing: 0.9,
    flexShrink: 1,
  },
  gpsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  captureText: {
    fontFamily: fonts.mono500,
    fontSize: 9,
    letterSpacing: 0.7,
    color: ACCENT,
  },
  retryText: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    letterSpacing: 0.7,
    color: colors.mute,
  },
  playsLikeBox: {
    position: 'absolute',
    right: 12,
    bottom: 26,
    alignItems: 'flex-end',
    gap: 5,
    backgroundColor: 'rgba(11,13,14,0.82)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 9,
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
  bigSide: {
    gap: 7,
    paddingBottom: 8,
    maxWidth: 130,
  },
  bigUnit: {
    fontFamily: fonts.mono400,
    fontSize: 11,
    letterSpacing: 1.8,
    color: colors.mute,
  },
  pinSource: {
    fontFamily: fonts.mono400,
    fontSize: 8,
    lineHeight: 11,
    letterSpacing: 0.8,
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
    lineHeight: 15,
    color: colors.muteStrong,
    textAlign: 'right',
  },
});

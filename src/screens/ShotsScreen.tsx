import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HoleNavHeader } from '../components/HoleNavHeader';
import { SatelliteMap } from '../components/SatelliteMap';
import { DivotState } from '../state/useDivotState';
import { ACCENT, colors, fonts } from '../theme';

export function ShotsScreen({ state }: { state: DivotState }) {
  return (
    <View>
      <HoleNavHeader
        title={`Shots · hole ${state.hole}`}
        subtitle={`PAR ${state.par} · ${state.holeYds} ${state.unitLabel}`}
        onPrev={state.prevHole}
        onNext={state.nextHole}
      />

      <SatelliteMap
        center={state.mapCenter}
        pin={state.pin}
        pos={state.pos}
        shots={state.shotPoints}
        hint={state.shotHint}
        distanceLabel={state.distanceLabel}
        onPickPin={state.setPin}
      />

      <View style={styles.body}>
        <View>
          {state.shots.map((sh) => (
            <View key={sh.n} style={styles.shotRow}>
              <View style={styles.shotIndex}>
                <Text style={styles.shotIndexText}>{sh.n}</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.shotClub}>{sh.club}</Text>
                <Text style={styles.shotNote}>{sh.note}</Text>
              </View>
              <Text style={[styles.shotDist, { color: sh.color }]}>{sh.dist}</Text>
              <Text style={styles.shotUnit}>{state.unitLabel}</Text>
            </View>
          ))}

          {state.shots.length === 0 && (
            <Text style={styles.empty}>
              NO SHOTS ON THIS HOLE YET. STAND OVER THE BALL AND TAP BELOW — EACH TAP DROPS A GPS
              POINT AND MEASURES THE LEG.
            </Text>
          )}
        </View>

        {/* Disabled until there is a fix to attach the shot to. */}
        <Pressable
          onPress={state.addShot}
          disabled={!state.gpsLocked}
          style={[styles.addShot, { opacity: state.gpsLocked ? 1 : 0.6 }]}
        >
          <View style={[styles.dot, { backgroundColor: state.gpsLocked ? ACCENT : '#D9A94A' }]} />
          <Text style={styles.addShotLabel}>
            {state.gpsLocked ? 'Add shot at my position' : 'Waiting for GPS…'}
          </Text>
        </Pressable>

        <View style={styles.avgCard}>
          <Text style={styles.avgCardLabel}>YOUR CLUB AVERAGES</Text>
          <View style={styles.avgRow}>
            {state.clubAverages.map((c) => (
              <View key={c.name} style={{ flex: 1, gap: 6 }}>
                <Text style={styles.avgDist}>{c.dist}</Text>
                <Text style={styles.avgName}>{c.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
  },
  shotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  shotIndex: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shotIndexText: {
    fontFamily: fonts.mono500,
    fontSize: 10,
    color: colors.muteStrong,
  },
  shotClub: {
    fontFamily: fonts.grotesk500,
    fontSize: 13,
    color: colors.text,
  },
  shotNote: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    color: colors.mute,
  },
  shotDist: {
    fontFamily: fonts.mono700,
    fontSize: 15,
    color: colors.text,
  },
  shotUnit: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    color: colors.muteFaint,
  },
  empty: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    fontFamily: fonts.mono400,
    fontSize: 10,
    lineHeight: 16,
    color: colors.mute,
  },
  addShot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    paddingVertical: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  addShotLabel: {
    fontFamily: fonts.grotesk600,
    fontSize: 13,
    color: colors.text,
  },
  avgCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 15,
    gap: 13,
  },
  avgCardLabel: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    letterSpacing: 1.3,
    color: colors.mute,
  },
  avgRow: {
    flexDirection: 'row',
    gap: 10,
  },
  avgDist: {
    fontFamily: fonts.mono500,
    fontSize: 15,
    color: colors.text,
  },
  avgName: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    color: colors.mute,
  },
});

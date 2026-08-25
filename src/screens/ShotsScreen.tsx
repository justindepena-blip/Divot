import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HoleNavHeader } from '../components/HoleNavHeader';
import { HoleSchematic } from '../components/HoleSchematic';
import { OutlineButton } from '../components/Buttons';
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

      <HoleSchematic hole={state.hole} height={330}>
        <View style={styles.ballDot} />
        <View style={styles.lineToShot1} />
        <View style={styles.shot1Marker} />
        <View style={styles.lineToPin} />
        <View style={styles.pinMarker} />
        {state.showShotLabels && (
          <>
            <View style={[styles.shotCallout, { left: '38%', bottom: 96 }]}>
              <Text style={styles.shotCalloutText}>1 · DRIVER 268</Text>
            </View>
            <View style={[styles.shotCallout, { left: '56%', bottom: 214 }]}>
              <Text style={styles.shotCalloutText}>2 · 7 IRON 152</Text>
            </View>
          </>
        )}
        <Text style={styles.dragHint}>DRAG A MARKER TO CORRECT</Text>
      </HoleSchematic>

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
              <Text style={styles.shotDist}>{sh.dist}</Text>
              <Text style={styles.shotUnit}>{state.unitLabel}</Text>
            </View>
          ))}
        </View>

        <OutlineButton label="Add shot from here" onPress={() => {}} />

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
  ballDot: {
    position: 'absolute',
    left: '33%',
    bottom: 34,
    width: 9,
    height: 9,
    marginLeft: -4,
    borderRadius: 5,
    backgroundColor: colors.text,
  },
  lineToShot1: {
    position: 'absolute',
    left: '33%',
    bottom: 38,
    width: '34%',
    height: 150,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(47,169,232,0.5)',
  },
  shot1Marker: {
    position: 'absolute',
    left: '67%',
    bottom: 184,
    width: 9,
    height: 9,
    marginLeft: -4,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: ACCENT,
    backgroundColor: colors.holeBgBottom,
  },
  lineToPin: {
    position: 'absolute',
    left: '53%',
    bottom: 188,
    width: '14%',
    height: 66,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(47,169,232,0.5)',
  },
  pinMarker: {
    position: 'absolute',
    left: '53%',
    bottom: 250,
    width: 20,
    height: 20,
    marginLeft: -10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ACCENT,
    backgroundColor: 'rgba(47,169,232,0.2)',
  },
  shotCallout: {
    position: 'absolute',
    backgroundColor: 'rgba(11,13,14,0.85)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  shotCalloutText: {
    fontFamily: fonts.mono500,
    fontSize: 9,
    letterSpacing: 0.6,
    color: colors.textDim,
  },
  dragHint: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    fontFamily: fonts.mono400,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.mute,
  },
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

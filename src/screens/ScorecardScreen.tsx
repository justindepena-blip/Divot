import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SegmentedControl } from '../components/SegmentedControl';
import { DivotState } from '../state/useDivotState';
import { ACCENT, colors, fonts } from '../theme';

const PUTT_OPTIONS = [0, 1, 2, 3, 4];
const FAIRWAY_OPTIONS: { value: 'left' | 'hit' | 'right'; label: string }[] = [
  { value: 'left', label: 'LEFT' },
  { value: 'hit', label: 'HIT' },
  { value: 'right', label: 'RIGHT' },
];

export function ScorecardScreen({ state }: { state: DivotState }) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={{ gap: 5 }}>
          <Text style={styles.title}>Scorecard</Text>
          <Text style={styles.subtitle}>
            {state.courseName} · THRU {state.thru}
          </Text>
        </View>
        <SegmentedControl
          value={state.mode}
          onChange={state.setMode}
          options={[
            { value: 'tap', label: 'TAP' },
            { value: 'grid', label: 'GRID' },
          ]}
        />
      </View>

      {state.mode === 'tap' ? <TapCard state={state} /> : <GridCard state={state} />}
    </View>
  );
}

function TapCard({ state }: { state: DivotState }) {
  return (
    <View style={{ gap: 16 }}>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.holeTitle}>Hole {state.hole}</Text>
          <Text style={styles.holeSubtitle}>
            PAR {state.par} · {state.holeYds} {state.unitLabel}
          </Text>
        </View>

        <View style={styles.scoreRow}>
          <Pressable onPress={state.decScore} style={styles.stepper}>
            <Text style={styles.stepperText}>−</Text>
          </Pressable>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text style={[styles.scoreValue, { color: state.curColor }]}>{state.curScore}</Text>
            <Text style={[styles.scoreLabel, { color: state.curColor }]}>{state.curLabel.toUpperCase()}</Text>
          </View>
          <Pressable onPress={state.incScore} style={styles.stepper}>
            <Text style={styles.stepperText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.detailGroup}>
          <View style={styles.rowBetween}>
            <Text style={styles.detailLabel}>PUTTS</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {PUTT_OPTIONS.map((n) => {
                const on = state.curPutt === n;
                return (
                  <Pressable
                    key={n}
                    onPress={() => state.setPutt(n)}
                    style={[
                      styles.puttOption,
                      {
                        backgroundColor: on ? 'rgba(47,169,232,0.16)' : colors.surfaceRaised,
                        borderColor: on ? 'rgba(47,169,232,0.5)' : colors.borderSubtle,
                      },
                    ]}
                  >
                    <Text style={[styles.puttOptionText, { color: on ? ACCENT : colors.muteStrong }]}>{n}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.detailLabel}>TEE SHOT</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {FAIRWAY_OPTIONS.map((f) => {
                const on = state.curFw === f.value;
                return (
                  <Pressable
                    key={f.value}
                    onPress={() => state.setFairway(f.value)}
                    style={[
                      styles.fwOption,
                      {
                        backgroundColor: on ? 'rgba(47,169,232,0.16)' : colors.surfaceRaised,
                        borderColor: on ? 'rgba(47,169,232,0.5)' : colors.borderSubtle,
                      },
                    ]}
                  >
                    <Text style={[styles.fwOptionText, { color: on ? ACCENT : colors.muteStrong }]}>{f.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.detailLabel}>GREEN IN REG</Text>
            <Pressable
              onPress={state.toggleGir}
              style={[
                styles.girTrack,
                {
                  backgroundColor: state.curGir ? ACCENT : colors.surfaceRaised,
                  justifyContent: state.curGir ? 'flex-end' : 'flex-start',
                },
              ]}
            >
              <View style={styles.girKnob} />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable onPress={state.prevHole} style={styles.prevHoleBtn}>
          <Text style={styles.prevHoleText}>‹</Text>
        </Pressable>
        <Pressable onPress={state.saveNext} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>{state.saveLabel}</Text>
        </Pressable>
      </View>

      <RunningTotal state={state} totalFontSize={20} />
    </View>
  );
}

function GridCard({ state }: { state: DivotState }) {
  return (
    <View style={{ gap: 20 }}>
      <NineHoleTable label="OUT" holes={state.front9} par={state.parOut} score={state.scoreOut} />
      <NineHoleTable label="IN" holes={state.back9} par={state.parIn} score={state.scoreIn} />
      <RunningTotal state={state} totalFontSize={22} label={`TOTAL · THRU ${state.thru}`} />
      <Text style={styles.gridHint}>TAP ANY CELL TO JUMP TO THAT HOLE</Text>
    </View>
  );
}

function NineHoleTable({
  label,
  holes,
  par,
  score,
}: {
  label: string;
  holes: DivotState['front9'];
  par: number;
  score: number | null;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.gridSectionLabel}>{label}</Text>
      <View style={styles.gridRow}>
        <Text style={styles.gridRowKeyMuted}>HOLE</Text>
        {holes.map((h) => (
          <Text key={h.n} style={styles.gridHoleNum}>
            {h.n}
          </Text>
        ))}
        <Text style={styles.gridTotKey}>TOT</Text>
      </View>
      <View style={[styles.gridRow, styles.gridRowBordered]}>
        <Text style={styles.gridRowKeyMuted}>PAR</Text>
        {holes.map((h) => (
          <Text key={h.n} style={styles.gridParValue}>
            {h.par}
          </Text>
        ))}
        <Text style={styles.gridTotValueMuted}>{par}</Text>
      </View>
      <View style={[styles.gridRow, { paddingTop: 5 }]}>
        <Text style={styles.gridRowKeyMuted}>SCORE</Text>
        {holes.map((h) => (
          <Pressable key={h.n} onPress={h.onPress} style={styles.gridScoreCellWrap}>
            <View style={[styles.gridScoreCell, { backgroundColor: h.bg, borderColor: h.borderColor }]}>
              <Text style={[styles.gridScoreText, { color: h.color }]}>{h.score}</Text>
            </View>
          </Pressable>
        ))}
        <Text style={styles.gridTotValue}>{score ?? '–'}</Text>
      </View>
    </View>
  );
}

function RunningTotal({
  state,
  totalFontSize,
  label = 'RUNNING TOTAL',
}: {
  state: DivotState;
  totalFontSize: number;
  label?: string;
}) {
  return (
    <View style={styles.totalCard}>
      <Text style={styles.totalLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
        <Text style={[styles.totalValue, { fontSize: totalFontSize }]}>{state.totalScore ?? '–'}</Text>
        <Text style={styles.totalDelta}>{state.deltaText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 20,
    gap: 18,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  holeTitle: {
    fontFamily: fonts.grotesk600,
    fontSize: 15,
    color: colors.text,
  },
  holeSubtitle: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.mute,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  stepper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontFamily: fonts.grotesk400,
    fontSize: 26,
    color: colors.muteStrong,
  },
  scoreValue: {
    fontFamily: fonts.mono700,
    fontSize: 62,
    lineHeight: 53,
  },
  scoreLabel: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  detailGroup: {
    gap: 11,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  detailLabel: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.mute,
  },
  puttOption: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  puttOptionText: {
    fontFamily: fonts.mono500,
    fontSize: 12,
  },
  fwOption: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  fwOptionText: {
    fontFamily: fonts.mono500,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  girTrack: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    flexDirection: 'row',
  },
  girKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.text,
  },
  prevHoleBtn: {
    width: 56,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevHoleText: {
    fontFamily: fonts.mono400,
    fontSize: 15,
    color: colors.muteStrong,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontFamily: fonts.grotesk600,
    fontSize: 14,
    color: colors.accentOnBg,
  },
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  totalLabel: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.mute,
  },
  totalValue: {
    fontFamily: fonts.mono700,
    color: colors.text,
  },
  totalDelta: {
    fontFamily: fonts.mono500,
    fontSize: 12,
    color: ACCENT,
  },
  gridHint: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    lineHeight: 14,
    color: colors.muteFaint,
  },
  gridSectionLabel: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.mute,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridRowBordered: {
    paddingVertical: 7,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  gridRowKeyMuted: {
    width: 44,
    fontFamily: fonts.mono400,
    fontSize: 9,
    color: colors.mute,
  },
  gridHoleNum: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.mono400,
    fontSize: 10,
    color: colors.muteStrong,
  },
  gridTotKey: {
    width: 32,
    textAlign: 'right',
    fontFamily: fonts.mono400,
    fontSize: 9,
    color: colors.mute,
  },
  gridParValue: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.mono400,
    fontSize: 11,
    color: colors.mute,
  },
  gridTotValueMuted: {
    width: 32,
    textAlign: 'right',
    fontFamily: fonts.mono400,
    fontSize: 11,
    color: colors.mute,
  },
  gridScoreCellWrap: {
    flex: 1,
    alignItems: 'center',
  },
  gridScoreCell: {
    width: 26,
    height: 30,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridScoreText: {
    fontFamily: fonts.mono500,
    fontSize: 13,
  },
  gridTotValue: {
    width: 32,
    textAlign: 'right',
    fontFamily: fonts.mono700,
    fontSize: 13,
    color: colors.text,
  },
});

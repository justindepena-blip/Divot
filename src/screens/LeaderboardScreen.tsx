import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SegmentedControl } from '../components/SegmentedControl';
import { StatTile } from '../components/StatTile';
import { DivotState } from '../state/useDivotState';
import { ACCENT, colors, fonts } from '../theme';

export function LeaderboardScreen({ state }: { state: DivotState }) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={{ gap: 5 }}>
          <Text style={styles.title}>Saturday Group</Text>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE · 4 PLAYERS · {state.courseName}</Text>
          </View>
        </View>
        <SegmentedControl
          value={state.board}
          onChange={state.setBoard}
          options={[
            { value: 'gross', label: 'GROSS' },
            { value: 'net', label: 'NET' },
          ]}
        />
      </View>

      <View style={{ gap: 8 }}>
        {state.leaderboard.map((b) => (
          <View key={b.pos} style={[styles.boardRow, { backgroundColor: b.bg, borderColor: b.borderColor }]}>
            <Text style={styles.boardPos}>{b.pos}</Text>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{b.initials}</Text>
            </View>
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={[styles.boardName, { color: b.nameColor }]}>{b.name}</Text>
              <Text style={styles.boardMeta}>
                THRU {b.thru} · HCP {b.hcp}
              </Text>
            </View>
            <View style={styles.boardScoreCol}>
              <Text style={[styles.boardRel, { color: b.relColor }]}>{b.rel}</Text>
              <Text style={styles.boardTotal}>{b.total}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {state.groupStats.map((s) => (
          <StatTile key={s.label} value={s.value} label={s.label} accent={s.accent} style={{ flex: 1 }} />
        ))}
      </View>

      <View style={{ gap: 10 }}>
        <Text style={styles.feedLabel}>GROUP FEED</Text>
        {state.feed.map((e, idx) => (
          <View key={idx} style={styles.feedRow}>
            <View style={[styles.feedDot, { backgroundColor: dotColor(e.kind) }]} />
            <Text style={styles.feedText}>{e.text}</Text>
            <Text style={styles.feedTime}>{e.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function dotColor(kind: 'accent' | 'text' | 'mute') {
  if (kind === 'accent') return ACCENT;
  if (kind === 'text') return colors.text;
  return colors.muteFaint;
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.grotesk600,
    fontSize: 17,
    color: colors.text,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT,
  },
  liveText: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.mute,
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 14,
    borderWidth: 1,
  },
  boardPos: {
    width: 20,
    fontFamily: fonts.mono500,
    fontSize: 12,
    color: colors.mute,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.mono500,
    fontSize: 11,
    color: colors.muteStrong,
  },
  boardName: {
    fontFamily: fonts.grotesk500,
    fontSize: 13,
  },
  boardMeta: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    color: colors.mute,
  },
  boardScoreCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 11,
  },
  boardRel: {
    fontFamily: fonts.mono500,
    fontSize: 13,
  },
  boardTotal: {
    fontFamily: fonts.mono700,
    fontSize: 17,
    color: colors.text,
  },
  feedLabel: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.mute,
  },
  feedRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-start',
  },
  feedDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
  },
  feedText: {
    flex: 1,
    fontFamily: fonts.grotesk400,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textDim,
  },
  feedTime: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    color: colors.muteFaint,
    paddingTop: 3,
  },
});

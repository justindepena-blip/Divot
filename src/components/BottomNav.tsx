import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ACCENT, colors, fonts } from '../theme';
import { Screen } from '../state/useDivotState';

type Item = { key: Screen; label: string };

const ITEMS: Item[] = [
  { key: 'play', label: 'PLAY' },
  { key: 'shots', label: 'SHOTS' },
  { key: 'card', label: 'CARD' },
  { key: 'summary', label: 'RECAP' },
  { key: 'friends', label: 'GROUP' },
];

function Icon({ item, color }: { item: Screen; color: string }) {
  switch (item) {
    case 'play':
      return <View style={[styles.ring, { borderColor: color }]} />;
    case 'shots':
      return <View style={[styles.corner, { borderColor: color }]} />;
    case 'card':
      return <View style={[styles.card, { borderColor: color }]} />;
    case 'summary':
      return (
        <View style={styles.bars}>
          <View style={[styles.bar, { height: 8, backgroundColor: color }]} />
          <View style={[styles.bar, { height: 14, backgroundColor: color }]} />
          <View style={[styles.bar, { height: 11, backgroundColor: color }]} />
        </View>
      );
    case 'friends':
      return <View style={[styles.friend, { borderColor: color }]} />;
  }
}

type Props = {
  active: Screen;
  onSelect: (s: Screen) => void;
  bottomInset: number;
};

export function BottomNav({ active, onSelect, bottomInset }: Props) {
  return (
    <View style={[styles.bottomBar, { paddingBottom: Math.max(4, bottomInset) }]}>
      {ITEMS.map((item) => {
        const isActive = item.key === active;
        const color = isActive ? ACCENT : colors.muteFaint;
        return (
          <Pressable key={item.key} onPress={() => onSelect(item.key)} style={styles.item}>
            <Icon item={item.key} color={color} />
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(11,13,14,0.94)',
    paddingTop: 9,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
    paddingVertical: 5,
  },
  label: {
    fontFamily: fonts.mono500,
    fontSize: 8,
    letterSpacing: 1,
  },
  ring: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  corner: {
    width: 16,
    height: 16,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 3,
  },
  card: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 2,
    borderLeftWidth: 5,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 16,
  },
  bar: {
    width: 3,
  },
  friend: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderBottomLeftRadius: 3,
    borderWidth: 2,
  },
});

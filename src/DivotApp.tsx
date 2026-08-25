import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BottomNav } from './components/BottomNav';
import { RangefinderScreen } from './screens/RangefinderScreen';
import { ShotsScreen } from './screens/ShotsScreen';
import { ScorecardScreen } from './screens/ScorecardScreen';
import { RecapScreen } from './screens/RecapScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { useDivotState } from './state/useDivotState';
import { colors } from './theme';

export function DivotApp() {
  const state = useDivotState();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {state.screen === 'play' && <RangefinderScreen state={state} />}
          {state.screen === 'shots' && <ShotsScreen state={state} />}
          {state.screen === 'card' && <ScorecardScreen state={state} />}
          {state.screen === 'summary' && <RecapScreen state={state} />}
          {state.screen === 'friends' && <LeaderboardScreen state={state} />}
        </ScrollView>
        <BottomNav active={state.screen} onSelect={state.setScreen} bottomInset={insets.bottom} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
});

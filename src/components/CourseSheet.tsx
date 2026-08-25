import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DivotState } from '../state/useDivotState';
import { ACCENT, colors, fonts } from '../theme';
import { distance, toUnits } from '../lib/geo';

/** Bottom sheet for picking tees and finding a course to play. */
export function CourseSheet({ state }: { state: DivotState }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={state.sheetOpen}
      animationType="slide"
      transparent
      onRequestClose={state.closeSheet}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissArea} onPress={state.closeSheet} />

        <View style={[styles.sheet, { paddingBottom: Math.max(30, insets.bottom + 12) }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Where are you playing?</Text>
            <Pressable style={styles.close} onPress={state.closeSheet} hitSlop={8}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionLabel}>TEES</Text>
            <View style={styles.teeRow}>
              {state.tees.map((tee, k) => {
                const on = k === state.teeIndex;
                return (
                  <Pressable
                    key={tee.name}
                    onPress={() => state.setTee(k)}
                    style={[
                      styles.tee,
                      {
                        backgroundColor: on ? ACCENT : colors.surfaceRaised,
                        borderColor: on ? 'rgba(47,169,232,0.5)' : 'rgba(255,255,255,0.08)',
                      },
                    ]}
                  >
                    <Text style={[styles.teeText, { color: on ? colors.accentOnBg : colors.muteStrong }]}>
                      {tee.name.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 18 }]}>COURSES IN NJ &amp; NY</Text>
            <View style={styles.searchRow}>
              <TextInput
                value={state.query}
                onChangeText={state.setQuery}
                onSubmitEditing={state.search}
                placeholder="Search by name"
                placeholderTextColor={colors.mute}
                returnKeyType="search"
                autoCorrect={false}
                style={styles.input}
              />
              <Pressable onPress={state.search} style={[styles.searchButton, { backgroundColor: ACCENT }]}>
                <Text style={[styles.searchButtonText, { color: colors.accentOnBg }]}>FIND</Text>
              </Pressable>
              <Pressable onPress={state.nearMe} style={[styles.searchButton, styles.nearMe]}>
                <Text style={[styles.searchButtonText, { color: colors.muteStrong }]}>NEAR ME</Text>
              </Pressable>
            </View>

            <Text
              style={[styles.status, { color: state.searchBusy ? ACCENT : colors.mute }]}
            >
              {state.searchStatus}
            </Text>

            {state.results.map((course) => {
              const on = state.course?.id === course.id;
              return (
                <Pressable
                  key={course.id}
                  onPress={() => state.pickCourse(course)}
                  style={[
                    styles.courseRow,
                    {
                      backgroundColor: on ? 'rgba(47,169,232,0.10)' : colors.surface,
                      borderColor: on ? 'rgba(47,169,232,0.35)' : colors.border,
                    },
                  ]}
                >
                  <View style={styles.courseText}>
                    <Text style={[styles.courseName, { color: on ? ACCENT : colors.text }]}>
                      {course.name}
                    </Text>
                    <Text style={styles.courseCity}>{course.city || '—'}</Text>
                  </View>
                  {state.pos && (
                    <Text style={styles.courseAway}>
                      {toUnits(distance(state.pos, course), 'yards')} {state.unitLabel}
                    </Text>
                  )}
                </Pressable>
              );
            })}

            <View style={styles.pinCard}>
              <View style={{ gap: 6, flex: 1 }}>
                <Text style={styles.pinCardLabel}>PINS FROM MAP DATA</Text>
                <Text style={styles.pinCardBody}>Tap the satellite map{'\n'}to adjust any pin.</Text>
              </View>
              <Text style={styles.pinCardCount}>
                {state.pinnedHoles}/{state.holeCount}
              </Text>
            </View>

            <Text style={styles.footnote}>
              HOLES · PARS · GREENS FROM OPENSTREETMAP · IMAGERY FROM ESRI WORLD IMAGERY · BOTH FREE
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8,9,10,0.72)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    maxHeight: '86%',
    backgroundColor: '#0E1113',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 18,
  },
  title: {
    fontFamily: fonts.grotesk600,
    fontSize: 16,
    color: colors.text,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: fonts.grotesk400,
    fontSize: 17,
    lineHeight: 20,
    color: colors.muteStrong,
  },
  body: {
    paddingBottom: 8,
  },
  sectionLabel: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.mute,
    marginBottom: 9,
  },
  teeRow: {
    flexDirection: 'row',
    gap: 7,
  },
  tee: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  teeText: {
    fontFamily: fonts.mono500,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 13,
    fontFamily: fonts.grotesk400,
    fontSize: 12,
    color: colors.text,
  },
  searchButton: {
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderRadius: 10,
    justifyContent: 'center',
  },
  nearMe: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  searchButtonText: {
    fontFamily: fonts.mono500,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  status: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 9,
    marginBottom: 9,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 13,
    borderWidth: 1,
    marginBottom: 9,
  },
  courseText: {
    flex: 1,
    gap: 5,
  },
  courseName: {
    fontFamily: fonts.grotesk500,
    fontSize: 13,
    lineHeight: 16,
  },
  courseCity: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    color: colors.mute,
  },
  courseAway: {
    fontFamily: fonts.mono500,
    fontSize: 11,
    color: colors.muteStrong,
  },
  pinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 13,
    backgroundColor: 'rgba(47,169,232,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(47,169,232,0.2)',
    marginTop: 9,
  },
  pinCardLabel: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    letterSpacing: 1.3,
    color: ACCENT,
  },
  pinCardBody: {
    fontFamily: fonts.mono400,
    fontSize: 10,
    lineHeight: 14,
    color: colors.muteStrong,
  },
  pinCardCount: {
    fontFamily: fonts.mono700,
    fontSize: 20,
    color: colors.text,
  },
  footnote: {
    fontFamily: fonts.mono400,
    fontSize: 9,
    lineHeight: 14,
    color: colors.muteFaint,
    marginTop: 18,
  },
});

import React, { ReactNode, useMemo, useState } from 'react';
import {
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { ACCENT, colors, fonts } from '../theme';
import { Point, TILE_SIZE, centerOf, project, unproject, zoomToFit } from '../lib/geo';
import { LatLng, Position } from '../types';

/** Esri World Imagery — free to use with the attribution shown below. */
const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile';
const ATTRIBUTION = 'Imagery © Esri · Holes © OpenStreetMap';

/** Northern New Jersey — the view before a course is chosen. */
const HOME: LatLng = { lat: 40.75, lng: -74.2 };
const HOME_ZOOM = 9;
const COURSE_ZOOM = 16;
const SINGLE_POINT_ZOOM = 17;
const MAX_ZOOM = 18;
const MIN_ZOOM = 3;
const FIT_PADDING = 48;

type Props = {
  height?: number;
  /** Fallback centre — the chosen course — when there is nothing to fit to. */
  center: LatLng | null;
  pin: LatLng | null;
  pos: Position | null;
  /** Logged shots; drawn as a numbered chain on the shot-tracking screen. */
  shots?: LatLng[];
  /** Uppercase mono chip pinned top-left. */
  hint: string;
  /** Yardage drawn on the line from the player to the pin. */
  distanceLabel?: string | null;
  onPickPin: (at: LatLng) => void;
  children?: ReactNode;
};

/**
 * A satellite view built from raster tiles placed by hand.
 *
 * The design needs a fixed panel framing one hole — not a pan-and-zoom map —
 * so computing the tile window directly avoids a native maps dependency
 * entirely. That keeps one code path across iOS, Android and the static web
 * export, and needs no API key.
 */
export function SatelliteMap({
  height = 300,
  center,
  pin,
  pos,
  shots = [],
  hint,
  distanceLabel,
  onPickPin,
  children,
}: Props) {
  const [width, setWidth] = useState(0);

  const view = useMemo(() => {
    if (!width) return null;

    const focus: LatLng[] = [];
    if (pin) focus.push(pin);
    if (pos) focus.push(pos);
    shots.forEach((s) => focus.push(s));

    let zoom: number;
    let middle: LatLng;
    if (focus.length > 1) {
      zoom = zoomToFit(focus, width, height, FIT_PADDING, MIN_ZOOM, MAX_ZOOM);
      middle = centerOf(focus, zoom);
    } else if (focus.length === 1) {
      zoom = SINGLE_POINT_ZOOM;
      middle = focus[0];
    } else {
      zoom = center ? COURSE_ZOOM : HOME_ZOOM;
      middle = center ?? HOME;
    }

    // Absolute pixel coordinate of the panel's top-left corner.
    const middlePx = project(middle, zoom);
    const origin: Point = { x: middlePx.x - width / 2, y: middlePx.y - height / 2 };
    const toScreen = (at: LatLng): Point => {
      const p = project(at, zoom);
      return { x: p.x - origin.x, y: p.y - origin.y };
    };

    // Every tile that overlaps the panel.
    const span = Math.pow(2, zoom);
    const tiles: { key: string; uri: string; left: number; top: number }[] = [];
    for (let tx = Math.floor(origin.x / TILE_SIZE); tx <= Math.floor((origin.x + width) / TILE_SIZE); tx++) {
      for (let ty = Math.floor(origin.y / TILE_SIZE); ty <= Math.floor((origin.y + height) / TILE_SIZE); ty++) {
        if (ty < 0 || ty >= span) continue; // above the pole or below it
        const wrapped = ((tx % span) + span) % span; // the world repeats east-west
        tiles.push({
          key: `${zoom}/${tx}/${ty}`,
          // Esri orders this path row-before-column.
          uri: `${TILE_URL}/${zoom}/${ty}/${wrapped}`,
          left: tx * TILE_SIZE - origin.x,
          top: ty * TILE_SIZE - origin.y,
        });
      }
    }

    return { zoom, origin, toScreen, tiles };
  }, [width, height, center, pin, pos, shots]);

  const handleTap = (event: GestureResponderEvent) => {
    if (!view) return;
    const { locationX, locationY } = event.nativeEvent;
    onPickPin(
      unproject({ x: view.origin.x + locationX, y: view.origin.y + locationY }, view.zoom),
    );
  };

  const pinAt = view && pin ? view.toScreen(pin) : null;
  const posAt = view && pos ? view.toScreen(pos) : null;
  const shotsAt = view ? shots.map((s) => view.toScreen(s)) : [];

  /** The chain the ball travelled: shot to shot, then on to the pin. */
  const chain: Point[] = pinAt ? [...shotsAt, pinAt] : shotsAt;

  return (
    <View style={[styles.frame, { height }]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleTap}>
        {view?.tiles.map((tile) => (
          <Image
            key={tile.key}
            source={{ uri: tile.uri }}
            style={[styles.tile, { left: tile.left, top: tile.top }]}
          />
        ))}

        {posAt && pinAt && (
          <View style={line(posAt, pinAt, 'rgba(47,169,232,0.85)', 1.5)} pointerEvents="none" />
        )}

        {chain.length > 1 &&
          chain
            .slice(0, -1)
            .map((from, k) => (
              <View
                key={`leg-${k}`}
                style={line(from, chain[k + 1], 'rgba(242,245,244,0.85)', 1.2)}
                pointerEvents="none"
              />
            ))}

        {shotsAt.map((at, k) => (
          <View key={`shot-${k}`} style={[styles.shotMarker, { left: at.x - 6, top: at.y - 6 }]}>
            <Text style={styles.shotMarkerText}>{k + 1}</Text>
          </View>
        ))}

        {pinAt && <View style={[styles.pinMarker, { left: pinAt.x - 9, top: pinAt.y - 9 }]} />}
        {posAt && <View style={[styles.playerDot, { left: posAt.x - 5, top: posAt.y - 5 }]} />}

        {posAt && pinAt && distanceLabel ? (
          <View
            style={[
              styles.distanceLabel,
              { left: (posAt.x + pinAt.x) / 2 - 34, top: (posAt.y + pinAt.y) / 2 - 11 },
            ]}
            pointerEvents="none"
          >
            <Text style={styles.distanceLabelText}>{distanceLabel}</Text>
          </View>
        ) : null}
      </Pressable>

      <View style={styles.hint} pointerEvents="none">
        <Text style={styles.hintText}>{hint}</Text>
      </View>

      {children}

      <Text style={styles.attribution} pointerEvents="none">
        {ATTRIBUTION}
      </Text>
    </View>
  );
}

/**
 * A one-pixel view rotated onto the line between two points. Positioned from
 * its own centre so it needs no transform origin.
 */
function line(a: Point, b: Point, color: string, weight: number): ViewStyle {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return {
    position: 'absolute',
    left: (a.x + b.x) / 2 - length / 2,
    top: (a.y + b.y) / 2,
    width: length,
    height: 0,
    borderTopWidth: weight,
    borderColor: color,
    borderStyle: 'dashed',
    transform: [{ rotate: `${angle}deg` }],
  };
}

const styles = StyleSheet.create({
  frame: {
    position: 'relative',
    overflow: 'hidden',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.holeBgBottom,
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  pinMarker: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: ACCENT,
    backgroundColor: 'rgba(47,169,232,0.3)',
  },
  playerDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  shotMarker: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.text,
    backgroundColor: colors.holeBgBottom,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shotMarkerText: {
    position: 'absolute',
    top: -13,
    fontFamily: fonts.mono500,
    fontSize: 9,
    color: colors.textDim,
  },
  distanceLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(11,13,14,0.86)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  distanceLabelText: {
    fontFamily: fonts.mono500,
    fontSize: 9,
    color: '#E4EAEB',
  },
  hint: {
    position: 'absolute',
    top: 10,
    left: 12,
    maxWidth: '68%',
    backgroundColor: 'rgba(11,13,14,0.82)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 9,
  },
  hintText: {
    fontFamily: fonts.mono400,
    fontSize: 8,
    lineHeight: 11,
    letterSpacing: 0.8,
    color: colors.muteStrong,
  },
  attribution: {
    position: 'absolute',
    right: 4,
    bottom: 2,
    fontFamily: fonts.mono400,
    fontSize: 7,
    color: colors.mute,
    backgroundColor: 'rgba(11,13,14,0.7)',
    paddingHorizontal: 3,
  },
});

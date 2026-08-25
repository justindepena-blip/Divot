import React, { useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { DivotApp } from './src/DivotApp';
import { fontAssets, colors } from './src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts(fontAssets);

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayout}>
        <LinearGradient
          colors={[colors.bgGradientInner, colors.bg]}
          style={{ flex: 1 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.6 }}
        >
          <DivotApp />
        </LinearGradient>
      </View>
    </SafeAreaProvider>
  );
}

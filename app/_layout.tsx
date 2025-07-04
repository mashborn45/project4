import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the native splash screen from auto-hiding while we load our assets and perform checks.
// This gives us control over when the splash screen disappears.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Animated values for the logo pop-up animation.
  // We use useRef to ensure these values persist across re-renders.
  const logoOpacity = useRef(new Animated.Value(0)).current; // Starts invisible
  const logoScale = useRef(new Animated.Value(0.5)).current; // Starts smaller for a pop effect

  useEffect(() => {
    async function prepare() {
      try {
        // Ensure all necessary fonts are loaded before proceeding.
        // The `useFonts` hook returns a boolean indicating if fonts are loaded.
        // Wait for fonts to be loaded. If they are not yet loaded, this will pause.
        if (!fontsLoaded) {
          return; // Do not proceed until fonts are loaded
        }

        // Reset animation values to ensure they play from the start on re-render/reload
        logoOpacity.setValue(0);
        logoScale.setValue(0.5);

        // Start the logo pop-up animation.
        // We use Animated.parallel to run both opacity and scale animations simultaneously.
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1, // Fade in to full opacity
            duration: 2000, // Increased animation duration for fading (from 1500ms to 2000ms)
            useNativeDriver: true, // Use native driver for better performance
          }),
          Animated.spring(logoScale, {
            toValue: 1, // Scale up to original size
            friction: 7, // Adjusted friction for a slightly slower, smoother spring (from 6 to 7)
            tension: 25, // Adjusted tension for a slightly slower spring (from 20 to 25)
            useNativeDriver: true, // Use native driver for better performance
          }),
        ]).start(); // Start the animation sequence.

        // Simulate any other loading tasks (e.g., API calls, asset loading)
        // and ensure the splash screen is visible for a minimum duration.
        // Increased the minimum display time to 4 seconds for a more noticeable splash.
        await new Promise(resolve => setTimeout(resolve, 4000));

      } catch (e) {
        // Log any errors that occur during the preparation phase.
        console.warn(e);
      } finally {
        // Once all preparation tasks (including animation and minimum display time) are complete,
        // set `appIsReady` to true, which will trigger the rendering of the main app content.
        setAppIsReady(true);
      }
    }

    // Call the prepare function when the component mounts or when fontsLoaded state changes.
    // This effect will re-run if fontsLoaded changes, which is crucial for reloads.
    prepare();
  }, [fontsLoaded, logoOpacity, logoScale]); // Dependency array: re-run effect if fontsLoaded or animated values change.

  // This callback is triggered when the root view of the application is laid out.
  // It's the ideal place to hide the native splash screen once our React Native content is ready.
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the native splash screen. If this is not called, the splash screen would remain visible.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]); // Dependency array: re-run callback if appIsReady changes.

  if (!appIsReady) {
    // If the app is not yet ready (i.e., `prepare` function is still running),
    // display the animated logo splash screen.
    // Adding a key here forces React to re-mount this component on every reload,
    // ensuring the useEffect runs and the animation restarts.
    return (
      <View key="splash-screen-view" style={styles.container}>
        <Animated.Image
          source={require('../assets/images/logo.png')} // Path to your logo image
          style={[
            styles.logo,
            {
              opacity: logoOpacity, // Apply animated opacity
              transform: [{ scale: logoScale }], // Apply animated scale
            },
          ]}
        />
      </View>
    );
  }

  // Once the app is ready, render the main application content.
  // The `onLayoutRootView` prop on the `View` ensures the native splash screen hides
  // when this content is displayed.
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {/* ThemeProvider from @react-navigation/native for light/dark mode support */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Stack from expo-router manages your navigation routes */}
        <Stack>
          {/* Define your main tab navigation group */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Define a screen for handling not-found routes */}
          <Stack.Screen name="+not-found" />
        </Stack>
        {/* StatusBar component to control the status bar appearance */}
        <StatusBar style="auto" />
      </ThemeProvider>
    </View>
  );
}

// StyleSheet for defining the styles used in the splash screen.
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full available space
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    backgroundColor: '#ffffff', // Background color for the splash screen view
    // This should ideally match the backgroundColor set in your app.json for a seamless transition.
  },
  logo: {
    width: 300, // Increased logo width (from 200 to 300)
    height: 300, // Increased logo height (from 200 to 300)
    resizeMode: 'contain', // Ensures the entire logo is visible within the bounds
  },
});

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
        await fontsLoaded;

        // Start the logo pop-up animation.
        // We use Animated.parallel to run both opacity and scale animations simultaneously.
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1, // Fade in to full opacity
            duration: 800, // Animation duration for fading
            useNativeDriver: true, // Use native driver for better performance
          }),
          Animated.spring(logoScale, {
            toValue: 1, // Scale up to original size
            friction: 3, // Controls the bounciness of the spring animation
            tension: 40, // Controls the speed of the spring animation
            useNativeDriver: true, // Use native driver for better performance
          }),
        ]).start(); // Start the animation sequence.

        // Simulate any other loading tasks (e.g., API calls, asset loading)
        // and ensure the splash screen is visible for a minimum duration (e.g., 2 seconds).
        // This provides a smoother user experience.
        await new Promise(resolve => setTimeout(resolve, 2000));

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
    prepare();
  }, [fontsLoaded]); // Dependency array: re-run effect if fontsLoaded changes.

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
    return (
      <View style={styles.container}>
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
    width: 600, // Set the width of your logo
    height: 300, // Set the height of your logo
    resizeMode: 'contain', // Ensures the entire logo is visible within the bounds
  },
});

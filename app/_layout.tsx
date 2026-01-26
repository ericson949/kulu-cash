import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

/**
 * Root Layout Component
 * Configures the navigation stack and the dark status bar.
 */
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      />
    </>
  );
}

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../theme/tokens';

/**
 * DirtBackground Component
 * Provides the "Dirt Texture" (Terre rouge) overlay on top of the Deep Slate background.
 */
export const DirtBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      {/* Base Deep Slate Background */}
      <View style={styles.base} />
      
      {/* Dirt Texture Overlay (Using a subtle tint for now, can be replaced by SVG later) */}
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.dirtOverlay,
    opacity: 0.15,
  },
  content: {
    flex: 1,
  },
});

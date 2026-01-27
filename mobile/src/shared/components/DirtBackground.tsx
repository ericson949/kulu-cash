import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Rect, Defs, Pattern, Circle } from 'react-native-svg';
import { Colors } from '../theme/tokens';

const { width, height } = Dimensions.get('window');

/**
 * DirtBackground Component
 * Provides a rich "Dirt Texture" (Terre rouge) overlay using SVG patterns.
 */
export const DirtBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      {/* Base Deep Slate Background */}
      <View style={styles.base} />
      
      {/* Premium Dirt Texture Overlay */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="dirt" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              {/* Subtle noise/stone elements */}
              <Circle cx="10" cy="10" r="1.5" fill={Colors.secondary} opacity="0.1" />
              <Circle cx="30" cy="25" r="1" fill={Colors.secondary} opacity="0.08" />
              <Circle cx="5" cy="35" r="2" fill={Colors.secondary} opacity="0.05" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#dirt)" />
        </Svg>
      </View>
      
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

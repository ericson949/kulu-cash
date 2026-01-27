import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface KuluMascotProps {
  mood?: 'happy' | 'neutral' | 'urgent'; // For future expansion (Story 3.3)
  size?: number;
}

export const KuluMascot = ({ mood = 'neutral', size = 60 }: KuluMascotProps) => {
  // For MVP, we use the sticker fallback.
  // In Epic 3, we will map moods to different assets.
  const source = require('@/assets/kulu-sticker.png'); 

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={source} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

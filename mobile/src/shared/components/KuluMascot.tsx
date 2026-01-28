import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';

interface KuluMascotProps {
  mood?: 'happy' | 'neutral' | 'urgent' | 'strike' | 'rich';
  size?: number;
}

export const KuluMascot = ({ mood = 'neutral', size = 60 }: KuluMascotProps) => {
  const source = require('@/assets/kulu-sticker.png'); 

  // Visual feedback for moods (Temporary awaiting Assets)
  const getOverlay = () => {
      switch (mood) {
          case 'strike': return '🛑';
          case 'rich': return '😎';
          case 'urgent': return null; // Speech bubble does the job, or maybe we add sweat 😅
          default: return null;
      }
  };

  const getTint = () => {
      switch (mood) {
          case 'strike': return 'gray';
          case 'urgent': return undefined; // '#ffcccc' maybe?
          default: return undefined;
      }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image 
        source={source} 
        style={[styles.image, { tintColor: getTint() }]} 
        resizeMode="contain" 
      />
      {getOverlay() && (
          <View style={styles.overlay}>
              <Text style={{ fontSize: size * 0.4 }}>{getOverlay()}</Text>
          </View>
      )}
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
  overlay: {
      position: 'absolute',
      bottom: -5,
      right: -5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 5,
  }
});

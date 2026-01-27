import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/tokens';

interface SpeechBubbleProps {
  message: string;
  onPress?: () => void;
  variant?: 'info' | 'action';
  placement?: 'left' | 'right';
}


export const SpeechBubble = ({ message, onPress, variant = 'info', placement = 'left' }: SpeechBubbleProps) => {
  return (
    <TouchableOpacity 
        style={[styles.bubble, variant === 'action' && styles.actionBubble]} 
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
        disabled={!onPress}
    >
      <Text style={[styles.text, variant === 'action' && styles.actionText]}>
        {message}
      </Text>
      <View style={[
          styles.arrow, 
          variant === 'action' && styles.actionArrow,
          placement === 'right' ? styles.arrowRight : styles.arrowLeft
      ]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 16,
    marginBottom: Spacing.sm,
    maxWidth: '80%', // This component shouldn't control max width externally usually, but OK.
    shadowColor: "#000",
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  // ...
  arrow: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.surface,
  },
  arrowLeft: {
      left: 10,
      borderBottomLeftRadius: 0, // Reset logic if needed
  },
  arrowRight: {
      right: 10,
  },
  // ...
  actionArrow: {
      borderTopColor: Colors.primary,
  }
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface SegmentedControlProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: ViewStyle;
}

export const SegmentedControl = ({ options, selectedValue, onValueChange, style }: SegmentedControlProps) => {
  const handlePress = (value: string) => {
    if (value !== selectedValue) {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      onValueChange(value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.segment, isSelected && styles.selectedSegment]}
            onPress={() => handlePress(option.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  selectedSegment: {
    backgroundColor: Colors.surface, // Or a slightly lighter shade
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Typography.body,
  },
  selectedText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
});

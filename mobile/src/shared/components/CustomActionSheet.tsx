import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export interface ActionSheetOption {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isCancel?: boolean;
  color?: string;
}

interface CustomActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  options: ActionSheetOption[];
}

export const CustomActionSheet = ({ visible, onClose, title, options }: CustomActionSheetProps) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible && slideAnim._value === height) return null; // Optimization? Not really safely accessible, relying on visible prop.

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheetContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.handle} />
        {title && <Text style={styles.title}>{title}</Text>}

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                option.isCancel && styles.cancelButton,
              ]}
              onPress={() => {
                // Wait for animation if needed or just trigger
                onClose();
                setTimeout(option.onPress, 100); // Slight delay to let sheet close
              }}
            >
              <View style={styles.optionContent}>
                 {option.icon && <Ionicons name={option.icon} size={20} color={option.color || Colors.text} style={{marginRight: 10}} />}
                 <Text style={[
                     styles.optionText, 
                     { color: option.color || Colors.text },
                     option.isCancel && styles.cancelText
                 ]}>
                    {option.label}
                 </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1A', // Dark grey/black
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: Spacing.xl + 20, // Safe area
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    fontWeight: 'bold',
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: Spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Typography.body,
  },
  cancelText: {
      color: Colors.textSecondary,
  }
});

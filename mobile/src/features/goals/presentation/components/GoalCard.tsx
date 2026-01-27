import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { SavingsGoal } from '../../domain/goal.store';
import { Ionicons } from '@expo/vector-icons';

interface GoalCardProps {
  goal: SavingsGoal;
  onPress: () => void;
}

const TEMPLATE_IMAGES: Record<string, any> = {
  motorcycle: require('@/assets/goal-templates/motorcycle.png'),
  house: require('@/assets/goal-templates/house.png'),
  wedding: require('@/assets/kulu-sticker.png'), // Fallback
  travel: require('@/assets/kulu-sticker.png'), // Fallback
};

export const GoalCard = ({ goal, onPress }: GoalCardProps) => {
  const imageSource = goal.imageUri && TEMPLATE_IMAGES[goal.imageUri] 
    ? TEMPLATE_IMAGES[goal.imageUri] 
    : require('@/assets/kulu-sticker.png');

  // Calculate progress (mock for now as deposits are next story)
  const currentAmount = 0; 
  const progress = Math.min((currentAmount / goal.targetAmount) * 100, 100);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{goal.name}</Text>
            {goal.description && (
                <Text style={styles.description} numberOfLines={1}>{goal.description}</Text>
            )}
        </View>

        <View style={styles.footer}>
            <View style={styles.amountContainer}>
                <Ionicons name="wallet-outline" size={14} color={Colors.primary} style={{marginRight: 4}} />
                <Text style={styles.amount}>{goal.targetAmount.toLocaleString()} FCFA</Text>
            </View>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{goal.brickAmount.toLocaleString()} / brique</Text>
            </View>
        </View>
        
        {/* Progress Bar Background */}
        <View style={styles.progressBackground}>
            {/* Progress Bar Fill */}
             <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  image: {
    width: 48,
    height: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: Spacing.xs,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Typography.heading,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: Typography.body,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  badge: {
    backgroundColor: 'rgba(255,193,7,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
     height: '100%',
     backgroundColor: Colors.accent,
     borderRadius: 2,
  }
});

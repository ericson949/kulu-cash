import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { SavingsGoal } from '../../domain/goal.store';
import { Ionicons } from '@expo/vector-icons';
import { TontineEngine } from '../../domain/tontine.engine';

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

  // Use Engine to get dynamic data
  const currentPeriod = TontineEngine.getCurrentPeriodIndex(goal);
  const dueAmount = TontineEngine.calculateDueForPeriod(goal.tontineType, goal.brickAmount, currentPeriod);
  
  // Format Frequency Label (e.g. "Semaine 3")
  let periodLabel = 'Tour';
  if (goal.frequency === 'weekly') periodLabel = 'Semaine';
  if (goal.frequency === 'monthly') periodLabel = 'Mois';
  if (goal.frequency === 'daily') periodLabel = 'Jour';

  // Calculate progress (Mocked for now until Transactions are implemented)
  const progress = 0;

  return (
    <RectButton style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{goal.name}</Text>
            {/* Status Badge */}
            <View style={styles.badge}>
                <Ionicons name="time-outline" size={10} color={Colors.textSecondary} style={{marginRight:4}}/>
                <Text style={styles.badgeText}>{periodLabel} {currentPeriod}</Text>
            </View>
        </View>

        <View style={styles.mainInfo}>
            <Text style={styles.targetAmount}>{goal.targetAmount.toLocaleString()} FCFA</Text>
            
            {/* Dynamic Due Amount Section */}
            <View style={styles.dueBox}>
                <Text style={styles.dueLabel}>À verser :</Text>
                <Text style={styles.dueValue}>{dueAmount.toLocaleString()} F</Text>
            </View>
        </View>
        
        {/* Progress Bar Background */}
        <View style={styles.progressBackground}>
             <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}% complété</Text>
      </View>
    </RectButton>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Typography.heading,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  mainInfo: {
      marginBottom: Spacing.xs,
  },
  targetAmount: {
      color: Colors.textSecondary,
      fontSize: 12,
      marginBottom: Spacing.xs,
  },
  dueBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(46, 204, 113, 0.15)', // Green tint
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: 'flex-start',
  },
  dueLabel: {
      color: Colors.accent,
      fontSize: 12,
      fontWeight: '600',
      marginRight: 4,
  },
  dueValue: {
      color: Colors.text,
      fontSize: 14,
      fontWeight: 'bold',
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
     height: '100%',
     backgroundColor: Colors.accent,
     borderRadius: 2,
  },
  progressText: {
      color: Colors.textSecondary,
      fontSize: 10,
      marginTop: 2,
      textAlign: 'right',
  }
});

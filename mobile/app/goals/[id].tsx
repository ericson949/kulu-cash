import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { DirtBackground } from '@/src/shared/components/DirtBackground';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { useGoalStore, GoalState } from '@/src/features/goals/domain/goal.store';
import { BrickWall } from '@/src/features/goals/presentation/components/BrickWall';
import { Ionicons } from '@expo/vector-icons';
import { TontineEngine } from '@/src/features/goals/domain/tontine.engine';
import { useTransactionStore } from '@/src/features/transactions/domain/transaction.store';
import { HistoryList } from '@/src/features/transactions/presentation/components/HistoryList';
import * as Haptics from 'expo-haptics';
import { KuluMascot } from '@/src/shared/components/KuluMascot';
import { SpeechBubble } from '@/src/shared/components/SpeechBubble';

const { width } = Dimensions.get('window');

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const goal = useGoalStore((state: GoalState) => 
    state.goals.find((g) => g.id === id)
  );
  
  // Safe Selection: Select raw state, filter in render with useMemo to avoid infinite loops
  const allTransactions = useTransactionStore((state) => state.transactions);
  const addTransaction = useTransactionStore((state) => state.addTransaction);

  const goalTransactions = useMemo(() => {
      if (!id) return [];
      return allTransactions.filter(t => t.goalId === id);
  }, [allTransactions, id]);

  // Memoize total calculation
  const totalDeposited = useMemo(() => {
      return goalTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
  }, [goalTransactions]);

  if (!goal) {
    return (
      <DirtBackground>
        <View style={styles.center}>
          <Text style={styles.errorText}>Chantier introuvable 🏗️</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Retour</Text>
          </TouchableOpacity>
        </View>
      </DirtBackground>
    );
  }

  // Engine Calcs
  const currentPeriod = TontineEngine.getCurrentPeriodIndex(goal);
  const dueAmount = TontineEngine.calculateDueForPeriod(goal.tontineType, goal.brickAmount, currentPeriod);
  
  // Smart Hint Logic
  const expectedTotal = TontineEngine.calculateExpectedBalance(goal);
  const effectiveTotal = totalDeposited + (goal.initialBalance || 0);
  const missingAmount = Math.max(0, expectedTotal - effectiveTotal);

  const completedBricks = goal.brickAmount > 0 ? Math.floor(effectiveTotal / goal.brickAmount) : 0;

  const triggerDeposit = (amount: number) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
          "Poser une brique ?",
          `Confirmer le dépôt de ${amount.toLocaleString()} FCFA ?`,
          [
              { text: "Annuler", style: "cancel" },
              { 
                  text: "POSER 🧱", 
                  onPress: () => {
                      addTransaction({
                          goalId: goal.id,
                          amount: amount,
                          date: new Date().toISOString(),
                          type: 'deposit'
                      });
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }
              }
          ]
      );
  };

  // Kulu Message
  let kuluMessage = "Tout est en ordre chef ! 🏗️";
  let isAction = false;
  
  if (missingAmount > 0) {
      kuluMessage = `Il manque ${missingAmount.toLocaleString()} F pour être à jour !`;
      isAction = true;
  }

  return (
    <DirtBackground>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{goal.name}</Text>
        <TouchableOpacity style={styles.menuButton}>
             <Ionicons name="ellipsis-vertical" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.hintSection}>
          <View style={styles.bubbleContainer}>
              <SpeechBubble 
                  message={kuluMessage} 
                  variant={isAction ? 'action' : 'info'}
                  placement="right"
                  onPress={isAction ? () => triggerDeposit(missingAmount) : undefined}
              />
          </View>
          <View style={styles.mascotContainer}>
              <KuluMascot mood={missingAmount > 0 ? 'urgent' : 'happy'} size={70} />
          </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Status Card */}
        <View style={styles.statusCard}>
             <View style={styles.statusRow}>
                 <View>
                     <Text style={styles.label}>ÉPARGNE CIBLE</Text>
                     <Text style={styles.bigAmount}>{goal.targetAmount.toLocaleString()}<Text style={styles.currency}>F</Text></Text>
                 </View>
                 <View style={styles.badge}>
                     <Text style={styles.badgeText}>Tour {currentPeriod} / {goal.duration}</Text>
                 </View>
             </View>

             <View style={styles.divider} />

             <View style={styles.statusRow}>
                  <View>
                      <Text style={styles.label}>À VERSER CE TOUR</Text>
                      <Text style={styles.dueAmount}>{dueAmount.toLocaleString()}<Text style={styles.currency}>F</Text></Text>
                  </View>
                   <TouchableOpacity style={styles.payButton} onPress={() => triggerDeposit(dueAmount)}>
                      <Text style={styles.payButtonText}>POSER 🧱</Text>
                   </TouchableOpacity>
             </View>
        </View>

        {/* The Wall */}
        <View style={styles.wallSection}>
            <Text style={styles.sectionTitle}>M U R   D E   B R I Q U E S</Text>
            <View style={styles.wallContainer}>
                <BrickWall 
                    totalBricks={goal.duration} 
                    completedBricks={completedBricks}
                    brickHeight={16}
                />
            </View>
            <Text style={styles.wallLegend}>{completedBricks} briques posées sur {goal.duration}</Text>
        </View>

        {/* History List */}
        <HistoryList transactions={goalTransactions} />

      </ScrollView>
    </DirtBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.text, fontSize: 18, marginBottom: 16 },
  backLink: { color: Colors.primary, fontSize: 16 },
  
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingTop: 60,
      paddingBottom: Spacing.md,
  },
  backButton: { padding: 4 },
  menuButton: { padding: 4 },
  headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.text,
      fontFamily: Typography.heading,
      flex: 1,
      textAlign: 'center',
  },
  scrollContent: {
      padding: Spacing.lg,
      paddingBottom: 120, // Space for floating Kulu
  },
  
  // Hint Section (Floating)
  hintSection: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 100,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      // Ensure clicks pass through empty space if needed, but here it's fine
  },
  mascotContainer: {
      marginLeft: Spacing.xs,
      // Shadow for pop
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
  },
  bubbleContainer: {
      marginBottom: 30, // Lift bubble slightly above Kulu's feet/center
      maxWidth: 200,
  },

  // Status Card
  statusCard: {
      backgroundColor: Colors.surface,
      borderRadius: 24,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      marginBottom: Spacing.xl,
  },
  statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  label: {
      color: Colors.textSecondary,
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: 1,
      marginBottom: 4,
  },
  bigAmount: {
      color: Colors.text,
      fontSize: 28,
      fontWeight: '900',
      fontFamily: Typography.heading,
  },
  currency: {
      fontSize: 18,
      color: Colors.textSecondary,
  },
  badge: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
  },
  badgeText: {
      color: Colors.text,
      fontSize: 12,
      fontWeight: 'bold',
  },
  divider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginVertical: Spacing.md,
  },
  dueAmount: {
      color: Colors.accent, // Greenish
      fontSize: 24,
      fontWeight: 'bold',
  },
  payButton: {
      backgroundColor: Colors.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: 12,
  },
  payButtonText: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 14,
  },

  // Wall
  wallSection: {
      alignItems: 'center',
  },
  sectionTitle: {
      color: Colors.textSecondary,
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: 4,
      marginBottom: Spacing.lg,
      opacity: 0.5,
  },
  wallContainer: {
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 16,
      padding: Spacing.md,
      width: '100%',
      minHeight: 200,
      justifyContent: 'center',
  },
  wallLegend: {
      color: Colors.textSecondary,
      marginTop: Spacing.md,
      fontStyle: 'italic',
  }
});

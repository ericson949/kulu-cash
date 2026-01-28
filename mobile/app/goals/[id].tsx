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
import { ProofCaptureService } from '@/src/shared/services/proof.service';
import { CustomActionSheet, ActionSheetOption } from '@/src/shared/components/CustomActionSheet';
import { useState } from 'react';

// ... 

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const goal = useGoalStore((state: GoalState) => 
    state.goals.find((g) => g.id === id)
  );
  
  
  const [activeSheet, setActiveSheet] = useState<'none' | 'deposit' | 'debug'>('none');
  const [pendingAmount, setPendingAmount] = useState<number>(0);

  // Safe Selection
  const allTransactions = useTransactionStore((state) => state.transactions);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const clearTransactions = useTransactionStore((state) => state.clearTransactions);

  // ... (memos)

  // Seed Helper
  const seedScenario = (type: 'happy' | 'rich' | 'urgent' | 'strike') => {
      clearTransactions(goal.id); // Reset first
      
      const expected = TontineEngine.calculateExpectedBalance(goal);
      let amountToDeposit = 0;

      switch (type) {
          case 'happy': 
              amountToDeposit = expected; 
              break;
          case 'rich': 
              amountToDeposit = expected + goal.brickAmount; 
              break;
          case 'urgent': 
              amountToDeposit = Math.max(0, expected - (goal.brickAmount * 0.5)); 
              break;
          case 'strike': 
              amountToDeposit = Math.max(0, expected - (goal.brickAmount * 2.5)); 
              break;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setActiveSheet('none');

      // Small delay to ensure clear propagates before add
      setTimeout(() => {
        if (amountToDeposit > 0) {
            addTransaction({
                goalId: goal.id,
                amount: amountToDeposit,
                date: new Date().toISOString(),
                type: 'deposit'
            });
            // Optional: Alert.alert("Debug", `Seeded: ${amountToDeposit}`);
        }
      }, 100);
  };

  const deleteGoal = useGoalStore((state: GoalState) => state.deleteGoal);

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la cotisation ?",
      "Attention, cette action est irréversible. Tout l'historique sera effacé.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: () => {
            deleteGoal(goal.id);
            clearTransactions(goal.id); // Good practice to clear transactions too
            router.back();
          }
        }
      ]
    );
    setActiveSheet('none');
  };

  const menuOptions: ActionSheetOption[] = [
      { label: "🗑️  Supprimer la cotisation", onPress: handleDelete, color: 'red' },
      // Debug Items below
      { label: "🧪  Seed: À jour (Happy)", onPress: () => seedScenario('happy') },
      { label: "😎  Seed: En Avance (Rich)", onPress: () => seedScenario('rich') },
      { label: "😰  Seed: Retard (Urgent)", onPress: () => seedScenario('urgent') },
      { label: "🛑  Seed: Grève (Strike)", onPress: () => seedScenario('strike') },
      { label: "🧹  Reset Transactions", onPress: () => { clearTransactions(goal.id); setActiveSheet('none'); }, color: 'orange' },
      { label: "Fermer", onPress: () => {}, isCancel: true }
  ];

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
          <Text style={styles.errorText}>Cotisation introuvable 🏗️</Text>
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

  // Kulu Message & Mood
  let kuluMessage = "Tout est en ordre chef ! 🏗️";
  let isAction = false;
  let kuluMood: 'happy' | 'urgent' | 'strike' | 'rich' = 'happy';

  if (missingAmount > 0) {
      if (missingAmount > goal.brickAmount) {
          kuluMood = 'strike';
          kuluMessage = "ON FAIT GRÈVE !! 😤\n(Trop de retard)";
      } else {
          kuluMood = 'urgent';
          kuluMessage = `Pst ! Il manque ${missingAmount.toLocaleString()} F`;
      }
      isAction = true;
  } else if (effectiveTotal > expectedTotal) {
      kuluMood = 'rich';
      kuluMessage = "En avance sur le planning ! 😎";
  }

  const confirmDeposit = (proofUri?: string) => {
      addTransaction({
          goalId: goal.id,
          amount: pendingAmount,
          date: new Date().toISOString(),
          type: 'deposit',
          proofUri
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const triggerDeposit = (amount: number) => {
     Haptics.selectionAsync();
     setPendingAmount(amount);
     setActiveSheet('deposit');
  };

  const depositOptions: ActionSheetOption[] = [
      {
          label: "📸  Prendre une photo",
          onPress: async () => {
              const uri = await ProofCaptureService.takePhoto();
              if (uri) confirmDeposit(uri);
              setActiveSheet('none');
          },
          color: Colors.text
      },
      {
          label: "🖼️  Choisir depuis la galerie",
          onPress: async () => {
              const uri = await ProofCaptureService.pickImage();
              if (uri) confirmDeposit(uri);
              setActiveSheet('none');
          },
          color: Colors.text
      },
      {
          label: "⚡  Déposer sans preuve",
          onPress: () => { confirmDeposit(); setActiveSheet('none'); },
          color: Colors.primary 
      },
      {
          label: "Annuler",
          onPress: () => {},
          isCancel: true
      }
  ];
  
  
  return (
    <DirtBackground>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{goal.name}</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setActiveSheet('debug')}>
             <Ionicons name="ellipsis-vertical" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Sheets */}
      <CustomActionSheet 
        visible={activeSheet === 'deposit'} 
        onClose={() => setActiveSheet('none')}
        title={`Déposer ${pendingAmount.toLocaleString()} F ?`}
        options={depositOptions}
      />

       <CustomActionSheet 
        visible={activeSheet === 'debug'} 
        onClose={() => setActiveSheet('none')}
        title="Gestion & Debug"
        options={menuOptions}
      />

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
              <KuluMascot mood={kuluMood} size={70} />
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

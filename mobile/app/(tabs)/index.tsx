import { Swipeable } from 'react-native-gesture-handler';
import { useTransactionStore } from '@/src/features/transactions/domain/transaction.store';
import { CustomActionSheet, ActionSheetOption } from '@/src/shared/components/CustomActionSheet';
import { useState } from 'react';

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { DirtBackground } from '@/src/shared/components/DirtBackground';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { useGoalStore, GoalState } from '@/src/features/goals/domain/goal.store';
import { GoalCard } from '@/src/features/goals/presentation/components/GoalCard';
import { Ionicons } from '@expo/vector-icons';
import { SyncService } from '@/src/features/sync/domain/sync.service';


export default function HomeScreen() {
  const router = useRouter();
  const goals = useGoalStore((state: GoalState) => state.goals);
  const deleteGoal = useGoalStore((state: GoalState) => state.deleteGoal);
  const clearTransactions = useTransactionStore((state) => state.clearTransactions);
  
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);

  const handleSync = () => {
      Alert.alert(
          "Cloud Sync ☁️",
          "Sauvegarder ou Restaurer tes chantiers ?",
          [
              { text: "Annuler", style: "cancel" },
              { 
                  text: "📥 RESTAURER", 
                  style: "destructive",
                  onPress: async () => {
                      const success = await SyncService.pullRestore();
                      if (success) Alert.alert("Succès", "Chantiers récupérés !");
                      else Alert.alert("Erreur", "Aucune sauvegarde trouvée.");
                  }
              },
              { 
                  text: "📤 SAUVEGARDER", 
                  onPress: async () => {
                      const success = await SyncService.pushBackup();
                      if (success) Alert.alert("Succès", "Données sécurisées dans le cloud !");
                  } 
              }
          ]
      );
  };



  const renderHeader = () => (
      <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Mes Cotisations 💸</Text>
          <TouchableOpacity onPress={handleSync} style={styles.syncButton}>
              <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
      </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Aucune cotisation en cours</Text>
      <Text style={styles.emptySubtitle}>
        Lance ton premier objectif d'épargne ! 🚀
      </Text>
    </View>
  );

  const handleDeleteGoal = (goalId: string) => {
      setDeletingGoalId(goalId);
  };

  const confirmDelete = () => {
    if (!deletingGoalId) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    deleteGoal(deletingGoalId);
    clearTransactions(deletingGoalId);
    setDeletingGoalId(null);
  };

  const deleteOptions: ActionSheetOption[] = [
      { 
          label: "🗑️  Confirmer la suppression", 
          onPress: confirmDelete, 
          color: '#ef4444' // Red
      },
      { 
          label: "Annuler", 
          onPress: () => {}, 
          isCancel: true 
      }
  ];

  const renderRightActions = (progress, dragX, goalId) => {
      // ... (same as before)
      return (
          <TouchableOpacity 
              style={styles.deleteAction}
              onPress={() => handleDeleteGoal(goalId)}
          >
              <Ionicons name="trash-outline" size={32} color="#fff" />
              <Text style={styles.deleteText}>Suppr.</Text>
          </TouchableOpacity>
      );
  };

  return (
    <DirtBackground>
      <View style={styles.container}>
        {goals.length > 0 ? (
           <FlatList
             data={goals}
             keyExtractor={(item) => item.id}
             renderItem={({ item }) => (
                <Swipeable
                    renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
                    containerStyle={styles.swipeContainer}
                    friction={2}
                    overshootFriction={4}
                    rightThreshold={40}
                >
                    <GoalCard 
                        goal={item} 
                        onPress={() => router.push(`/goals/${item.id}`)} 
                    />
                </Swipeable>
             )}
             contentContainerStyle={styles.listContent}
             showsVerticalScrollIndicator={false}
             ListHeaderComponent={renderHeader}
           />
        ) : (
            <>
                <View style={{ paddingHorizontal: Spacing.xl }}>{renderHeader()}</View>
                {renderEmptyState()}
            </>
        )}



        {/* Delete Confirmation Sheet */}
        <CustomActionSheet 
            visible={!!deletingGoalId}
            onClose={() => setDeletingGoalId(null)}
            title="Supprimer cette cotisation ? (Irréversible)"
            options={deleteOptions}
        />
      </View>
    </DirtBackground>
  );
}

const styles = StyleSheet.create({
  // ... (existing styles)
  swipeContainer: {
      marginBottom: Spacing.md,
      backgroundColor: 'transparent',
      // No overflow hidden to allow shadow/elevation of GoalCard if needed, but Swipeable usually handles it.
  },
  deleteAction: {
      backgroundColor: '#ef4444',
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      height: '100%',
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      // Adjust alignment with card margin if card has margin. 
      // GoalCard usually has margin, so we might need to match it.
      // GoalCard styles: marginBottom is handled by FlatList separator or item style? 
      // Looking at `GoalCard`, it has `marginBottom: Spacing.md` usually? 
      // Wait, let's assume GoalCard logic needs wrapper tweaks.
      // Actually, Swipeable wraps the content. If Content has margin, swipe action might look weird.
      // Better to remove margin from GoalCard and put it on Swipeable Container? 
      // I'll stick to basic implementation and refine layout if needed.
  },
  deleteText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 12,
      marginTop: 4,
  },
  // ... (rest of styles)
  container: {
    flex: 1,
    paddingTop: 60, // Space for status bar
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 150, // Increased for Tab Bar clearance
  },
  headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
  },
  headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: Colors.text,
      fontFamily: Typography.heading,
  },
  syncButton: {
      padding: Spacing.sm,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontFamily: Typography.heading,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: Typography.body,
  },

});

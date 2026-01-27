import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { DirtBackground } from '@/src/shared/components/DirtBackground';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { useGoalStore, GoalState } from '@/src/features/goals/domain/goal.store';
import { GoalCard } from '@/src/features/goals/presentation/components/GoalCard';

export default function HomeScreen() {
  const router = useRouter();
  const goals = useGoalStore((state: GoalState) => state.goals);

  const handleNewProject = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/goals/create');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Ton chantier est vide, mon frère !</Text>
      <Text style={styles.emptySubtitle}>
        Commence ton premier projet et bâtis ton avenir 🏗️
      </Text>
    </View>
  );

  return (
    <DirtBackground>
      <View style={styles.container}>
        {goals.length > 0 ? (
           <FlatList
             data={goals}
             keyExtractor={(item) => item.id}
             renderItem={({ item }) => (
                <GoalCard 
                    goal={item} 
                    onPress={() => console.log('Goal pressed:', item.id)} 
                />
             )}
             contentContainerStyle={styles.listContent}
             showsVerticalScrollIndicator={false}
             ListHeaderComponent={
                <Text style={styles.headerTitle}>Mes Chantiers 🏗️</Text>
             }
           />
        ) : (
            renderEmptyState()
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={handleNewProject}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>➕</Text>
          <Text style={styles.fabText}>Nouveau Projet</Text>
        </TouchableOpacity>
      </View>
    </DirtBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // Space for status bar
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100, // Space for FAB
  },
  headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: Colors.text,
      marginBottom: Spacing.lg,
      fontFamily: Typography.heading,
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
  fab: {
    position: 'absolute',
    bottom: Spacing.xl * 2,
    right: Spacing.xl,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  fabText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: Typography.heading,
  },
});

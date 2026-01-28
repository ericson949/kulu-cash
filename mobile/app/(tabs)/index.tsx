import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useTransactionStore } from '@/src/features/transactions/domain/transaction.store';

// ... (existing imports)

export default function HomeScreen() {
  const router = useRouter();
  const goals = useGoalStore((state: GoalState) => state.goals);
  const deleteGoal = useGoalStore((state: GoalState) => state.deleteGoal);
  const clearTransactions = useTransactionStore((state) => state.clearTransactions);

  // ... (handleSync, handleNewProject, renderHeader, renderEmptyState)

  const handleDeleteGoal = (goalId: string) => {
      Alert.alert(
          "Supprimer la cotisation ?",
          "Irréversible. L'historique sera effacé.",
          [
              { text: "Annuler", style: "cancel" },
              { 
                  text: "Supprimer", 
                  style: "destructive",
                  onPress: () => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      deleteGoal(goalId);
                      clearTransactions(goalId);
                  } 
              }
          ]
      );
  };

  const renderRightActions = (progress, dragX, goalId) => {
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
    paddingBottom: 100, // Space for FAB
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

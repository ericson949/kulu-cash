import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { DirtBackground } from '../../src/shared/components/DirtBackground';
import { Colors, Spacing, Typography } from '../../src/shared/theme/tokens';
import { Plus } from 'lucide-react-native';

/**
 * Main Dashboard Screen
 * Represents the "Chantier Vide" state with the Gold FAB.
 */
export default function DashboardScreen() {
  return (
    <DirtBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>KuluCash</Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Ton chantier est vide, mon frère !</Text>
        </View>

        {/* Floating Action Button (FAB) */}
        <Pressable 
          style={({ pressed }) => [
            styles.fab,
            pressed && styles.fabPressed
          ]}
          onPress={() => console.log('Nouveau Projet')}
        >
          <Plus color="#000" size={24} />
          <Text style={styles.fabText}>Nouveau Projet</Text>
        </Pressable>
      </View>
    </DirtBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    marginTop: Spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary, // Kulu Gold
    fontFamily: Typography.heading,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontFamily: Typography.body,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xxl,
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  fabText: {
    color: '#000',
    fontWeight: 'bold',
    marginLeft: Spacing.sm,
    fontFamily: Typography.body,
  },
});

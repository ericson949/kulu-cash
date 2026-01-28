import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DirtBackground } from '@/src/shared/components/DirtBackground';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { useAuthStore } from '@/src/features/auth/domain/auth.service';
import { SyncService } from '@/src/features/sync/domain/sync.service';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);

  const handleBackup = async () => {
    try {
        const success = await SyncService.pushBackup();
        if (success) Alert.alert("Succès", "Sauvegarde réussie ! ☁️");
    } catch (e) {
        Alert.alert("Erreur", "La sauvegarde a échoué.");
    }
  };

  const handleRestore = async () => {
     Alert.alert(
        "Attention",
        "Cela va écraser les données locales par celles du dernier backup. Continuer ?",
        [
            { text: "Annuler", style: "cancel" },
            { 
                text: "Écraser et Restaurer", 
                style: "destructive",
                onPress: async () => {
                    try {
                        const success = await SyncService.pullRestore();
                        if (success) Alert.alert("Succès", "Données restaurées !");
                        else Alert.alert("Info", "Aucune sauvegarde trouvée.");
                    } catch (e) {
                        Alert.alert("Erreur", "La restauration a échoué.");
                    }
                }
            }
        ]
     );
  };

  return (
    <DirtBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Mon Profil 🏗️</Text>
        </View>

        {/* User Card */}
        <View style={styles.card}>
            <View style={styles.userIcon}>
                <Ionicons name="person-circle" size={64} color={Colors.primary} />
            </View>
            <Text style={styles.userIdLabel}>Identifiant Bâtisseur</Text>
            <Text style={styles.userId}>{user ? user.uid : "Connexion..."}</Text>
            <View style={styles.statusBadge}>
                 <Text style={styles.statusText}>{user ? "Connecté (Anonyme)" : "Hors ligne"}</Text>
            </View>
        </View>

        {/* Sync Actions */}
        <Text style={styles.sectionTitle}>CLOUD & SAUVEGARDE</Text>
        <View style={styles.card}>
            <TouchableOpacity style={styles.actionRow} onPress={handleBackup}>
                <View style={styles.iconBox}>
                    <Ionicons name="cloud-upload" size={24} color={Colors.primary} />
                </View>
                <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Sauvegarder maintenant</Text>
                    <Text style={styles.actionSubtitle}>Envoyer mes données dans le cloud</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <TouchableOpacity style={styles.actionRow} onPress={handleRestore}>
                <View style={styles.iconBox}>
                    <Ionicons name="cloud-download" size={24} color={Colors.accent} />
                </View>
                <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Restaurer une sauvegarde</Text>
                    <Text style={styles.actionSubtitle}>Récupérer mes données</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>
            Votre compte est actuellement anonyme. Conservez votre Identifiant si vous changez de téléphone (fonctionnalité de liaison à venir).
        </Text>

      </ScrollView>
    </DirtBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    paddingTop: 60,
  },
  header: {
      marginBottom: Spacing.xl,
      alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: Typography.heading,
  },
  card: {
      backgroundColor: Colors.surface,
      borderRadius: 16,
      padding: Spacing.lg,
      marginBottom: Spacing.xl,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
  },
  userIcon: {
      alignItems: 'center',
      marginBottom: Spacing.md,
  },
  userIdLabel: {
      color: Colors.textSecondary,
      textAlign: 'center',
      fontSize: 12,
      marginBottom: 4,
  },
  userId: {
      color: Colors.text,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 14,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      marginBottom: Spacing.md,
  },
  statusBadge: {
      alignSelf: 'center',
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
  },
  statusText: {
      color: Colors.primary,
      fontSize: 12,
      fontWeight: 'bold',
  },
  sectionTitle: {
      color: Colors.textSecondary,
      fontWeight: 'bold',
      marginBottom: Spacing.md,
      marginLeft: Spacing.sm,
      letterSpacing: 1,
      fontSize: 12,
  },
  actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
  },
  iconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.05)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
  },
  actionTextContainer: {
      flex: 1,
  },
  actionTitle: {
      color: Colors.text,
      fontWeight: 'bold',
      fontSize: 16,
  },
  actionSubtitle: {
      color: Colors.textSecondary,
      fontSize: 12,
  },
  divider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginVertical: Spacing.md,
      marginLeft: 56, // Align with text start
  },
  infoText: {
      color: Colors.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
      marginTop: Spacing.lg,
      fontSize: 12,
      paddingHorizontal: Spacing.xl,
  },
});

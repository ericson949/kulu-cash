import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useGoalStore, GoalState } from '@/src/features/goals/domain/goal.store';
import { Colors, Spacing, Typography } from '@/src/shared/theme/tokens';
import { DirtBackground } from '@/src/shared/components/DirtBackground';
import { Ionicons } from '@expo/vector-icons';

const TEMPLATES = [
  { id: 'motorcycle', source: require('@/assets/goal-templates/motorcycle.png'), label: 'Moto' },
  { id: 'house', source: require('@/assets/goal-templates/house.png'), label: 'Maison' },
  // Placeholders using the sticker for now until we generate more
  { id: 'wedding', source: require('@/assets/kulu-sticker.png'), label: 'Mariage' }, 
  { id: 'travel', source: require('@/assets/kulu-sticker.png'), label: 'Voyage' },
];

export default function CreateGoalScreen() {
  const router = useRouter();
  const addGoal = useGoalStore((state: GoalState) => state.addGoal);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [brickAmount, setBrickAmount] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleCreate = () => {
    if (!name || !targetAmount || !brickAmount) {
      // Simple validation shake or alert could go here
      return; 
    }

    if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    addGoal({
      name,
      description,
      targetAmount: parseInt(targetAmount, 10),
      brickAmount: parseInt(brickAmount, 10),
      imageUri: selectedTemplate || undefined,
    });
    
    router.back();
  };

  return (
    <DirtBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Nouvel Objectif</Text>
        </View>

        <View style={styles.form}>
            {/* Image Selection */}
            <Text style={styles.label}>Choisis ton rêve 💭</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateList}>
                {TEMPLATES.map((t) => (
                    <TouchableOpacity 
                        key={t.id} 
                        style={[styles.templateItem, selectedTemplate === t.id && styles.templateSelected]}
                        onPress={() => setSelectedTemplate(t.id)}
                    >
                        <Image source={t.source} style={styles.templateImage} />
                        <Text style={styles.templateLabel}>{t.label}</Text>
                        {selectedTemplate === t.id && (
                            <View style={styles.checkBadge}>
                                <Ionicons name="checkmark" size={12} color="#000" />
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Inputs */}
            <Text style={styles.label}>Nom du projet</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Ex: Ma nouvelle moto" 
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Description (Optionnelle)</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Pour aller au travail plus vite..." 
                placeholderTextColor={Colors.textSecondary}
                value={description}
                onChangeText={setDescription}
            />

            <Text style={styles.label}>Montant Cible (FCFA)</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Ex: 500000" 
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                value={targetAmount}
                onChangeText={setTargetAmount}
            />

            <Text style={styles.label}>Montant de la Brique (FCFA)</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Ex: 10000" 
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                value={brickAmount}
                onChangeText={setBrickAmount}
            />

            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                <Text style={styles.createButtonText}>Créer le projet 🚀</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </DirtBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
      padding: Spacing.xl,
      paddingTop: Spacing.xxl * 2, // Safe area ish
  },
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xl,
  },
  backButton: {
      marginRight: Spacing.md,
      padding: Spacing.xs,
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.text,
      fontFamily: Typography.heading,
  },
  form: {
      gap: Spacing.lg,
  },
  label: {
      color: Colors.text,
      fontSize: 16,
      marginBottom: Spacing.xs,
      fontFamily: Typography.body,
  },
  input: {
      backgroundColor: Colors.surface,
      borderRadius: 12,
      padding: Spacing.md,
      color: Colors.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      fontFamily: Typography.body,
  },
  templateList: {
      flexDirection: 'row',
      marginBottom: Spacing.md,
  },
  templateItem: {
      marginRight: Spacing.md,
      alignItems: 'center',
      padding: Spacing.xs,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: 'transparent',
  },
  templateSelected: {
      borderColor: Colors.primary,
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  templateImage: {
      width: 64,
      height: 64,
      marginBottom: Spacing.xs,
  },
  templateLabel: {
      color: Colors.textSecondary,
      fontSize: 12,
  },
  checkBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: Colors.primary,
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
  },
  createButton: {
      backgroundColor: Colors.primary,
      padding: Spacing.lg,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: Spacing.lg,
  },
  createButtonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: Typography.heading,
  },
});
